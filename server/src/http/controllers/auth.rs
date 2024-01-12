use std::collections::HashMap;

use anyhow::anyhow;
use axum::{
    extract::{Query, State},
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};

use super::InternalState;
use crate::{
    http::utils::err_handler::response_unhandled_err,
    model::responses::auth::{Auth, INVALID_OATH_CODE, MISSING_OATH_CODE},
    services::{book::IBookService, health::IHealthService},
    utils::{
        github::{exchange_user_token, get_user_email_from_token},
        jwt::encode_jwt,
    },
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

    let gh_oauth = match exchange_user_token(
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

    let user_email = match get_user_email_from_token(&gh_oauth.access_token).await {
        Ok(user_email) => user_email,
        Err(e) => return response_unhandled_err(e),
    };

    let jwt = match encode_jwt(user_email, &state.config.jwt_secret) {
        Ok(jwt) => jwt,
        Err(e) => return response_unhandled_err(anyhow!(e)),
    };

    (StatusCode::OK, Json(Auth { access_token: jwt })).into_response()
}
