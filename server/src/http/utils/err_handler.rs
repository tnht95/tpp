use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use tracing::error;

use crate::model::responses::INTERNAL_SERVER_ERR;

pub fn response_unhandled_err(e: anyhow::Error) -> Response {
    error!("Unhandled error: {e:?}");
    (StatusCode::INTERNAL_SERVER_ERROR, Json(INTERNAL_SERVER_ERR)).into_response()
}

pub fn response_unhandled_str(e: &str) -> Response {
    error!("Unhandled error: {e:?}");
    (StatusCode::INTERNAL_SERVER_ERROR, Json(INTERNAL_SERVER_ERR)).into_response()
}
