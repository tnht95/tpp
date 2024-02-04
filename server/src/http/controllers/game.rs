use axum::{
    extract::{Multipart, Path, State},
    response::{IntoResponse, Response},
    Json,
};
use uuid::Uuid;
use validator::Validate;

use crate::{
    http::{
        controllers::InternalState,
        utils::{
            auth::Authentication,
            err_handler::{
                response_400_with_const,
                response_unhandled_err,
                response_validation_err,
            },
            multipart::extract_bytes_from_multipart,
            validator::QueryValidator,
        },
    },
    model::{
        requests::game::{AddGameRequest, GameQuery},
        responses::{
            game::{DESERIALIZE_GAME_ERR, INVALID_ROM, NOT_AUTH_DEL, NOT_FOUND},
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

pub async fn add<TInternalServices: IInternalServices>(
    State(state): InternalState<TInternalServices>,
    Authentication(user, ..): Authentication<TInternalServices>,
    mut multipart: Multipart,
) -> Response {
    let rom_bytes = match extract_bytes_from_multipart(&mut multipart).await {
        Ok(bytes) => {
            if bytes.is_empty() || bytes.len() > 3584 {
                return response_400_with_const(INVALID_ROM);
            }
            bytes
        }
        Err(e) => return e,
    };

    let game = match extract_bytes_from_multipart(&mut multipart).await {
        Ok(bytes) => match serde_json::from_slice::<AddGameRequest>(&bytes) {
            Ok(game) => game,
            Err(_) => return response_400_with_const(DESERIALIZE_GAME_ERR),
        },
        Err(e) => return e,
    };

    match game.validate() {
        Ok(_) => (),
        Err(e) => return response_validation_err(e).into_response(),
    };

    match state
        .services
        .game
        .add(user.id, user.name, game, &rom_bytes)
        .await
    {
        Ok(game) => Json(HttpResponse { data: game }).into_response(),
        Err(GameServiceErr::Other(e)) => response_unhandled_err(e),
    }
}
