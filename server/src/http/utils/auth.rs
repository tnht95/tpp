use std::{marker::PhantomData, sync::Arc};

use axum::{
    async_trait,
    extract::{FromRef, FromRequestParts},
    http::request::Parts,
    response::Response,
};

use super::{cookie::extract_access_token, err_handler::response_401_err};
use crate::{
    database::entities::user::User,
    http::Server,
    services::IInternalServices,
    utils::jwt::{self},
};

pub struct Authentication<TInternalServices: IInternalServices>(
    pub User,
    pub bool,
    pub PhantomData<TInternalServices>,
);

#[async_trait]
impl<S, TInternalServices> FromRequestParts<S> for Authentication<TInternalServices>
where
    S: Send + Sync,
    TInternalServices: IInternalServices,
    Arc<Server<TInternalServices>>: FromRef<S>,
{
    type Rejection = Response;
    async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        let state = Arc::from_ref(state);
        let access_token = extract_access_token(&parts.headers).map_err(|_| response_401_err())?;
        match jwt::decode(access_token, &state.config.auth.jwt.secret) {
            Ok(jwt::JwtClaim { user, is_admin, .. }) => Ok(Self(user, is_admin, PhantomData)),
            Err(_) => Err(response_401_err()),
        }
    }
}

pub struct AuthenticationMaybe<TInternalServices: IInternalServices>(
    pub Option<User>,
    pub Option<bool>,
    pub PhantomData<TInternalServices>,
);

#[async_trait]
impl<S, TInternalServices> FromRequestParts<S> for AuthenticationMaybe<TInternalServices>
where
    S: Send + Sync,
    TInternalServices: IInternalServices,
    Arc<Server<TInternalServices>>: FromRef<S>,
{
    type Rejection = ();
    async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        let state = Arc::from_ref(state);
        let access_token = match extract_access_token(&parts.headers) {
            Ok(access_token) => access_token,
            Err(_) => return Ok(Self(None, None, PhantomData)),
        };
        match jwt::decode(access_token, &state.config.auth.jwt.secret) {
            Ok(jwt::JwtClaim { user, is_admin, .. }) =>
                Ok(Self(Some(user), Some(is_admin), PhantomData)),
            Err(_) => Ok(Self(None, None, PhantomData)),
        }
    }
}

#[async_trait]
impl<S, TInternalServices> FromRequestParts<S> for Server<TInternalServices>
where
    S: Send + Sync,
    TInternalServices: IInternalServices,
    Self: FromRef<S>,
{
    type Rejection = ();
    async fn from_request_parts(_: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        Ok(Self::from_ref(state))
    }
}
