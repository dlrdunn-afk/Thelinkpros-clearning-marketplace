import { io as Client, Socket } from 'socket.io-client';

let socket: Socket | null = null;

// Client-side usage (Next.js Client Component via RealtimeProvider)
export function getClientSocket(): Socket {
  if (!socket) {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_IO_URL || 'http://localhost:3001';
    socket = Client(socketUrl, {
      transports: ['websocket'],
    });
  }
  return socket;
}

// Server-side emitter (Server Actions) via socket.io-client
export async function emitRealtimeEvent(event: string, payload: unknown) {
  const serverUrl = process.env.SOCKET_IO_SERVER_URL || 'http://localhost:3001';
  const authToken = process.env.SOCKET_IO_AUTH_TOKEN || 'demo-token';
  
  if (!serverUrl || !authToken) {
    console.log('Socket.io not configured, skipping real-time event:', event);
    return;
  }
  
  // For serverless reliability, emit via short-lived connection
  const s = Client(serverUrl, {
    transports: ['websocket'],
    extraHeaders: { Authorization: `Bearer ${authToken}` },
    reconnection: false,
    timeout: 3000,
  });
  await new Promise<void>((resolve) => {
    s.on('connect', () => {
      s.emit(event, payload);
      s.disconnect();
      resolve();
    });
    s.on('connect_error', () => {
      console.log('Socket.io connection failed, continuing without real-time updates');
      resolve();
    }); // swallow errors
  });
}
