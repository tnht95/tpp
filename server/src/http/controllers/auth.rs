use std::collections::HashMap;

use axum::{
    extract::{Query, State},
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use tracing::debug;

use super::InternalState;
use crate::{
    model::responses::auth::{
        BAD_FORMAT_INSTALLATION_ID,
        INVALID_INSTALLATION_ID,
        MISSING_INSTALLATION_ID,
    },
    services::{book::IBookService, health::IHealthService},
};

pub async fn exchange_token<THealthService, TBookService>(
    Query(params): Query<HashMap<String, String>>,
    State(state): InternalState<THealthService, TBookService>,
) -> Response
where
    THealthService: IHealthService,
    TBookService: IBookService,
{
    let installation_id = match params.get("installation_id") {
        Some(id) => match id.parse::<u64>() {
            Ok(id) => id,
            Err(_) =>
                return (StatusCode::BAD_REQUEST, Json(BAD_FORMAT_INSTALLATION_ID)).into_response(),
        },
        None => return (StatusCode::BAD_REQUEST, Json(MISSING_INSTALLATION_ID)).into_response(),
    };

    let installation = match state
        .gh_client
        .apps()
        .installation(installation_id.into())
        .await
    {
        Ok(installation) => installation,
        Err(e) => {
            debug!("Invalid installation id: {e}");
            return (StatusCode::BAD_REQUEST, Json(INVALID_INSTALLATION_ID)).into_response();
        }
    };
    (StatusCode::OK, Json(installation)).into_response()
}
