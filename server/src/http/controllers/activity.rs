use axum::{
    extract::{Path, Query, State},
    response::{IntoResponse, Response},
    Json,
};

use super::InternalState;
use crate::{
    http::utils::err_handler::{response_400_with_const, response_unhandled_err},
    model::{
        requests::PaginationWithTarget,
        responses::{HttpResponse, INVALID_USER_ID_ERR},
    },
    services::{
        activity::{ActivityServiceErr, IActivityService},
        IInternalServices,
    },
};

pub async fn filter<TInternalServices: IInternalServices>(
    Path(user_id): Path<String>,
    State(state): InternalState<TInternalServices>,
    Query(pagination): Query<PaginationWithTarget>,
) -> Response {
    let user_id = match user_id.parse::<i64>() {
        Ok(id) => id,
        Err(_) => return response_400_with_const(INVALID_USER_ID_ERR),
    };

    match state
        .services
        .activity
        .filter(user_id, pagination.into())
        .await
    {
        Ok(activities) => Json(HttpResponse { data: activities }).into_response(),
        Err(ActivityServiceErr::Other(e)) => response_unhandled_err(e),
    }
}
