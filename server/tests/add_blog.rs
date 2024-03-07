use axum::{body::Body, extract::Request, http::StatusCode};
use http_body_util::BodyExt;
use hyper::Method;
use serde_json::{json, Value};
use tower::{Service, ServiceExt};
use serial_test::file_serial;

use crate::common::{gen_jwt, gen_ws_ticket, get_admin, mock_user, setup_app};

mod common;

#[tokio::test]
#[file_serial]
async fn with_empty_request() {
    let mut app = setup_app(true).await;
    let user = get_admin().await;
    let ws_ticket = gen_ws_ticket(&user, false).await;
    let access_token = gen_jwt(user).await;

    let request = Request::builder()
        .uri("/api/v1/blogs")
        .method(Method::POST)
        .header("Content-Type", "application/json")
        .header(
            "cookie",
            format!("access_token={access_token};ws_ticket={ws_ticket}"),
        )
        .body(Body::from(
            json!({
            "title": "".to_string(),
            "content": "".to_string(),
            "description": "".to_string()
            })
            .to_string(),
        ))
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
    let msg = body.get("msg").unwrap().to_string();
    assert!(msg.contains("title: Title can not be empty"));
    assert!(msg.contains("content: Content can not be empty"));
    assert!(msg.contains("description: Description can not be empty"));
}

#[tokio::test]
#[file_serial]
async fn when_not_admin() {
    let mut app = setup_app(true).await;
    let user = mock_user(1, "me", true).await;
    let ws_ticket = gen_ws_ticket(&user, false).await;
    let access_token = gen_jwt(user).await;

    let request = Request::builder()
        .uri("/api/v1/blogs")
        .method(Method::POST)
        .header("Content-Type", "application/json")
        .header(
            "cookie",
            format!("access_token={access_token};ws_ticket={ws_ticket}"),
        )
        .body(Body::from(
            json!({
            "title": "a".to_string(),
            "content": "a".to_string(),
            "description": "a".to_string()
            })
            .to_string(),
        ))
        .unwrap();
    let response = ServiceExt::<Request<Body>>::ready(&mut app)
        .await
        .unwrap()
        .call(request)
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::FORBIDDEN);
}

#[tokio::test]
#[file_serial]
async fn when_not_login() {
    let mut app = setup_app(true).await;
    let request = Request::builder()
        .uri("/api/v1/blogs")
        .method(Method::POST)
        .header("Content-Type", "application/json")
        .body(Body::from(
            json!({
            "title": "a".to_string(),
            "content": "a".to_string(),
            "description": "a".to_string()
            })
            .to_string(),
        ))
        .unwrap();
    let response = ServiceExt::<Request<Body>>::ready(&mut app)
        .await
        .unwrap()
        .call(request)
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::UNAUTHORIZED);
}

#[tokio::test]
#[file_serial]
async fn successfully() {
    let mut app = setup_app(true).await;
    let user = get_admin().await;
    let ws_ticket = gen_ws_ticket(&user, false).await;
    let access_token = gen_jwt(user).await;

    let request = Request::builder()
        .uri("/api/v1/blogs")
        .method(Method::POST)
        .header("Content-Type", "application/json")
        .header(
            "cookie",
            format!("access_token={access_token};ws_ticket={ws_ticket}"),
        )
        .body(Body::from(
            json!({
            "title": "a".to_string(),
            "content": "b".to_string(),
            "description": "c".to_string()
            })
            .to_string(),
        ))
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
    assert!(data.is_null());
}
