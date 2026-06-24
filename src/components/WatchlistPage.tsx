import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Property, SmartAlert, Room } from '../types';
import { Trash2, Plus, Bell, MapPin, Heart, Sparkles } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

interface WatchlistPageProps {
  properties: Property[];
  rooms: Room[];
  watchlist: string[];
  alerts: SmartAlert[];
  onToggleWatchlist: (id: string) => void;
  onAddAlert: (name: string, city: string) => void;
  onDeleteAlert: (id: string) => void;
  onSelectProperty: (id: string) => void;
}

export const WatchlistPage: React.FC<WatchlistPageProps> = ({
  properties,
  rooms,
  watchlist,
  alerts,
  onToggleWatchlist,
  onAddAlert,
  onDeleteAlert,
  onSelectProperty,
}) => {
  const { settings } = useSettings();
  const [alertName, setAlertName] = useState('');
  const [alertCity, setAlertCity] = useState(settings.cities[0] || 'Jakarta');
  const navigate = useNavigate();

  const watchedProperties = properties.filter((p) => watchlist.includes(p.id));

  const getLowestPrice = (propId: string) => {
    const propRooms = rooms.filter((r) => r.property_id === propId);
    return propRooms.length > 0 ? Math.min(...propRooms.map((r) => r.price_monthly)) : 0;
  };

  const getAvailableRoomsCount = (propId: string) => {
    return rooms.filter((r) => r.property_id === propId && r.status === 'available').length;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertName.trim()) return;
    onAddAlert(alertName, alertCity);
    setAlertName('');
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-6 md:p-8 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* 1. Left/Center Area: Watchlist items list (2 columns wide) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="text-left">
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Kost yang Disimpan</h1>
          <p className="text-xs text-slate-500 mt-1">Daftar hunian favorit Anda untuk memantau ketersediaan dan harga secara berkala.</p>
        </div>

        {watchedProperties.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm flex flex-col items-center justify-center space-y-4 min-h-[350px]">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center shadow-sm">
              <Heart className="w-7 h-7 fill-rose-500 animate-pulse" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="text-base font-extrabold text-slate-800">Watchlist Anda Kosong</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Belum ada kost yang disimpan. Cari kost impian Anda dan simpan ke daftar favorit sekarang.
              </p>
            </div>
            <button
              onClick={() => navigate('/search')}
              className="px-5 py-2.5 bg-[var(--primary-600)] hover:bg-[var(--primary-700)] text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer mt-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Cari Kost Sekarang
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {watchedProperties.map((p) => {
              const lowestPrice = getLowestPrice(p.id);
              const availableRooms = getAvailableRoomsCount(p.id);
              
              return (
                <div
                  key={p.id}
                  onClick={() => onSelectProperty(p.id)}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-md hover:border-[var(--primary-500)]/30 transition-all duration-300 cursor-pointer group flex flex-col relative"
                >
                  <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                    <img
                      src={p.media[0]?.url_medium}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Available Rooms Status Badge */}
                    <div className="absolute top-4 left-4">
                      {availableRooms > 0 ? (
                        <span className="flex items-center gap-1 bg-white text-slate-800 text-xs font-bold py-1.5 px-3 rounded-full border border-slate-200 shadow-sm">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary-400)] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--primary-500)]"></span>
                          </span>
                          Sisa {availableRooms} Kamar
                        </span>
                      ) : (
                        <span className="flex items-center bg-red-50 text-red-700 text-xs font-bold py-1.5 px-3 rounded-full border border-red-100 shadow-sm">
                          Penuh
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWatchlist(p.id);
                      }}
                      className="absolute top-4 right-4 p-2.5 rounded-full bg-white text-slate-400 hover:text-red-500 border border-slate-200/50 shadow-md active:scale-95 transition-all z-20 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2 text-left">
                      <span className={`inline-block text-xs font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${
                        p.type === 'kost_campur'
                          ? 'bg-[var(--primary-50)] text-[var(--primary-800)]'
                          : p.type === 'kost_putra'
                            ? 'bg-blue-50 text-blue-800'
                            : 'bg-pink-50 text-pink-800'
                      }`}>
                        {p.type === 'kost_campur' ? 'Campur' : p.type === 'kost_putra' ? 'Putra' : 'Putri'}
                      </span>

                      <h3 className="text-base font-extrabold text-slate-800 group-hover:text-[var(--primary-600)] transition-colors line-clamp-1">
                        {p.name}
                      </h3>
                      
                      <p className="text-slate-400 text-xs flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                        <span className="truncate">{p.location.address || p.location.city}</span>
                      </p>
                    </div>
                    
                    <div className="border-t border-slate-100 pt-4 mt-auto flex items-center justify-between">
                      <div className="flex items-baseline">
                        <span className="text-lg font-black text-slate-900">{formatPrice(lowestPrice)}</span>
                        <span className="text-slate-400 text-xs ml-0.5">/bln</span>
                      </div>
                      <span className="text-xs font-extrabold text-[var(--primary-600)] group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                        Detail Kost &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Right Area: Smart Search Alerts Panel (1 column wide) */}
      {settings.feature_smart_alerts && (
      <div className="space-y-6">
        <div className="text-left">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Smart Alerts</h2>
          <p className="text-xs text-slate-500 mt-1">Dapatkan notifikasi otomatis jika ada kost baru sesuai kriteria Anda.</p>
        </div>
        
        {/* Create Alert Box */}
        <form onSubmit={handleCreateAlert} className="bg-white rounded-3xl p-6 border border-slate-200/85 shadow-sm space-y-5">
          <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3 text-left">
            <div className="p-2 bg-[var(--primary-50)] text-[var(--primary-600)] rounded-xl">
              <Bell className="w-4 h-4" />
            </div>
            <span>Buat Notifikasi Baru</span>
          </h3>

          <div className="text-left space-y-1.5">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Notifikasi</label>
            <input
              type="text"
              placeholder="Contoh: Kost Dekat ITB"
              value={alertName}
              onChange={(e) => setAlertName(e.target.value)}
              className="w-full text-xs rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-[var(--primary-500)]/10 focus:border-[var(--primary-500)] outline-none transition-all py-2.5 px-3"
            />
          </div>

          <div className="text-left space-y-1.5">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Pilih Kota</label>
            <select
              value={alertCity}
              onChange={(e) => setAlertCity(e.target.value)}
              className="w-full text-xs rounded-xl border-slate-200 bg-white focus:ring-4 focus:ring-[var(--primary-500)]/10 focus:border-[var(--primary-500)] outline-none transition-all py-2.5 px-3"
            >
              {settings.cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[var(--primary-600)] hover:bg-[var(--primary-700)] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Aktifkan Alert
          </button>
        </form>

        {/* Alerts List */}
        <div className="space-y-3">
          {alerts.length > 0 && (
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-left">Alert Aktif ({alerts.length})</p>
          )}
          {alerts.map((a) => (
            <div key={a.id} className="bg-white rounded-2xl p-4 border border-slate-200/60 shadow-sm flex items-center justify-between hover:border-[var(--primary-500)]/30 transition-all duration-300">
              <div className="flex items-center gap-3 text-left">
                <div className="p-2.5 rounded-xl bg-[var(--primary-50)] text-[var(--primary-600)]">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800 leading-snug">{a.name}</h4>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Kota: {a.search_params.city}</p>
                </div>
              </div>
              <button
                onClick={() => onDeleteAlert(a.id)}
                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-4.5 h-4.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
      )}
    </div>
  );
};
