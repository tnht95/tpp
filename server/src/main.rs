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
        discussion::DiscussionService,
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
        Config::from_file(PathBuf::from(&cli.config_path)).context("Could not read config file")?;

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

            let health_service = RwLock::new(HealthService::new(
                Database::new_with_default_log(&config)
                    .await
                    .context("Failed to initialize database")?,
            ));
            let book_service = BookService::new(Arc::clone(&db));
            let user_service = UserService::new(Arc::clone(&db));
            let game_service = GameService::new(Arc::clone(&db), String::from(&config.rom_dir))
                .await
                .context("Failed to initialize game")?;
            let post_service = PostService::new(Arc::clone(&db));
            let blog_service = BlogService::new(Arc::clone(&db));
            let comment_service = CommentService::new(Arc::clone(&db));
            let discussion_service = DiscussionService::new(Arc::clone(&db));

            Server::<InternalServices>::new(
                config,
                ServicesBuilder::new()
                    .health(health_service)
                    .book(book_service)
                    .user(user_service)
                    .game(game_service)
                    .post(post_service)
                    .blog(blog_service)
                    .comment(comment_service)
                    .discussion(discussion_service)
                    .build(),
            )
            .start()
            .await
            .context("Failed to start server {}")?;
        }
    }

    Ok(())
}
