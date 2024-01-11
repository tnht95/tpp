use std::sync::Arc;

use axum::extract::State;
use tokio::sync::RwLock;

use super::Server;

pub mod book;
pub mod health;

type InternalState<THealthService, TBookService> =
    State<Arc<RwLock<Server<THealthService, TBookService>>>>;
