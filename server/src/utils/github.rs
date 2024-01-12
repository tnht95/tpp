use anyhow::{bail, Result};
use octocrab::Octocrab;

pub fn build_client(app_id: u64, secret: &str) -> Result<Octocrab> {
    match octocrab::Octocrab::builder()
        .app(
            app_id.into(),
            jsonwebtoken::EncodingKey::from_rsa_pem(secret.as_bytes())?,
        )
        .build()
    {
        Ok(octocrab) => Ok(octocrab),
        Err(e) => bail!(e),
    }
}
