use anyhow::{anyhow, Result};
use axum::http::{header::ACCEPT, HeaderMap, HeaderValue};
use octocrab::Octocrab;
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
pub struct GhOAuth {
    pub access_token: String,
}

pub fn build_client(app_id: u64, secret: &str) -> Result<Octocrab> {
    octocrab::Octocrab::builder()
        .app(
            app_id.into(),
            jsonwebtoken::EncodingKey::from_rsa_pem(secret.as_bytes())?,
        )
        .build()
        .map_err(|e| anyhow!(e))
}

pub async fn exchange_user_token(
    instance: &Octocrab,
    client_id: &String,
    client_secret: &String,
    code: &String,
) -> Result<GhOAuth> {
    let mut headers = HeaderMap::new();
    headers.insert(ACCEPT, HeaderValue::from_static("application/json"));

    instance
        .get_with_headers::<GhOAuth, _, _>(
            format!(
            "https://github.com/login/oauth/access_token?client_id={client_id}&client_secret={client_secret}&code={code}",
        ),
            None::<&()>,
            Some(headers),
        )
        .await.map_err(|e| anyhow!(e))
}
