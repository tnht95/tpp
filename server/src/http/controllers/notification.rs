use axum::{
    extract::{Path, Query, State},
    response::{IntoResponse, Response},
    Json,
};

use super::InternalState;
use crate::{
    http::utils::{
        auth::Authentication,
        err_handler::{response_400_with_const, response_unhandled_err},
    },
    model::{
        requests::Pagination,
        responses::{notification::INVALID_NOTI_ID, HttpResponse},
    },
    services::{
        notification::{INofitifcationService, NofitifcationServiceErr},
        IInternalServices,
    },
};

pub async fn filter<TInternalServices: IInternalServices>(
    State(state): InternalState<TInternalServices>,
    Query(pagination): Query<Pagination>,
    Authentication { user, .. }: Authentication<TInternalServices>,
) -> Response {
    match state
        .services
        .notification
        .filter(user.id, pagination.into())
        .await
    {
        Ok(notis) => Json(HttpResponse { data: notis }).into_response(),
        Err(NofitifcationServiceErr::Other(e)) => response_unhandled_err(e),
    }
}

pub async fn is_check<TInternalServices: IInternalServices>(
    State(state): InternalState<TInternalServices>,
    Authentication { user, .. }: Authentication<TInternalServices>,
) -> Response {
    match state.services.notification.is_check(user.id).await {
        Ok(is_check) => Json(HttpResponse { data: is_check }).into_response(),
        Err(NofitifcationServiceErr::Other(e)) => response_unhandled_err(e),
    }
}

pub async fn check<TInternalServices: IInternalServices>(
    State(state): InternalState<TInternalServices>,
    Authentication { user, .. }: Authentication<TInternalServices>,
) -> Response {
    match state.services.notification.check(user.id).await {
        Ok(check) => Json(HttpResponse { data: check }).into_response(),
        Err(NofitifcationServiceErr::Other(e)) => response_unhandled_err(e),
    }
}

pub async fn read<TInternalServices: IInternalServices>(
    Path(id): Path<String>,
    State(state): InternalState<TInternalServices>,
    Authentication { user, .. }: Authentication<TInternalServices>,
) -> Response {
    let id = match id.parse::<i64>() {
        Ok(id) => id,
        Err(_) => return response_400_with_const(INVALID_NOTI_ID),
    };
    match state.services.notification.read(id, user.id).await {
        Ok(read) => Json(HttpResponse { data: read }).into_response(),
        Err(NofitifcationServiceErr::Other(e)) => response_unhandled_err(e),
    }
}
