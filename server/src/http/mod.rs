mod controllers;
mod handlers;
mod utils;

use std::{iter::once, net::SocketAddr, sync::Arc, time::Duration};

use anyhow::Result;
use axum::{
    http::header::AUTHORIZATION,
    routing::{get, post},
    Router,
    ServiceExt,
};
use controllers::book::get_books;
use tokio::sync::RwLock;
use tower::ServiceBuilder;
use tower_http::{
    catch_panic::CatchPanicLayer,
    compression::{CompressionLayer, CompressionLevel},
    normalize_path::NormalizePath,
    request_id::{MakeRequestUuid, PropagateRequestIdLayer, SetRequestIdLayer},
    sensitive_headers::SetSensitiveRequestHeadersLayer,
    timeout::{RequestBodyTimeoutLayer, TimeoutLayer},
    trace::{DefaultMakeSpan, DefaultOnFailure, DefaultOnResponse, TraceLayer},
};
use tracing::{info, Level};

use crate::{
    config::Config,
    http::{
        controllers::{book::add_books, health::is_healthy},
        handlers::{panic, shutdown},
    },
    services::{book::IBookService, health::IHealthService},
};

pub struct Server<THealthService: IHealthService, TBookService: IBookService> {
    config: Config,
    services: Services<THealthService, TBookService>,
}

struct Services<THealthService: IHealthService, TBookService: IBookService> {
    health: THealthService,
    book: TBookService,
}

impl<THealthService, TBookService> Server<THealthService, TBookService>
where
    THealthService: IHealthService + Sync + Send + 'static,
    TBookService: IBookService + Sync + Send + 'static,
{
    pub fn new(config: Config, health: THealthService, book: TBookService) -> Self {
        Self {
            config,
            services: Services { health, book },
        }
    }

    pub async fn start(self) -> Result<()> {
        let http_address = SocketAddr::from(([0, 0, 0, 0], self.config.server.http_port));

        let middleware = ServiceBuilder::new()
            .layer(SetSensitiveRequestHeadersLayer::new(once(AUTHORIZATION)))
            .layer(CompressionLayer::new().quality(CompressionLevel::Fastest))
            .layer(CatchPanicLayer::custom(panic::recover))
            .layer(
                TraceLayer::new_for_http()
                    .make_span_with(DefaultMakeSpan::new().include_headers(true))
                    .on_failure(DefaultOnFailure::new().level(Level::ERROR))
                    .on_response(
                        DefaultOnResponse::new()
                            .level(Level::INFO)
                            .include_headers(true),
                    ),
            )
            .layer(SetRequestIdLayer::x_request_id(MakeRequestUuid))
            .layer(PropagateRequestIdLayer::x_request_id())
            .layer(RequestBodyTimeoutLayer::new(Duration::from_secs(4)))
            .layer(TimeoutLayer::new(Duration::from_secs(5)));

        let state = Arc::new(RwLock::new(self));
        let app = NormalizePath::trim_trailing_slash(Router::merge(
            Router::new()
                .route("/books", get(get_books::<THealthService, TBookService>))
                .route("/books", post(add_books::<THealthService, TBookService>))
                .layer(middleware)
                .with_state(Arc::clone(&state)),
            Router::new().route(
                "/health",
                get(is_healthy::<THealthService, TBookService>).with_state(Arc::clone(&state)),
            ),
        ));

        info!("listening on {}", http_address);

        axum::Server::bind(&http_address)
            .serve(app.into_make_service())
            .with_graceful_shutdown(shutdown::handle(state))
            .await?;

        info!("Server shutdown successfully");

        Ok(())
    }
}
