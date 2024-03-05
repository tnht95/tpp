use anyhow::Result;
use axum::{
    body::Body,
    http::header::{ACCEPT, AUTHORIZATION},
};
use http_body_util::BodyExt;
use hyper::{header::USER_AGENT, Request};
use hyper_tls::HttpsConnector;
use hyper_util::{client::legacy::Client, rt::TokioExecutor};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct GhOAuth {
    pub access_token: String,
}

#[derive(Serialize, Deserialize)]
pub struct GithubUser {
    pub login: String,
    pub id: i64,
    pub avatar_url: String,
    pub html_url: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub bio: Option<String>,
}

pub async fn exchange_user_token(
    client_id: &str,
    client_secret: &str,
    code: &str,
) -> Result<GhOAuth> {
    let response = Client::builder(TokioExecutor::new()).build(HttpsConnector::new())
            .request(
                Request::builder()
                    .uri(format!("https://github.com/login/oauth/access_token?client_id={client_id}&client_secret={client_secret}&code={code}"))
                    .header(ACCEPT, "application/vnd.github+json")
                    .body(Body::empty())?
            )
            .await?;
    let body = response.into_body().collect().await?.to_bytes();
    Ok(serde_json::from_slice::<GhOAuth>(&body)?)
}

pub async fn get_ghuser_from_token(token: &str) -> Result<GithubUser> {
    let response = Client::builder(TokioExecutor::new())
        .build(HttpsConnector::new())
        .request(
            Request::builder()
                .uri("https://api.github.com/user")
                .header(USER_AGENT, "tpp-app")
                .header(ACCEPT, "application/vnd.github+json")
                .header(AUTHORIZATION, format!("Bearer {token}"))
                .body(Body::empty())?,
        )
        .await?;
    let body = response.into_body().collect().await?.to_bytes();
    Ok(serde_json::from_slice::<GithubUser>(&body)?)
}
