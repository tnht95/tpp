use anyhow::Result;
use futures::StreamExt;
use rustls_acme::{axum::AxumAcceptor, caches::DirCache, AcmeConfig};
use tracing::{error, info};

use crate::config::Acme;

pub fn build_acceptor(acme: &Acme) -> Result<AxumAcceptor> {
    let mut acme_state = AcmeConfig::new([&acme.domain])
        .contact([&format!("mailto:{}", acme.email)])
        .cache_option(Some(DirCache::new(String::from(&acme.cache))))
        .directory_lets_encrypt(true)
        .state();

    let acceptor = acme_state.axum_acceptor(acme_state.default_rustls_config());

    tokio::spawn(async move {
        loop {
            match acme_state
                .next()
                .await
                .expect("acme failed to poll next event")
            {
                Ok(ok) => info!("event: {:?}", ok),
                Err(err) => error!("error: {:?}", err),
            }
        }
    });

    Ok(acceptor)
}
