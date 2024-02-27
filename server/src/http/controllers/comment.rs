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
            auth::{Authentication, AuthenticationMaybe},
            err_handler::{response_400_with_const, response_unhandled_err},
            validator::JsonValidator,
        },
    },
    model::{
        requests::{
            comment::{AddCommentRequest, DeleteCommentRequest, EditCommentRequest},
            PaginationWithTarget,
        },
        responses::{
            comment::{NOT_AUTH_DEL, NOT_AUTH_EDIT},
            HttpResponse,
            INVALID_UUID_ERR,
        },
    },
    services::{
        comment::{CommentServiceErr, ICommentService},
        IInternalServices,
    },
};

pub async fn filter<TInternalServices: IInternalServices>(
    State(state): InternalState<TInternalServices>,
    Query(pagination): Query<PaginationWithTarget>,
    AuthenticationMaybe { user, .. }: AuthenticationMaybe<TInternalServices>,
) -> Response {
    match state
        .services
        .comment
        .filter(pagination.into(), user.map(|u| u.id))
        .await
    {
        Ok(comments) => Json(HttpResponse { data: comments }).into_response(),
        Err(CommentServiceErr::Other(e)) => response_unhandled_err(e),
    }
}

pub async fn add<TInternalServices: IInternalServices>(
    State(state): InternalState<TInternalServices>,
    Authentication { user, .. }: Authentication<TInternalServices>,
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

pub async fn delete<TInternalServices: IInternalServices>(
    Path(id): Path<String>,
    State(state): InternalState<TInternalServices>,
    Authentication { user, .. }: Authentication<TInternalServices>,
    Json(comment): Json<DeleteCommentRequest>,
) -> Response {
    let id = match id.parse::<Uuid>() {
        Ok(id) => id,
        Err(_) => return response_400_with_const(INVALID_UUID_ERR),
    };

    match state.services.comment.existed(id, user.id).await {
        Ok(existed) =>
            if !existed {
                return response_400_with_const(NOT_AUTH_DEL);
            },
        Err(CommentServiceErr::Other(e)) => return response_unhandled_err(e),
    };

    match state.services.comment.delete(id, comment).await {
        Ok(comment) => Json(HttpResponse { data: comment }).into_response(),
        Err(CommentServiceErr::Other(e)) => response_unhandled_err(e),
    }
}

pub async fn edit<TInternalServices: IInternalServices>(
    Path(id): Path<String>,
    State(state): InternalState<TInternalServices>,
    Authentication { user, .. }: Authentication<TInternalServices>,
    JsonValidator(comment): JsonValidator<EditCommentRequest>,
) -> Response {
    let id = match id.parse::<Uuid>() {
        Ok(id) => id,
        Err(_) => return response_400_with_const(INVALID_UUID_ERR),
    };

    match state.services.comment.existed(id, user.id).await {
        Ok(existed) =>
            if !existed {
                return response_400_with_const(NOT_AUTH_EDIT);
            },
        Err(CommentServiceErr::Other(e)) => return response_unhandled_err(e),
    };

    match state.services.comment.edit(id, comment, user.id).await {
        Ok(comment) => Json(HttpResponse { data: comment }).into_response(),
        Err(CommentServiceErr::Other(e)) => response_unhandled_err(e),
    }
}
