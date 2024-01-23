use axum::{
    extract::State,
    response::{IntoResponse, Response},
    Json,
};

use crate::{
    http::{controllers::InternalState, utils::err_handler::response_unhandled_err},
    model::responses::HttpResponse,
    services::{
        post::{IPostService, PostServiceErr},
        IInternalServices,
    },
};

pub async fn get_all<TInternalServices: IInternalServices>(
    State(state): InternalState<TInternalServices>,
) -> Response {
    match state.services.post.get_all().await {
        Ok(posts) => Json(HttpResponse { data: posts }).into_response(),
        Err(PostServiceErr::Other(e)) => response_unhandled_err(e),
    }
}
