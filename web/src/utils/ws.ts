let ws: WebSocket | undefined;

export const connect = (): WebSocket => {
  if (ws) return ws;

  ws = new WebSocket(import.meta.env.VITE_WS_URL);

  ws.addEventListener('open', () => {});

  ws.addEventListener('message', () => {});

  ws.addEventListener('close', () => {
    ws = undefined;
  });

  return ws;
};
