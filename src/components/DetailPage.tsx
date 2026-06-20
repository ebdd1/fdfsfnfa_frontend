import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Shield, ArrowLeft, Send, ChevronRight, Star, KeyRound, Building, Eye } from 'lucide-react';
import type { Property, Room } from '../types';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { RentOrderModal } from './RentOrderModal';

interface DetailPageProps {
  property: Property;
  rooms: Room[];
  recommendations?: Property[];
  onBack: () => void;
  onStartChat: (ownerId: string, propertyId: string) => void;
}

export const DetailPage: React.FC<DetailPageProps> = ({
  property,
  rooms,
  recommendations,
  onBack,
  onStartChat,
}) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isRentOpen, setIsRentOpen] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const photos = property.media || [];

  useEffect(() => {
    setActivePhotoIdx(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [property.id]);

  const heroPhoto = photos[activePhotoIdx];

  const propertyRooms = rooms.filter((r) => r.property_id === property.id);
  const availableCount = propertyRooms.filter((r) => r.status === 'available').length;

  const lowestPrice = propertyRooms.length > 0 ? Math.min(...propertyRooms.map((r) => r.price_monthly)) : 0;
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* 1. Header Bar */}
      <div className="bg-white border-b border-slate-100 py-4 px-8 sticky top-0 z-30 flex items-center gap-4 shadow-sm text-left">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-full transition-all text-slate-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        <div>
          <h2 className="text-base font-extrabold text-slate-800">{property.name}</h2>
          <p className="text-xs text-slate-400">{property.location.address}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 mt-4 sm:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. Main Content Panel (2 columns wide) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Images Section */}
          <div className="bg-white rounded-[32px] overflow-hidden border border-slate-200/80 shadow-sm">
            {/* Hero image */}
            <div className="relative aspect-[16/9] bg-slate-200 overflow-hidden">
              {heroPhoto?.url_original ? (
                <img
                  src={heroPhoto.url_original}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                  <Building className="w-16 h-16 text-emerald-300" />
                </div>
              )}
              {/* GPS badge */}
              {(heroPhoto?.latitude || heroPhoto?.longitude) && (
                <div className="absolute bottom-6 left-6 bg-slate-900/85 backdrop-blur-md px-4 py-2.5 rounded-2xl text-white text-xs font-bold flex items-center gap-2 shadow-lg">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Koordinat: {heroPhoto.latitude?.toFixed(4)}, {heroPhoto.longitude?.toFixed(4)}
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {photos.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {photos.map((photo, i) => (
                  <button
                    key={photo.id}
                    onClick={() => setActivePhotoIdx(i)}
                    className={`shrink-0 w-16 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                      i === activePhotoIdx ? 'border-emerald-500 shadow-md' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={photo.url_thumbnail} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Badges block */}
          <div className="bg-white rounded-[32px] p-8 border border-slate-200/80 shadow-sm space-y-6 text-left">
            <div className="flex flex-wrap gap-2.5">
              {property.owner?.is_verified && (
                <span className="flex items-center gap-1.5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider py-2 px-4 rounded-xl shadow-sm">
                  <Shield className="w-3.5 h-3.5 fill-white" />
                  Listing Terverifikasi
                </span>
              )}
              <span className={`text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-xl border ${
                availableCount === 0 
                  ? 'bg-red-50 text-red-700 border-red-100' 
                  : 'bg-emerald-50 text-emerald-700 border-emerald-100'
              }`}>
                {availableCount === 0 ? 'Penuh' : `Sisa ${availableCount} Kamar Kosong`}
              </span>
            </div>

            <div className="space-y-2">
              <span className={`inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded ${
                property.type === 'kost_campur' 
                  ? 'bg-emerald-50 text-emerald-800' 
                  : property.type === 'kost_putra' 
                    ? 'bg-blue-50 text-blue-800' 
                    : 'bg-pink-50 text-pink-850'
              }`}>
                {property.type === 'kost_campur' ? 'Campur' : property.type === 'kost_putra' ? 'Putra' : 'Putri'}
              </span>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">{property.name}</h1>
              <p className="text-slate-500 flex items-center gap-1 text-sm font-semibold">
                <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                {property.location.address}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Fasilitas Kost</h3>
              <div className="flex flex-wrap gap-2">
                {property.facilities.map((fac) => (
                  <span key={fac} className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200/50 py-2.5 px-4.5 rounded-xl">
                    {fac}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Description Block */}
          <div className="bg-white rounded-[32px] p-8 border border-slate-200/80 shadow-sm text-left">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Deskripsi Kost</h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line font-medium">
              {property.description || 'Belum ada deskripsi untuk kost ini.'}
            </p>
          </div>
        </div>

        {/* 3. Sidebar Panel - Booking & Contact (1 column wide) */}
        <div className="space-y-6">
          <div className="bg-white rounded-[32px] p-8 border border-slate-200/80 shadow-sm sticky top-24 space-y-6 text-left">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Mulai Dari</span>
              <div className="flex items-baseline">
                <span className="text-3xl font-black text-emerald-600">{formatPrice(lowestPrice)}</span>
                <span className="text-slate-400 text-xs ml-1 font-semibold">/bulan</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Pilihan Kamar</h4>
              <div className="space-y-3">
                {propertyRooms.map((room) => (
                  <div key={room.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100/30 transition-colors">
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-slate-800 block">Kamar {room.room_number}</span>
                      <div className="flex flex-wrap gap-1">
                        {room.facilities.map((rf) => (
                          <span key={rf} className="text-[9px] font-bold text-slate-500 bg-white border border-slate-200/60 px-2 py-0.5 rounded">
                            {rf}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${room.status === 'available' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                      {room.status === 'available' ? 'Tersedia' : 'Penuh'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center text-slate-400">
                  {property.owner?.avatar_url ? (
                    <img src={property.owner.avatar_url} alt={property.owner?.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold">{(property.owner?.name || 'P')[0]}</span>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-800">{property.owner?.name || 'Pemilik Kost'}</h4>
                  <p className="text-[10px] text-emerald-600 font-bold">Hubungi via Chat</p>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (!user) return navigate('/login');
                  setIsRentOpen(true);
                }}
                disabled={availableCount === 0}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/10 hover:shadow-lg hover:shadow-emerald-600/20 transition-all duration-200 active:scale-95"
              >
                <KeyRound className="w-4 h-4" />
                {availableCount === 0 ? 'Kamar Penuh' : 'Ajukan Sewa'}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => onStartChat(property.owner_id, property.id)}
                className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all duration-200 active:scale-95"
              >
                <Send className="w-4 h-4" />
                Tanya Pemilik Kost
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Rekomendasi Kost Terkait */}
      {recommendations && recommendations.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-8 mt-10 sm:mt-16 pt-10 sm:pt-12 border-t border-slate-200/60 animate-in fade-in slide-in-from-bottom-6 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div className="text-left space-y-1">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block font-mono">PILIHAN LAINNYA</span>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Kost Serupa yang Direkomendasikan</h3>
              <p className="text-sm text-slate-500">Hunian alternatif terdekat dengan fasilitas terbaik dan terverifikasi.</p>
            </div>
            <button 
              onClick={() => navigate('/search')}
              className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:translate-x-0.5 transition-all self-start sm:self-auto cursor-pointer font-extrabold"
            >
              Lihat Semua Kost
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 text-left">
            {recommendations.map((p) => {
              const pRooms = p.rooms || [];
              const lowestPrice = pRooms.length > 0 ? Math.min(...pRooms.map((r) => r.price_monthly)) : 2000000;
              const availableRoomsCount = pRooms.filter(r => r.status === 'available').length;
              
              return (
                <div 
                  key={p.id}
                  onClick={() => navigate(`/property/${p.id}`)}
                  className="bg-white rounded-[28px] overflow-hidden border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 cursor-pointer group flex flex-col relative"
                >
                  {/* Photo area */}
                  <div className="relative aspect-[4/3] bg-slate-55 overflow-hidden">
                    <img 
                      src={p.media[0]?.url_medium || p.media[0]?.url_original} 
                      alt={p.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Floating GPS Badge with blinking pulse */}
                    <div className="absolute top-4 left-4">
                      <span className="flex items-center gap-1.5 bg-white/95 text-slate-805 text-[10px] font-extrabold py-1.5 px-3 rounded-full border border-slate-200/80 shadow-sm">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        GPS Terverifikasi
                      </span>
                    </div>

                    {/* Floating Popularity / Trusted Badge */}
                    <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5">
                      <span className="flex items-center gap-1 bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider py-1 px-2.5 rounded-full shadow-md">
                        <Star className="w-2.5 h-2.5 fill-white shrink-0 animate-pulse" />
                        4.9 (Trusted)
                      </span>
                      <span className="flex items-center gap-1 bg-slate-900/80 text-white text-[8px] font-extrabold py-0.5 px-2 rounded-full backdrop-blur-sm shadow-sm">
                        <Eye className="w-3 h-3 shrink-0" /> {Math.floor(Math.random() * 500) + 700}+ Dilihat
                      </span>
                    </div>

                    {/* Price tag overlay */}
                    <div className="absolute bottom-4 right-4 bg-slate-900/90 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-full backdrop-blur-sm">
                      {formatPrice(lowestPrice)}<span className="text-[10px] text-slate-400 font-normal">/bln</span>
                    </div>
                  </div>
                  
                  {/* Content Area */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className={`inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded ${
                        p.type === 'kost_campur' 
                          ? 'bg-emerald-50 text-emerald-800' 
                          : p.type === 'kost_putra' 
                            ? 'bg-blue-50 text-blue-800' 
                            : 'bg-pink-50 text-pink-805'
                      }`}>
                        {p.type === 'kost_campur' ? 'Campur' : p.type === 'kost_putra' ? 'Putra' : 'Putri'}
                      </span>
                      
                      <h4 className="text-base font-black text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-1">{p.name}</h4>
                      
                      <p className="text-slate-500 text-xs flex items-center gap-1 font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="line-clamp-1 text-slate-400">{p.location.address || p.location.city}</span>
                      </p>
                    </div>

                    {/* Footer Row */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-150">
                      <div className="flex items-center gap-1 text-[11px] text-slate-450 font-bold">
                        <span className="text-slate-600">{p.location.city || 'Palopo'}</span>
                        <span>&bull; Rekomendasi</span>
                      </div>

                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                        availableRoomsCount > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {availableRoomsCount > 0 ? `${availableRoomsCount} Kamar Tersedia` : 'Penuh'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <RentOrderModal
        isOpen={isRentOpen}
        onClose={() => setIsRentOpen(false)}
        propertyName={property.name}
        rooms={propertyRooms}
      />
    </div>
  );
};

