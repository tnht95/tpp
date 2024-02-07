mod controllers;
mod handlers;
mod utils;

use std::{iter::once, net::SocketAddr, sync::Arc, time::Duration};

use anyhow::Result;
use axum::{
    extract::DefaultBodyLimit,
    http::{header::AUTHORIZATION, Method},
    routing::{delete, get, post, put},
    Router,
    ServiceExt,
};
use tower::ServiceBuilder;
use tower_http::{
    catch_panic::CatchPanicLayer,
    compression::{CompressionLayer, CompressionLevel},
    cors::CorsLayer,
    limit::RequestBodyLimitLayer,
    normalize_path::NormalizePath,
    request_id::{MakeRequestUuid, PropagateRequestIdLayer, SetRequestIdLayer},
    sensitive_headers::SetSensitiveRequestHeadersLayer,
    services::ServeDir,
    timeout::{RequestBodyTimeoutLayer, TimeoutLayer},
    trace::{DefaultMakeSpan, DefaultOnResponse, TraceLayer},
};
use tracing::{info, Level};

use crate::{
    config::Config,
    http::{
        controllers::{auth, blog, book, comment, discussion, game, health, post, search, user},
        handlers::{panic, shutdown},
        utils::err_handler::response_404_err,
    },
    services::{IInternalServices, Services},
};

pub struct Server<TInternalServices: IInternalServices> {
    config: Config,
    services: Services<TInternalServices>,
}

impl<TInternalServices> Server<TInternalServices>
where
    TInternalServices: IInternalServices + 'static + Send,
{
    pub fn new(config: Config, services: Services<TInternalServices>) -> Self {
        Self { config, services }
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
                    .max_age(Duration::from_secs(self.config.server.cors_max_age)),
            )
            .layer(SetSensitiveRequestHeadersLayer::new(once(AUTHORIZATION)))
            .layer(CompressionLayer::new().quality(CompressionLevel::Fastest))
            .layer(CatchPanicLayer::custom(panic::recover))
            .layer(
                TraceLayer::new_for_http()
                    .make_span_with(
                        DefaultMakeSpan::new()
                            .level(Level::INFO)
                            .include_headers(true),
                    )
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
        let app = NormalizePath::trim_trailing_slash(
            Router::new()
                .nest_service("/roms", ServeDir::new(&state.config.rom_dir))
                .route("/health", get(health::is_healthy))
                .nest(
                    "/api/v1",
                    Router::new()
                        .route("/me", get(auth::me))
                        .route("/logout", post(auth::log_out))
                        .route("/authentication", get(auth::authentication))
                        .route("/users/:id", get(user::get_by_id))
                        .route("/books", get(book::get_all))
                        .route("/books", post(book::add))
                        .route("/games", get(game::filter))
                        .route("/games", post(game::add))
                        .route("/games/:id", get(game::get_by_id))
                        .route("/games/:id", delete(game::delete))
                        .route("/games/:id", put(game::edit))
                        .route("/games/tags", get(game::get_tags))
                        .route("/posts", get(post::filter))
                        .route("/posts", post(post::add))
                        .route("/posts/:id", delete(post::delete))
                        .route("/posts/:id", put(post::edit))
                        .route("/blogs", get(blog::filter))
                        .route("/blogs", post(blog::add))
                        .route("/blogs/:id", get(blog::get_by_id))
                        .route("/blogs/:id", delete(blog::delete))
                        .route("/blogs/:id", put(blog::edit))
                        .route("/blogs/tags", get(blog::get_tags))
                        .route("/comments", get(comment::filter))
                        .route("/comments", post(comment::add))
                        .route("/comments/:id", delete(comment::delete))
                        .route("/comments/:id", put(comment::edit))
                        .route("/games/:gid/discussions", get(discussion::filter))
                        .route("/games/:gid/discussions", post(discussion::add))
                        .route("/games/:gid/discussions/counts", get(discussion::count))
                        .route("/discussions/:id", get(discussion::get_by_id))
                        .route("/discussions/:id", put(discussion::edit))
                        .route("/discussions/:id", delete(discussion::delete))
                        .route("/search", get(search::search))
                        .layer(middleware),
                )
                .layer(DefaultBodyLimit::max(5 * 1024)) // 5KB
                .layer(RequestBodyLimitLayer::new(5 * 1024)) // 5KB
                .fallback(response_404_err)
                .with_state(Arc::clone(&state)),
        );

        info!("listening on {}", http_address);

        axum::Server::bind(&http_address)
            .serve(app.into_make_service())
            .with_graceful_shutdown(shutdown::handle(state))
            .await?;

        info!("Server shutdown successfully");

        Ok(())
    }
}
