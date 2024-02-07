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
        requests::{
            discussion::{AddDiscussionRequest, EditDiscussionRequest},
            Pagination,
        },
        responses::{
            comment::{NOT_AUTH_DEL, NOT_AUTH_EDIT},
            discussion::NOT_FOUND,
            HttpResponse,
            INVALID_UUID_ERR,
        },
    },
    services::{
        discussion::{DiscussionServiceErr, IDiscussionService},
        IInternalServices,
    },
};

pub async fn filter<TInternalServices: IInternalServices>(
    Path(game_id): Path<String>,
    Query(pagination): Query<Pagination>,
    State(state): InternalState<TInternalServices>,
) -> Response {
    let game_id = match game_id.parse::<Uuid>() {
        Ok(id) => id,
        Err(_) => return response_400_with_const(INVALID_UUID_ERR),
    };

    match state.services.discussion.filter(game_id, pagination).await {
        Ok(discussions) => Json(HttpResponse { data: discussions }).into_response(),
        Err(DiscussionServiceErr::Other(e)) => response_unhandled_err(e),
    }
}

pub async fn add<TInternalServices: IInternalServices>(
    Path(game_id): Path<String>,
    State(state): InternalState<TInternalServices>,
    Authentication(user, ..): Authentication<TInternalServices>,
    JsonValidator(discussion): JsonValidator<AddDiscussionRequest>,
) -> Response {
    let game_id = match game_id.parse::<Uuid>() {
        Ok(id) => id,
        Err(_) => return response_400_with_const(INVALID_UUID_ERR),
    };

    match state
        .services
        .discussion
        .add(user.id, user.name, game_id, discussion)
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

pub async fn edit<TInternalServices: IInternalServices>(
    Path(id): Path<String>,
    State(state): InternalState<TInternalServices>,
    Authentication(user, ..): Authentication<TInternalServices>,
    JsonValidator(discussion): JsonValidator<EditDiscussionRequest>,
) -> Response {
    let id = match id.parse::<Uuid>() {
        Ok(id) => id,
        Err(_) => return response_400_with_const(INVALID_UUID_ERR),
    };

    match state.services.discussion.existed(id, user.id).await {
        Ok(existed) =>
            if !existed {
                return response_400_with_const(NOT_AUTH_EDIT);
            },
        Err(DiscussionServiceErr::Other(e)) => return response_unhandled_err(e),
    };

    match state.services.discussion.edit(id, discussion).await {
        Ok(discussion) => Json(HttpResponse { data: discussion }).into_response(),
        Err(DiscussionServiceErr::Other(e)) => response_unhandled_err(e),
    }
}

pub async fn delete<TInternalServices: IInternalServices>(
    Path(id): Path<String>,
    State(state): InternalState<TInternalServices>,
    Authentication(user, ..): Authentication<TInternalServices>,
) -> Response {
    let id = match id.parse::<Uuid>() {
        Ok(id) => id,
        Err(_) => return response_400_with_const(INVALID_UUID_ERR),
    };

    match state.services.discussion.existed(id, user.id).await {
        Ok(existed) =>
            if !existed {
                return response_400_with_const(NOT_AUTH_DEL);
            },
        Err(DiscussionServiceErr::Other(e)) => return response_unhandled_err(e),
    };

    match state.services.discussion.delete(id).await {
        Ok(discussion) => Json(HttpResponse { data: discussion }).into_response(),
        Err(DiscussionServiceErr::Other(e)) => response_unhandled_err(e),
    }
}

pub async fn count<TInternalServices: IInternalServices>(
    Path(game_id): Path<String>,
    State(state): InternalState<TInternalServices>,
) -> Response {
    let game_id = match game_id.parse::<Uuid>() {
        Ok(id) => id,
        Err(_) => return response_400_with_const(INVALID_UUID_ERR),
    };

    match state.services.discussion.count(game_id).await {
        Ok(count) => Json(HttpResponse { data: count }).into_response(),
        Err(DiscussionServiceErr::Other(e)) => response_unhandled_err(e),
    }
}
