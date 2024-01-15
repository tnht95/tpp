use std::{
    ops::Add,
    time::{Duration, SystemTime, UNIX_EPOCH},
};

use anyhow::{anyhow, Result};
use jsonwebtoken::{Algorithm, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct JwtClaim {
    id: u64,
    email: String,
    exp_at: u128,
}

pub fn encode(id: u64, email: String, secret: &str, expire_in: u64) -> Result<String> {
    Ok(jsonwebtoken::encode(
        &Header::new(Algorithm::HS256),
        &JwtClaim {
            id,
            email,
            exp_at: SystemTime::now()
                .add(Duration::from_secs(expire_in))
                .duration_since(UNIX_EPOCH)?
                .as_millis(),
        },
        &EncodingKey::from_secret(secret.as_ref()),
    )?)
}

pub fn decode(token: &str, secret: &str) -> Result<JwtClaim> {
    let mut validation = Validation::new(Algorithm::HS256);
    validation.set_required_spec_claims::<String>(&[]);

    let claim = jsonwebtoken::decode::<JwtClaim>(
        token,
        &DecodingKey::from_secret(secret.as_ref()),
        &validation,
    )?
    .claims;

    match claim.exp_at < SystemTime::now().duration_since(UNIX_EPOCH)?.as_millis() {
        true => Err(anyhow!("expired")),
        false => Ok(claim),
    }
}
