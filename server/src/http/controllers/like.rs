use axum::{
    extract::State,
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
        requests::like::{AddLikeRequest, DeleteLikeRequest},
        responses::HttpResponse,
    },
    services::{
        like::{ILikeService, LikeServiceErr},
        IInternalServices,
    },
};

pub async fn like<TInternalServices: IInternalServices>(
    State(state): InternalState<TInternalServices>,
    Authentication { user, .. }: Authentication<TInternalServices>,
    JsonValidator(like_req): JsonValidator<AddLikeRequest>,
) -> Response {
    match state.services.like.like(user.id, like_req).await {
        Ok(post) => Json(HttpResponse { data: post }).into_response(),
        Err(LikeServiceErr::Other(e)) => response_unhandled_err(e),
    }
}

pub async fn unlike<TInternalServices: IInternalServices>(
    State(state): InternalState<TInternalServices>,
    Authentication { user, .. }: Authentication<TInternalServices>,
    JsonValidator(like_req): JsonValidator<DeleteLikeRequest>,
) -> Response {
    match state.services.like.unlike(user.id, like_req).await {
        Ok(post) => Json(HttpResponse { data: post }).into_response(),
        Err(LikeServiceErr::Other(e)) => response_unhandled_err(e),
    }
}
