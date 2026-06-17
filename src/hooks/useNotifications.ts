import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/api/notification.service';
import { useAuthStore } from '../stores/authStore';

export const useNotifications = () => {
  const { user } = useAuthStore();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationService.mine,
    enabled: !!user?.id,
  });

  const markRead = useMutation({
    mutationFn: notificationService.markRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAllRead = useMutation({
    mutationFn: notificationService.markAllRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const notifications = query.data || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    isLoading: query.isLoading,
    markRead: markRead.mutate,
    markAllRead: markAllRead.mutate,
  };
};
