use axum::{extract::State, http::StatusCode};

use super::InternalState;
use crate::services::{health::IHealthService, IInternalServices};

pub async fn is_healthy<TInternalServices: IInternalServices>(
    State(state): InternalState<TInternalServices>,
) -> StatusCode {
    match state.services.health.read().await.is_healthy().await {
        true => StatusCode::OK,
        false => StatusCode::BAD_GATEWAY,
    }
}
