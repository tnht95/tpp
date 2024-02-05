use axum::{
    extract::{Path, Query, State},
    response::{IntoResponse, Response},
    Json,
};
use uuid::Uuid;

use crate::{
    http::{
        controllers::InternalState,
        utils::{
            auth::Authentication,
            err_handler::{response_400_with_const, response_unhandled_err},
            validator::JsonValidator,
        },
    },
    model::{
        requests::{discussion::AddDiscussionRequest, PaginationWithTarget},
        responses::{discussion::NOT_FOUND, HttpResponse, INVALID_UUID_ERR},
    },
    services::{
        discussion::{DiscussionServiceErr, IDiscussionService},
        IInternalServices,
    },
};

pub async fn filter<TInternalServices: IInternalServices>(
    Query(pagination): Query<PaginationWithTarget>,
    State(state): InternalState<TInternalServices>,
) -> Response {
    match state.services.discussion.filter(pagination.into()).await {
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

pub async fn get_by_id<TInternalServices: IInternalServices>(
    Path(id): Path<String>,
    State(state): InternalState<TInternalServices>,
) -> Response {
    let id = match id.parse::<Uuid>() {
        Ok(id) => id,
        Err(_) => return response_400_with_const(INVALID_UUID_ERR),
    };

    match state.services.discussion.get_by_id(id).await {
        Ok(discussion) => match discussion {
            Some(discussion) => Json(HttpResponse { data: discussion }).into_response(),
            None => response_400_with_const(NOT_FOUND),
        },
        Err(DiscussionServiceErr::Other(e)) => response_unhandled_err(e),
    }
}
