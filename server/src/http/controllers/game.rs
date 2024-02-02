use axum::{
    extract::{Path, State},
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
            validator::{JsonValidator, QueryValidator},
        },
    },
    model::{
        requests::game::{AddGameRequest, GameQuery},
        responses::{
            game::{NOT_AUTH_DEL, NOT_FOUND},
            HttpResponse,
            INVALID_UUID_ERR,
        },
    },
    services::{
        game::{GameServiceErr, IGameService},
        IInternalServices,
    },
};

pub async fn filter<TInternalServices: IInternalServices>(
    State(state): InternalState<TInternalServices>,
    QueryValidator(query): QueryValidator<GameQuery>,
) -> Response {
    match state.services.game.filter(query).await {
        Ok(games) => Json(HttpResponse { data: games }).into_response(),
        Err(GameServiceErr::Other(e)) => response_unhandled_err(e),
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

    match state.services.game.get_by_id(id).await {
        Ok(game) => match game {
            Some(game) => Json(HttpResponse { data: game }).into_response(),
            None => response_400_with_const(NOT_FOUND),
        },
        Err(GameServiceErr::Other(e)) => response_unhandled_err(e),
    }
}

pub async fn add<TInternalServices: IInternalServices>(
    State(state): InternalState<TInternalServices>,
    Authentication(user, ..): Authentication<TInternalServices>,
    JsonValidator(game): JsonValidator<AddGameRequest>,
) -> Response {
    match state.services.game.add(user.id, &user.name, game).await {
        Ok(game) => Json(HttpResponse { data: game }).into_response(),
        Err(GameServiceErr::Other(e)) => response_unhandled_err(e),
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

    match state.services.game.existed(id, user.id).await {
        Ok(existed) =>
            if !existed {
                return response_400_with_const(NOT_AUTH_DEL);
            },
        Err(GameServiceErr::Other(e)) => return response_unhandled_err(e),
    };

    match state.services.game.delete(id).await {
        Ok(game) => Json(HttpResponse { data: game }).into_response(),
        Err(GameServiceErr::Other(e)) => response_unhandled_err(e),
    }
}
