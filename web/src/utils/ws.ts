import { Notification } from '@/models';

let ws: WebSocket | undefined;

type ReceiveNewNotification = (noti: Notification) => void;

export const connect = (
  ticket: string,
  onReceiving: ReceiveNewNotification
): WebSocket => {
  if (ws) return ws;

  ws = new WebSocket(import.meta.env.VITE_WS_URL);

  ws.addEventListener('open', () => {
    ws?.send(ticket);
  });

  ws.addEventListener('message', event => {
    onReceiving(JSON.parse(event.data as string) as Notification);
  });

  ws.addEventListener('close', () => {
    ws = undefined;
  });

  return ws;
};
export const disconnect = () => {
  if (!ws) return;
  ws.close();
};
