use serial_test::file_serial;
use axum::{body::Body, extract::Request, http::StatusCode};
use http_body_util::BodyExt;
use serde_json::{json, Value};
use tower::{util::ServiceExt, Service};

use crate::common::{gen_jwt, get_pool, gen_ws_ticket, mock_user, setup_app};

mod common;

#[tokio::test]
#[file_serial]
async fn with_invalid_id() {
    let mut app = setup_app(true).await;
    let request = Request::builder()
        .uri("/api/v1/users/sss")
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
            "code": "ERR_103",
            "msg": "Invalid User ID",
        })
    );
}

#[tokio::test]
#[file_serial]
async fn with_nonexistent_id() {
    let mut app = setup_app(true).await;
    let request = Request::builder()
        .uri("/api/v1/users/1")
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
            "code": "USER_001",
            "msg": "User Not Found",
        })
    );
}

#[tokio::test]
#[file_serial]
async fn non_auth_with_existed_id() {
    let mut app = setup_app(true).await;
    let request = Request::builder()
        .uri("/api/v1/users/40195902")
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
    assert_eq!(data.get("id").unwrap().as_i64(), Some(40195902));
    assert_eq!(data.get("name").unwrap().as_str(), Some("tnht95"));
    assert_eq!(
        data.get("githubUrl").unwrap().as_str(),
        Some("https://github.com/tnht95")
    );
    assert!(body.get("data").unwrap().get("bio").is_none());
    assert_eq!(
        data.get("avatar").unwrap().as_str(),
        Some("https://avatars.githubusercontent.com/u/40195902?v=4")
    );
    assert_eq!(data.get("subscribers").unwrap().as_i64(), Some(0));
    assert!(data.get("isSubscribed").is_none());
    assert_eq!(
        data.get("createdAt").unwrap().as_str(),
        Some("2024-01-23T04:08:43.497206Z")
    );
}

#[tokio::test]
#[file_serial]
async fn auth_with_subscriber() {
    let mut app = setup_app(true).await;

    let user = mock_user(1, "me", true).await;
    let ws_ticket = gen_ws_ticket(&user, false).await;
    let access_token = gen_jwt(user).await;

    sqlx::query!("insert into user_subscribers (user_id, subscriber_id) values (40195902,1)")
        .execute(get_pool().await)
        .await
        .unwrap();

    let request = Request::builder()
        .uri("/api/v1/users/40195902")
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
    assert_eq!(data.get("id").unwrap().as_i64(), Some(40195902));
    assert_eq!(data.get("name").unwrap().as_str(), Some("tnht95"));
    assert_eq!(
        data.get("githubUrl").unwrap().as_str(),
        Some("https://github.com/tnht95")
    );
    assert!(body.get("data").unwrap().get("bio").is_none());
    assert_eq!(
        data.get("avatar").unwrap().as_str(),
        Some("https://avatars.githubusercontent.com/u/40195902?v=4")
    );
    assert_eq!(data.get("subscribers").unwrap().as_i64(), Some(1));
    assert_eq!(data.get("isSubscribed").unwrap().as_bool(), Some(true));
    assert_eq!(
        data.get("createdAt").unwrap().as_str(),
        Some("2024-01-23T04:08:43.497206Z")
    );

    sqlx::query!("delete from users where id = 1",)
        .execute(get_pool().await)
        .await
        .unwrap();
}
