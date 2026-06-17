import api from './axios';
import type { Property } from '../../types';

// A watchlist record as returned by GET /watchlist (includes the joined property)
export interface WatchlistRecord {
  id: string;
  seekerId: string;
  propertyId: string;
  property?: any;
}

export const watchlistService = {
  getBySeeker: async (seekerId: string): Promise<WatchlistRecord[]> => {
    const response = await api.get('/watchlist', { params: { seekerId } });
    return response.data;
  },

  add: async (seekerId: string, propertyId: string): Promise<WatchlistRecord> => {
    const response = await api.post('/watchlist', { seekerId, propertyId });
    return response.data;
  },

  remove: async (recordId: string): Promise<void> => {
    await api.delete(`/watchlist/${recordId}`);
  },
};

export type { Property };
