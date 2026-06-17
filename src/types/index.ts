export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'seeker' | 'owner' | 'admin';
  is_verified: boolean;
  avatar_url: string;
  banner_url?: string;
}

export interface Media {
  id: string;
  url_original: string;
  url_medium: string;
  url_thumbnail: string;
  latitude?: number;
  longitude?: number;
  captured_at?: string;
}

export interface Room {
  id: string;
  property_id: string;
  room_number: string;
  price_monthly: number;
  status: 'available' | 'occupied' | 'renovation';
  facilities: string[];
}

export interface Property {
  id: string;
  owner_id: string;
  owner?: User;
  name: string;
  type: 'kost_putra' | 'kost_putri' | 'kost_campur' | 'apartment';
  location: {
    address: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  facilities: string[];
  description: string;
  is_verified?: boolean;
  media: Media[];
  rooms: Room[];
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content_type: 'text' | 'image' | 'location';
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  seeker_id: string;
  owner_id: string;
  owner?: User;
  seeker?: User;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface SmartAlert {
  id: string;
  name: string;
  search_params: {
    city?: string;
    type?: string;
    min_price?: number;
    max_price?: number;
    facilities?: string[];
  };
  is_active: boolean;
  notification_frequency: 'instant' | 'daily' | 'weekly';
}

export type OrderStatus = 'pending' | 'awaiting_payment' | 'active' | 'rejected' | 'cancelled' | 'completed';

export interface OrderParty {
  id: string;
  name: string;
  avatar_url?: string;
  phone?: string;
}

export interface RentalOrder {
  id: string;
  seekerId: string;
  ownerId: string;
  propertyId: string;
  roomId: string;
  status: OrderStatus;
  startDate: string;
  durationMonths: number;
  priceMonthly: number;
  totalAmount: number;
  paidAt?: string | null;
  createdAt: string;
  seeker?: OrderParty;
  owner?: OrderParty;
  property?: { id: string; name: string; city: string; address: string };
  room?: { id: string; roomNumber: string; priceMonthly: number; status: string };
}
