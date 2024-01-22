use std::sync::Arc;

use tracing::info;

use crate::{
    http::Server,
    services::{health::IHealthService, IInternalServices},
};

pub async fn handle<TInternalServices: IInternalServices>(state: Arc<Server<TInternalServices>>) {
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
