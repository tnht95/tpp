pub mod activity;
pub mod auth;
pub mod blog;
pub mod comment;
pub mod discussion;
pub mod game;
pub mod health;
pub mod like;
pub mod notification;
pub mod post;
pub mod search;
pub mod subscribe;
pub mod user;
pub mod vote;

use std::sync::Arc;

use axum::extract::State;

use super::ApiServer;

type InternalState<TInternalServices> = State<Arc<ApiServer<TInternalServices>>>;
