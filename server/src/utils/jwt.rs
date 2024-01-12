use anyhow::Result;
use jsonwebtoken::{encode, Algorithm, EncodingKey, Header};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct JwtClaim {
    user_email: String,
}

pub fn encode_jwt(user_email: String, secret: &str) -> Result<String> {
    Ok(encode(
        &Header::new(Algorithm::HS256),
        &JwtClaim { user_email },
        &EncodingKey::from_secret(secret.as_ref()),
    )?)
}
