use std::sync::Arc;

use axum::{
    extract::State,
    response::{IntoResponse, Json, Response},
};

use crate::{
    http::Server,
    model::{requests::book::AddBookRequest, responses::HttpResponse},
    services::book::IBookService,
};

pub async fn get_books<T>(State(state): State<Arc<Server<T>>>) -> Response
where
    T: IBookService,
{
    let books = state.services.book.get_books().await.unwrap();
    Json(HttpResponse { data: books }).into_response()
}

pub async fn add_books<T>(
    State(state): State<Arc<Server<T>>>,
    Json(book): Json<AddBookRequest>,
) -> Response
where
    T: IBookService,
{
    let books = state.services.book.add_books(book).await.unwrap();
    Json(HttpResponse { data: books }).into_response()
}
