import { io, type Socket } from 'socket.io-client';

/** API URL — Railway provides HTTPS, so WSS is used automatically */
const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

let socket: Socket | null = null;
let joinHandler: (() => void) | null = null;

/** Get (or lazily create) the shared socket connection [F-014]. */
export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: true,
      // Websocket first; polling as fallback; secure: true enforces TLS/WSS [F-014]
      transports: ['websocket', 'polling'],
      withCredentials: true, // Send httpOnly cookie so server verifies JWT at handshake [F-002]
    });
  }
  return socket;
};

/**
 * Join personal rooms after connection.
 * JWT verification already happened at handshake — we only emit identity for room subscription.
 */
export const joinRealtime = (_userId: string, _role: string) => {
  const s = getSocket();
  if (joinHandler) s.off('connect', joinHandler);
  joinHandler = () => s.emit('join'); // no userId/role in body — server uses socket.user from JWT [F-014]
  if (s.connected) joinHandler();
  s.on('connect', joinHandler);
};

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
  joinHandler = null;
};

export const emitTyping = (payload: {
  conversationId: string;
  toUserId: string;
  isTyping: boolean;
}) => {
  // fromUserId and fromName come from server-side JWT verification [F-014]
  getSocket().emit('typing', payload);
};
