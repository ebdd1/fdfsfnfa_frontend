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
  // FIX: Backend now uses JWT user.id — no need to pass seekerId [SEC-001]
  getBySeeker: async (): Promise<WatchlistRecord[]> => {
    const response = await api.get('/watchlist'); // seekerId from JWT automatically
    return response.data;
  },

  // FIX: Backend now uses JWT user.id — seekerId in body is ignored [SEC-001]
  add: async (propertyId: string): Promise<WatchlistRecord> => {
    const response = await api.post('/watchlist', { propertyId }); // seekerId from JWT
    return response.data;
  },

  remove: async (recordId: string): Promise<void> => {
    await api.delete(`/watchlist/${recordId}`);
  },
};

export type { Property };
