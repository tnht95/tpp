use axum::{
    async_trait,
    body::HttpBody,
    extract::{FromRequest, Query},
    http::{Request, StatusCode},
    BoxError,
    Json,
};
use serde::de::DeserializeOwned;
use validator::{Validate, ValidationErrors};

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
                    code: "ERR_002".into(),
                    msg: rejection.body_text(),
                }),
            )),
        }
    }
}

pub struct QueryValidator<T>(pub T);

#[async_trait]
impl<T, S, B> FromRequest<S, B> for QueryValidator<T>
where
    T: DeserializeOwned + Validate,
    B: Send + 'static,
    S: Send + Sync,
{
    type Rejection = (StatusCode, Json<HttpResponseErr>);

    async fn from_request(req: Request<B>, state: &S) -> Result<Self, Self::Rejection> {
        match Query::<T>::from_request(req, state).await {
            Ok(Query(query)) => {
                query.validate().map_err(response_validation_err)?;
                Ok(Self(query))
            }
            Err(rejection) => Err((
                rejection.status(),
                Json(HttpResponseErr {
                    code: "ERR_003".into(),
                    msg: rejection.body_text(),
                }),
            )),
        }
    }
}

fn response_validation_err(e: ValidationErrors) -> (StatusCode, Json<HttpResponseErr>) {
    (
        StatusCode::BAD_REQUEST,
        Json(HttpResponseErr {
            code: "ERR_004".into(),
            msg: format!("Input validation error: [{e}]").replace('\n', ", "),
        }),
    )
}
