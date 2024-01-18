use anyhow::{anyhow, Result};
use axum::http::{
    header::{InvalidHeaderValue, ACCEPT, AUTHORIZATION},
    HeaderMap,
    HeaderValue,
};
use octocrab::models::Author;
use serde::Deserialize;

#[derive(Deserialize)]
pub struct GhOAuth {
    pub access_token: String,
}

fn build_headers(token: Option<&str>) -> Result<HeaderMap> {
    let mut headers = HeaderMap::new();
    headers.insert(
        ACCEPT,
        HeaderValue::from_static("application/vnd.github+json"),
    );
    if let Some(token) = token {
        headers.insert(
            AUTHORIZATION,
            format!("Bearer {token}")
                .parse()
                .map_err(|e: InvalidHeaderValue| anyhow!(e))?,
        );
    }
    Ok(headers)
}

pub async fn exchange_user_token(
    client_id: &str,
    client_secret: &str,
    code: &str,
) -> Result<GhOAuth> {
    octocrab::instance()
        .get_with_headers::<GhOAuth, _, _>(
            format!(
            "https://github.com/login/oauth/access_token?client_id={client_id}&client_secret={client_secret}&code={code}",
        ),
            None::<&()>,
            Some(build_headers(None)?),
        )
        .await.map_err(|e| anyhow!(e))
}

pub async fn get_user_from_token(token: &str) -> Result<Author> {
    octocrab::instance()
        .get_with_headers::<Author, _, _>(
            "https://api.github.com/user",
            None::<&()>,
            Some(build_headers(Some(token))?),
        )
        .await
        .map_err(|e| anyhow!(e))
}
