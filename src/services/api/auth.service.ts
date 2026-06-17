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

  updateMe: async (data: { name?: string; phone?: string; avatar_url?: string; banner_url?: string }) => {
    const response = await api.patch('/auth/me', data);
    return response.data;
  },
};
