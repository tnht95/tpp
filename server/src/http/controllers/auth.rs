use std::collections::HashMap;

use axum::{
    extract::{Query, State},
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};

use super::InternalState;
use crate::{
    model::responses::auth::{INVALID_OATH_CODE, MISSING_OATH_CODE},
    services::{book::IBookService, health::IHealthService},
    utils::github::exchange_user_token,
};

pub async fn exchange_token<THealthService, TBookService>(
    Query(params): Query<HashMap<String, String>>,
    State(state): InternalState<THealthService, TBookService>,
) -> Response
where
    THealthService: IHealthService,
    TBookService: IBookService,
{
    let code = match params.get("code") {
        Some(id) => id,
        None => return (StatusCode::BAD_REQUEST, Json(MISSING_OATH_CODE)).into_response(),
    };

    let response = match exchange_user_token(
        &state.gh_client,
        &state.config.github_app.client_id,
        &state.config.github_app.client_secret,
        code,
    )
    .await
    {
        Ok(response) => response,
        Err(_) => {
            return (StatusCode::BAD_REQUEST, Json(INVALID_OATH_CODE)).into_response();
        }
    };

    (StatusCode::OK, Json(response)).into_response()
}
