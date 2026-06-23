import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Building2, Building, MapPin, Percent, Plus, Calendar, MoreHorizontal, Wallet } from 'lucide-react';
import type { Property, Room } from '../../types';

interface OverviewProps {
  ownerProperties: Property[];
  rooms: Room[];
  totalRoomsCount: number;
  occupancyRate: number;
  occupiedCount: number;
  totalRevenue: number;
  renovationCount: number;
  formatPrice: (price: number) => string;
  onOpenAddProperty: () => void;
  onOpenEditProperty?: () => void;
  onNavigateToManage: (propertyId: string) => void;
}

export const Overview: React.FC<OverviewProps> = ({
  ownerProperties,
  rooms,
  totalRoomsCount,
  occupancyRate,
  occupiedCount,
  totalRevenue,
  renovationCount,
  formatPrice,
  onOpenAddProperty,
  onNavigateToManage
}) => {
  const { user } = useAuthStore();
  const currentDate = new Date().toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* Hero: banner cover + greeting in one clean block */}
      <div className="rounded-[24px] overflow-hidden border border-slate-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] bg-white">
        {/* Banner strip */}
        <div className="h-24 w-full bg-gradient-to-r from-[var(--primary-500)] to-teal-500">
          {user?.banner_url && <img src={user.banner_url} alt="Banner" className="h-full w-full object-cover" />}
        </div>

        {/* Greeting row with overlapping avatar */}
        <div className="relative px-6 pb-5">
          {/* Avatar overlapping the banner */}
          <div className="absolute -top-8 left-6">
            <div className="w-16 h-16 rounded-2xl border-4 border-white bg-[var(--primary-100)] overflow-hidden shadow-lg">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--primary-600)] font-black text-xl">
                  {(user?.name || 'P')[0].toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-10">
            <div>
              <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">Selamat Datang, {user?.name || 'Pemilik'}</h1>
              <p className="text-[13px] text-slate-500 mt-1">Pantau dan kelola portofolio kost Anda hari ini untuk kesehatan finansial.</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl text-[13px] font-medium text-slate-600 border border-slate-100 shrink-0 self-start md:self-auto">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{currentDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid - Oripio Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Balance Card */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-slate-600 font-medium text-[13px]">
              <div className="bg-[var(--primary-50)] p-1.5 rounded-lg">
                <Wallet className="w-4 h-4 text-[var(--primary-600)]" />
              </div>
              <span>Total Pendapatan</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-medium bg-slate-50 px-2 py-1 rounded-md text-slate-500 cursor-pointer hover:bg-slate-100">
              IDR <span className="text-slate-400 ml-1">▼</span>
            </div>
          </div>
          <div className="mb-3">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{formatPrice(totalRevenue)}</h2>
          </div>
          <div className="flex items-center gap-2 text-[12px]">
            <span className="flex items-center gap-0.5 bg-[var(--primary-50)] text-[var(--primary-600)] px-1.5 py-0.5 rounded-md font-medium">
              {occupiedCount} kamar terisi
            </span>
            <span className="text-slate-400">menghasilkan pendapatan</span>
          </div>
        </div>

        {/* Expenses/Occupancy Card */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-slate-600 font-medium text-[13px]">
              <div className="bg-[var(--primary-50)] p-1.5 rounded-lg">
                <Building2 className="w-4 h-4 text-[var(--primary-600)]" />
              </div>
              <span>Okupansi Kost</span>
            </div>
            <button className="text-slate-400 hover:bg-slate-50 p-1 rounded-md cursor-pointer">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <div className="mb-3">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{occupancyRate.toFixed(0)}%</h2>
          </div>
          <div className="flex items-center gap-2 text-[12px]">
            <span className="flex items-center gap-0.5 bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded-md font-medium">
              {occupiedCount} / {totalRoomsCount} kamar
            </span>
            <span className="text-slate-400">terisi saat ini</span>
          </div>
        </div>

        {/* Savings/Rooms Card */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-slate-600 font-medium text-[13px]">
              <div className="bg-[var(--primary-50)] p-1.5 rounded-lg">
                <Percent className="w-4 h-4 text-[var(--primary-600)]" />
              </div>
              <span>Kamar Aktif</span>
            </div>
            <button className="text-slate-400 hover:bg-slate-50 p-1 rounded-md cursor-pointer">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <div className="mb-3">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{occupiedCount} <span className="text-lg text-slate-400 font-medium">/ {totalRoomsCount}</span></h2>
          </div>
          <div className="flex items-center gap-2 text-[12px]">
            {renovationCount > 0 ? (
              <span className="flex items-center gap-0.5 bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-md font-medium">
                {renovationCount} kamar renovasi
              </span>
            ) : (
              <span className="flex items-center gap-0.5 bg-[var(--primary-50)] text-[var(--primary-600)] px-1.5 py-0.5 rounded-md font-medium">
                Tidak ada renovasi
              </span>
            )}
            <span className="text-slate-400">status terkini</span>
          </div>
        </div>

      </div>

      {/* Property Listing Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Properties List - Left 2 Columns */}
        <div className="lg:col-span-2 bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4 bg-[var(--primary-500)] rounded-full"></div>
              <h3 className="text-[15px] font-semibold text-slate-800">Kost Anda</h3>
            </div>
            <button 
              onClick={onOpenAddProperty}
              className="text-[13px] font-medium text-[var(--primary-600)] flex items-center gap-1 hover:bg-[var(--primary-50)] px-2 py-1 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Tambah
            </button>
          </div>

          {ownerProperties.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-sm text-slate-500 font-medium">Belum ada kost terdaftar.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ownerProperties.map(p => {
                const propRooms = rooms.filter((r) => r.property_id === p.id);
                const occupiedPropCount = propRooms.filter((r) => r.status === 'occupied').length;
                const startingPrice = propRooms.length ? Math.min(...propRooms.map(r => r.price_monthly)) : 0;

                return (
                  <div key={p.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => onNavigateToManage(p.id)}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                        {p.media && p.media.length > 0 ? (
                          <img src={p.media[0]?.url_thumbnail || p.media[0]?.url_original} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Building2 className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-[14px] font-semibold text-slate-800 mb-0.5">{p.name}</h4>
                        <div className="flex items-center gap-3 text-[12px] text-slate-500">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {p.location?.city || '-'}</span>
                          <span className="text-[var(--primary-600)] bg-[var(--primary-50)] px-1.5 py-0.5 rounded text-[10px] font-semibold">{occupiedPropCount} Terisi</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium uppercase">Harga Mulai</p>
                        <p className="text-[14px] font-semibold text-slate-800">{startingPrice > 0 ? formatPrice(startingPrice) : '-'}</p>
                      </div>
                      <MoreHorizontal className="w-5 h-5 text-slate-300" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Small overview/action card - Right Column */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/50 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4 bg-[var(--primary-500)] rounded-full"></div>
              <h3 className="text-[15px] font-semibold text-slate-800">Aksi Cepat</h3>
            </div>
            <MoreHorizontal className="w-4 h-4 text-slate-400 cursor-pointer" />
          </div>

          <div className="flex-1 flex flex-col justify-center items-center text-center p-6 bg-[var(--primary-700)] rounded-2xl relative overflow-hidden shadow-lg shadow-[var(--primary-700)]/20 mt-2">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="bg-white/20 p-3 rounded-xl mb-4 backdrop-blur-sm">
              <Building className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-white font-semibold text-sm mb-2 relative z-10">Kembangkan Bisnis</h4>
            <p className="text-[var(--primary-100)] text-[11px] leading-relaxed mb-6 relative z-10 max-w-[180px] mx-auto">
              Tambah kost baru ke portofolio Anda untuk meningkatkan aliran pendapatan.
            </p>
            <button 
              onClick={onOpenAddProperty}
              className="w-full bg-white text-[var(--primary-800)] text-[13px] font-semibold py-2.5 rounded-xl hover:bg-[var(--primary-50)] transition-colors relative z-10 shadow-sm cursor-pointer"
            >
              Tambah Kost
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
