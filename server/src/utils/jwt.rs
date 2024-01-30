use std::{
    ops::Add,
    time::{Duration, SystemTime, UNIX_EPOCH},
};

use anyhow::{anyhow, Result};
use jsonwebtoken::{Algorithm, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};

use crate::{config::Config, database::entities::user::User};

#[derive(Serialize, Deserialize)]
pub struct JwtClaim {
    pub user: User,
    pub is_admin: bool,
    exp_at: u128,
}

pub fn encode(user: User, config: &Config) -> Result<String> {
    Ok(jsonwebtoken::encode(
        &Header::new(Algorithm::HS256),
        &JwtClaim {
            is_admin: user.id == config.auth.admin_id,
            user,
            exp_at: SystemTime::now()
                .add(Duration::from_secs(config.auth.jwt.expire_in))
                .duration_since(UNIX_EPOCH)?
                .as_millis(),
        },
        &EncodingKey::from_secret(config.auth.jwt.secret.as_ref()),
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
