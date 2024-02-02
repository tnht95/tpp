use axum::{
    async_trait,
    body::HttpBody,
    extract::{FromRequest, FromRequestParts, Query},
    http::{request::Parts, Request, StatusCode},
    BoxError,
    Json,
};
use serde::de::DeserializeOwned;
use validator::Validate;

use super::err_handler::response_validation_err;
use crate::model::responses::HttpResponseErr;

pub struct JsonValidator<T>(pub T);
#[async_trait]
impl<T, S, B> FromRequest<S, B> for JsonValidator<T>
where
    T: DeserializeOwned + Validate,
    B: HttpBody + Send + 'static,
    B::Data: Send,
    B::Error: Into<BoxError>,
    S: Send + Sync,
{
    type Rejection = (StatusCode, Json<HttpResponseErr>);
    async fn from_request(req: Request<B>, state: &S) -> Result<Self, Self::Rejection> {
        match Json::<T>::from_request(req, state).await {
            Ok(Json(body)) => {
                body.validate().map_err(response_validation_err)?;
                Ok(Self(body))
            }
            Err(rejection) => Err((
                rejection.status(),
                Json(HttpResponseErr {
                    code: "ERR_998".into(),
                    msg: rejection.body_text(),
                }),
            )),
        }
    }
}

pub struct QueryValidator<T>(pub T);
#[async_trait]
impl<T, S> FromRequestParts<S> for QueryValidator<T>
where
    T: DeserializeOwned + Validate,
    S: Send + Sync,
{
    type Rejection = (StatusCode, Json<HttpResponseErr>);
    async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        match Query::<T>::from_request_parts(parts, state).await {
            Ok(Query(query)) => {
                query.validate().map_err(response_validation_err)?;
                Ok(Self(query))
            }
            Err(rejection) => Err((
                rejection.status(),
                Json(HttpResponseErr {
                    code: "ERR_997".into(),
                    msg: rejection.body_text(),
                }),
            )),
        }
    }
}
