mod controllers;
mod handlers;
mod utils;

use std::{iter::once, net::SocketAddr, sync::Arc, time::Duration};

use anyhow::Result;
use axum::{
    http::{header::AUTHORIZATION, Method},
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
    cors::CorsLayer,
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
        controllers::{auth, book::add_books, health::is_healthy},
        handlers::{panic, shutdown},
    },
    services::IInternalServices,
};

pub struct Server<TInternalServices: IInternalServices> {
    config: Config,
    services: Services<TInternalServices>,
}

struct Services<TInternalServices: IInternalServices> {
    health: RwLock<TInternalServices::THealthService>,
    book: TInternalServices::TBookService,
    user: TInternalServices::TUserService,
}

impl<TInternalServices> Server<TInternalServices>
where
    TInternalServices: IInternalServices + 'static,
{
    pub fn new(
        config: Config,
        health: TInternalServices::THealthService,
        book: TInternalServices::TBookService,
        user: TInternalServices::TUserService,
    ) -> Self {
        Self {
            config,
            services: Services {
                health: RwLock::new(health),
                book,
                user,
            },
        }
    }

    pub async fn start(self) -> Result<()> {
        let http_address = SocketAddr::from(([0, 0, 0, 0], self.config.server.http_port));

        let middleware = ServiceBuilder::new()
            .layer(
                CorsLayer::new()
                    .allow_credentials(true)
                    .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
                    .allow_origin([self.config.site_url.parse().expect("invalid site url")])
                    .allow_headers([
                        "x-request-id".parse().expect("invalid header"),
                        "content-type".parse().expect("invalid header"),
                    ])
                    .max_age(Duration::from_secs(3600)),
            )
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

        let state = Arc::new(self);
        let app = NormalizePath::trim_trailing_slash(Router::merge(
            Router::new()
                .route("/health", get(is_healthy))
                .with_state(Arc::clone(&state)),
            Router::new().nest(
                "/api/v1",
                Router::new()
                    .route("/me", get(auth::me))
                    .route("/logout", post(auth::log_out))
                    .route("/authentication", get(auth::exchange_token))
                    .route("/books", get(get_books))
                    .route("/books", post(add_books))
                    .layer(middleware)
                    .with_state(Arc::clone(&state)),
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
