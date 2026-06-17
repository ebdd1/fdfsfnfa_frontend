import api from './axios';

export type RoomStatus = 'available' | 'occupied' | 'renovation';

export const ownerService = {
  updateRoomStatus: async (roomId: string, status: RoomStatus) => {
    const res = await api.put(`/owner/rooms/${roomId}/status`, { status });
    return res.data;
  },
};
