import React from 'react';
import type { Property } from '../../types';
import { Building2, MapPin, Plus } from 'lucide-react';
import { useUpdateRoomStatus } from '../../hooks/useOwnerRooms';
import type { RoomStatus } from '../../services/api/owner.service';

interface PropertiesListProps {
  properties: Property[];
  onAddProperty: () => void;
  formatPrice: (price: number) => string;
}

export const PropertiesList: React.FC<PropertiesListProps> = ({
  properties,
  onAddProperty,
  formatPrice
}) => {
  const { updateRoomStatus, isUpdating, pendingRoomId } = useUpdateRoomStatus();
  if (properties.length === 0) {
    return (
      <div className="bg-white rounded-[24px] border border-slate-100/50 p-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <Building2 className="w-8 h-8 text-slate-300" />
        </div>
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Belum Ada Kost</h2>
        <p className="text-[13px] text-slate-500 max-w-md mx-auto mb-8 font-medium">
          Anda belum menambahkan kost. Tambahkan kost pertama Anda untuk mulai mengelola penyewa dan mencatat pendapatan.
        </p>
        <button 
          onClick={onAddProperty}
          className="bg-emerald-600 text-white font-semibold text-[13px] px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kost Pertama</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Manajemen Kost</h2>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onAddProperty}
            className="bg-emerald-600 text-white font-semibold text-[13px] px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Kost</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(property => {
          const roomsCount = property.rooms?.length || 0;
          const startingPrice = property.rooms?.length 
            ? Math.min(...property.rooms.map(r => r.price_monthly)) 
            : 0;

          return (
            <div key={property.id} className="bg-white rounded-[24px] border border-slate-100/50 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] transition-all duration-300 group flex flex-col cursor-pointer">
              <div className="h-44 bg-slate-100 flex items-center justify-center relative">
                {property.media && property.media.length > 0 ? (
                  <img src={property.media[0].url_medium || property.media[0].url_original} alt={property.name} className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-12 h-12 text-slate-300" />
                )}
                
                {/* Status Badge */}
                <div className={`absolute top-4 left-4 px-2.5 py-1 backdrop-blur-md bg-white/90 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5
                  ${property.is_verified ? 'text-emerald-700' : 'text-amber-700'}
                `}>
                  <div className={`w-1.5 h-1.5 rounded-full ${property.is_verified ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                  {property.is_verified ? 'Terverifikasi' : 'Menunggu'}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="font-semibold text-slate-800 text-[16px] leading-tight mb-1.5">{property.name}</h3>
                  <div className="flex items-center gap-1.5 text-slate-500 text-[12px] font-medium">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{property.location?.city || '-'}</span>
                  </div>
                </div>
                
                <div className="mt-auto pt-5 border-t border-slate-100 flex items-end justify-between">
                  <div>
                    <p className="text-[11px] font-medium text-slate-400 mb-0.5">Inventori Kamar</p>
                    <p className="text-[14px] font-semibold text-slate-700">{roomsCount} Terdaftar</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-medium text-slate-400 mb-0.5">Harga Mulai</p>
                    <p className="text-[15px] font-bold text-slate-800 tracking-tight">
                      {startingPrice > 0 ? formatPrice(startingPrice) : '-'}
                    </p>
                  </div>
                </div>

                {/* Room status management */}
                {property.rooms && property.rooms.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                    <p className="text-[11px] font-medium text-slate-400">Status Kamar</p>
                    {property.rooms.map(room => (
                      <div key={room.id} className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[12px] font-semibold text-slate-700 truncate">Kamar {room.room_number || '-'}</p>
                          <p className="text-[10px] text-slate-400">{formatPrice(room.price_monthly)}/bln</p>
                        </div>
                        <select
                          value={room.status}
                          disabled={isUpdating && pendingRoomId === room.id}
                          onChange={(e) => updateRoomStatus({ roomId: room.id, status: e.target.value as RoomStatus })}
                          className={`text-[11px] font-bold rounded-lg border px-2 py-1 outline-none cursor-pointer transition-colors disabled:opacity-50 ${
                            room.status === 'available'
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                              : room.status === 'occupied'
                                ? 'border-blue-200 bg-blue-50 text-blue-700'
                                : 'border-amber-200 bg-amber-50 text-amber-700'
                          }`}
                        >
                          <option value="available">Tersedia</option>
                          <option value="occupied">Terisi</option>
                          <option value="renovation">Renovasi</option>
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
