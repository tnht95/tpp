pub mod auth;
pub mod book;
pub mod health;

use std::sync::Arc;

use axum::extract::State;
use tokio::sync::RwLock;

use super::Server;

type InternalState<THealthService, TBookService> =
    State<Arc<RwLock<Server<THealthService, TBookService>>>>;
