import api from './axios';
import type { OrderStatus, RentalOrder } from '../../types';

export { type OrderStatus } from '../../types';

export const orderService = {
  create: async (data: { roomId: string; startDate: string; durationMonths: number }): Promise<RentalOrder> => {
    const res = await api.post('/orders', data);
    return res.data;
  },
  mine: async (): Promise<RentalOrder[]> => {
    const res = await api.get('/orders/mine');
    return res.data;
  },
  accept: async (id: string): Promise<RentalOrder> => (await api.patch(`/orders/${id}/accept`)).data,
  reject: async (id: string): Promise<RentalOrder> => (await api.patch(`/orders/${id}/reject`)).data,
  pay: async (id: string): Promise<RentalOrder> => (await api.patch(`/orders/${id}/pay`)).data,
  cancel: async (id: string): Promise<RentalOrder> => (await api.patch(`/orders/${id}/cancel`)).data,
  complete: async (id: string): Promise<RentalOrder> => (await api.patch(`/orders/${id}/complete`)).data,
  // Admin
  all: async (): Promise<RentalOrder[]> => (await api.get('/admin/orders')).data,
};

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Menunggu Persetujuan',
  awaiting_payment: 'Menunggu Pembayaran',
  active: 'Aktif',
  rejected: 'Ditolak',
  cancelled: 'Dibatalkan',
  completed: 'Selesai',
};
