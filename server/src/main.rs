use std::{path::PathBuf, sync::Arc};

use anyhow::{Context, Result};
use clap::Parser;
use cli::{Cli, Cmd};
use config::{Config, LogFmt};
use database::Database;
use http::Server;
use services::{book::BookService, health::HealthService};
use tracing::trace;
use tracing_subscriber::{prelude::*, EnvFilter};

use crate::services::{user::UserService, InternalServices};

mod cli;
mod config;
mod database;
mod http;
mod model;
mod services;
mod utils;

// TODO
// auth
// docker
// swagger
// redis
// test
// CI/CD
#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();

    let config =
        Config::from_file(PathBuf::from(&cli.config)).context("Could not read config file")?;

    // init logger
    match config.log_format {
        LogFmt::Json => {
            tracing_subscriber::registry()
                .with(tracing_subscriber::fmt::layer().json())
                .with(EnvFilter::from_default_env())
                .init();
        }
        LogFmt::Text => {
            tracing_subscriber::registry()
                .with(tracing_subscriber::fmt::layer().pretty())
                .with(EnvFilter::from_default_env())
                .init();
        }
    };

    trace!("config: {:?}", config);

    match cli.command {
        Cmd::Start => {
            Database::migrate(&config)
                .await
                .context("Failed to migrate database")?;

            let db = Arc::new(
                Database::new(&config)
                    .await
                    .context("Failed to initialize database")?,
            );

            let health_service = HealthService::new(Database::new_with_no_log(&config).await?);
            let book_service = BookService::new(Arc::clone(&db));
            let user_service = UserService::new(Arc::clone(&db));

            let server =
                Server::<InternalServices>::new(config, health_service, book_service, user_service);

            server.start().await.context("Failed to start server {}")?;
        }
    }

    Ok(())
}
