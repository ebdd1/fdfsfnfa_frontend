import api from './axios';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  avatar_url?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt?: string;
}

export interface AdminListing {
  id: string;
  name: string;
  city: string;
  address: string;
  type?: string;
  status: string;
  isVerified: boolean;
  owner?: { id: string; name: string; email: string };
  rooms?: { status: string; priceMonthly: number }[];
  facilities?: string[];
}

export interface AdminStats {
  users: { total: number; seekers: number; owners: number; admins: number };
  properties: { total: number; verified: number; pending: number };
  totalRooms: number;
  totalConversations: number;
  cityBreakdown: Record<string, number>;
  orders: { total: number; active: number; pending: number; revenue: number };
}

export const adminService = {
  listUsers: async (): Promise<AdminUser[]> => {
    const res = await api.get('/admin/users');
    return res.data;
  },
  updateUser: async (id: string, data: Partial<Pick<AdminUser, 'isVerified' | 'isActive' | 'role'>>): Promise<AdminUser> => {
    const res = await api.patch(`/admin/users/${id}`, data);
    return res.data;
  },
  listListings: async (): Promise<AdminListing[]> => {
    const res = await api.get('/admin/listings');
    return res.data;
  },
  updateListing: async (id: string, data: { isVerified?: boolean; status?: string }): Promise<AdminListing> => {
    const res = await api.patch(`/admin/listings/${id}`, data);
    return res.data;
  },
  getStats: async (): Promise<AdminStats> => {
    const res = await api.get('/admin/stats');
    return res.data;
  },
  listConversations: async (): Promise<AdminConversation[]> => {
    const res = await api.get('/admin/conversations');
    return res.data;
  },
  getConversationMessages: async (id: string): Promise<AdminMessage[]> => {
    const res = await api.get(`/admin/conversations/${id}/messages`);
    return res.data;
  },
};

export interface AdminConversationParty {
  id: string;
  name: string;
  avatar_url?: string;
  role?: string;
}

export interface AdminConversation {
  id: string;
  seekerId: string;
  ownerId: string;
  propertyId: string;
  lastMessage?: string;
  unreadCount: number;
  updatedAt?: string;
  seeker?: AdminConversationParty;
  owner?: AdminConversationParty;
  property?: { id: string; name: string; city: string };
  _count?: { messages: number };
}

export interface AdminMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender?: AdminConversationParty;
}
