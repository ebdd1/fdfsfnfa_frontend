import api from './axios';

export interface ConversationRecord {
  id: string;
  seekerId: string;
  ownerId: string;
  propertyId: string;
  lastMessage?: string;
  unreadCount: number;
  seeker?: any;
  owner?: any;
  property?: any;
}

export interface MessageRecord {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender?: any;
}

export const conversationService = {
  getByUser: async (userId: string): Promise<ConversationRecord[]> => {
    const response = await api.get('/conversations', { params: { userId } });
    return response.data;
  },

  create: async (payload: { seekerId: string; ownerId: string; propertyId: string }): Promise<ConversationRecord> => {
    const response = await api.post('/conversations', payload);
    return response.data;
  },

  getMessages: async (conversationId: string): Promise<MessageRecord[]> => {
    const response = await api.get(`/conversations/${conversationId}/messages`);
    return response.data;
  },

  sendMessage: async (conversationId: string, payload: { senderId: string; content: string }): Promise<MessageRecord> => {
    const response = await api.post(`/conversations/${conversationId}/messages`, payload);
    return response.data;
  },

  markRead: async (conversationId: string): Promise<void> => {
    await api.patch(`/conversations/${conversationId}/read`);
  },
};
