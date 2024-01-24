use axum::{
    extract::{Query, State},
    http::{HeaderMap, StatusCode},
    response::{IntoResponse, Response},
    Json,
};

use super::extract_jwt_claim;
use crate::{
    http::{controllers::InternalState, utils::err_handler::response_unhandled_err},
    model::{
        requests::{post::AddPostRequest, PaginationParam},
        responses::HttpResponse,
    },
    services::{
        post::{IPostService, PostServiceErr},
        IInternalServices,
    },
};

pub async fn filter<TInternalServices: IInternalServices>(
    Query(pagination): Query<PaginationParam>,
    State(state): InternalState<TInternalServices>,
) -> Response {
    match state.services.post.filter(pagination.into()).await {
        Ok(posts) => Json(HttpResponse { data: posts }).into_response(),
        Err(PostServiceErr::Other(e)) => response_unhandled_err(e),
    }
}

pub async fn add<TInternalServices: IInternalServices>(
    headers: HeaderMap,
    State(state): InternalState<TInternalServices>,
    Json(post): Json<AddPostRequest>,
) -> Response {
    let user = match extract_jwt_claim(headers, &state.config.auth.jwt.secret) {
        Ok(jwt_claim) => jwt_claim.user,
        Err(_) => return StatusCode::UNAUTHORIZED.into_response(),
    };

    match state.services.post.add(user.id, post).await {
        Ok(post) => Json(HttpResponse { data: post }).into_response(),
        Err(PostServiceErr::Other(e)) => response_unhandled_err(e),
    }
}
