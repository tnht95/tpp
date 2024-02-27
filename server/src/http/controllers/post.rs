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
            post::{AddPostRequest, EditPostRequest},
            Pagination,
        },
        responses::{
            post::{NOT_AUTH_DEL, NOT_AUTH_EDIT},
            HttpResponse,
            INVALID_UUID_ERR,
        },
    },
    services::{
        post::{IPostService, PostServiceErr},
        IInternalServices,
    },
};

pub async fn filter<TInternalServices: IInternalServices>(
    Query(pagination): Query<Pagination>,
    State(state): InternalState<TInternalServices>,
    AuthenticationMaybe { user, .. }: AuthenticationMaybe<TInternalServices>,
) -> Response {
    match state
        .services
        .post
        .filter(pagination.into(), user.map(|u| u.id))
        .await
    {
        Ok(posts) => Json(HttpResponse { data: posts }).into_response(),
        Err(PostServiceErr::Other(e)) => response_unhandled_err(e),
    }
}

pub async fn add<TInternalServices: IInternalServices>(
    State(state): InternalState<TInternalServices>,
    Authentication { user, .. }: Authentication<TInternalServices>,
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
    Authentication { user, .. }: Authentication<TInternalServices>,
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

pub async fn edit<TInternalServices: IInternalServices>(
    Path(id): Path<String>,
    State(state): InternalState<TInternalServices>,
    Authentication { user, .. }: Authentication<TInternalServices>,
    JsonValidator(post): JsonValidator<EditPostRequest>,
) -> Response {
    let id = match id.parse::<Uuid>() {
        Ok(id) => id,
        Err(_) => return response_400_with_const(INVALID_UUID_ERR),
    };

    match state.services.post.existed(id, user.id).await {
        Ok(existed) =>
            if !existed {
                return response_400_with_const(NOT_AUTH_EDIT);
            },
        Err(PostServiceErr::Other(e)) => return response_unhandled_err(e),
    };

    match state.services.post.edit(id, post, user.id).await {
        Ok(post) => Json(HttpResponse { data: post }).into_response(),
        Err(PostServiceErr::Other(e)) => response_unhandled_err(e),
    }
}

pub async fn get_by_id<TInternalServices: IInternalServices>(
    Path(id): Path<String>,
    State(state): InternalState<TInternalServices>,
    AuthenticationMaybe { user, .. }: AuthenticationMaybe<TInternalServices>,
) -> Response {
    let id = match id.parse::<Uuid>() {
        Ok(id) => id,
        Err(_) => return response_400_with_const(INVALID_UUID_ERR),
    };

    match state.services.post.get_by_id(id, user.map(|u| u.id)).await {
        Ok(post) => Json(HttpResponse { data: post }).into_response(),
        Err(PostServiceErr::Other(e)) => response_unhandled_err(e),
    }
}
