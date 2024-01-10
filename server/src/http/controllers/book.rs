use std::sync::Arc;

use axum::{
    extract::State,
    http::StatusCode,
    response::{IntoResponse, Json, Response},
};

use crate::{
    http::Server,
    model::{
        requests::book::AddBookRequest,
        responses::{HttpResponse, INTERNAL_SERVER_ERR},
    },
    services::book::{BookServiceErr, IBookService},
};

pub async fn get_books<T>(State(state): State<Arc<Server<T>>>) -> Response
where
    T: IBookService,
{
    match state.services.book.get_books().await {
        Ok(books) => Json(HttpResponse { data: books }).into_response(),
        Err(BookServiceErr::Other(_)) =>
            (StatusCode::INTERNAL_SERVER_ERROR, Json(INTERNAL_SERVER_ERR)).into_response(),
    }
}

pub async fn add_books<T>(
    State(state): State<Arc<Server<T>>>,
    Json(book): Json<AddBookRequest>,
) -> Response
where
    T: IBookService,
{
    match state.services.book.add_books(book).await {
        Ok(book) => Json(HttpResponse { data: book }).into_response(),
        Err(BookServiceErr::Other(_)) =>
            (StatusCode::INTERNAL_SERVER_ERROR, Json(INTERNAL_SERVER_ERR)).into_response(),
    }
}
