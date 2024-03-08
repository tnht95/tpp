use axum::{
    body::Body,
    extract::Request,
    http::{Method, StatusCode},
};
use http_body_util::BodyExt;
use serde_json::{json, Value};
use serial_test::serial;
use tower::{Service, ServiceExt};

use crate::common::{gen_jwt, gen_ws_ticket, get_admin, mock_user, setup_app};

mod common;
#[tokio::test]
#[serial]
async fn when_not_login() {
    let mut app = setup_app(true).await;
    let request = Request::builder()
        .uri("/api/v1/users/40195902/subscribes")
        .method(Method::POST)
        .body(Body::empty())
        .unwrap();
    let response = ServiceExt::<Request<Body>>::ready(&mut app)
        .await
        .unwrap()
        .call(request)
        .await
        .unwrap();
    let user_request = Request::builder()
        .uri("/api/v1/users/40195902")
        .body(Body::empty())
        .unwrap();

    let user_response = ServiceExt::<Request<Body>>::ready(&mut app)
        .await
        .unwrap()
        .call(user_request)
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::UNAUTHORIZED);
    assert_eq!(user_response.status(), StatusCode::OK);

    let body = user_response
        .into_body()
        .collect()
        .await
        .unwrap()
        .to_bytes();
    let body: Value = serde_json::from_slice(&body).unwrap();
    let data = body.get("data").unwrap();
    assert!(data.get("isSubscribed").is_none());
    assert_eq!(data.get("subscribers").unwrap().as_i64(), Some(0));
}

#[tokio::test]
#[serial]
async fn with_nonexistent_id() {
    let mut app = setup_app(true).await;
    let user = mock_user(1, "me", true).await;
    let ws_ticket = gen_ws_ticket(&user, false).await;
    let access_token = gen_jwt(user).await;

    let request = Request::builder()
        .uri("/api/v1/users/123/subscribes")
        .method(Method::POST)
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
    assert_eq!(response.status(), StatusCode::BAD_REQUEST);
    let body = response.into_body().collect().await.unwrap().to_bytes();
    let body: Value = serde_json::from_slice(&body).unwrap();
    assert_eq!(
        body,
        json!({
            "code": "SUBSCRIBE_002",
            "msg": "Invalid User",
        })
    );
}

#[tokio::test]
#[serial]
async fn self_subscribed() {
    let mut app = setup_app(true).await;
    let user = get_admin();
    let ws_ticket = gen_ws_ticket(&user, false).await;
    let access_token = gen_jwt(user).await;

    let request = Request::builder()
        .uri("/api/v1/users/40195902/subscribes")
        .method(Method::POST)
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

    let user_request = Request::builder()
        .uri("/api/v1/users/40195902")
        .header(
            "cookie",
            format!("access_token={access_token};ws_ticket={ws_ticket}"),
        )
        .body(Body::empty())
        .unwrap();

    let user_response = ServiceExt::<Request<Body>>::ready(&mut app)
        .await
        .unwrap()
        .call(user_request)
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::BAD_REQUEST);
    assert_eq!(user_response.status(), StatusCode::OK);

    let body = response.into_body().collect().await.unwrap().to_bytes();
    let body: Value = serde_json::from_slice(&body).unwrap();
    assert_eq!(
        body,
        json!({
            "code": "SUBSCRIBE_001",
            "msg": "Self Subscribe Not Allowed",
        })
    );

    let u_body = user_response
        .into_body()
        .collect()
        .await
        .unwrap()
        .to_bytes();
    let u_body: Value = serde_json::from_slice(&u_body).unwrap();
    let data = u_body.get("data").unwrap();
    assert_eq!(data.get("isSubscribed").unwrap().as_bool(), Some(false));
    assert_eq!(data.get("subscribers").unwrap().as_i64(), Some(0));
}

#[tokio::test]
#[serial]
async fn successfully() {
    let mut app = setup_app(true).await;
    let user = mock_user(1, "me", true).await;
    let ws_ticket = gen_ws_ticket(&user, false).await;
    let access_token = gen_jwt(user).await;

    let request = Request::builder()
        .uri("/api/v1/users/40195902/subscribes")
        .method(Method::POST)
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

    let user_request = Request::builder()
        .uri("/api/v1/users/40195902")
        .header(
            "cookie",
            format!("access_token={access_token};ws_ticket={ws_ticket}"),
        )
        .body(Body::empty())
        .unwrap();

    let user_response = ServiceExt::<Request<Body>>::ready(&mut app)
        .await
        .unwrap()
        .call(user_request)
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);
    assert_eq!(user_response.status(), StatusCode::OK);

    let body = user_response
        .into_body()
        .collect()
        .await
        .unwrap()
        .to_bytes();
    let body: Value = serde_json::from_slice(&body).unwrap();
    let data = body.get("data").unwrap();
    assert_eq!(data.get("isSubscribed").unwrap().as_bool(), Some(true));
    assert_eq!(data.get("subscribers").unwrap().as_i64(), Some(1));

    // test unsubscribe
    let request = Request::builder()
        .uri("/api/v1/users/40195902/subscribes")
        .method(Method::DELETE)
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

    let user_request = Request::builder()
        .uri("/api/v1/users/40195902")
        .header(
            "cookie",
            format!("access_token={access_token};ws_ticket={ws_ticket}"),
        )
        .body(Body::empty())
        .unwrap();

    let user_response = ServiceExt::<Request<Body>>::ready(&mut app)
        .await
        .unwrap()
        .call(user_request)
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);
    assert_eq!(user_response.status(), StatusCode::OK);

    let body = user_response
        .into_body()
        .collect()
        .await
        .unwrap()
        .to_bytes();
    let body: Value = serde_json::from_slice(&body).unwrap();
    let data = body.get("data").unwrap();
    assert_eq!(data.get("isSubscribed").unwrap().as_bool(), Some(false));
    assert_eq!(data.get("subscribers").unwrap().as_i64(), Some(0));
}
