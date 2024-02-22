use std::net::SocketAddr;

//allows to extract the IP of connecting user
use axum::extract::connect_info::ConnectInfo;
use axum::{
    extract::ws::{Message, WebSocketUpgrade},
    response::Response,
};
use tracing::error;

pub async fn handler(ws: WebSocketUpgrade, ConnectInfo(addr): ConnectInfo<SocketAddr>) -> Response {
    ws.on_upgrade(move |mut socket| async move {
        for i in 1..=10 {
            if let Err(e) = socket
                .send(Message::Text(format!("hello {addr}: {i}")))
                .await
            {
                error!("[ws]: Error sending messages {e:?}");
            };
        }
        if let Err(e) = socket.close().await {
            error!("[ws]: Error closing socket {e:?}");
        };
    })
}
