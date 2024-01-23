pub mod auth;
pub mod book;
pub mod game;
pub mod health;

use std::sync::Arc;

use axum::extract::State;

use super::Server;

type InternalState<TInternalServices> = State<Arc<Server<TInternalServices>>>;
