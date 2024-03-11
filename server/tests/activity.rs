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
async fn post() {
    let mut app = setup_app(true).await;
    let post = mock_post().await;
    let user = get_admin();
    let ws_ticket = gen_ws_ticket(&user, false).await;
    let access_token = gen_jwt(user).await;

    let request = Request::builder()
        .uri("/api/v1/users/40195902/activities")
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
    assert_eq!(data.len(), 9);
    assert_eq!(
        first_data.get("memo").unwrap().as_str(),
        Some("Content: abc")
    );
    assert_eq!(first_data.get("targetType").unwrap().as_str(), Some("post"));
    assert_eq!(
        first_data.get("targetId").unwrap().as_str(),
        Some(post.id.to_string()).as_deref()
    );

    //test update post
    let e_request = Request::builder()
        .uri(format!("/api/v1/posts/{}", post.id))
        .method(Method::PUT)
        .header(
            "cookie",
            format!("access_token={access_token};ws_ticket={ws_ticket}"),
        )
        .header("Content-Type", "application/json")
        .body(Body::from(
            json!({
            "content": "new".to_string(),
            })
            .to_string(),
        ))
        .unwrap();
    let e_response = ServiceExt::<Request<Body>>::ready(&mut app)
        .await
        .unwrap()
        .call(e_request)
        .await
        .unwrap();

    let request = Request::builder()
        .uri("/api/v1/users/40195902/activities")
        .body(Body::empty())
        .unwrap();

    let response = ServiceExt::<Request<Body>>::ready(&mut app)
        .await
        .unwrap()
        .call(request)
        .await
        .unwrap();

    assert_eq!(e_response.status(), StatusCode::OK);
    assert_eq!(response.status(), StatusCode::OK);
    let body = response.into_body().collect().await.unwrap().to_bytes();
    let body: Value = serde_json::from_slice(&body).unwrap();
    let data = body.get("data").unwrap().as_array().unwrap();
    assert_eq!(data.len(), 9);
    assert_eq!(
        data.first().unwrap().get("memo").unwrap().as_str(),
        Some("Content: new")
    );

    //test delete post
    let d_request = Request::builder()
        .uri(format!("/api/v1/posts/{}", post.id))
        .method(Method::DELETE)
        .header(
            "cookie",
            format!("access_token={access_token};ws_ticket={ws_ticket}"),
        )
        .header("Content-Type", "application/json")
        .body(Body::empty())
        .unwrap();
    let d_response = ServiceExt::<Request<Body>>::ready(&mut app)
        .await
        .unwrap()
        .call(d_request)
        .await
        .unwrap();

    let request = Request::builder()
        .uri("/api/v1/users/40195902/activities")
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
    assert_eq!(data.len(), 8);
}
