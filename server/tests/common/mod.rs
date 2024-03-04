#![allow(dead_code)]
use std::{path::PathBuf, sync::Arc};

use axum::Router;
use redis::AsyncCommands;
use server::{
    cache::{Cache, ICache},
    config::Config,
    database::{entities::user::User, Database, IDatabase},
    init,
    utils::{jwt, time::now},
};
use sqlx::postgres::PgPoolOptions;
use tokio::sync::OnceCell;

static CONFIG_INSTANCE: OnceCell<Config> = OnceCell::const_new();
static DB_INSTANCE: OnceCell<Database> = OnceCell::const_new();

pub async fn get_config() -> &'static Config {
    CONFIG_INSTANCE
        .get_or_init(|| async { Config::from_file(PathBuf::from("./config.toml")).unwrap() })
        .await
}

pub async fn get_db() -> &'static Database {
    DB_INSTANCE
        .get_or_init(|| async { Database::new(get_config().await).await.unwrap() })
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

pub async fn mock_user(id: i64, name: &str, persist_db: bool) -> User {
    let user = User {
        id,
        name: name.into(),
        github_url: format!("https://github.com/{name}"),
        bio: None,
        avatar: format!("https://avatars.githubusercontent.com/u/{id}?v=4"),
        created_at: now(),
        updated_at: now(),
    };
    if persist_db {
        sqlx::query!(
            "insert into users (id, name, avatar, github_url)
            values ($1, $2, $3, $4)",
            user.id,
            user.name,
            user.avatar,
            user.github_url,
        )
        .execute(get_db().await.get_pool())
        .await
        .unwrap();
    }
    user
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
