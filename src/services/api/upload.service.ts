import axios from 'axios';
import { useAuthStore } from '../../stores/authStore';

const uploadApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true, // Send httpOnly cookie [F-002]
});

// No manual token — cookie is sent automatically [F-002]
uploadApi.interceptors.request.use((config) => config, (error) => Promise.reject(error));

uploadApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearUser();
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export interface UploadResult {
  url: string;
}

export const uploadService = {
  uploadImage: async (file: File): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await uploadApi.post<UploadResult>('/uploads/image', formData);
    return res.data;
  },
};
