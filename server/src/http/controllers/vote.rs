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
            validator::JsonValidator,
        },
    },
    model::{
        requests::vote::AddVoteRequest,
        responses::{vote::INVALID_GAME, HttpResponse, INVALID_UUID_ERR},
    },
    services::{
        vote::{IVoteService, VoteServiceErr},
        IInternalServices,
    },
};

pub async fn vote<TInternalServices: IInternalServices>(
    Path(game_id): Path<String>,
    State(state): InternalState<TInternalServices>,
    Authentication { user, .. }: Authentication<TInternalServices>,
    JsonValidator(vote): JsonValidator<AddVoteRequest>,
) -> Response {
    let game_id = match game_id.parse::<Uuid>() {
        Ok(id) => id,
        Err(_) => return response_400_with_const(INVALID_UUID_ERR),
    };
    match state.services.vote.vote(game_id, user.id, vote).await {
        Ok(vote) => Json(HttpResponse { data: vote }).into_response(),
        Err(e) => match e {
            VoteServiceErr::InvalidGame => response_400_with_const(INVALID_GAME),
            VoteServiceErr::Other(e) => response_unhandled_err(e),
        },
    }
}

pub async fn un_vote<TInternalServices: IInternalServices>(
    Path(game_id): Path<String>,
    State(state): InternalState<TInternalServices>,
    Authentication { user, .. }: Authentication<TInternalServices>,
) -> Response {
    let game_id = match game_id.parse::<Uuid>() {
        Ok(id) => id,
        Err(_) => return response_400_with_const(INVALID_UUID_ERR),
    };

    match state.services.vote.un_vote(game_id, user.id).await {
        Ok(vote) => Json(HttpResponse { data: vote }).into_response(),
        Err(e) => match e {
            VoteServiceErr::Other(e) => response_unhandled_err(e),
            VoteServiceErr::InvalidGame => unreachable!(),
        },
    }
}
