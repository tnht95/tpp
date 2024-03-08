use std::str::FromStr;

use axum::{body::Body, extract::Request, http::StatusCode};
use http_body_util::BodyExt;
use hyper::Method;
use serde_json::{json, Value};
use serial_test::serial;
use tower::{Service, ServiceExt};
use uuid::Uuid;

use crate::common::{
    gen_jwt,
    gen_ws_ticket,
    mock_blog,
    mock_discussion,
    mock_game,
    mock_post,
    mock_user,
    setup_app,
};

mod common;
#[tokio::test]
#[serial]
async fn when_not_login() {
    let mut app = setup_app(true).await;

    let request = Request::builder()
        .uri("/api/v1/comments")
        .method(Method::POST)
        .header("Content-Type", "application/json")
        .body(Body::from(
            json!({
            "targetId": "",
            "targetType": "posts",
            "content": "".to_string()
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
#[serial]
async fn post_successfully() {
    let mut app = setup_app(true).await;
    let post = mock_post().await;
    let user = mock_user(1, "me", true).await;
    let ws_ticket = gen_ws_ticket(&user, false).await;
    let access_token = gen_jwt(user).await;

    let request = Request::builder()
        .uri("/api/v1/comments")
        .method(Method::POST)
        .header("Content-Type", "application/json")
        .header(
            "cookie",
            format!("access_token={access_token};ws_ticket={ws_ticket}"),
        )
        .body(Body::from(
            json!({
            "targetId": post.id.to_string(),
            "targetType": "posts",
            "content": "a".to_string()
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

    let c_request = Request::builder()
        .uri(format!("/api/v1/posts/{}", post.id))
        .body(Body::empty())
        .unwrap();
    let c_response = ServiceExt::<Request<Body>>::ready(&mut app)
        .await
        .unwrap()
        .call(c_request)
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::OK);
    assert_eq!(c_response.status(), StatusCode::OK);
    let body = response.into_body().collect().await.unwrap().to_bytes();
    let body: Value = serde_json::from_slice(&body).unwrap();
    let comment = body.get("data").unwrap();
    let comment_id = Uuid::from_str(comment.get("id").unwrap().as_str().unwrap()).unwrap();

    let c_body = c_response.into_body().collect().await.unwrap().to_bytes();
    let c_body: Value = serde_json::from_slice(&c_body).unwrap();
    let data = c_body.get("data").unwrap();
    assert_eq!(data.get("comments").unwrap().as_i64(), Some(1));

    //test delete comment
    let request = Request::builder()
        .uri(format!("/api/v1/comments/{}", comment_id))
        .method(Method::DELETE)
        .header("Content-Type", "application/json")
        .header(
            "cookie",
            format!("access_token={access_token};ws_ticket={ws_ticket}"),
        )
        .body(Body::from(
            json!({
            "targetId": post.id.to_string(),
            "targetType": "posts"
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

    let c_request = Request::builder()
        .uri(format!("/api/v1/posts/{}", post.id))
        .body(Body::empty())
        .unwrap();
    let c_response = ServiceExt::<Request<Body>>::ready(&mut app)
        .await
        .unwrap()
        .call(c_request)
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::OK);
    assert_eq!(c_response.status(), StatusCode::OK);
    let c_body = c_response.into_body().collect().await.unwrap().to_bytes();
    let c_body: Value = serde_json::from_slice(&c_body).unwrap();
    let data = c_body.get("data").unwrap();
    assert_eq!(data.get("comments").unwrap().as_i64(), Some(0));
}

#[tokio::test]
#[serial]
async fn blog_successfully() {
    let mut app = setup_app(true).await;
    let user = mock_user(1, "me", true).await;
    let ws_ticket = gen_ws_ticket(&user, false).await;
    let access_token = gen_jwt(user).await;
    let blog = mock_blog().await;

    let request = Request::builder()
        .uri("/api/v1/comments")
        .method(Method::POST)
        .header("Content-Type", "application/json")
        .header(
            "cookie",
            format!("access_token={access_token};ws_ticket={ws_ticket}"),
        )
        .body(Body::from(
            json!({
            "targetId": blog.id.to_string(),
            "targetType": "blogs",
            "content": "blogs".to_string()
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

    let c_request = Request::builder()
        .uri(format!("/api/v1/blogs/{}", blog.id))
        .body(Body::empty())
        .unwrap();
    let c_response = ServiceExt::<Request<Body>>::ready(&mut app)
        .await
        .unwrap()
        .call(c_request)
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::OK);
    assert_eq!(c_response.status(), StatusCode::OK);
    let body = response.into_body().collect().await.unwrap().to_bytes();
    let body: Value = serde_json::from_slice(&body).unwrap();
    let comment = body.get("data").unwrap();
    let comment_id = Uuid::from_str(comment.get("id").unwrap().as_str().unwrap()).unwrap();

    let c_body = c_response.into_body().collect().await.unwrap().to_bytes();
    let c_body: Value = serde_json::from_slice(&c_body).unwrap();
    let data = c_body.get("data").unwrap();
    assert_eq!(data.get("comments").unwrap().as_i64(), Some(1));

    // test delete comment
    let request = Request::builder()
        .uri(format!("/api/v1/comments/{}", comment_id))
        .method(Method::DELETE)
        .header("Content-Type", "application/json")
        .header(
            "cookie",
            format!("access_token={access_token};ws_ticket={ws_ticket}"),
        )
        .body(Body::from(
            json!({
            "targetId": blog.id.to_string(),
            "targetType": "blogs"
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

    let c_request = Request::builder()
        .uri(format!("/api/v1/blogs/{}", blog.id))
        .body(Body::empty())
        .unwrap();
    let c_response = ServiceExt::<Request<Body>>::ready(&mut app)
        .await
        .unwrap()
        .call(c_request)
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::OK);
    assert_eq!(c_response.status(), StatusCode::OK);
    let c_body = c_response.into_body().collect().await.unwrap().to_bytes();
    let c_body: Value = serde_json::from_slice(&c_body).unwrap();
    let data = c_body.get("data").unwrap();
    assert_eq!(data.get("comments").unwrap().as_i64(), Some(0));
}

#[tokio::test]
#[serial]
async fn discussion_successfully() {
    let mut app = setup_app(true).await;
    let user = mock_user(1, "me", true).await;
    let ws_ticket = gen_ws_ticket(&user, false).await;
    let access_token = gen_jwt(user).await;
    let game = mock_game().await;
    let discussion = mock_discussion(game.id).await;

    let request = Request::builder()
        .uri("/api/v1/comments")
        .method(Method::POST)
        .header("Content-Type", "application/json")
        .header(
            "cookie",
            format!("access_token={access_token};ws_ticket={ws_ticket}"),
        )
        .body(Body::from(
            json!({
            "targetId": discussion.id.to_string(),
            "targetType": "discussions",
            "content": "discussion".to_string()
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

    let c_request = Request::builder()
        .uri(format!(
            "/api/v1/games/{}/discussions/{}",
            game.id, discussion.id
        ))
        .body(Body::empty())
        .unwrap();
    let c_response = ServiceExt::<Request<Body>>::ready(&mut app)
        .await
        .unwrap()
        .call(c_request)
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::OK);
    assert_eq!(c_response.status(), StatusCode::OK);
    let body = response.into_body().collect().await.unwrap().to_bytes();
    let body: Value = serde_json::from_slice(&body).unwrap();
    let comment = body.get("data").unwrap();
    let comment_id = Uuid::from_str(comment.get("id").unwrap().as_str().unwrap()).unwrap();

    let c_body = c_response.into_body().collect().await.unwrap().to_bytes();
    let c_body: Value = serde_json::from_slice(&c_body).unwrap();
    let data = c_body.get("data").unwrap();
    assert_eq!(data.get("comments").unwrap().as_i64(), Some(1));

    // test delete comment
    let request = Request::builder()
        .uri(format!("/api/v1/comments/{}", comment_id))
        .method(Method::DELETE)
        .header("Content-Type", "application/json")
        .header(
            "cookie",
            format!("access_token={access_token};ws_ticket={ws_ticket}"),
        )
        .body(Body::from(
            json!({
            "targetId": discussion.id.to_string(),
            "targetType": "discussions"
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

    let c_request = Request::builder()
        .uri(format!(
            "/api/v1/games/{}/discussions/{}",
            game.id, discussion.id
        ))
        .body(Body::empty())
        .unwrap();
    let c_response = ServiceExt::<Request<Body>>::ready(&mut app)
        .await
        .unwrap()
        .call(c_request)
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);
    assert_eq!(c_response.status(), StatusCode::OK);
    let body = c_response.into_body().collect().await.unwrap().to_bytes();
    let body: Value = serde_json::from_slice(&body).unwrap();
    let data = body.get("data").unwrap();
    assert_eq!(data.get("comments").unwrap().as_i64(), Some(0));
}
