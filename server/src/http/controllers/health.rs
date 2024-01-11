use axum::{extract::State, http::StatusCode};

use super::InternalState;
use crate::services::{book::IBookService, health::IHealthService};

pub async fn is_healthy<THealthService, TBookService>(
    State(state): InternalState<THealthService, TBookService>,
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
