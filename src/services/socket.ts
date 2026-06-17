import { io, type Socket } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

let socket: Socket | null = null;
let joinHandler: (() => void) | null = null;

/** Get (or lazily create) the shared socket connection. */
export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(API_URL, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
};

/** Join personal + role rooms so the server can target this user. */
export const joinRealtime = (userId: string, role: string) => {
  const s = getSocket();
  // Replace any previous join handler so re-runs don't stack listeners.
  if (joinHandler) s.off('connect', joinHandler);
  joinHandler = () => s.emit('join', { userId, role });
  if (s.connected) joinHandler();
  s.on('connect', joinHandler); // re-join after reconnects
};

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
  joinHandler = null;
};

/** Notify the other participant that the current user is typing (or stopped). */
export const emitTyping = (payload: {
  conversationId: string;
  toUserId: string;
  fromUserId: string;
  fromName: string;
  isTyping: boolean;
}) => {
  getSocket().emit('typing', payload);
};
