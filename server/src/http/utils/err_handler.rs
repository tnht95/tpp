use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use tracing::error;
use validator::ValidationErrors;

use crate::model::responses::{HttpResponseErr, INTERNAL_SERVER_ERR};

pub fn response_unhandled_err(e: anyhow::Error) -> Response {
    error!("Unhandled error: {e:?}");
    (StatusCode::INTERNAL_SERVER_ERROR, Json(INTERNAL_SERVER_ERR)).into_response()
}

pub fn response_unhandled_str(e: &str) -> Response {
    error!("Unhandled error: {e:?}");
    (StatusCode::INTERNAL_SERVER_ERROR, Json(INTERNAL_SERVER_ERR)).into_response()
}

pub fn response_validation_err(e: ValidationErrors) -> Response {
    (
        StatusCode::BAD_REQUEST,
        Json(HttpResponseErr {
            code: "ERR_001".into(),
            msg: format!("Input validation error: [{e}]").replace('\n', ", "),
        }),
    )
        .into_response()
}
