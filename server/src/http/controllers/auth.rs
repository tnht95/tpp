use std::collections::HashMap;

use anyhow::anyhow;
use axum::{
    extract::{Query, State},
    http::{
        header::{LOCATION, SET_COOKIE},
        HeaderMap,
        StatusCode,
    },
    response::{IntoResponse, Response},
    Json,
};

use super::InternalState;
use crate::{
    http::utils::err_handler::response_unhandled_err,
    model::responses::auth::{INVALID_OATH_CODE, MISSING_OATH_CODE},
    services::{book::IBookService, health::IHealthService},
    utils::{
        github::{exchange_user_token, get_user_from_token},
        jwt,
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

    let user = match get_user_from_token(&gh_oauth.access_token).await {
        Ok(user) => user,
        Err(e) => return response_unhandled_err(e),
    };

    let jwt = match jwt::encode(
        *user.id,
        user.email.unwrap_or("".into()),
        &state.config.auth.jwt.secret,
        state.config.auth.jwt.expire_in,
    ) {
        Ok(jwt) => jwt,
        Err(e) => return response_unhandled_err(anyhow!(e)),
    };

    // TODO: update database

    (
        StatusCode::FOUND,
        [
            (
                SET_COOKIE,
                format!(
                    "access_token={jwt};SameSite=None;Secure;HttpOnly;Max-Age={}",
                    state.config.auth.jwt.expire_in
                ),
            ),
            (LOCATION, String::from(&state.config.auth.redirect_url)),
        ],
    )
        .into_response()
}

pub async fn verify<THealthService, TBookService>(
    headers: HeaderMap,
    State(state): InternalState<THealthService, TBookService>,
) -> StatusCode
where
    THealthService: IHealthService,
    TBookService: IBookService,
{
    let cookie = match headers.get("cookie") {
        Some(cookie) => match cookie.to_str() {
            Ok(cookie) => cookie,
            Err(_) => return StatusCode::UNAUTHORIZED,
        },
        None => return StatusCode::UNAUTHORIZED,
    };

    match jwt::decode(&cookie[13..], &state.config.auth.jwt.secret) {
        Ok(_) => StatusCode::OK,
        Err(_) => StatusCode::UNAUTHORIZED,
    }
}
