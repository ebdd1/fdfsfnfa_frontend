import axios from 'axios';
import { useAuthStore } from '../../stores/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true, // Send httpOnly cookie on every request [F-002]
  headers: {
    'Content-Type': 'application/json',
  },
});

// No request interceptor needed — token lives in httpOnly cookie, not in JS [F-002]
api.interceptors.request.use((config) => config, (error) => Promise.reject(error));

// Response interceptor: on 401, clear user state and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearUser();
      // Don't redirect if already on login/register page to avoid redirect loops
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
