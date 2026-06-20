import api from './axios';

export interface LoginRequestPayload {
  email: string;
  password?: string;
}

export interface RegisterRequestPayload {
  name: string;
  email: string;
  password?: string;
  phone: string;
  role: 'seeker' | 'owner';
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'seeker' | 'owner' | 'admin';
    phone?: string;
    avatar_url?: string;
    banner_url?: string;
    is_verified?: boolean;
    bankName?: string;
    bankAccountNumber?: string;
    bankAccountHolder?: string;
  };
}

export const authService = {
  login: async (data: LoginRequestPayload): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequestPayload): Promise<LoginResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Logout: hit server to invalidate token [F-009]
  logout: async () => {
    await api.post('/auth/logout');
  },

  updateMe: async (data: {
    name?: string;
    phone?: string;
    avatar_url?: string;
    banner_url?: string;
    bankName?: string;
    bankAccountNumber?: string;
    bankAccountHolder?: string;
  }) => {
    // Whitelist only safe fields — prevent privilege escalation [F-004, F-015]
    const ALLOWED = ['name', 'phone', 'avatar_url', 'banner_url', 'bankName', 'bankAccountNumber', 'bankAccountHolder'] as const;
    const safe: Record<string, string> = {};
    for (const key of ALLOWED) {
      if (data[key] !== undefined) safe[key] = data[key]!;
    }
    const response = await api.patch('/auth/me', safe);
    return response.data;
  },
};
