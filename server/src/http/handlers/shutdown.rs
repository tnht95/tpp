use std::sync::Arc;

use tracing::info;

use crate::{
    http::Server,
    services::{book::IBookService, health::IHealthService},
};

pub async fn handle<THealthService, TBookService>(state: Arc<Server<THealthService, TBookService>>)
where
    THealthService: IHealthService,
    TBookService: IBookService,
{
    let ctrl_c = async {
        tokio::signal::ctrl_c()
            .await
            .expect("Failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate())
            .expect("Failed to install signal handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {
            info!("Receiving SIGINT signal");
            state.services.health.write().await.app_close();
        },
        _ = terminate => {
            info!("Receiving SIGKILL signal");
            state.services.health.write().await.app_close();
        },
    }
}
