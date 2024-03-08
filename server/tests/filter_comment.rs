use std::str::FromStr;

use axum::{body::Body, extract::Request, http::StatusCode};
use http_body_util::BodyExt;
use serde_json::Value;
use serial_test::serial;
use server::database::entities::comment::CommentType::Posts;
use tower::{Service, ServiceExt};
use uuid::Uuid;

use crate::common::{mock_comment, setup_app};

mod common;
#[tokio::test]
#[serial]
async fn with_big_pagination() {
    let mut app = setup_app(true).await;
    mock_comment(
        Uuid::from_str("b2337049-fa84-4d42-95da-3720a90e994d").unwrap(),
        Posts,
    )
    .await;
    let request = Request::builder()
        .uri("/api/v1/comments?targetId=b2337049-fa84-4d42-95da-3720a90e994d&offset=-1&limit=100")
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
    let comments = data.as_array().unwrap();
    assert_eq!(
        comments.first().unwrap().get("content").unwrap().as_str(),
        Some("abc")
    );
    assert_eq!(comments.len(), 1);
}

#[tokio::test]
#[serial]
async fn with_nonexistent_id() {
    let mut app = setup_app(true).await;

    let request = Request::builder()
        .uri("/api/v1/comments?targetId=b2337049-fa84-4d42-95da-3720a90e994d&offset=-1&limit=100")
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
    let comments = data.as_array().unwrap();
    assert_eq!(comments.len(), 0);
}

#[tokio::test]
#[serial]
async fn with_invalid_id() {
    let mut app = setup_app(true).await;

    let request = Request::builder()
        .uri("/api/v1/comments?targetId=b23d&offset=-1&limit=100")
        .body(Body::empty())
        .unwrap();
    let response = ServiceExt::<Request<Body>>::ready(&mut app)
        .await
        .unwrap()
        .call(request)
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::BAD_REQUEST);
}
