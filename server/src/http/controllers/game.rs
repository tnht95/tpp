use axum::{
    extract::State,
    response::{IntoResponse, Response},
    Json,
};

use crate::{
    http::{
        controllers::InternalState,
        utils::{err_handler::response_unhandled_err, validator::QueryValidator},
    },
    model::{requests::game::GameQuery, responses::HttpResponse},
    services::{
        game::{GameServiceErr, IGameService},
        IInternalServices,
    },
};

pub async fn filter<TInternalServices: IInternalServices>(
    State(state): InternalState<TInternalServices>,
    QueryValidator(query): QueryValidator<GameQuery>,
) -> Response {
    //fixme: constraint orderBy && orderField || !orderBy && !orderField
    match state.services.game.filter(query).await {
        Ok(games) => Json(HttpResponse { data: games }).into_response(),
        Err(GameServiceErr::Other(e)) => response_unhandled_err(e),
    }
}
