use std::{path::PathBuf, sync::Arc};

use async_once_cell::OnceCell;
use axum::Router;
use server::{config::Config, http::ApiServer, init, services::InternalServices};

static SERVER_INSTANCE: OnceCell<Arc<ApiServer<InternalServices>>> = OnceCell::new();

pub async fn init_app() -> Router {
    SERVER_INSTANCE
        .get_or_init(async {
            Arc::new(
                init(Config::from_file(PathBuf::from("./config.toml")).unwrap())
                    .await
                    .unwrap(),
            )
        })
        .await
        .build_app()
}
