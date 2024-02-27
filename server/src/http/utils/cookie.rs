use anyhow::{anyhow, Result};
use axum::http::HeaderMap;

fn extract_cookie(headers: &HeaderMap) -> Result<&str> {
    Ok(headers
        .get("cookie")
        .ok_or(anyhow!("cookie not found"))?
        .to_str()?)
}

pub fn extract_access_token(headers: &HeaderMap) -> Result<&str> {
    let cookie = extract_cookie(headers)?;

    let access_token = cookie
        .split(';')
        .find(|item| item.starts_with("access_token="))
        .ok_or(anyhow!("access token not found"))?;

    // skip "access_token="
    Ok(&access_token[13..])
}

pub fn extract_ws_ticket(headers: &HeaderMap) -> Result<&str> {
    let cookie = extract_cookie(headers)?;

    let ws_ticket = cookie
        .split(';')
        .find(|item| item.starts_with("ws_ticket="))
        .ok_or(anyhow!("websocket ticket not found"))?;

    // skip "ws_ticket="
    Ok(&ws_ticket[10..])
}
