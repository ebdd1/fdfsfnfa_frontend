import api from './axios';
import type { Property } from '../../types';

// Adapter to map backend API response to frontend Property interface
const adaptProperty = (raw: any): Property => {
  return {
    id: raw.id,
    owner_id: raw.ownerId,
    owner: raw.owner,
    name: raw.name,
    type: raw.type || 'kost_campur',
    location: {
      address: raw.address,
      city: raw.city,
      latitude: raw.lat,
      longitude: raw.lng,
    },
    facilities: raw.facilities || [],
    description: raw.description || '',
    is_verified: raw.is_verified ?? raw.isVerified ?? true,
    media: raw.media || [],
    rooms: (raw.rooms || []).map((r: any) => ({
      id: r.id || Math.random().toString(),
      property_id: raw.id,
      room_number: r.roomNumber || r.room_number || '',
      price_monthly: r.priceMonthly || r.price_monthly || 0,
      status: r.status || 'available',
      facilities: r.facilities || []
    }))
  };
};

export const propertyService = {
  getAll: async (params?: any): Promise<{ data: Property[], meta: any }> => {
    const response = await api.get('/listings', { params });
    const mappedData = response.data.data.map(adaptProperty);
    return { data: mappedData, meta: response.data.meta };
  },

  getById: async (id: string): Promise<Property> => {
    const response = await api.get(`/listings/${id}`);
    return adaptProperty(response.data);
  },

  create: async (data: Partial<Property>): Promise<Property> => {
    const response = await api.post('/listings', data);
    return adaptProperty(response.data);
  },

  addMedia: async (propertyId: string, urls: string[]) => {
    const response = await api.post(`/listings/${propertyId}/media`, { urls });
    return response.data;
  },

  getRooms: async (propertyId: string) => {
    const response = await api.get(`/listings/${propertyId}/rooms`);
    return response.data;
  }
};
