import api from './axios';

export interface NotificationRecord {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  orderId: string | null;
  isRead: boolean;
  createdAt: string;
}

export const notificationService = {
  mine: async (): Promise<NotificationRecord[]> => (await api.get('/notifications')).data,
  markRead: async (id: string): Promise<void> => {
    await api.patch(`/notifications/${id}/read`);
  },
  markAllRead: async (): Promise<void> => {
    await api.patch('/notifications/read-all');
  },
};
