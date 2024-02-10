use axum::{
    extract::{Path, State},
    response::{IntoResponse, Response},
    Json,
};

use crate::{
    http::{
        controllers::InternalState,
        utils::{
            auth::Authentication,
            err_handler::{response_400_with_const, response_unhandled_err},
        },
    },
    model::responses::{
        subscribe::{INVALID_USER, SELF_SUBSCRIBE},
        HttpResponse,
        INVALID_USER_ID_ERR,
    },
    services::{
        subscribe::{ISubscribeService, SubscribeServiceErr},
        IInternalServices,
    },
};

pub async fn subscribe_user<TInternalServices: IInternalServices>(
    Path(user_id): Path<i64>,
    State(state): InternalState<TInternalServices>,
    Authentication(user, ..): Authentication<TInternalServices>,
) -> Response {
    if user.id == user_id {
        return response_400_with_const(SELF_SUBSCRIBE);
    }

    match state
        .services
        .subscribe
        .subscribe_user(user.id, user_id)
        .await
    {
        Ok(subscribe) => Json(HttpResponse { data: subscribe }).into_response(),
        Err(e) => match e {
            SubscribeServiceErr::InvalidUser => response_400_with_const(INVALID_USER),
            SubscribeServiceErr::Other(e) => response_unhandled_err(e),
        },
    }
}

pub async fn unsubscribe_user<TInternalServices: IInternalServices>(
    Path(user_id): Path<String>,
    State(state): InternalState<TInternalServices>,
    Authentication(user, ..): Authentication<TInternalServices>,
) -> Response {
    let user_id = match user_id.parse::<i64>() {
        Ok(id) => id,
        Err(_) => return response_400_with_const(INVALID_USER_ID_ERR),
    };

    match state
        .services
        .subscribe
        .unsubscribe_user(user.id, user_id)
        .await
    {
        Ok(subscribe) => Json(HttpResponse { data: subscribe }).into_response(),
        Err(SubscribeServiceErr::Other(e)) => response_unhandled_err(e),
        Err(SubscribeServiceErr::InvalidUser) => unreachable!(),
    }
}
