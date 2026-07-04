import React, { useState } from 'react';
import type { Property, Room } from '../../types';
import { Building2, MapPin, Plus, Trash2, Check, Loader2, Search, MoreVertical, DoorOpen, Users, Key } from 'lucide-react';
import { useUpdateRoomStatus, useAddRooms, useDeleteProperty } from '../../hooks/useOwnerRooms';
import { ConfirmDialog } from '../admin/adminUi';

interface PropertiesListProps {
  properties: Property[];
  onAddProperty: () => void;
  formatPrice: (price: number) => string;
}

type FilterType = 'all' | 'available' | 'occupied' | 'renovation';

export const PropertiesList: React.FC<PropertiesListProps> = ({
  properties,
  onAddProperty,
  formatPrice
}) => {
  const { updateRoomStatus, isUpdating, pendingRoomId } = useUpdateRoomStatus();
  const { addRooms, isAdding, pendingPropertyId } = useAddRooms();
  const { deleteProperty, isDeleting: isDeletingProperty, deletingId } = useDeleteProperty();

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Confirm dialog state
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'property' | 'room'; propertyId?: string; roomId?: string; name: string } | null>(null);

  // Inline add-room state
  const [addRoomPropertyId, setAddRoomPropertyId] = useState<string | null>(null);
  const [addRoomCount, setAddRoomCount] = useState('1');
  const [addRoomPrice, setAddRoomPrice] = useState('');

  // Filter rooms based on search and filter
  const getFilteredRooms = (rooms: Room[], query: string, filter: FilterType) => {
    return rooms.filter(room => {
      const matchesSearch = query === '' ||
        (room.room_number?.toLowerCase().includes(query.toLowerCase()));
      const matchesFilter = filter === 'all' || room.status === filter;
      return matchesSearch && matchesFilter;
    });
  };

  // Get status badge styles
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'occupied':
        return { bg: 'bg-secondary-container', text: 'text-on-secondary-container', dot: 'bg-secondary', label: 'Terisi' };
      case 'available':
        return { bg: 'bg-tertiary-container', text: 'text-on-tertiary-container', dot: 'bg-tertiary', label: 'Tersedia' };
      case 'renovation':
        return { bg: 'bg-error-container', text: 'text-on-error-container', dot: 'bg-error', label: 'Perbaikan' };
      default:
        return { bg: 'bg-surface-container', text: 'text-on-surface', dot: 'bg-outline', label: status };
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDeleteProperty = async () => {
    if (!confirmDelete || confirmDelete.type !== 'property') return;
    try {
      await deleteProperty(confirmDelete.propertyId!);
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

  if (properties.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl p-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-300 shadow-level-1 border border-outline-variant">
        <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-6">
          <Building2 className="w-8 h-8 text-on-surface-variant" />
        </div>
        <h2 className="font-headline text-[20px] font-semibold text-on-surface mb-2">Belum Ada Kost</h2>
        <p className="font-body text-[14px] text-on-surface-variant max-w-sm mx-auto mb-8">
          Tambahkan kost pertama Anda untuk mulai mengelola kamar dan melihat analytics.
        </p>
        <button onClick={onAddProperty} className="bg-primary text-on-primary font-label text-[14px] font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-level-1 flex items-center gap-2 cursor-pointer">
          <Plus className="w-5 h-5" />
          <span>Tambah Kost
        </span>
        </button>
      </div>
    );
  }

  // Global stats
  const allRooms = properties.flatMap(p => p.rooms || []);
  const totalUnits = allRooms.length;
  const totalOccupied = allRooms.filter(r => r.status === 'occupied').length;
  const totalAvailable = allRooms.filter(r => r.status === 'available').length;
  const globalOccupancyRate = totalUnits > 0 ? Math.round((totalOccupied / totalUnits) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="font-headline text-[24px] font-semibold text-on-surface tracking-tight">Manajemen Kost</h2>
        <button onClick={onAddProperty} className="bg-primary text-on-primary font-label text-[14px] font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors shadow-level-1 flex items-center gap-2 cursor-pointer self-start">
          <Plus className="w-4 h-4" />
          <span>Tambah Kost</span>
        </button>
      </div>

      {/* Global Metrics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-level-1 border border-outline-variant">
          <div className="flex justify-between items-start mb-3">
            <span className="font-label text-[12px] font-semibold text-on-surface-variant uppercase tracking-wide">Total Unit</span>
            <div className="bg-primary-container p-2 rounded-xl text-on-primary-container">
              <DoorOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="font-headline text-[32px] font-bold text-on-surface tracking-tight">{totalUnits}</div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-level-1 border border-outline-variant relative overflow-hidden">
          <div className="absolute inset-0 bg-surface-variant/10 pointer-events-none" />
          <div className="flex justify-between items-start mb-3 relative z-10">
            <span className="font-label text-[12px] font-semibold text-on-surface-variant uppercase tracking-wide">Terisi</span>
            <div className="bg-secondary-container p-2 rounded-xl text-on-secondary-container">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-end gap-2 relative z-10">
            <span className="font-headline text-[32px] font-bold text-on-surface tracking-tight">{totalOccupied}</span>
            <span className="font-body text-[14px] text-secondary font-medium mb-1">({globalOccupancyRate}%)</span>
          </div>
          <div className="w-full bg-surface-container-high h-2 rounded-full mt-3 overflow-hidden relative z-10">
            <div className="bg-secondary h-full rounded-full" style={{ width: `${globalOccupancyRate}%` }} />
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-level-1 border border-outline-variant">
          <div className="flex justify-between items-start mb-3">
            <span className="font-label text-[12px] font-semibold text-on-surface-variant uppercase tracking-wide">Tersedia</span>
            <div className="bg-tertiary-container p-2 rounded-xl text-on-tertiary-container">
              <Key className="w-5 h-5" />
            </div>
          </div>
          <div className="font-headline text-[32px] font-bold text-on-surface tracking-tight">{totalAvailable}</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-level-1 border border-outline-variant flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari unit..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface rounded-xl border-none focus:ring-2 focus:ring-primary font-body text-[14px] text-on-surface placeholder:text-outline outline-none"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {(['all', 'available', 'occupied', 'renovation'] as FilterType[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full font-label text-[12px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === filter
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface text-on-surface border border-outline-variant hover:bg-surface-container'
              }`}
            >
              {filter === 'all' ? 'Semua' : filter === 'available' ? 'Tersedia' : filter === 'occupied' ? 'Terisi' : 'Perbaikan'}
            </button>
          ))}
        </div>
      </div>

      {/* Properties with Rooms */}
      <div className="space-y-8">
        {properties.map(property => {
          const filteredRooms = getFilteredRooms(property.rooms || [], searchQuery, activeFilter);
          if (activeFilter !== 'all' && filteredRooms.length === 0 && searchQuery === '') return null;

          return (
            <div key={property.id} className="space-y-4">
              {/* Property Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-headline text-[20px] md:text-[24px] font-semibold text-on-surface">{property.name}</h3>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      property.is_verified ? 'bg-primary-fixed-dim text-primary' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {property.is_verified ? 'Terverifikasi' : 'Menunggu'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant font-body text-[14px]">
                    <MapPin className="w-4 h-4" />
                    <span>{property.location?.city || '-'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleSelect(property.id)}
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                      selectedIds.has(property.id) ? 'bg-primary border-primary text-on-primary' : 'bg-surface border-outline-variant text-outline hover:border-primary hover:text-primary'
                    }`}
                  >
                    {selectedIds.has(property.id) ? <Check className="w-5 h-5" /> : <div className="w-2.5 h-2.5 rounded-full border-2 border-current" />}
                  </button>
                  <button
                    onClick={() => setConfirmDelete({ type: 'property', propertyId: property.id, name: property.name })}
                    disabled={isDeletingProperty && deletingId === property.id}
                    className="w-10 h-10 rounded-xl bg-surface border border-outline-variant flex items-center justify-center text-outline hover:text-error hover:border-error transition-colors cursor-pointer"
                  >
                    {isDeletingProperty && deletingId === property.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      const lowest = property.rooms?.length ? Math.min(...property.rooms.map(r => r.price_monthly)) : '';
                      setAddRoomPrice(lowest ? String(lowest) : '');
                      setAddRoomPropertyId(addRoomPropertyId === property.id ? null : property.id);
                    }}
                    className="bg-primary text-on-primary font-label text-[14px] font-semibold px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors shadow-level-1 flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Unit
                  </button>
                </div>
              </div>

              {/* Inline Add Room Form */}
              {addRoomPropertyId === property.id && (
                <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant animate-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center gap-3 flex-wrap">
                    <input type="number" min="1" value={addRoomCount} onChange={e => setAddRoomCount(e.target.value)} placeholder="Jumlah"
                      className="w-20 px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-[14px] font-semibold text-on-surface outline-none focus:border-primary" />
                    <span className="font-body text-[12px] text-outline">kamar</span>
                    <span className="font-body text-[12px] text-outline">Rp</span>
                    <input type="number" value={addRoomPrice} onChange={e => setAddRoomPrice(e.target.value)} placeholder="per bulan"
                      className="flex-1 min-w-[120px] px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-[14px] font-semibold text-on-surface outline-none focus:border-primary" />
                    <div className="flex gap-2 ml-auto">
                      <button onClick={() => { setAddRoomPropertyId(null); setAddRoomCount('1'); setAddRoomPrice(''); }}
                        className="px-4 py-2 rounded-xl font-label text-[12px] font-bold bg-surface border border-outline-variant text-outline hover:bg-surface-container transition-colors cursor-pointer">
                        Batal
                      </button>
                      <button disabled={isAdding && pendingPropertyId === property.id} onClick={() => handleAddRoom(property.id)}
                        className="px-4 py-2 rounded-xl font-label text-[12px] font-bold bg-primary text-on-primary hover:bg-primary/90 disabled:bg-primary/50 transition-colors cursor-pointer flex items-center gap-2">
                        {isAdding && pendingPropertyId === property.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        Simpan
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Unit Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRooms.map(room => {
                  const status = getStatusBadge(room.status);
                  return (
                    <div key={room.id} className="bg-surface-container-lowest rounded-2xl shadow-level-1 overflow-hidden hover:shadow-level-2 transition-all duration-300 flex flex-col">
                      {/* Room Status Header */}
                      <div className="p-4 flex justify-between items-center bg-surface-container">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center">
                            <span className="font-headline text-[18px] font-bold text-primary">{room.room_number || '-'}</span>
                          </div>
                          <div>
                            <h4 className="font-label text-[14px] font-semibold text-on-surface">{property.type || 'Kost'}</h4>
                            <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full mt-1 ${status.bg} ${status.text}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                              {status.label}
                            </span>
                          </div>
                        </div>
                        <button className="w-9 h-9 rounded-lg bg-surface-container-low border border-outline-variant flex items-center justify-center text-outline hover:text-on-surface transition-colors cursor-pointer">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Room Info */}
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="mb-4">
                          <span className="font-headline text-[18px] font-bold text-primary">
                            {formatPrice(room.price_monthly || 0)}
                            <span className="text-[12px] font-body text-on-surface-variant font-normal">/bln</span>
                          </span>
                        </div>

                        {/* Facilities */}
                        {room.facilities && room.facilities.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {room.facilities.slice(0, 4).map((facility, idx) => (
                              <span key={idx} className="text-[10px] font-label px-2 py-1 bg-surface rounded text-outline">{facility}</span>
                            ))}
                            {room.facilities.length > 4 && (
                              <span className="text-[10px] font-label text-outline">+{room.facilities.length - 4}</span>
                            )}
                          </div>
                        )}

                        <div className="mt-auto pt-3 border-t border-outline-variant">
                          <select
                            value={room.status}
                            disabled={isUpdating && pendingRoomId === room.id}
                            onChange={(e) => updateRoomStatus({ roomId: room.id, status: e.target.value as 'available' | 'occupied' | 'renovation' })}
                            className={`w-full text-[12px] font-bold rounded-lg border px-3 py-2 outline-none cursor-pointer transition-colors disabled:opacity-50 ${
                              room.status === 'available' ? 'bg-tertiary-container text-on-tertiary-container border-tertiary/30' :
                              room.status === 'occupied' ? 'bg-secondary-container text-on-secondary-container border-secondary/30' :
                              'bg-error-container text-on-error-container border-error/30'
                            }`}
                          >
                            <option value="available">Tersedia</option>
                            <option value="occupied">Terisi</option>
                            <option value="renovation">Perbaikan</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredRooms.length === 0 && (
                  <div className="col-span-full bg-surface-container-lowest rounded-2xl p-8 text-center">
                    <p className="font-body text-[14px] text-on-surface-variant">
                      {searchQuery ? `Tidak ada kamar yang cocok dengan "${searchQuery}"` : 'Tidak ada kamar dengan filter ini'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDelete !== null}
        tone="rose"
        title="Hapus Kost"
        message={<>
          Yakin ingin menghapus kost <strong>"{confirmDelete?.name}"</strong>? Semua kamar dan data terkait akan ikut dihapus. Tindakan ini tidak dapat dibatalkan.
        </>}
        confirmLabel={isDeletingProperty ? 'Menghapus...' : 'Ya, Hapus'}
        loading={isDeletingProperty}
        onConfirm={handleDeleteProperty}
        onClose={() => setConfirmDelete(null)}
      />
    </div>
  );
};
