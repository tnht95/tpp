use axum::{
    extract::State,
    response::{IntoResponse, Response},
    Json,
};

use crate::{
    http::{
        controllers::InternalState,
        utils::{
            auth::Authentication,
            err_handler::{response_403_err, response_unhandled_err},
            validator::JsonValidator,
        },
    },
    model::{requests::blog::AddBlogRequest, responses::HttpResponse},
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

pub async fn add<TInternalServices: IInternalServices>(
    State(state): InternalState<TInternalServices>,
    Authentication(_, is_admin, _): Authentication<TInternalServices>,
    JsonValidator(blog): JsonValidator<AddBlogRequest>,
) -> Response {
    if !is_admin {
        return response_403_err();
    }
    match state.services.blog.add(blog).await {
        Ok(blog) => Json(HttpResponse { data: blog }).into_response(),
        Err(BlogServiceErr::Other(e)) => response_unhandled_err(e),
    }
}
