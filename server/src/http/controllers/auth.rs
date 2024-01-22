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
use chrono::Utc;

use super::InternalState;
use crate::{
    database::entities::users::User,
    http::utils::{cookie::extract_access_token, err_handler::response_unhandled_err},
    model::responses::auth::{INVALID_OATH_CODE, MISSING_OATH_CODE},
    services::{
        user::{IUserService, UserServiceErr},
        IInternalServices,
    },
    utils::{
        github::{exchange_user_token, get_ghuser_from_token},
        jwt,
    },
};

pub async fn authentication<TInternalServices: IInternalServices>(
    Query(query): Query<HashMap<String, String>>,
    State(state): InternalState<TInternalServices>,
) -> Response {
    let code = match query.get("code") {
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

    let gh_user = match get_ghuser_from_token(&gh_oauth.access_token).await {
        Ok(user) => user,
        Err(e) => return response_unhandled_err(e),
    };

    let user = match state
        .services
        .user
        .sync_user(&User {
            id: gh_user.id,
            name: gh_user.login,
            github_url: gh_user.html_url,
            bio: gh_user.bio,
            avatar: gh_user.avatar_url,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        })
        .await
    {
        Ok(user) => user,
        Err(UserServiceErr::Other(e)) => return response_unhandled_err(e),
    };

    let jwt = match jwt::encode(
        user,
        &state.config.auth.jwt.secret,
        state.config.auth.jwt.expire_in,
    ) {
        Ok(jwt) => jwt,
        Err(e) => return response_unhandled_err(anyhow!(e)),
    };

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

pub async fn me<TInternalServices: IInternalServices>(
    headers: HeaderMap,
    State(state): InternalState<TInternalServices>,
) -> Response {
    let jwt = match extract_access_token(&headers) {
        Ok(jwt) => jwt,
        Err(_) => return StatusCode::UNAUTHORIZED.into_response(),
    };

    match jwt::decode(jwt, &state.config.auth.jwt.secret) {
        Ok(jwt_claim) => (StatusCode::OK, Json(jwt_claim.user)).into_response(),
        Err(_) => StatusCode::UNAUTHORIZED.into_response(),
    }
}

pub async fn log_out() -> Response {
    (
        StatusCode::OK,
        [(
            SET_COOKIE,
            "access_token=;SameSite=None;Secure;HttpOnly;Max-Age=0".to_string(),
        )],
    )
        .into_response()
}
