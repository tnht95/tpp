use axum::{
    body::Body,
    extract::Request,
    http::{header::SET_COOKIE, StatusCode},
};
use http_body_util::BodyExt;
use redis::AsyncCommands;
use serde_json::{json, Value};
use serial_test::serial;
use server::{
    cache::{Cache, ICache},
    utils::time::mock_time,
};
use tower::{util::ServiceExt, Service};

use crate::common::{gen_jwt, gen_ws_ticket, get_config, mock_user, setup_app};

mod common;

#[tokio::test]
#[serial]
async fn missing_cookie() {
    let mut app = setup_app(false).await;
    let request = Request::builder()
        .uri("/api/v1/me")
        .body(Body::empty())
        .unwrap();
    let response = ServiceExt::<Request<Body>>::ready(&mut app)
        .await
        .unwrap()
        .call(request)
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::UNAUTHORIZED);
    let body = response.into_body().collect().await.unwrap().to_bytes();
    let body: Value = serde_json::from_slice(&body).unwrap();
    assert_eq!(
        body,
        json!({
            "code": "ERR_001",
            "msg": "Unauthorized",
        })
    );
}

#[tokio::test]
#[serial]
async fn bad_access_token() {
    let mut app = setup_app(false).await;
    let request = Request::builder()
        .uri("/api/v1/me")
        .header("cookie", "bad_cookie")
        .body(Body::empty())
        .unwrap();
    let response = ServiceExt::<Request<Body>>::ready(&mut app)
        .await
        .unwrap()
        .call(request)
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::UNAUTHORIZED);
    let body = response.into_body().collect().await.unwrap().to_bytes();
    let body: Value = serde_json::from_slice(&body).unwrap();
    assert_eq!(
        body,
        json!({
            "code": "ERR_001",
            "msg": "Unauthorized",
        })
    );
}

#[tokio::test]
#[serial]
async fn valid_user_authentication() {
    let mut app = setup_app(false).await;

    mock_time::set_mock_time(mock_time::now());
    let user = mock_user(1, "bob", false).await;
    let user_expected_body = mock_user(1, "bob", false).await;
    mock_time::clear_mock_time();

    let ws_ticket = gen_ws_ticket(&user, false).await;
    let access_token = gen_jwt(user).await;

    let request = Request::builder()
        .uri("/api/v1/me")
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
    assert_eq!(
        body,
        json!({ "data": {
        "isAdmin": false,
        "wsTicket": ws_ticket,
        "user": user_expected_body
    } })
    );
}

#[tokio::test]
#[serial]
async fn valid_admin_authentication() {
    let config = get_config().await;
    let mut app = setup_app(false).await;

    mock_time::set_mock_time(mock_time::now());
    let user = mock_user(config.auth.admin_id, "bob", false).await;
    let user_expected_body = mock_user(config.auth.admin_id, "bob", false).await;
    mock_time::clear_mock_time();

    let ws_ticket = gen_ws_ticket(&user, false).await;
    let access_token = gen_jwt(user).await;

    let request = Request::builder()
        .uri("/api/v1/me")
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
    assert_eq!(
        body,
        json!({ "data": {
        "isAdmin": true,
        "wsTicket": ws_ticket,
        "user": user_expected_body
    } })
    );
}

#[tokio::test]
#[serial]
async fn logout_successfully() {
    let mut app = setup_app(false).await;

    let user = mock_user(1, "bob", false).await;

    let ws_ticket = gen_ws_ticket(&user, true).await;
    let access_token = gen_jwt(user).await;

    let request = Request::builder()
        .uri("/api/v1/logout")
        .method("DELETE")
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

    let mut headers = response.headers().get_all(SET_COOKIE).iter();
    assert_eq!(
        headers.next().unwrap(),
        "access_token=;SameSite=None;Secure;HttpOnly;Max-Age=0"
    );
    assert_eq!(
        headers.next().unwrap(),
        "ws_ticket=;SameSite=None;Secure;HttpOnly;Max-Age=0"
    );
    assert!(headers.next().is_none());

    let body = response.into_body().collect().await.unwrap().to_bytes();
    let body: Value = serde_json::from_slice(&body).unwrap();
    assert_eq!(body, json!({ "data": None::<()> }));

    let cache = Cache::new(get_config().await).await.unwrap();
    let mut con = cache.get_con();
    let result: Option<()> = con.get(format!("ws_ticket_{ws_ticket}")).await.unwrap();
    assert_eq!(result, None);
}
