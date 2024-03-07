use serial_test::serial;
use axum::{body::Body, extract::Request, http::StatusCode};
use tower::{Service, ServiceExt};

use crate::common::setup_app;

mod common;

#[tokio::test]
#[serial]
async fn successfully() {
    let mut app = setup_app(true).await;

    let request = Request::builder()
        .uri("/api/v1/games/tags")
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
