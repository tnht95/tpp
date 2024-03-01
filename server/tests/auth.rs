use axum::{body::Body, extract::Request, http::StatusCode};
use http_body_util::BodyExt;
use serde_json::{json, Value};
use tower::{util::ServiceExt, Service};

use crate::common::setup_app;

mod common;

#[tokio::test]
async fn unauthentication() {
    let mut app = setup_app().await;
    let request = Request::builder()
        .uri("/api/v1/me")
        .body(Body::empty())
        .unwrap();
    let response = ServiceExt::<Request<Body>>::ready(&mut app)
        .await
        .unwrap()
        .call(request)
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::UNAUTHORIZED);
    let body = response.into_body().collect().await.unwrap().to_bytes();
    let body: Value = serde_json::from_slice(&body).unwrap();
    assert_eq!(
        body,
        json!({
            "code": "ERR_001",
            "msg": "Unauthorized",
        })
    );
}
