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
            discussion::{AddDiscussionRequest, EditDiscussionRequest},
            Pagination,
        },
        responses::{
            discussion::{INVALID_GAME, NOT_AUTH_DEL, NOT_AUTH_EDIT, NOT_FOUND},
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

    match state
        .services
        .discussion
        .filter(game_id, pagination.into())
        .await
    {
        Ok(discussions) => Json(HttpResponse { data: discussions }).into_response(),
        Err(e) => match e {
            DiscussionServiceErr::Other(e) => response_unhandled_err(e),
            DiscussionServiceErr::InvalidGame => unreachable!(),
        },
    }
}

pub async fn add<TInternalServices: IInternalServices>(
    Path(game_id): Path<String>,
    State(state): InternalState<TInternalServices>,
    Authentication { user, .. }: Authentication<TInternalServices>,
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
        Err(e) => match e {
            DiscussionServiceErr::InvalidGame => response_400_with_const(INVALID_GAME),
            DiscussionServiceErr::Other(e) => response_unhandled_err(e),
        },
    }
}

pub async fn get_by_id<TInternalServices: IInternalServices>(
    Path((game_id, id)): Path<(String, String)>,
    State(state): InternalState<TInternalServices>,
    AuthenticationMaybe { user, .. }: AuthenticationMaybe<TInternalServices>,
) -> Response {
    let id = match id.parse::<Uuid>() {
        Ok(id) => id,
        Err(_) => return response_400_with_const(INVALID_UUID_ERR),
    };

    let game_id = match game_id.parse::<Uuid>() {
        Ok(game_id) => game_id,
        Err(_) => return response_400_with_const(INVALID_UUID_ERR),
    };

    match state
        .services
        .discussion
        .get_by_id(id, game_id, user.map(|u| u.id))
        .await
    {
        Ok(discussion) => match discussion {
            Some(discussion) => Json(HttpResponse { data: discussion }).into_response(),
            None => response_400_with_const(NOT_FOUND),
        },
        Err(e) => match e {
            DiscussionServiceErr::Other(e) => response_unhandled_err(e),
            DiscussionServiceErr::InvalidGame => unreachable!(),
        },
    }
}

pub async fn edit<TInternalServices: IInternalServices>(
    Path((game_id, id)): Path<(String, String)>,
    State(state): InternalState<TInternalServices>,
    Authentication { user, .. }: Authentication<TInternalServices>,
    JsonValidator(discussion): JsonValidator<EditDiscussionRequest>,
) -> Response {
    let id = match id.parse::<Uuid>() {
        Ok(id) => id,
        Err(_) => return response_400_with_const(INVALID_UUID_ERR),
    };

    let game_id = match game_id.parse::<Uuid>() {
        Ok(game_id) => game_id,
        Err(_) => return response_400_with_const(INVALID_UUID_ERR),
    };

    match state.services.discussion.existed(id, user.id).await {
        Ok(existed) =>
            if !existed {
                return response_400_with_const(NOT_AUTH_EDIT);
            },
        Err(e) => match e {
            DiscussionServiceErr::Other(e) => return response_unhandled_err(e),
            DiscussionServiceErr::InvalidGame => unreachable!(),
        },
    };

    match state
        .services
        .discussion
        .edit(id, game_id, discussion, user.id)
        .await
    {
        Ok(discussion) => Json(HttpResponse { data: discussion }).into_response(),
        Err(e) => match e {
            DiscussionServiceErr::Other(e) => response_unhandled_err(e),
            DiscussionServiceErr::InvalidGame => unreachable!(),
        },
    }
}

pub async fn delete<TInternalServices: IInternalServices>(
    Path((game_id, id)): Path<(String, String)>,
    State(state): InternalState<TInternalServices>,
    Authentication { user, .. }: Authentication<TInternalServices>,
) -> Response {
    let id = match id.parse::<Uuid>() {
        Ok(id) => id,
        Err(_) => return response_400_with_const(INVALID_UUID_ERR),
    };

    let game_id = match game_id.parse::<Uuid>() {
        Ok(game_id) => game_id,
        Err(_) => return response_400_with_const(INVALID_UUID_ERR),
    };

    match state.services.discussion.existed(id, user.id).await {
        Ok(existed) =>
            if !existed {
                return response_400_with_const(NOT_AUTH_DEL);
            },
        Err(e) => match e {
            DiscussionServiceErr::Other(e) => return response_unhandled_err(e),
            DiscussionServiceErr::InvalidGame => unreachable!(),
        },
    };

    match state.services.discussion.delete(id, game_id).await {
        Ok(discussion) => Json(HttpResponse { data: discussion }).into_response(),
        Err(e) => match e {
            DiscussionServiceErr::Other(e) => response_unhandled_err(e),
            DiscussionServiceErr::InvalidGame => unreachable!(),
        },
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
        Err(e) => match e {
            DiscussionServiceErr::Other(e) => response_unhandled_err(e),
            DiscussionServiceErr::InvalidGame => unreachable!(),
        },
    }
}
