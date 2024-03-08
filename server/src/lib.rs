pub mod cache;
pub mod cli;
pub mod config;
pub mod database;
pub mod http;
mod model;
pub mod services;
pub mod utils;

use std::sync::Arc;

use anyhow::{Context, Result};
use tokio::{
    fs::{copy, create_dir, metadata, read_dir},
    sync::RwLock,
};

use crate::{
    cache::Cache,
    config::Config,
    database::Database,
    http::ApiServer,
    services::{
        activity::ActivityService,
        auth::AuthService,
        blog::BlogService,
        comment::CommentService,
        discussion::DiscussionService,
        game::GameService,
        health::HealthService,
        like::LikeService,
        notification::NofitifcationService,
        post::PostService,
        search::SearchService,
        subscribe::SubscribeService,
        user::UserService,
        vote::VoteService,
        InternalServices,
        ServicesBuilder,
    },
};

pub async fn init_roms(rom_dir: &str) -> Result<()> {
    let is_dir = metadata(rom_dir)
        .await
        .map(|mdata| mdata.is_dir())
        .unwrap_or(false);
    if !is_dir {
        create_dir(rom_dir)
            .await
            .context("Failed to create roms dir")?;
    }
    let mut fixed_roms_dir = read_dir("./fixed_roms")
        .await
        .context("Failed to read fixed_roms")?;
    while let Ok(Some(rom_entry)) = fixed_roms_dir.next_entry().await {
        copy(
            rom_entry.path(),
            format!(
                "./roms/{}",
                rom_entry
                    .path()
                    .to_str()
                    .with_context(|| format!("Invalid path: {:?}", rom_entry.path()))?
                    .split('/')
                    .last()
                    .with_context(|| format!("Invalid file: {:?}", rom_entry.path()))?
            ),
        )
        .await
        .with_context(|| format!("Failed to copy roms: {:?}", rom_entry.path()))?;
    }
    Ok(())
}

pub async fn init(config: Config) -> Result<ApiServer<InternalServices>> {
    Database::migrate(&config)
        .await
        .context("Failed to migrate database")?;

    let cache = Arc::new(
        Cache::new(&config)
            .await
            .context("Failed to initialize cache")?,
    );

    let db = Arc::new(
        Database::new(&config)
            .await
            .context("Failed to initialize database")?,
    );

    let health_service = RwLock::new(HealthService::new(
        Database::new_with_default_log(&config)
            .await
            .context("Failed to initialize database")?,
        Arc::clone(&cache),
    ));
    let auth_service = AuthService::new(Arc::clone(&cache));
    let user_service = UserService::new(Arc::clone(&db));
    let game_service = GameService::new(Arc::clone(&db), String::from(&config.rom_dir))
        .await
        .context("Failed to initialize game")?;
    let post_service = PostService::new(Arc::clone(&db));
    let blog_service = BlogService::new(Arc::clone(&db));
    let comment_service = CommentService::new(Arc::clone(&db));
    let discussion_service = DiscussionService::new(Arc::clone(&db));
    let search_service = SearchService::new(Arc::clone(&db));
    let subscribe_service = SubscribeService::new(Arc::clone(&db));
    let vote_service = VoteService::new(Arc::clone(&db));
    let like_service = LikeService::new(Arc::clone(&db));
    let activity_service = ActivityService::new(Arc::clone(&db));
    let notification_service = NofitifcationService::new(db, cache);

    Ok(ApiServer::new(
        config,
        ServicesBuilder::new()
            .health(health_service)
            .auth(auth_service)
            .user(user_service)
            .game(game_service)
            .post(post_service)
            .blog(blog_service)
            .comment(comment_service)
            .discussion(discussion_service)
            .search(search_service)
            .subscribe(subscribe_service)
            .vote(vote_service)
            .like(like_service)
            .activity(activity_service)
            .notification(notification_service)
            .build(),
    ))
}
