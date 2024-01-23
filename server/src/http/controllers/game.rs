use axum::{
    extract::State,
    response::{IntoResponse, Response},
    Json,
};

use crate::{
    http::{controllers::InternalState, utils::err_handler::response_unhandled_err},
    model::responses::HttpResponse,
    services::{
        game::{GameServiceErr, IGameService},
        IInternalServices,
    },
};

pub async fn get_all<TInternalServices: IInternalServices>(
    State(state): InternalState<TInternalServices>,
) -> Response {
    match state.services.game.get_all().await {
        Ok(games) => Json(HttpResponse { data: games }).into_response(),
        Err(GameServiceErr::Other(e)) => response_unhandled_err(e),
    }
}

pub async fn get_newest<TInternalServices: IInternalServices>(
    State(state): InternalState<TInternalServices>,
) -> Response {
    match state.services.game.get_newest().await {
        Ok(games) => Json(HttpResponse { data: games }).into_response(),
        Err(GameServiceErr::Other(e)) => response_unhandled_err(e),
    }
}
