use std::str::FromStr;

use axum::{
    body::Body,
    extract::Request,
    http::{Method, StatusCode},
};
use http_body_util::BodyExt;
use serde_json::{json, Value};
use serial_test::serial;
use server::database::entities::comment::CommentType::Posts;
use tower::{Service, ServiceExt};
use uuid::Uuid;

use crate::common::{gen_jwt, gen_ws_ticket, mock_comment_with_admin, mock_user, setup_app};

mod common;
#[tokio::test]
#[serial]
async fn when_not_owner() {
    let mut app = setup_app(true).await;
    let user = mock_user(1, "me", true).await;
    let ws_ticket = gen_ws_ticket(&user, false).await;
    let access_token = gen_jwt(user).await;
    let comment = mock_comment_with_admin(
        Uuid::from_str("b2337049-fa84-4d42-95da-3720a90e994d").unwrap(),
        Posts,
    )
    .await;

    let request = Request::builder()
        .uri(format!("/api/v1/comments/{}", comment.id))
        .method(Method::DELETE)
        .header("Content-Type", "application/json")
        .header(
            "cookie",
            format!("access_token={access_token};ws_ticket={ws_ticket}"),
        )
        .body(Body::from(
            json!({
            "targetId": "b2337049-fa84-4d42-95da-3720a90e994d",
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
    assert_eq!(response.status(), StatusCode::BAD_REQUEST);
    let body = response.into_body().collect().await.unwrap().to_bytes();
    let body: Value = serde_json::from_slice(&body).unwrap();
    assert_eq!(
        body,
        json!({
           "code": "CMT_001", "msg": "Not Authorized To Delete",
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
        .method(Method::DELETE)
        .header("Content-Type", "application/json")
        .header(
            "cookie",
            format!("access_token={access_token};ws_ticket={ws_ticket}"),
        )
        .body(Body::from(
            json!({
            "targetId": "b2337049-fa84-4d42-95da-3720a90e994d",
            "targetType": "posts",
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
