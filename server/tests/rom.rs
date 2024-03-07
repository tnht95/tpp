use serial_test::serial;
use axum::{body::Body, extract::Request, http::StatusCode};
use http_body_util::BodyExt;
use tower::{util::ServiceExt, Service};

use crate::common::setup_app;

mod common;

#[tokio::test]
#[serial]
async fn rom_is_accessible() {
    let mut app = setup_app(false).await;
    tokio::fs::write("./roms/123", "my_rom").await.unwrap();
    let request = Request::builder()
        .uri("/roms/123")
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
    assert_eq!(&body[..], b"my_rom");
    tokio::fs::remove_file("./roms/123").await.unwrap();
}
