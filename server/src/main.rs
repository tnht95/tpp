use std::path::PathBuf;

use clap::Parser;
use cli::{Cli, Cmd};
use config::{Config, LogFmt};
use database::Database;
use http::Server;
use services::book::BookService;
use tracing::{error, trace};
use tracing_subscriber::{prelude::*, EnvFilter};

mod cli;
mod config;
mod database;
mod http;
mod model;
mod services;

// TODO
// pg, migrate, log
// middleware
// docker
// swagger
// redis
// test
// doc
// Gracefully shutdown
// request-id tracking
// CI/CD
// K8s prevent request loss
// error handling
#[tokio::main]
async fn main() {
    let cli = Cli::parse();

    let config = match Config::from_file(PathBuf::from(&cli.config)) {
        Ok(config) => config,
        Err(e) => panic!("couldn't read config file: {}\n{}", cli.config, e),
    };

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
            let database = Database::new(&config).await.unwrap();
            let book_service = BookService::new(database);
            let server = Server::new(config, book_service);
            if let Err(e) = server.start().await {
                error!("fail to start server {}", e);
            }
        }
    }
}
