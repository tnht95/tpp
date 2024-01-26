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
        requests::{post::AddPostRequest, PaginationParam},
        responses::{post::NOT_AUTH_DEL, HttpResponse, INVALID_UUID_ERR},
    },
    services::{
        post::{IPostService, PostServiceErr},
        IInternalServices,
    },
};

pub async fn filter<TInternalServices: IInternalServices>(
    Query(pagination): Query<PaginationParam>,
    State(state): InternalState<TInternalServices>,
) -> Response {
    match state.services.post.filter(pagination.into()).await {
        Ok(posts) => Json(HttpResponse { data: posts }).into_response(),
        Err(PostServiceErr::Other(e)) => response_unhandled_err(e),
    }
}

pub async fn add<TInternalServices: IInternalServices>(
    State(state): InternalState<TInternalServices>,
    Authentication(user, _): Authentication<TInternalServices>,
    JsonValidator(post): JsonValidator<AddPostRequest>,
) -> Response {
    match state.services.post.add(user.id, post).await {
        Ok(post) => Json(HttpResponse { data: post }).into_response(),
        Err(PostServiceErr::Other(e)) => response_unhandled_err(e),
    }
}

pub async fn delete<TInternalServices: IInternalServices>(
    Path(id): Path<String>,
    State(state): InternalState<TInternalServices>,
    Authentication(user, _): Authentication<TInternalServices>,
) -> Response {
    let id = match id.parse::<Uuid>() {
        Ok(id) => id,
        Err(_) => return response_400_with_const(INVALID_UUID_ERR),
    };

    match state.services.post.existed(id, user.id).await {
        Ok(existed) =>
            if !existed {
                return response_400_with_const(NOT_AUTH_DEL);
            },
        Err(PostServiceErr::Other(e)) => return response_unhandled_err(e),
    };

    match state.services.post.delete(id).await {
        Ok(post) => Json(HttpResponse { data: post }).into_response(),
        Err(PostServiceErr::Other(e)) => response_unhandled_err(e),
    }
}
