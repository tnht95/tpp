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
        requests::{post::AddPostRequest, PaginationParam},
        responses::HttpResponse,
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
