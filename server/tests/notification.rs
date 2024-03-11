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

use crate::common::{
    gen_jwt,
    gen_ws_ticket,
    get_admin,
    mock_comment_with_other_user,
    mock_post,
    mock_user,
    setup_app,
};

mod common;

#[tokio::test]
#[serial]
async fn get_notification_with_post() {
    let mut app = setup_app(true).await;
    let user = get_admin();
    let other_user = mock_user(1, "me", true).await;
    let other_ws_ticket = gen_ws_ticket(&other_user, false).await;
    let other_access_token = gen_jwt(other_user).await;
    let ws_ticket = gen_ws_ticket(&user, false).await;
    let access_token = gen_jwt(user).await;
    let post = mock_post().await;
    let comment = mock_comment_with_other_user(post.id, Posts).await;

    let request = Request::builder()
        .uri("/api/v1/notifications?offset=0&limit=20")
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
    let data = body.get("data").unwrap().as_array().unwrap();
    let first_data = data.first().unwrap();
    assert_eq!(data.len(), 1);
    assert_eq!(
        first_data.get("targetType").unwrap().as_str(),
        Some("commentPost")
    );
    assert_eq!(first_data.get("isRead").unwrap().as_bool(), Some(false));

    // test delete comment
    let d_request = Request::builder()
        .uri(format!("/api/v1/comments/{}", comment.id))
        .method(Method::DELETE)
        .header("Content-Type", "application/json")
        .header(
            "cookie",
            format!("access_token={other_access_token};ws_ticket={other_ws_ticket}"),
        )
        .body(Body::from(
            json!({
            "targetId": "b2337049-fa84-4d42-95da-3720a90e994d",
            "targetType": "posts",
            })
            .to_string(),
        ))
        .unwrap();
    let d_response = ServiceExt::<Request<Body>>::ready(&mut app)
        .await
        .unwrap()
        .call(d_request)
        .await
        .unwrap();

    let request = Request::builder()
        .uri("/api/v1/notifications?offset=0&limit=20")
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

    assert_eq!(d_response.status(), StatusCode::OK);
    assert_eq!(response.status(), StatusCode::OK);
    let body = response.into_body().collect().await.unwrap().to_bytes();
    let body: Value = serde_json::from_slice(&body).unwrap();
    let data = body.get("data").unwrap().as_array().unwrap();
    assert_eq!(data.len(), 0);
}

#[tokio::test]
#[serial]
async fn get_notification_with_subscribe() {
    let mut app = setup_app(true).await;
    let other_user = mock_user(1, "me", true).await;
    let other_ws_ticket = gen_ws_ticket(&other_user, false).await;
    let other_access_token = gen_jwt(other_user).await;

    let s_request = Request::builder()
        .uri("/api/v1/users/40195902/subscribes")
        .method(Method::POST)
        .header(
            "cookie",
            format!("access_token={other_access_token};ws_ticket={other_ws_ticket}"),
        )
        .body(Body::empty())
        .unwrap();
    let s_response = ServiceExt::<Request<Body>>::ready(&mut app)
        .await
        .unwrap()
        .call(s_request)
        .await
        .unwrap();

    mock_post().await;

    let request = Request::builder()
        .uri("/api/v1/notifications?offset=0&limit=20")
        .header(
            "cookie",
            format!("access_token={other_access_token};ws_ticket={other_access_token}"),
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
    assert_eq!(s_response.status(), StatusCode::OK);

    let body = response.into_body().collect().await.unwrap().to_bytes();
    let body: Value = serde_json::from_slice(&body).unwrap();
    let data = body.get("data").unwrap().as_array().unwrap();
    assert_eq!(data.len(), 2);
}
