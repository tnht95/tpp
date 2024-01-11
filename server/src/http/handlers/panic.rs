use std::any::Any;

use axum::response::Response;

use crate::http::utils::response_unhandled_str;

pub fn recover(e: Box<dyn Any + Send + 'static>) -> Response {
    let e = if let Some(e) = e.downcast_ref::<String>() {
        e.to_string()
    } else if let Some(e) = e.downcast_ref::<&str>() {
        e.to_string()
    } else {
        "Unknown panic message".to_string()
    };
    response_unhandled_str(&e)
}
