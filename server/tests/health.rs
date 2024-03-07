use axum::{body::Body, extract::Request, http::StatusCode};
use serial_test::serial;
use tower::{util::ServiceExt, Service};

use crate::common::setup_app;

mod common;

#[tokio::test]
#[serial]
async fn is_healthy() {
    let mut app = setup_app(false).await;
    let request = Request::builder()
        .uri("/health")
        .body(Body::empty())
        .unwrap();
    let response = ServiceExt::<Request<Body>>::ready(&mut app)
        .await
        .unwrap()
        .call(request)
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::OK);
}
