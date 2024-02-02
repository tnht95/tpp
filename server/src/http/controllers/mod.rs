pub mod auth;
pub mod blog;
pub mod book;
pub mod comment;
pub mod discussion;
pub mod game;
pub mod health;
pub mod post;
pub mod user;

use std::sync::Arc;

use axum::extract::State;

use super::Server;

type InternalState<TInternalServices> = State<Arc<Server<TInternalServices>>>;
