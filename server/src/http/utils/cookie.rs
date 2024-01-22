use anyhow::{anyhow, Result};
use axum::http::HeaderMap;

pub fn extract_access_token(headers: &HeaderMap) -> Result<&str> {
    let cookie = headers
        .get("cookie")
        .ok_or(anyhow!("cookie not found"))?
        .to_str()?;

    let access_token = cookie
        .split(';')
        .find(|item| item.starts_with("access_token="))
        .ok_or(anyhow!("access token not found"))?;

    // skip "access_token="
    Ok(&access_token[13..])
}
