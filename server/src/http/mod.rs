mod controllers;

use std::{net::SocketAddr, sync::Arc};

use anyhow::Result;
use axum::{
    routing::{get, post},
    Router,
};
use controllers::book::get_books;
use tracing::info;

use crate::{config::Config, http::controllers::book::add_books, services::book::IBookService};

pub struct Server<T: IBookService> {
    config: Config,
    services: Services<T>,
}

struct Services<T: IBookService> {
    book: T,
}

impl<T> Server<T>
where
    T: IBookService + Sync + Send + 'static,
{
    pub fn new(config: Config, book_service: T) -> Self {
        Self {
            config,
            services: Services { book: book_service },
        }
    }

    pub async fn start(self) -> Result<()> {
        let http_address = SocketAddr::from(([0, 0, 0, 0], self.config.server.http_port));
        let app = Router::new()
            .route("/books", get(get_books::<T>))
            .route("/books", post(add_books::<T>))
            .with_state(Arc::new(self));
        info!("listening on {}", http_address);
        axum::Server::bind(&http_address)
            .serve(app.into_make_service())
            .await?;
        Ok(())
    }
}
