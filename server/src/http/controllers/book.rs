use axum::{
    extract::State,
    response::{IntoResponse, Json, Response},
};

use super::InternalState;
use crate::{
    http::utils::err_handler::response_unhandled_err,
    model::{requests::book::AddBookRequest, responses::HttpResponse},
    services::{
        book::{BookServiceErr, IBookService},
        health::IHealthService,
        user::IUserService,
    },
};

pub async fn get_books<THealthService, TBookService, TUSerService>(
    State(state): InternalState<THealthService, TBookService, TUSerService>,
) -> Response
where
    THealthService: IHealthService,
    TBookService: IBookService,
    TUSerService: IUserService,
{
    match state.services.book.get_books().await {
        Ok(books) => Json(HttpResponse { data: books }).into_response(),
        Err(BookServiceErr::Other(e)) => response_unhandled_err(e),
    }
}

pub async fn add_books<THealthService, TBookService, TUSerService>(
    State(state): InternalState<THealthService, TBookService, TUSerService>,
    Json(book): Json<AddBookRequest>,
) -> Response
where
    THealthService: IHealthService,
    TBookService: IBookService,
    TUSerService: IUserService,
{
    match state.services.book.add_books(book).await {
        Ok(book) => Json(HttpResponse { data: book }).into_response(),
        Err(BookServiceErr::Other(e)) => response_unhandled_err(e),
    }
}
