use std::collections::HashMap;

use anyhow::anyhow;
use axum::{
    extract::{Query, State},
    http::{
        header::{LOCATION, SET_COOKIE},
        StatusCode,
    },
    response::{IntoResponse, Response},
    Json,
};
use chrono::Utc;
use serde_json::json;

use super::InternalState;
use crate::{
    database::entities::user::User,
    http::utils::{
        auth::Authentication,
        err_handler::{response_400_with_const, response_unhandled_err},
    },
    model::responses::{
        auth::{INVALID_OATH_CODE, MISSING_OATH_CODE},
        HttpResponse,
    },
    services::{
        auth::IAuthService,
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
        None => return response_400_with_const(MISSING_OATH_CODE),
    };

    let gh_oauth = match exchange_user_token(
        &state.config.github_app.client_id,
        &state.config.github_app.client_secret,
        code,
    )
    .await
    {
        Ok(response) => response,
        Err(_) => return response_400_with_const(INVALID_OATH_CODE),
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

    let ws_ticket = match state.services.auth.issue_ws_ticket(&user).await {
        Ok(ws_ticket) => ws_ticket,
        Err(e) => return response_unhandled_err(anyhow!(e)),
    };

    let jwt = match jwt::encode(user, &state.config) {
        Ok(jwt) => jwt,
        Err(e) => return response_unhandled_err(anyhow!(e)),
    };

    (
        StatusCode::FOUND,
        [
            (
                SET_COOKIE,
                format!(
                    "access_token={jwt};ws_ticket={ws_ticket};SameSite=None;Secure;HttpOnly;Max-Age={}",
                    state.config.auth.jwt.expire_in
                ),
            ),
            (LOCATION, String::from(&state.config.auth.redirect_url)),
        ],
        Json(HttpResponse { data: () }),
    )
        .into_response()
}

pub async fn me<TInternalServices: IInternalServices>(
    Authentication {
        user,
        is_admin,
        ws_ticket,
        ..
    }: Authentication<TInternalServices>,
) -> Response {
    Json(HttpResponse {
        data: json!({"user": user, "isAdmin": is_admin, "ws_ticket": ws_ticket }),
    })
    .into_response()
}

pub async fn log_out<TInternalServices: IInternalServices>(
    Authentication { ws_ticket, .. }: Authentication<TInternalServices>,
    State(state): InternalState<TInternalServices>,
) -> Response {
    if let Err(e) = state.services.auth.delete_ws_ticket(&ws_ticket).await {
        return response_unhandled_err(anyhow!(e));
    };
    (
        [(
            SET_COOKIE,
            "access_token=;SameSite=None;Secure;HttpOnly;Max-Age=0".to_string(),
        )],
        Json(HttpResponse { data: () }),
    )
        .into_response()
}
