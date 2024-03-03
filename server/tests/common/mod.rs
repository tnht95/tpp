#![allow(dead_code)]
use std::{path::PathBuf, sync::Arc};

use axum::Router;
use redis::AsyncCommands;
use server::{
    cache::{Cache, ICache},
    config::Config,
    database::entities::user::User,
    init,
    utils::{jwt, time::now},
};
use sqlx::postgres::PgPoolOptions;
use tokio::sync::OnceCell;

static CONFIG_INSTANCE: OnceCell<Config> = OnceCell::const_new();

pub async fn get_config() -> &'static Config {
    CONFIG_INSTANCE
        .get_or_init(|| async { Config::from_file(PathBuf::from("./config.toml")).unwrap() })
        .await
}

async fn clean_data() {
    let config = get_config().await;
    let pool = PgPoolOptions::new()
        .max_connections(1)
        .connect(&config.server.pg_url)
        .await
        .unwrap();
    sqlx::migrate!().run(&pool).await.unwrap()
}

pub async fn setup_app(reset_data: bool) -> Router {
    if reset_data {
        clean_data().await;
    }
    Arc::new(init(get_config().await.clone()).await.unwrap()).build_app()
}

pub fn mock_user(id: i64, name: &str) -> User {
    User {
        id,
        name: name.into(),
        github_url: format!("https://github.com/{name}"),
        bio: None,
        avatar: "https://avatars.githubusercontent.com/u/40195902?v=4".into(),
        created_at: now(),
        updated_at: now(),
    }
}

pub async fn gen_jwt(user: User) -> String {
    jwt::encode(user, get_config().await).unwrap()
}

pub async fn gen_ws_ticket(user: &User, persist_cache: bool) -> String {
    let ws_ticket = uuid::Uuid::new_v4().to_string();
    let user_str = serde_json::to_string(user).unwrap();
    if persist_cache {
        let cache = Cache::new(get_config().await).await.unwrap();
        let mut con = cache.get_con();
        let _: () = con
            .set_ex(format!("ws_ticket_{ws_ticket}"), user_str, cache.get_exp())
            .await
            .unwrap();
    }
    ws_ticket
}
