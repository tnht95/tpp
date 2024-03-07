use serial_test::serial;
use axum::{body::Body, extract::Request, http::StatusCode};
use http_body_util::BodyExt;
use serde_json::Value;
use tower::{Service, ServiceExt};

use crate::common::{mock_discussion, mock_game, setup_app};

mod common;
#[tokio::test]
#[serial]
async fn with_negative_pagination() {
    let mut app = setup_app(true).await;
    let game = mock_game().await;
    let discussion = mock_discussion(game.id).await;
    let request = Request::builder()
        .uri(format!(
            "/api/v1/games/{}/discussions?offset=-1&limit=-100",
            game.id
        ))
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
    let discussions = data.as_array().unwrap();
    assert_eq!(
        discussions.first().unwrap().get("title").unwrap().as_str(),
        Some(discussion.title).as_deref()
    );
    assert_eq!(discussions.len(), 1);
}
