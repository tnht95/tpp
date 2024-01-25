use axum::{
    async_trait,
    body::HttpBody,
    extract::FromRequest,
    http::{Request, StatusCode},
    BoxError,
    Json,
};
use serde::de::DeserializeOwned;
use validator::Validate;

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
                body.validate().map_err(|e| {
                    (
                        StatusCode::BAD_REQUEST,
                        Json(HttpResponseErr {
                            code: "ERR_002".into(),
                            msg: format!("Input validation error: [{e}]").replace('\n', ", "),
                        }),
                    )
                })?;
                Ok(Self(body))
            }
            Err(rejection) => Err((
                rejection.status(),
                Json(HttpResponseErr {
                    code: "ERR_001".into(),
                    msg: rejection.body_text(),
                }),
            )),
        }
    }
}
