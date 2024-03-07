use serial_test::file_serial;
use axum::{body::Body, extract::Request, http::StatusCode};
use http_body_util::BodyExt;
use serde_json::Value;
use tower::{Service, ServiceExt};

use crate::common::{mock_game, setup_app};

mod common;

#[tokio::test]
#[file_serial]
async fn with_big_pagination() {
    let mut app = setup_app(true).await;
    mock_game().await;
    let request = Request::builder()
        .uri("/api/v1/games?offset=100&limit=100")
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
    let games = data.as_array().unwrap();
    assert_eq!(games.len(), 0);
}

#[tokio::test]
#[file_serial]
async fn successfully() {
    let mut app = setup_app(true).await;
    let request = Request::builder()
        .uri("/api/v1/games?offset=6&limit=10")
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
    let games = data.as_array().unwrap();
    assert_eq!(games.len(), 1);
}
