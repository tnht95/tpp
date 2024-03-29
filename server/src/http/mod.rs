mod controllers;
mod handlers;
mod utils;
mod ws;

use std::{
    iter::once,
    net::{Ipv4Addr, SocketAddr},
    sync::Arc,
    time::Duration,
};

use anyhow::Result;
use axum::{
    extract::DefaultBodyLimit,
    http::{header::AUTHORIZATION, Method},
    routing::{delete, get, post, put},
    Router,
};
use tokio::net::TcpListener;
use tower::ServiceBuilder;
use tower_http::{
    catch_panic::CatchPanicLayer,
    compression::{CompressionLayer, CompressionLevel},
    cors::CorsLayer,
    limit::RequestBodyLimitLayer,
    normalize_path::NormalizePathLayer,
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
        controllers::{
            activity,
            auth,
            blog,
            comment,
            discussion,
            game,
            health,
            like,
            notification,
            post,
            search,
            subscribe,
            user,
            vote,
        },
        handlers::{panic, shutdown},
        utils::{acme::build_acceptor, err_handler::response_404_err},
    },
    services::{IInternalServices, Services},
};

pub struct ApiServer<TInternalServices: IInternalServices> {
    config: Config,
    services: Services<TInternalServices>,
}

impl<TInternalServices> ApiServer<TInternalServices>
where
    TInternalServices: IInternalServices + 'static + Send,
{
    pub fn new(config: Config, services: Services<TInternalServices>) -> Self {
        Self { config, services }
    }

    pub fn build_app(self: &Arc<Self>) -> Router {
        let cors_middleware = ServiceBuilder::new().layer(
            CorsLayer::new()
                .allow_credentials(true)
                .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
                .allow_origin([self.config.site_url.parse().expect("invalid site url")])
                .allow_headers([
                    "x-request-id".parse().expect("invalid header"),
                    "content-type".parse().expect("invalid header"),
                ])
                .max_age(Duration::from_secs(self.config.server.cors_max_age)),
        );

        let api_middleware = ServiceBuilder::new()
            .layer(NormalizePathLayer::trim_trailing_slash())
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

        Router::new()
            .nest_service("/roms", ServeDir::new(&self.config.rom_dir))
            .route("/health", get(health::is_healthy))
            .route("/ws", get(ws::handler))
            .nest(
                "/api/v1",
                Router::new()
                    .route(
                        "/version",
                        get(|| async {
                            compile_time_run::run_command_str!("git", "rev-parse", "HEAD")
                        }),
                    )
                    .route("/me", get(auth::me))
                    .route("/logout", delete(auth::log_out))
                    .route("/authentication", get(auth::authentication))
                    .route("/users/:id", get(user::get_by_id))
                    .route("/users/name/:name", get(user::get_id_by_name))
                    .route("/users/:id/subscribes", post(subscribe::subscribe_user))
                    .route("/users/:id/subscribes", delete(subscribe::unsubscribe_user))
                    .route("/users/:id/activities", get(activity::filter))
                    .route("/posts", get(post::filter))
                    .route("/posts", post(post::add))
                    .route("/posts/:id", get(post::get_by_id))
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
                    .route("/likes", post(like::like))
                    .route("/likes", delete(like::unlike))
                    .route("/games", get(game::filter))
                    .route("/games", post(game::add))
                    .route("/games/:id", get(game::get_by_id))
                    .route("/games/:id", delete(game::delete))
                    .route("/games/:id", put(game::edit))
                    .route("/games/tags", get(game::get_tags))
                    .route("/games/:gid/votes", post(vote::vote))
                    .route("/games/:gid/votes", delete(vote::un_vote))
                    .route("/games/:gid/discussions", get(discussion::filter))
                    .route("/games/:gid/discussions", post(discussion::add))
                    .route("/games/:gid/discussions/counts", get(discussion::count))
                    .route("/games/:gid/discussions/:id", get(discussion::get_by_id))
                    .route("/games/:gid/discussions/:id", put(discussion::edit))
                    .route("/games/:gid/discussions/:id", delete(discussion::delete))
                    .route("/search", get(search::search))
                    .route("/tags/:tag", get(search::tag_search))
                    .route("/notifications", get(notification::filter))
                    .route("/notifications/check", get(notification::is_check))
                    .route("/notifications/check", put(notification::check))
                    .route("/notifications/read/:id", put(notification::read))
                    .layer(api_middleware),
            )
            .layer(cors_middleware)
            .layer(DefaultBodyLimit::max(5 * 1024)) // 5KB
            .layer(RequestBodyLimitLayer::new(5 * 1024)) // 5KB
            .fallback(response_404_err)
            .with_state(Arc::clone(self))
    }

    pub async fn start(self) -> Result<()> {
        let state = Arc::new(self);
        let app = state
            .build_app()
            .into_make_service_with_connect_info::<SocketAddr>();

        let handler = axum_server::Handle::new();
        let shutdown_handler = shutdown::handle(state.clone(), handler.clone());

        if let Some(acme) = &state.config.acme {
            axum_server::bind(SocketAddr::from((
                Ipv4Addr::UNSPECIFIED,
                state.config.server.http_port,
            )))
            .acceptor(build_acceptor(acme)?)
            .handle(handler)
            .serve(app)
            .await?;
        } else {
            axum::serve(
                TcpListener::bind(format!("0.0.0.0:{}", state.config.server.http_port)).await?,
                app,
            )
            .with_graceful_shutdown(shutdown_handler)
            .await?;
        }

        info!("Server shutdown successfully");

        Ok(())
    }
}
