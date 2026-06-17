import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { getSocket, joinRealtime, disconnectSocket } from '../services/socket';
import { useToastStore } from '../stores/toastStore';

/**
 * Mount once near the app root. Connects the socket for the logged-in user,
 * joins their rooms, and turns realtime events into React Query invalidations
 * so every dashboard refetches the moment an order or message changes.
 */
export const useRealtime = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Logged out → tear down the socket so the next login starts fresh.
    if (!user?.id) {
      disconnectSocket();
      return;
    }

    const socket = getSocket();
    joinRealtime(user.id, user.role);

    const onOrderUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    };

    const onMessage = () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['admin-conversations'] });
    };

    // Realtime rental notifications: refresh the bell list and pop a toast.
    const onNotification = (payload: { title?: string; body?: string } = {}) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      useToastStore.getState().push({
        variant: 'success',
        title: payload.title || 'Notifikasi baru',
        body: payload.body,
      });
    };

    socket.on('order:update', onOrderUpdate);
    socket.on('message:new', onMessage);
    socket.on('notification:new', onNotification);

    return () => {
      socket.off('order:update', onOrderUpdate);
      socket.off('message:new', onMessage);
      socket.off('notification:new', onNotification);
    };
  }, [user?.id, user?.role, queryClient]);
};
