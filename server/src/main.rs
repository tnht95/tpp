use std::{path::PathBuf, sync::Arc};

use anyhow::{Context, Result};
use clap::Parser;
use tokio::sync::RwLock;
use tracing::trace;
use tracing_subscriber::{prelude::*, EnvFilter};

use crate::{
    cli::{Cli, Cmd},
    config::{Config, LogFmt},
    database::Database,
    http::Server,
    services::{
        blog::BlogService,
        book::BookService,
        comment::CommentService,
        game::GameService,
        health::HealthService,
        post::PostService,
        user::UserService,
        InternalServices,
        ServicesBuilder,
    },
};

mod cli;
mod config;
mod database;
mod http;
mod model;
mod services;
mod utils;

// TODO
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

            let health_service = HealthService::new(Database::new_with_default_log(&config).await?);
            let book_service = BookService::new(Arc::clone(&db));
            let user_service = UserService::new(Arc::clone(&db));
            let game_service = GameService::new(Arc::clone(&db));
            let post_service = PostService::new(Arc::clone(&db));
            let blog_service = BlogService::new(Arc::clone(&db));
            let comment_service = CommentService::new(Arc::clone(&db));

            let services = ServicesBuilder::new()
                .health(RwLock::new(health_service))
                .book(book_service)
                .user(user_service)
                .game(game_service)
                .post(post_service)
                .blog(blog_service)
                .comment(comment_service)
                .build();

            let server = Server::<InternalServices>::new(config, services);

            server.start().await.context("Failed to start server {}")?;
        }
    }

    Ok(())
}
