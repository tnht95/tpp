use axum::{body::Body, extract::Request, http::StatusCode};
use http_body_util::BodyExt;
use serde_json::{json, Value};
use tower::{Service, ServiceExt};

use crate::common::{mock_post, setup_app};

mod common;

#[tokio::test]
async fn with_invalid_id() {
    let mut app = setup_app(true).await;

    let request = Request::builder()
        .uri("/api/v1/posts/f")
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
            "code": "ERR_100",
            "msg": "Invalid Uuid"
        })
    )
}

#[tokio::test]
async fn with_nonexistent_id() {
    let mut app = setup_app(true).await;

    let request = Request::builder()
        .uri("/api/v1/posts/b2337049-fa84-4d42-95da-3720a90e994d")
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
            "code": "POST_003",
            "msg": "Post Not Found",
        })
    );
}

#[tokio::test]
async fn successfully() {
    let mut app = setup_app(true).await;
    let post = mock_post().await;

    let request = Request::builder()
        .uri(format!("/api/v1/posts/{}", post.id))
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
    assert_eq!(data.get("content").unwrap().as_str(), Some("abc"));
}
