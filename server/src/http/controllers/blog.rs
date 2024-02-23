use axum::{
    extract::{Path, Query, State},
    response::{IntoResponse, Response},
    Json,
};
use uuid::Uuid;

use crate::{
    http::{
        controllers::InternalState,
        utils::{
            auth::Authentication,
            err_handler::{response_400_with_const, response_403_err, response_unhandled_err},
            validator::JsonValidator,
        },
    },
    model::{
        requests::{
            blog::{AddBlogRequest, EditBlogRequest},
            Pagination,
        },
        responses::{blog::NOT_FOUND, HttpResponse, INVALID_UUID_ERR},
    },
    services::{
        blog::{BlogServiceErr, IBlogService},
        IInternalServices,
    },
};

pub async fn filter<TInternalServices: IInternalServices>(
    Query(pagination): Query<Pagination>,
    State(state): InternalState<TInternalServices>,
) -> Response {
    match state.services.blog.filter(pagination.into()).await {
        Ok(blogs) => Json(HttpResponse { data: blogs }).into_response(),
        Err(BlogServiceErr::Other(e)) => response_unhandled_err(e),
    }
}

pub async fn add<TInternalServices: IInternalServices>(
    State(state): InternalState<TInternalServices>,
    Authentication(user, is_admin, _): Authentication<TInternalServices>,
    JsonValidator(blog): JsonValidator<AddBlogRequest>,
) -> Response {
    if !is_admin {
        return response_403_err();
    }
    match state.services.blog.add(user.id, blog).await {
        Ok(blog) => Json(HttpResponse { data: blog }).into_response(),
        Err(BlogServiceErr::Other(e)) => response_unhandled_err(e),
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

    match state.services.blog.get_by_id(id).await {
        Ok(blog) => match blog {
            Some(blog) => Json(HttpResponse { data: blog }).into_response(),
            None => response_400_with_const(NOT_FOUND),
        },
        Err(BlogServiceErr::Other(e)) => response_unhandled_err(e),
    }
}

pub async fn delete<TInternalServices: IInternalServices>(
    Path(id): Path<String>,
    State(state): InternalState<TInternalServices>,
    Authentication(_, is_admin, _): Authentication<TInternalServices>,
) -> Response {
    if !is_admin {
        return response_403_err();
    }

    let id = match id.parse::<Uuid>() {
        Ok(id) => id,
        Err(_) => return response_400_with_const(INVALID_UUID_ERR),
    };

    match state.services.blog.delete(id).await {
        Ok(blog) => Json(HttpResponse { data: blog }).into_response(),
        Err(BlogServiceErr::Other(e)) => response_unhandled_err(e),
    }
}

pub async fn edit<TInternalServices: IInternalServices>(
    Path(id): Path<String>,
    State(state): InternalState<TInternalServices>,
    Authentication(_, is_admin, _): Authentication<TInternalServices>,
    JsonValidator(blog): JsonValidator<EditBlogRequest>,
) -> Response {
    if !is_admin {
        return response_403_err();
    }

    let id = match id.parse::<Uuid>() {
        Ok(id) => id,
        Err(_) => return response_400_with_const(INVALID_UUID_ERR),
    };

    match state.services.blog.edit(id, blog).await {
        Ok(blog) => Json(HttpResponse { data: blog }).into_response(),
        Err(BlogServiceErr::Other(e)) => response_unhandled_err(e),
    }
}

pub async fn get_tags<TInternalServices: IInternalServices>(
    State(state): InternalState<TInternalServices>,
) -> Response {
    match state.services.blog.get_tags().await {
        Ok(tags) => Json(HttpResponse { data: tags }).into_response(),
        Err(BlogServiceErr::Other(e)) => response_unhandled_err(e),
    }
}
