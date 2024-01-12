pub mod auth;
pub mod book;
pub mod health;

use std::sync::Arc;

use axum::extract::State;

use super::Server;

type InternalState<THealthService, TBookService> = State<Arc<Server<THealthService, TBookService>>>;
