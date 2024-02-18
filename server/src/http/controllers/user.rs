use axum::{
    extract::{Path, State},
    response::{IntoResponse, Response},
    Json,
};

use crate::{
    http::{
        controllers::InternalState,
        utils::{
            auth::AuthenticationMaybe,
            err_handler::{response_400_with_const, response_unhandled_err},
        },
    },
    model::responses::{user::NOT_FOUND, HttpResponse, INVALID_USER_ID_ERR},
    services::{
        user::{IUserService, UserServiceErr},
        IInternalServices,
    },
};

pub async fn get_by_id<TInternalServices: IInternalServices>(
    Path(user_id): Path<String>,
    State(state): InternalState<TInternalServices>,
    AuthenticationMaybe(subscriber, ..): AuthenticationMaybe<TInternalServices>,
) -> Response {
    let user_id = match user_id.parse::<i64>() {
        Ok(id) => id,
        Err(_) => return response_400_with_const(INVALID_USER_ID_ERR),
    };

    match state
        .services
        .user
        .get_by_id(user_id, subscriber.map(|s| s.id))
        .await
    {
        Ok(user) => match user {
            Some(user) => Json(HttpResponse { data: user }).into_response(),
            None => response_400_with_const(NOT_FOUND),
        },
        Err(UserServiceErr::Other(e)) => response_unhandled_err(e),
    }
}
