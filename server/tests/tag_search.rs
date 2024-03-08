use axum::{body::Body, extract::Request, http::StatusCode};
use http_body_util::BodyExt;
use serde_json::Value;
use serial_test::serial;
use tower::{Service, ServiceExt};

use crate::common::setup_app;

mod common;
#[tokio::test]
#[serial]
async fn successfully() {
    let mut app = setup_app(true).await;
    let request = Request::builder()
        .uri("/api/v1/tags/shooting?offset=1&limit=100")
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
    assert_eq!(data.get("blogs").unwrap().as_array().unwrap().len(), 0);
    assert_eq!(data.get("games").unwrap().as_array().unwrap().len(), 2);
}

#[tokio::test]
#[serial]
async fn with_one_category_successfully() {
    let mut app = setup_app(true).await;
    let request = Request::builder()
        .uri("/api/v1/tags/shooting?offset=0&limit=20&category=blogs")
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
    assert_eq!(data.get("blogs").unwrap().as_array().unwrap().len(), 0);
    assert_eq!(data.get("games").unwrap().as_array().unwrap().len(), 0);
}

#[tokio::test]
#[serial]
async fn with_wildcard_input() {
    let mut app = setup_app(true).await;
    let request = Request::builder()
        .uri("/api/v1/tags/%?offset=0&limit=20")
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
    assert_eq!(data.get("blogs").unwrap().as_array().unwrap().len(), 0);
    assert_eq!(data.get("games").unwrap().as_array().unwrap().len(), 0);
}
