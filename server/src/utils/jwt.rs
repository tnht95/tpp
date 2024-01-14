use std::{
    ops::Add,
    time::{Duration, SystemTime, UNIX_EPOCH},
};

use anyhow::Result;
use jsonwebtoken::{encode, Algorithm, EncodingKey, Header};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct JwtClaim {
    user_email: String,
    exp_at: u128,
}

pub fn encode_jwt(user_email: String, secret: &str, expire_in: u64) -> Result<String> {
    Ok(encode(
        &Header::new(Algorithm::HS256),
        &JwtClaim {
            user_email,
            exp_at: SystemTime::now()
                .add(Duration::from_secs(expire_in))
                .duration_since(UNIX_EPOCH)?
                .as_millis(),
        },
        &EncodingKey::from_secret(secret.as_ref()),
    )?)
}
