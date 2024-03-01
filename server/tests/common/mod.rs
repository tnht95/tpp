#![allow(dead_code)]
use std::{path::PathBuf, sync::Arc};

use axum::Router;
use chrono::Utc;
use redis::AsyncCommands;
use server::{
    cache::{Cache, ICache},
    config::Config,
    database::entities::user::User,
    http::ApiServer,
    services::InternalServices,
    utils::jwt,
};
use sqlx::postgres::PgPoolOptions;
use tokio::sync::OnceCell;

static SERVER_INSTANCE: OnceCell<Arc<ApiServer<InternalServices>>> = OnceCell::const_new();

static CONFIG_INSTANCE: OnceCell<Config> = OnceCell::const_new();

async fn get_config() -> &'static Config {
    CONFIG_INSTANCE
        .get_or_init(|| async { Config::from_file(PathBuf::from("./config.toml")).unwrap() })
        .await
}

async fn init_server() -> &'static Arc<ApiServer<InternalServices>> {
    SERVER_INSTANCE
        .get_or_init(|| async move {
            Arc::new(
                server::init(Config::from_file(PathBuf::from("./config.toml")).unwrap())
                    .await
                    .unwrap(),
            )
        })
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

pub async fn setup_app() -> Router {
    clean_data().await;
    init_server().await.build_app()
}

pub fn mock_user(id: i64, name: &str) -> User {
    User {
        id,
        name: name.into(),
        github_url: format!("https://github.com/{name}"),
        bio: None,
        avatar: "https://avatars.githubusercontent.com/u/40195902?v=4".into(),
        // TODO: mock time
        created_at: Utc::now(),
        updated_at: Utc::now(),
    }
}

pub async fn gen_jwt(user: User) -> String {
    jwt::encode(user, get_config().await).unwrap()
}

pub async fn gen_ws_ticket(user: &User) -> String {
    let ws_ticket = uuid::Uuid::new_v4().to_string();
    let key = format!("ws_ticket_{ws_ticket}");
    let user_str = serde_json::to_string(user).unwrap();
    let cache = Cache::new(get_config().await).await.unwrap();
    let mut con = cache.get_con();
    let _: () = con.set_ex(&key, user_str, cache.get_exp()).await.unwrap();
    key
}
