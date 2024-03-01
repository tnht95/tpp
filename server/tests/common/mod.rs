use std::{path::PathBuf, sync::Arc};

use axum::Router;
use server::{config::Config, http::ApiServer, services::InternalServices};
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
