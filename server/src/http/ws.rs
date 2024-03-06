use std::{net::SocketAddr, ops::ControlFlow, sync::Arc, time::Duration};

use axum::{
    extract::{
        connect_info::ConnectInfo,
        ws::{Message, WebSocket, WebSocketUpgrade},
        State,
    },
    response::Response,
};
//allows to split the websocket stream into separate TX and RX branches
use futures::{sink::SinkExt, stream::StreamExt};
//allows to extract the IP of connecting user
use tokio::sync::mpsc;
use tracing::{debug, error};

use super::ApiServer;
use crate::services::{auth::IAuthService, notification::INofitifcationService, IInternalServices};

pub async fn handler<TInternalServices: IInternalServices + 'static>(
    ws: WebSocketUpgrade,
    ConnectInfo(who): ConnectInfo<SocketAddr>,
    State(state): State<Arc<ApiServer<TInternalServices>>>,
) -> Response {
    ws.on_upgrade(move |socket| handle_socket(socket, who, state))
}

async fn handle_socket<TInternalServices: IInternalServices + 'static>(
    socket: WebSocket,
    who: SocketAddr,
    state: Arc<ApiServer<TInternalServices>>,
) {
    let (mut socket_sender, mut socket_receiver) = socket.split();
    let ws_ticket = tokio::select! {
        msg = socket_receiver.next() => {
            if let Some(Ok(Message::Text(ws_ticket))) = msg {
                ws_ticket
            } else {
                debug!("client {} sent an invalid message or abruptly disconnected", who);
                return;
            }
        }
        // close connection when the client is not able to send the websocket ticket within 1s.
        _ = tokio::time::sleep(Duration::from_secs(1)) => {
            debug!("client {} websocket ticket initialized timed out", who);
            return;
        }
    };

    // verify websocket ticket
    let (user, ttl) = if let Ok(Some(user)) = state.services.auth.get_ws_ticket(&ws_ticket).await {
        user
    } else {
        debug!("client {who} sent a bad websocket ticket: {ws_ticket}");
        return;
    };

    let (noti_sender, mut noti_receiver) = mpsc::channel::<String>(64);

    // Spawn a task to listen for notifications
    let mut noti_sender_task = tokio::spawn(async move {
        if let Err(e) = state
            .services
            .notification
            .listen(&format!("to_user_id_{}", user.id), noti_sender)
            .await
        {
            error!("Listener has stopped due to: {e:#}");
        };
    });

    // Spawn a task to receive messages from the sender and send them to the client
    let mut noti_receiver_task = tokio::spawn(async move {
        while let Some(payload) = noti_receiver.recv().await {
            if let Err(e) = socket_sender.send(Message::Text(payload)).await {
                error!("Error sending message: {e:#}");
                return;
            }
        }
    });

    tokio::select! {
        _ = &mut noti_sender_task => {}
        _ = &mut noti_receiver_task => {}
        // close connection when the client exceed ttl
        _ = tokio::time::sleep(Duration::from_secs(ttl)) => {
            debug!("client {} timed out", who);
            return;
        }
        msg = socket_receiver.next() => {
            if let Some(Ok(msg)) = msg {
                process_message(msg, who);
            }
        }
    }
    noti_receiver_task.abort();
    noti_sender_task.abort();
    debug!("websocket context {who} destroyed");
}

fn process_message(msg: Message, who: SocketAddr) -> ControlFlow<(), ()> {
    match msg {
        Message::Text(_) => {}
        Message::Binary(_) => {}
        Message::Close(close_frame) => {
            if let Some(close_frame) = close_frame {
                debug!(
                    ">>> {} sent close with code {} and reason `{}`",
                    who, close_frame.code, close_frame.reason
                );
            } else {
                debug!(">>> {who} somehow sent close message without CloseFrame");
            }
            return ControlFlow::Break(());
        }

        Message::Pong(_) => {}
        Message::Ping(_) => {}
    }
    ControlFlow::Continue(())
}
