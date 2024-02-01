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
        requests::comment::{AddCommentRequest, CommentQuery},
        responses::HttpResponse,
    },
    services::{
        comment::{CommentServiceErr, ICommentService},
        IInternalServices,
    },
};

pub async fn filter<TInternalServices: IInternalServices>(
    State(state): InternalState<TInternalServices>,
    Query(query): Query<CommentQuery>,
) -> Response {
    match state.services.comment.filter(query).await {
        Ok(comments) => Json(HttpResponse { data: comments }).into_response(),
        Err(CommentServiceErr::Other(e)) => response_unhandled_err(e),
    }
}

pub async fn add<TInternalServices: IInternalServices>(
    State(state): InternalState<TInternalServices>,
    Authentication(user, ..): Authentication<TInternalServices>,
    JsonValidator(comment): JsonValidator<AddCommentRequest>,
) -> Response {
    match state
        .services
        .comment
        .add(user.id, user.name, comment)
        .await
    {
        Ok(comment) => Json(HttpResponse { data: comment }).into_response(),
        Err(CommentServiceErr::Other(e)) => response_unhandled_err(e),
    }
}
