use axum::{
    extract::{Query, State},
    response::{IntoResponse, Response},
    Json,
};

use crate::{
    http::{controllers::InternalState, utils::err_handler::response_unhandled_err},
    model::{requests::QueryWithTarget, responses::HttpResponse},
    services::{
        discussion::{DiscussionServiceErr, IDiscussionService},
        IInternalServices,
    },
};

pub async fn filter<TInternalServices: IInternalServices>(
    Query(query): Query<QueryWithTarget>,
    State(state): InternalState<TInternalServices>,
) -> Response {
    match state.services.discussion.filter(query).await {
        Ok(discussions) => Json(HttpResponse { data: discussions }).into_response(),
        Err(DiscussionServiceErr::Other(e)) => response_unhandled_err(e),
    }
}
