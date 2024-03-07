use serial_test::serial;
use axum::{body::Body, extract::Request, http::StatusCode};
use http_body_util::BodyExt;
use serde_json::{json, Value};
use tower::{Service, ServiceExt};

use crate::common::setup_app;

mod common;
#[tokio::test]
#[serial]
async fn with_nonexistent_name() {
    let mut app = setup_app(true).await;
    let request = Request::builder()
        .uri("/api/v1/users/name/sss")
        .body(Body::empty())
        .unwrap();
    let response = ServiceExt::<Request<Body>>::ready(&mut app)
        .await
        .unwrap()
        .call(request)
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::BAD_REQUEST);
    let body = response.into_body().collect().await.unwrap().to_bytes();
    let body: Value = serde_json::from_slice(&body).unwrap();
    assert_eq!(
        body,
        json!({
            "code": "USER_001",
            "msg": "User Not Found",
        })
    );
}

#[tokio::test]
#[serial]
async fn with_valid_name() {
    let mut app = setup_app(true).await;
    let request = Request::builder()
        .uri("/api/v1/users/name/tnht95")
        .body(Body::empty())
        .unwrap();
    let response = ServiceExt::<Request<Body>>::ready(&mut app)
        .await
        .unwrap()
        .call(request)
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::OK);
    let body = response.into_body().collect().await.unwrap().to_bytes();
    let body: Value = serde_json::from_slice(&body).unwrap();
    let data = body.get("data").unwrap();
    assert_eq!(data.as_i64(), Some(40195902));
}
