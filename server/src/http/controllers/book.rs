use std::sync::Arc;

use axum::{
    extract::State,
    http::StatusCode,
    response::{IntoResponse, Json, Response},
};
use tokio::sync::RwLock;

use crate::{
    http::Server,
    model::{
        requests::book::AddBookRequest,
        responses::{HttpResponse, INTERNAL_SERVER_ERR},
    },
    services::{
        book::{BookServiceErr, IBookService},
        health::IHealthService,
    },
};

pub async fn get_books<THealthService, TBookService>(
    State(state): State<Arc<RwLock<Server<THealthService, TBookService>>>>,
) -> Response
where
    THealthService: IHealthService,
    TBookService: IBookService,
{
    match state.read().await.services.book.get_books().await {
        Ok(books) => Json(HttpResponse { data: books }).into_response(),
        Err(BookServiceErr::Other(_)) =>
            (StatusCode::INTERNAL_SERVER_ERROR, Json(INTERNAL_SERVER_ERR)).into_response(),
    }
}

pub async fn add_books<THealthService, TBookService>(
    State(state): State<Arc<RwLock<Server<THealthService, TBookService>>>>,
    Json(book): Json<AddBookRequest>,
) -> Response
where
    THealthService: IHealthService,
    TBookService: IBookService,
{
    match state.read().await.services.book.add_books(book).await {
        Ok(book) => Json(HttpResponse { data: book }).into_response(),
        Err(BookServiceErr::Other(_)) =>
            (StatusCode::INTERNAL_SERVER_ERROR, Json(INTERNAL_SERVER_ERR)).into_response(),
    }
}
