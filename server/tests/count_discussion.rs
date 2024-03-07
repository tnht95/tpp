use serial_test::serial;
use axum::{body::Body, extract::Request, http::StatusCode};
use http_body_util::BodyExt;
use serde_json::Value;
use tower::{Service, ServiceExt};

use crate::common::{mock_discussion, mock_game, setup_app};

mod common;

#[tokio::test]
#[serial]
async fn with_invalid_id() {
    let mut app = setup_app(true).await;

    let request = Request::builder()
        .uri("/api/v1/games/bb41b2d6-6519-4033-b20d-d1214dd1ff19/discussions/counts")
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
    assert_eq!(data.as_i64(), Some(0));
}

#[tokio::test]
#[serial]
async fn successfully() {
    let mut app = setup_app(true).await;
    let game = mock_game().await;
    mock_discussion(game.id).await;

    let request = Request::builder()
        .uri(format!("/api/v1/games/{}/discussions/counts", game.id))
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
    assert_eq!(data.as_i64(), Some(1));
}
