import axios from 'axios';
import { useAuthStore } from '../../stores/authStore';

const uploadApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

uploadApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Do NOT set Content-Type — axios will set multipart/form-data + boundary automatically
  return config;
});

uploadApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
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
