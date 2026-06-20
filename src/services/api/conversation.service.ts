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
  content_type?: string;
  createdAt: string;
  readAt?: string | null;
  deliveredAt?: string | null;
  sender?: any;
  status?: 'sending' | 'sent' | 'failed';
}

export interface OptimisticMessage extends MessageRecord {
  tempId?: string;
  isOptimistic: boolean;
}

export const conversationService = {
  // userId is determined by JWT cookie server-side — not trusted from client [F-010]
  getMyConversations: async (): Promise<ConversationRecord[]> => {
    const response = await api.get('/conversations');
    return response.data;
  },

  // seekerId is forced server-side from JWT — client only sends ownerId + propertyId [F-010]
  create: async (payload: { ownerId: string; propertyId: string }): Promise<ConversationRecord> => {
    const response = await api.post('/conversations', payload);
    return response.data;
  },

  getMessages: async (conversationId: string): Promise<MessageRecord[]> => {
    const response = await api.get(`/conversations/${conversationId}/messages`);
    return response.data;
  },

  // senderId is determined server-side from JWT — body only carries content [F-010]
  sendMessage: async (conversationId: string, payload: { content: string; contentType?: string }): Promise<MessageRecord> => {
    const response = await api.post(`/conversations/${conversationId}/messages`, payload);
    return response.data;
  },

  markRead: async (conversationId: string): Promise<void> => {
    await api.patch(`/conversations/${conversationId}/read`);
  },

  markMessageAsRead: async (conversationId: string, messageId: string): Promise<void> => {
    await api.patch(`/conversations/${conversationId}/messages/${messageId}/read`);
  },
};
