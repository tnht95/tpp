use axum::{
    extract::{Query, State},
    response::{IntoResponse, Response},
    Json,
};

use super::InternalState;
use crate::{
    http::utils::{auth::Authentication, err_handler::response_unhandled_err},
    model::{requests::Pagination, responses::HttpResponse},
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
        Ok(notifications) => Json(HttpResponse {
            data: notifications,
        })
        .into_response(),
        Err(NofitifcationServiceErr::Other(e)) => response_unhandled_err(e),
    }
}
