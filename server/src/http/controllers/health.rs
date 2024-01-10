use std::sync::Arc;

use axum::{extract::State, http::StatusCode};
use tokio::sync::RwLock;

use crate::{
    http::Server,
    services::{book::IBookService, health::IHealthService},
};

pub async fn is_healthy<THealthService, TBookService>(
    State(state): State<Arc<RwLock<Server<THealthService, TBookService>>>>,
) -> StatusCode
where
    THealthService: IHealthService,
    TBookService: IBookService,
{
    match state.read().await.services.health.is_healthy().await {
        true => StatusCode::OK,
        false => StatusCode::BAD_GATEWAY,
    }
}
