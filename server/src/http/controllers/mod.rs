pub mod auth;
pub mod book;
pub mod game;
pub mod health;
pub mod post;

use std::sync::Arc;

use anyhow::Result;
use axum::{extract::State, http::HeaderMap};

use super::{utils::cookie::extract_access_token, Server};
use crate::utils::jwt::{self, JwtClaim};

type InternalState<TInternalServices> = State<Arc<Server<TInternalServices>>>;

fn extract_jwt_claim(headers: HeaderMap, secret: &str) -> Result<JwtClaim> {
    jwt::decode(extract_access_token(&headers)?, secret)
}
