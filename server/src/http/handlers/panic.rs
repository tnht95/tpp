use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use tracing::error;

use crate::model::responses::INTERNAL_SERVER_ERR;

pub fn recover(e: Box<dyn std::any::Any + Send + 'static>) -> Response {
    let e = if let Some(e) = e.downcast_ref::<String>() {
        e.to_string()
    } else if let Some(e) = e.downcast_ref::<&str>() {
        e.to_string()
    } else {
        "Unknown panic message".to_string()
    };
    error!("Unhandled error: {e:?}");
    (StatusCode::INTERNAL_SERVER_ERROR, Json(INTERNAL_SERVER_ERR)).into_response()
}
