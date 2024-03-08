use axum::{
    body::Body,
    extract::Request,
    http::{Method, StatusCode},
};
use http_body_util::BodyExt;
use serde_json::{json, Value};
use serial_test::serial;
use tower::{Service, ServiceExt};

use crate::common::{gen_jwt, gen_ws_ticket, get_admin, mock_post, setup_app};

mod common;

#[tokio::test]
#[serial]
async fn with_big_pagination() {
    let mut app = setup_app(true).await;
    let request = Request::builder()
        .uri("/api/v1/search?offset=-1&limit=100&keyword=a")
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
    assert_eq!(data.get("users").unwrap().as_array().unwrap().len(), 0);
    assert_eq!(data.get("posts").unwrap().as_array().unwrap().len(), 0);
}

#[tokio::test]
#[serial]
async fn with_one_category() {
    let mut app = setup_app(true).await;
    let request = Request::builder()
        .uri("/api/v1/search?offset=-1&limit=100&keyword=95&category=users")
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
    assert_eq!(data.get("posts").unwrap().as_array().unwrap().len(), 0);
    assert_eq!(data.get("games").unwrap().as_array().unwrap().len(), 0);
    let users = data.get("users").unwrap().as_array().unwrap();
    assert_eq!(users.len(), 1);
    assert_eq!(
        users.first().unwrap().get("name").unwrap().as_str(),
        Some("tnht95")
    );
}

#[tokio::test]
#[serial]
async fn post_when_not_login() {
    let mut app = setup_app(true).await;
    mock_post().await;
    let request = Request::builder()
        .uri("/api/v1/search?offset=-1&limit=100&keyword=a&category=posts")
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
    assert_eq!(data.get("users").unwrap().as_array().unwrap().len(), 0);
    assert_eq!(data.get("games").unwrap().as_array().unwrap().len(), 0);
    let posts = data.get("posts").unwrap().as_array().unwrap();
    let first_post = posts.first().unwrap();
    assert_eq!(posts.len(), 1);
    assert_eq!(first_post.get("content").unwrap().as_str(), Some("abc"));
    assert!(first_post.get("is_liked").is_none());
}

#[tokio::test]
#[serial]
async fn post_successfully() {
    let mut app = setup_app(true).await;
    let post = mock_post().await;
    let user = get_admin();
    let ws_ticket = gen_ws_ticket(&user, false).await;
    let access_token = gen_jwt(user).await;

    let like_request = Request::builder()
        .uri("/api/v1/likes")
        .method(Method::POST)
        .header(
            "cookie",
            format!("access_token={access_token};ws_ticket={ws_ticket}"),
        )
        .header("Content-Type", "application/json")
        .body(Body::from(
            json!({
                "targetId": post.id.to_string(),
                "targetType": "posts"
            })
            .to_string(),
        ))
        .unwrap();

    ServiceExt::<Request<Body>>::ready(&mut app)
        .await
        .unwrap()
        .call(like_request)
        .await
        .unwrap();

    let request = Request::builder()
        .uri("/api/v1/search?offset=-1&limit=100&keyword=a&category=posts")
        .header(
            "cookie",
            format!("access_token={access_token};ws_ticket={ws_ticket}"),
        )
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
    assert_eq!(data.get("users").unwrap().as_array().unwrap().len(), 0);
    assert_eq!(data.get("games").unwrap().as_array().unwrap().len(), 0);
    let posts = data.get("posts").unwrap().as_array().unwrap();
    let first_post = posts.first().unwrap();
    assert_eq!(posts.len(), 1);
    assert_eq!(first_post.get("content").unwrap().as_str(), Some("abc"));
    assert_eq!(first_post.get("isLiked").unwrap().as_bool(), Some(true));
    assert_eq!(first_post.get("likes").unwrap().as_i64(), Some(1));
}

#[tokio::test]
#[serial]
async fn with_wildcard_input() {
    let mut app = setup_app(true).await;
    let request = Request::builder()
        .uri("/api/v1/search?offset=-1&limit=100&keyword=_")
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
    assert_eq!(data.get("posts").unwrap().as_array().unwrap().len(), 0);
    assert_eq!(data.get("users").unwrap().as_array().unwrap().len(), 0);
}
