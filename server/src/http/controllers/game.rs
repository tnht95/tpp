use axum::{
    extract::{Query, State},
    response::{IntoResponse, Response},
    Json,
};

use crate::{
    http::{controllers::InternalState, utils::err_handler::response_unhandled_err},
    model::{requests::game::GameQuery, responses::HttpResponse},
    services::{
        game::{GameServiceErr, IGameService},
        IInternalServices,
    },
};

pub async fn filter<TInternalServices: IInternalServices>(
    Query(query): Query<GameQuery>,
    State(state): InternalState<TInternalServices>,
) -> Response {
    //fixme: constraint orderBy && orderField || !orderBy && !orderField
    match state.services.game.filter(query).await {
        Ok(games) => Json(HttpResponse { data: games }).into_response(),
        Err(GameServiceErr::Other(e)) => response_unhandled_err(e),
    }
}
