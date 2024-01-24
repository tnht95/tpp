use axum::{
    extract::State,
    response::{IntoResponse, Response},
    Json,
};

use crate::{
    http::{controllers::InternalState, utils::err_handler::response_unhandled_err},
    model::responses::HttpResponse,
    services::{
        blog::{BlogServiceErr, IBlogService},
        IInternalServices,
    },
};

pub async fn get_all<TInternalServices: IInternalServices>(
    State(state): InternalState<TInternalServices>,
) -> Response {
    match state.services.blog.get_all().await {
        Ok(blogs) => Json(HttpResponse { data: blogs }).into_response(),
        Err(BlogServiceErr::Other(e)) => response_unhandled_err(e),
    }
}
