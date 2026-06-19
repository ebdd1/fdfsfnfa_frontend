import React, { useState } from 'react';
import type { Property } from '../../types';
import { Building2, MapPin, Plus, Trash2, X, Check, Loader2 } from 'lucide-react';
import { useUpdateRoomStatus, useAddRooms, useDeleteRoom, useDeleteProperty, useDeletePropertiesBulk } from '../../hooks/useOwnerRooms';
import { ConfirmDialog } from '../admin/adminUi';
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
  const { addRooms, isAdding, pendingPropertyId } = useAddRooms();
  const { deleteRoom, isDeleting, pendingRoomId: deletingRoomId } = useDeleteRoom();
  const { deleteProperty, isDeleting: isDeletingProperty, deletingId } = useDeleteProperty();
  const { deletePropertiesBulk, isBulkDeleting } = useDeletePropertiesBulk();

  // Inline add-room state
  const [addRoomPropertyId, setAddRoomPropertyId] = useState<string | null>(null);
  const [addRoomCount, setAddRoomCount] = useState('1');
  const [addRoomPrice, setAddRoomPrice] = useState('');

  // Selection state (bulk delete)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Confirm dialog state
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'single' | 'bulk'; id?: string; ids?: string[]; name?: string } | null>(null);

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === properties.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(properties.map(p => p.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (!confirmDelete) return;
    const ids = confirmDelete.ids!;
    try {
      await deletePropertiesBulk(ids);
    } finally {
      setConfirmDelete(null);
      setSelectedIds(new Set());
    }
  };

  const handleSingleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteProperty(confirmDelete.id!);
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleAddRoom = async (propertyId: string) => {
    const count = parseInt(addRoomCount);
    const price = parseFloat(addRoomPrice);
    if (!count || count < 1 || !price || price <= 0) return;
    await addRooms({ propertyId, count, priceMonthly: price });
    setAddRoomPropertyId(null);
    setAddRoomCount('1');
    setAddRoomPrice('');
  };

  const handleDeleteRoom = async (propertyId: string, roomId: string) => {
    if (!confirm('Hapus kamar ini?')) return;
    await deleteRoom({ propertyId, roomId });
  };

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
          {/* Bulk delete toolbar */}
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 animate-in fade-in slide-in-from-right-2">
              <span className="text-[12px] font-bold text-rose-700">{selectedIds.size} dipilih</span>
              <button
                onClick={() => setSelectedIds(new Set())}
                className="text-[11px] text-rose-400 hover:text-rose-600 font-bold transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                disabled={isBulkDeleting}
                onClick={() => setConfirmDelete({ type: 'bulk', ids: Array.from(selectedIds) })}
                className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                {isBulkDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                Hapus Terpilih
              </button>
            </div>
          )}

          <button
            onClick={onAddProperty}
            className="bg-emerald-600 text-white font-semibold text-[13px] px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Kost</span>
          </button>
        </div>
      </div>

      {/* Select all row */}
      {properties.length > 1 && (
        <div className="flex items-center gap-2">
          <button
            onClick={handleSelectAll}
            className="text-[12px] font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            {selectedIds.size === properties.length ? 'Batalkan semua' : 'Pilih semua'}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(property => {
          const roomsCount = property.rooms?.length || 0;
          const startingPrice = property.rooms?.length 
            ? Math.min(...property.rooms.map(r => r.price_monthly)) 
            : 0;

          return (
            <div key={property.id} className={`bg-white rounded-[24px] border overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col cursor-pointer relative group
              ${selectedIds.has(property.id) ? 'border-rose-300 ring-2 ring-rose-200' : 'border-slate-100/50'}`}>
              <div className="h-44 bg-slate-100 flex items-center justify-center relative">
                {property.media && property.media.length > 0 ? (
                  <img src={property.media[0].url_medium || property.media[0].url_original} alt={property.name} className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-12 h-12 text-slate-300" />
                )}

                {/* Checkbox (top-left) */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleToggleSelect(property.id); }}
                  className={`absolute top-3 left-3 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer z-10
                    ${selectedIds.has(property.id)
                      ? 'bg-emerald-600 border-emerald-600'
                      : 'bg-white/80 border-slate-300 hover:border-emerald-400'}`}
                >
                  {selectedIds.has(property.id) && <Check className="w-3.5 h-3.5 text-white" />}
                </button>

                {/* Delete button (top-right) */}
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmDelete({ type: 'single', id: property.id, name: property.name }); }}
                  disabled={isDeletingProperty && deletingId === property.id}
                  title="Hapus kost"
                  className="absolute top-3 right-3 w-7 h-7 rounded-xl bg-white/90 backdrop-blur-sm border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:border-rose-300 transition-all opacity-0 group-hover:opacity-100 z-10 cursor-pointer"
                >
                  {isDeletingProperty && deletingId === property.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* Status Badge */}
                <div className={`absolute bottom-3 left-3 px-2.5 py-1 backdrop-blur-md bg-white/90 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5
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
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-medium text-slate-400">Status Kamar</p>
                    <button
                      onClick={() => {
                        // Pre-fill price with lowest existing room price
                        const lowest = property.rooms?.length
                          ? Math.min(...property.rooms.map(r => r.price_monthly))
                          : '';
                        setAddRoomPrice(lowest ? String(lowest) : '');
                        setAddRoomPropertyId(
                          addRoomPropertyId === property.id ? null : property.id
                        );
                      }}
                      className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      Tambah Kamar
                    </button>
                  </div>

                  {/* Inline add-room form */}
                  {addRoomPropertyId === property.id && (
                    <div className="bg-slate-50 rounded-xl p-3 space-y-2 border border-slate-200 animate-in slide-in-from-top-2 duration-150">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          value={addRoomCount}
                          onChange={e => setAddRoomCount(e.target.value)}
                          placeholder="Jumlah"
                          className="w-20 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[12px] font-semibold text-slate-700 outline-none focus:border-emerald-400"
                        />
                        <span className="text-[11px] text-slate-400 font-medium">kamar</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-[11px] text-slate-400 font-medium">Rp</span>
                        <input
                          type="number"
                          value={addRoomPrice}
                          onChange={e => setAddRoomPrice(e.target.value)}
                          placeholder="per bulan"
                          className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[12px] font-semibold text-slate-700 outline-none focus:border-emerald-400"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setAddRoomPropertyId(null)}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <X className="w-3 h-3" /> Batal
                        </button>
                        <button
                          disabled={isAdding && pendingPropertyId === property.id}
                          onClick={() => handleAddRoom(property.id)}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 transition-colors cursor-pointer"
                        >
                          {isAdding && pendingPropertyId === property.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Check className="w-3 h-3" />
                          )}
                          Simpan
                        </button>
                      </div>
                    </div>
                  )}

                  {property.rooms && property.rooms.length > 0 && property.rooms.map(room => (
                    <div key={room.id} className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[12px] font-semibold text-slate-700 truncate">Kamar {room.room_number || '-'}</p>
                        <p className="text-[10px] text-slate-400">{formatPrice(room.price_monthly)}/bln</p>
                      </div>
                      <div className="flex items-center gap-2">
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
                        <button
                          disabled={(isDeleting && deletingRoomId === room.id) || room.status === 'occupied'}
                          onClick={() => handleDeleteRoom(property.id, room.id)}
                          title={room.status === 'occupied' ? 'Kamar terisi, tidak bisa dihapus' : 'Hapus kamar'}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            room.status === 'occupied'
                              ? 'text-slate-200 cursor-not-allowed'
                              : 'text-rose-400 hover:bg-rose-50 hover:text-rose-600'
                          }`}
                        >
                          {isDeleting && deletingRoomId === room.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}

                  {(!property.rooms || property.rooms.length === 0) && (
                    <p className="text-[11px] text-slate-400 italic text-center py-2">Belum ada kamar.</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Confirm dialogs */}
      <ConfirmDialog
        open={confirmDelete !== null}
        tone="rose"
        title={confirmDelete?.type === 'bulk' ? 'Hapus Kost Terpilih' : 'Hapus Kost'}
        message={
          confirmDelete?.type === 'bulk'
            ? <>Yakin ingin menghapus <strong>{confirmDelete.ids?.length} kost</strong> ini? Semua kamar dan data terkait akan ikut dihapus. Tindakan ini tidak dapat dibatalkan.</>
            : <>Yakin ingin menghapus kost <strong>"{confirmDelete?.name}"</strong>? Semua kamar dan data terkait akan ikut dihapus. Tindakan ini tidak dapat dibatalkan.</>
        }
        confirmLabel={confirmDelete?.type === 'bulk' ? (isBulkDeleting ? 'Menghapus...' : 'Ya, Hapus Semua') : (isDeletingProperty ? 'Menghapus...' : 'Ya, Hapus Kost')}
        loading={confirmDelete?.type === 'bulk' ? isBulkDeleting : isDeletingProperty}
        onConfirm={confirmDelete?.type === 'bulk' ? handleBulkDelete : handleSingleDelete}
        onClose={() => setConfirmDelete(null)}
      />
    </div>
  );
};
