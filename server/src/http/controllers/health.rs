use axum::{extract::State, http::StatusCode};

use super::InternalState;
use crate::services::{book::IBookService, health::IHealthService, user::IUserService};

pub async fn is_healthy<THealthService, TBookService, TUSerService>(
    State(state): InternalState<THealthService, TBookService, TUSerService>,
) -> StatusCode
where
    THealthService: IHealthService,
    TBookService: IBookService,
    TUSerService: IUserService,
{
    match state.services.health.read().await.is_healthy().await {
        true => StatusCode::OK,
        false => StatusCode::BAD_GATEWAY,
    }
}
