use std::{net::SocketAddr, sync::Arc};

use axum::{
    extract::{
        connect_info::ConnectInfo,
        ws::{Message, WebSocket, WebSocketUpgrade},
        State,
    },
    response::Response,
};
use tokio::spawn;
//allows to extract the IP of connecting user
use tokio::sync::mpsc;
use tracing::{debug, error};

use super::Server;
use crate::services::{auth::IAuthService, notification::INofitifcationService, IInternalServices};

pub async fn handler<TInternalServices: IInternalServices + 'static>(
    ws: WebSocketUpgrade,
    ConnectInfo(who): ConnectInfo<SocketAddr>,
    State(state): State<Arc<Server<TInternalServices>>>,
) -> Response {
    ws.on_upgrade(move |socket| handle_socket(socket, who, state))
}

async fn handle_socket<TInternalServices: IInternalServices + 'static>(
    mut socket: WebSocket,
    who: SocketAddr,
    state: Arc<Server<TInternalServices>>,
) {
    // todo: timeout
    // await client to send ws_ticket as an initial handshake
    let ws_ticket = if let Some(msg) = socket.recv().await {
        if let Ok(Message::Text(msg)) = msg {
            msg
        } else {
            debug!("client {who} send invalid message");
            return;
        }
    } else {
        debug!("client {who} abruptly disconnected");
        return;
    };

    // verify webSocket ticket
    let user = if let Ok(user) = state.services.auth.get_ws_ticket(&ws_ticket).await {
        user
    } else {
        let _ = socket
            .send(Message::Text("Bad Websocket Ticket".into()))
            .await;
        return;
    };

    // listen new event
    let (sender, mut receiver) = mpsc::channel::<String>(64);
    let sender_task = spawn(async move {
        if let Err(e) = state
            .services
            .notification
            .listen(&format!("to_user_id_{}", user.id), sender)
            .await
        {
            error!("Listener has stopped due to: {e}");
        };
    });
    let receiver_task = spawn(async move {
        while let Some(payload) = receiver.recv().await {
            if let Err(e) = socket.send(Message::Text(payload)).await {
                error!("Error sending message: {e}");
                return;
            }
        }
    });

    if let Err(e) = sender_task.await {
        error!("Error stopping sender task: {e}");
    };
    if let Err(e) = receiver_task.await {
        error!("Error stopping receiver task: {e}");
    };
}
