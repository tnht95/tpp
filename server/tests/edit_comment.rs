use std::str::FromStr;

use axum::{
    body::Body,
    extract::Request,
    http::{Method, StatusCode},
};
use http_body_util::BodyExt;
use serde_json::{json, Value};
use serial_test::serial;
use server::database::entities::comment::CommentType::{Blogs, Discussions, Posts};
use tower::{Service, ServiceExt};
use uuid::Uuid;

use crate::common::{gen_jwt, gen_ws_ticket, get_admin, mock_comment, mock_user, setup_app};

mod common;
#[tokio::test]
#[serial]
async fn when_not_owner() {
    let mut app = setup_app(true).await;
    let user = mock_user(1, "me", true).await;
    let ws_ticket = gen_ws_ticket(&user, false).await;
    let access_token = gen_jwt(user).await;
    let comment = mock_comment(
        Uuid::from_str("b2337049-fa84-4d42-95da-3720a90e994d").unwrap(),
        Posts,
    )
    .await;

    let request = Request::builder()
        .uri(format!("/api/v1/comments/{}", comment.id))
        .method(Method::PUT)
        .header("Content-Type", "application/json")
        .header(
            "cookie",
            format!("access_token={access_token};ws_ticket={ws_ticket}"),
        )
        .body(Body::from(
            json!({
            "targetId": comment.target_id.to_string(),
            "targetType": "posts",
            "content": "h".to_string()
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
    assert_eq!(
        body,
        json!({
           "code": "CMT_002", "msg": "Not Authorized To Edit",
        })
    )
}

#[tokio::test]
#[serial]
async fn with_nonexistent_id() {
    let mut app = setup_app(true).await;
    let user = mock_user(1, "me", true).await;
    let ws_ticket = gen_ws_ticket(&user, false).await;
    let access_token = gen_jwt(user).await;

    let request = Request::builder()
        .uri("/api/v1/comments/b2337049-fa84-4d42-95da-3720a90e994d")
        .method(Method::PUT)
        .header("Content-Type", "application/json")
        .header(
            "cookie",
            format!("access_token={access_token};ws_ticket={ws_ticket}"),
        )
        .body(Body::from(
            json!({
            "targetId": "b2337049-fa84-4d42-95da-3720a90e994d",
            "targetType": "posts",
            "content": "h".to_string()
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
    assert_eq!(
        body,
        json!({
           "code": "CMT_002", "msg": "Not Authorized To Edit",
        })
    )
}

#[tokio::test]
#[serial]
async fn with_invalid_id() {
    let mut app = setup_app(true).await;
    let user = mock_user(1, "me", true).await;
    let ws_ticket = gen_ws_ticket(&user, false).await;
    let access_token = gen_jwt(user).await;

    let request = Request::builder()
        .uri("/api/v1/comments/b2")
        .method(Method::PUT)
        .header("Content-Type", "application/json")
        .header(
            "cookie",
            format!("access_token={access_token};ws_ticket={ws_ticket}"),
        )
        .body(Body::from(
            json!({
            "targetId": "b2337049-fa84-4d42-95da-3720a90e994d",
            "targetType": "posts",
            "content": "h".to_string()
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
    assert_eq!(
        body,
        json!({
            "code": "ERR_100",
            "msg": "Invalid Uuid"
        })
    )
}

#[tokio::test]
#[serial]
async fn post_successfully() {
    let mut app = setup_app(true).await;
    let user = get_admin();
    let ws_ticket = gen_ws_ticket(&user, false).await;
    let access_token = gen_jwt(user).await;
    let comment = mock_comment(
        Uuid::from_str("b2337049-fa84-4d42-95da-3720a90e994d").unwrap(),
        Posts,
    )
    .await;

    let request = Request::builder()
        .uri(format!("/api/v1/comments/{}", comment.id))
        .method(Method::PUT)
        .header("Content-Type", "application/json")
        .header(
            "cookie",
            format!("access_token={access_token};ws_ticket={ws_ticket}"),
        )
        .body(Body::from(
            json!({
            "targetId": "b2337049-fa84-4d42-95da-3720a90e994d",
            "targetType": "posts",
            "content": "new".to_string()
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
    assert_eq!(data.get("content").unwrap().as_str(), Some("new"));
}

#[tokio::test]
#[serial]
async fn blog_successfully() {
    let mut app = setup_app(true).await;
    let user = get_admin();
    let ws_ticket = gen_ws_ticket(&user, false).await;
    let access_token = gen_jwt(user).await;
    let comment = mock_comment(
        Uuid::from_str("b2337049-fa84-4d42-95da-3720a90e994d").unwrap(),
        Blogs,
    )
    .await;

    let request = Request::builder()
        .uri(format!("/api/v1/comments/{}", comment.id))
        .method(Method::PUT)
        .header("Content-Type", "application/json")
        .header(
            "cookie",
            format!("access_token={access_token};ws_ticket={ws_ticket}"),
        )
        .body(Body::from(
            json!({
            "targetId": "b2337049-fa84-4d42-95da-3720a90e994d",
            "targetType": "blogs",
            "content": "new".to_string()
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
    assert_eq!(data.get("content").unwrap().as_str(), Some("new"));
}

#[tokio::test]
#[serial]
async fn discussion_successfully() {
    let mut app = setup_app(true).await;
    let user = get_admin();
    let ws_ticket = gen_ws_ticket(&user, false).await;
    let access_token = gen_jwt(user).await;
    let comment = mock_comment(
        Uuid::from_str("b2337049-fa84-4d42-95da-3720a90e994d").unwrap(),
        Discussions,
    )
    .await;

    let request = Request::builder()
        .uri(format!("/api/v1/comments/{}", comment.id))
        .method(Method::PUT)
        .header("Content-Type", "application/json")
        .header(
            "cookie",
            format!("access_token={access_token};ws_ticket={ws_ticket}"),
        )
        .body(Body::from(
            json!({
            "targetId": "b2337049-fa84-4d42-95da-3720a90e994d",
            "targetType": "discussions",
            "content": "new".to_string()
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
    assert_eq!(data.get("content").unwrap().as_str(), Some("new"));
}
