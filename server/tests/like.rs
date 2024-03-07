use std::str::FromStr;

use axum::{
    body::Body,
    extract::Request,
    http::{Method, StatusCode},
};
use http_body_util::BodyExt;
use serde_json::{json, Value};
use server::database::entities::comment::CommentType::Blogs;
use tower::{Service, ServiceExt};
use uuid::Uuid;
use serial_test::serial;

use crate::common::{
    gen_jwt,
    gen_ws_ticket,
    get_admin,
    mock_comment,
    mock_discussion,
    mock_game,
    mock_post,
    setup_app,
};

mod common;

#[tokio::test]
#[serial]
async fn when_not_login() {
    let mut app = setup_app(true).await;
    let post = mock_post().await;

    let request = Request::builder()
        .uri("/api/v1/likes")
        .method(Method::POST)
        .header("Content-Type", "application/json")
        .body(Body::from(
            json!({
            "target_id": post.id.to_string(),
            "target_type": "Posts".to_string()
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

    let post_request = Request::builder()
        .uri(format!("/api/v1/posts/{}", post.id))
        .header("Content-Type", "application/json")
        .body(Body::empty())
        .unwrap();

    let post_response = ServiceExt::<Request<Body>>::ready(&mut app)
        .await
        .unwrap()
        .call(post_request)
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::UNAUTHORIZED);
    assert_eq!(post_response.status(), StatusCode::OK);

    let post_body = post_response
        .into_body()
        .collect()
        .await
        .unwrap()
        .to_bytes();
    let post_body: Value = serde_json::from_slice(&post_body).unwrap();
    let data = post_body.get("data").unwrap();
    assert!(data.get("isLiked").is_none());
    assert_eq!(data.get("likes").unwrap().as_i64(), Some(0));
}

#[tokio::test]
#[serial]
async fn unlike_when_not_login() {
    let mut app = setup_app(true).await;
    let post = mock_post().await;

    let request = Request::builder()
        .uri("/api/v1/likes")
        .method(Method::DELETE)
        .header("Content-Type", "application/json")
        .body(Body::from(
            json!({
            "target_id": post.id.to_string(),
            "target_type": "Posts".to_string()
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

    let post_request = Request::builder()
        .uri(format!("/api/v1/posts/{}", post.id))
        .header("Content-Type", "application/json")
        .body(Body::empty())
        .unwrap();

    let post_response = ServiceExt::<Request<Body>>::ready(&mut app)
        .await
        .unwrap()
        .call(post_request)
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::UNAUTHORIZED);
    assert_eq!(post_response.status(), StatusCode::OK);

    let post_body = post_response
        .into_body()
        .collect()
        .await
        .unwrap()
        .to_bytes();
    let post_body: Value = serde_json::from_slice(&post_body).unwrap();
    let data = post_body.get("data").unwrap();
    assert!(data.get("isLiked").is_none());
    assert_eq!(data.get("likes").unwrap().as_i64(), Some(0));
}
#[tokio::test]
#[serial]
async fn post_successfully() {
    let mut app = setup_app(true).await;
    let user = get_admin().await;
    let ws_ticket = gen_ws_ticket(&user, false).await;
    let access_token = gen_jwt(user).await;
    let post = mock_post().await;

    let request = Request::builder()
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

    let response = ServiceExt::<Request<Body>>::ready(&mut app)
        .await
        .unwrap()
        .call(request)
        .await
        .unwrap();

    let post_request = Request::builder()
        .uri(format!("/api/v1/posts/{}", post.id))
        .header(
            "cookie",
            format!("access_token={access_token};ws_ticket={ws_ticket}"),
        )
        .header("Content-Type", "application/json")
        .body(Body::empty())
        .unwrap();

    let post_response = ServiceExt::<Request<Body>>::ready(&mut app)
        .await
        .unwrap()
        .call(post_request)
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);
    assert_eq!(post_response.status(), StatusCode::OK);

    let post_body = post_response
        .into_body()
        .collect()
        .await
        .unwrap()
        .to_bytes();
    let post_body: Value = serde_json::from_slice(&post_body).unwrap();
    let data = post_body.get("data").unwrap();
    assert_eq!(data.get("isLiked").unwrap().as_bool(), Some(true));
    assert_eq!(data.get("likes").unwrap().as_i64(), Some(1));

    //test unlike
    let request = Request::builder()
        .uri("/api/v1/likes")
        .method(Method::DELETE)
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

    let response = ServiceExt::<Request<Body>>::ready(&mut app)
        .await
        .unwrap()
        .call(request)
        .await
        .unwrap();

    let post_request = Request::builder()
        .uri(format!("/api/v1/posts/{}", post.id))
        .header(
            "cookie",
            format!("access_token={access_token};ws_ticket={ws_ticket}"),
        )
        .header("Content-Type", "application/json")
        .body(Body::empty())
        .unwrap();

    let post_response = ServiceExt::<Request<Body>>::ready(&mut app)
        .await
        .unwrap()
        .call(post_request)
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);
    assert_eq!(post_response.status(), StatusCode::OK);

    let post_body = post_response
        .into_body()
        .collect()
        .await
        .unwrap()
        .to_bytes();
    let post_body: Value = serde_json::from_slice(&post_body).unwrap();
    let data = post_body.get("data").unwrap();
    assert_eq!(data.get("isLiked").unwrap().as_bool(), Some(false));
    assert_eq!(data.get("likes").unwrap().as_i64(), Some(0));
}

#[tokio::test]
#[serial]
async fn comment_successfully() {
    let mut app = setup_app(true).await;
    let user = get_admin().await;
    let ws_ticket = gen_ws_ticket(&user, false).await;
    let access_token = gen_jwt(user).await;
    let comment = mock_comment(
        Uuid::from_str("b2337049-fa84-4d42-95da-3720a90e994d").unwrap(),
        Blogs,
    )
    .await;

    let request = Request::builder()
        .uri("/api/v1/likes")
        .method(Method::POST)
        .header(
            "cookie",
            format!("access_token={access_token};ws_ticket={ws_ticket}"),
        )
        .header("Content-Type", "application/json")
        .body(Body::from(
            json!({
                "targetId": comment.id.to_string(),
                "targetType": "comments"
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

    let comment_request = Request::builder()
        .uri("/api/v1/comments?targetId=b2337049-fa84-4d42-95da-3720a90e994d")
        .header(
            "cookie",
            format!("access_token={access_token};ws_ticket={ws_ticket}"),
        )
        .header("Content-Type", "application/json")
        .body(Body::empty())
        .unwrap();

    let comment_response = ServiceExt::<Request<Body>>::ready(&mut app)
        .await
        .unwrap()
        .call(comment_request)
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);
    assert_eq!(comment_response.status(), StatusCode::OK);

    let comment_body = comment_response
        .into_body()
        .collect()
        .await
        .unwrap()
        .to_bytes();
    let comment_body: Value = serde_json::from_slice(&comment_body).unwrap();

    let data = comment_body.get("data").unwrap().as_array();
    let first_value = data.unwrap().first().unwrap();

    assert_eq!(first_value.get("isLiked").unwrap().as_bool(), Some(true));
    assert_eq!(first_value.get("likes").unwrap().as_i64(), Some(1));

    //test unlike
    let request = Request::builder()
        .uri("/api/v1/likes")
        .method(Method::DELETE)
        .header(
            "cookie",
            format!("access_token={access_token};ws_ticket={ws_ticket}"),
        )
        .header("Content-Type", "application/json")
        .body(Body::from(
            json!({
                  "targetId": comment.id.to_string(),
                "targetType": "comments"
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

    let comment_request = Request::builder()
        .uri("/api/v1/comments?targetId=b2337049-fa84-4d42-95da-3720a90e994d")
        .header(
            "cookie",
            format!("access_token={access_token};ws_ticket={ws_ticket}"),
        )
        .header("Content-Type", "application/json")
        .body(Body::empty())
        .unwrap();

    let comment_response = ServiceExt::<Request<Body>>::ready(&mut app)
        .await
        .unwrap()
        .call(comment_request)
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);
    assert_eq!(comment_response.status(), StatusCode::OK);

    let comment_body = comment_response
        .into_body()
        .collect()
        .await
        .unwrap()
        .to_bytes();
    let comment_body: Value = serde_json::from_slice(&comment_body).unwrap();

    let data = comment_body.get("data").unwrap().as_array();
    let first_value = data.unwrap().first().unwrap();

    assert_eq!(first_value.get("isLiked").unwrap().as_bool(), Some(false));
    assert_eq!(first_value.get("likes").unwrap().as_i64(), Some(0));
}

#[tokio::test]
#[serial]
async fn discussion_successfully() {
    let mut app = setup_app(true).await;
    let user = get_admin().await;
    let ws_ticket = gen_ws_ticket(&user, false).await;
    let access_token = gen_jwt(user).await;
    let game = mock_game().await;
    let discussion = mock_discussion(game.id).await;

    let request = Request::builder()
        .uri("/api/v1/likes")
        .method(Method::POST)
        .header(
            "cookie",
            format!("access_token={access_token};ws_ticket={ws_ticket}"),
        )
        .header("Content-Type", "application/json")
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

    let discussion_request = Request::builder()
        .uri(format!(
            "/api/v1/games/{}/discussions/{}",
            game.id, discussion.id
        ))
        .header(
            "cookie",
            format!("access_token={access_token};ws_ticket={ws_ticket}"),
        )
        .header("Content-Type", "application/json")
        .body(Body::empty())
        .unwrap();

    let discussion_response = ServiceExt::<Request<Body>>::ready(&mut app)
        .await
        .unwrap()
        .call(discussion_request)
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);
    assert_eq!(discussion_response.status(), StatusCode::OK);

    let discussion_body = discussion_response
        .into_body()
        .collect()
        .await
        .unwrap()
        .to_bytes();
    let discussion_body: Value = serde_json::from_slice(&discussion_body).unwrap();

    let data = discussion_body.get("data").unwrap();

    assert_eq!(data.get("isLiked").unwrap().as_bool(), Some(true));
    assert_eq!(data.get("likes").unwrap().as_i64(), Some(1));

    //test unlike
    let request = Request::builder()
        .uri("/api/v1/likes")
        .method(Method::DELETE)
        .header(
            "cookie",
            format!("access_token={access_token};ws_ticket={ws_ticket}"),
        )
        .header("Content-Type", "application/json")
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

    let discussion_request = Request::builder()
        .uri(format!(
            "/api/v1/games/{}/discussions/{}",
            game.id, discussion.id
        ))
        .header(
            "cookie",
            format!("access_token={access_token};ws_ticket={ws_ticket}"),
        )
        .header("Content-Type", "application/json")
        .body(Body::empty())
        .unwrap();

    let discussion_response = ServiceExt::<Request<Body>>::ready(&mut app)
        .await
        .unwrap()
        .call(discussion_request)
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);
    assert_eq!(discussion_response.status(), StatusCode::OK);

    let discussion_body = discussion_response
        .into_body()
        .collect()
        .await
        .unwrap()
        .to_bytes();
    let discussion_body: Value = serde_json::from_slice(&discussion_body).unwrap();

    let data = discussion_body.get("data").unwrap();

    assert_eq!(data.get("isLiked").unwrap().as_bool(), Some(false));
    assert_eq!(data.get("likes").unwrap().as_i64(), Some(0));
}
