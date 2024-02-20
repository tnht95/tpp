use axum::{
    extract::{Query, State},
    response::{IntoResponse, Response},
    Json,
};

use super::InternalState;
use crate::{
    http::utils::err_handler::response_unhandled_err,
    model::{requests::PaginationWithTarget, responses::HttpResponse},
    services::{
        activity::{ActivityServiceErr, IActivityService},
        IInternalServices,
    },
};

pub async fn filter<TInternalServices: IInternalServices>(
    State(state): InternalState<TInternalServices>,
    Query(pagination): Query<PaginationWithTarget>,
) -> Response {
    match state.services.activity.filter(pagination.into()).await {
        Ok(activities) => Json(HttpResponse { data: activities }).into_response(),
        Err(ActivityServiceErr::Other(e)) => response_unhandled_err(e),
    }
}
