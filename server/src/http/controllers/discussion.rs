use axum::{
    extract::{Query, State},
    response::{IntoResponse, Response},
    Json,
};

use crate::{
    http::{
        controllers::InternalState,
        utils::{
            auth::Authentication,
            err_handler::response_unhandled_err,
            validator::JsonValidator,
        },
    },
    model::{
        requests::{discussion::AddDiscussionRequest, QueryWithTarget},
        responses::HttpResponse,
    },
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

pub async fn add<TInternalServices: IInternalServices>(
    State(state): InternalState<TInternalServices>,
    Authentication(user, ..): Authentication<TInternalServices>,
    JsonValidator(discussion): JsonValidator<AddDiscussionRequest>,
) -> Response {
    match state
        .services
        .discussion
        .add(user.id, user.name, discussion)
        .await
    {
        Ok(discussion) => Json(HttpResponse { data: discussion }).into_response(),
        Err(DiscussionServiceErr::Other(e)) => response_unhandled_err(e),
    }
}
