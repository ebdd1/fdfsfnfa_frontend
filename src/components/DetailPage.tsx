import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="bg-surface min-h-screen">
      <div className="max-w-container-max mx-auto">
        {/* 2. Hero Image Section - Reference Style */}
        <div className="relative w-full h-80 md:h-[400px] bg-surface-container">
          {heroPhoto?.url_original ? (
            <img
              src={heroPhoto.url_original}
              alt={property.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-fixed to-tertiary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-6xl text-primary">domain</span>
            </div>
          )}

          {/* Top Action Buttons - Reference Style */}
          <div className="absolute top-4 left-4 right-4 flex justify-between">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center shadow-card active:scale-95 transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center shadow-card active:scale-95 transition-transform cursor-pointer">
                <span className="material-symbols-outlined text-xl">share</span>
              </button>
              <button className="w-10 h-10 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center shadow-card active:scale-95 transition-transform cursor-pointer">
                <span className="material-symbols-outlined text-xl">favorite_border</span>
              </button>
            </div>
          </div>

          {/* Photo Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-surface-container-lowest/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
            {photos.slice(0, 4).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${i === activePhotoIdx ? 'bg-on-surface' : 'bg-on-surface/30'}`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnail Strip */}
        {photos.length > 1 && (
          <div className="flex gap-2 p-4 overflow-x-auto hide-scrollbar">
            {photos.map((photo, i) => (
              <button
                key={photo.id}
                onClick={() => setActivePhotoIdx(i)}
                className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  i === activePhotoIdx ? 'border-primary shadow-card' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={photo.url_thumbnail} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Main Content */}
        <div className="px-margin-mobile md:px-margin-desktop py-stack-lg flex flex-col gap-stack-lg">

          {/* Header Info */}
          <div className="flex flex-col gap-stack-sm">
            <div className="flex justify-between items-start gap-4">
              <h1 className="font-headline-lg text-headline-lg text-on-surface">{property.name}</h1>
              <div className="flex items-center gap-1 bg-surface-container px-2.5 py-1 rounded-full shrink-0">
                <span className="material-symbols-outlined text-base text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="font-label-md text-label-md text-primary">4.9</span>
              </div>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-lg">location_on</span>
              {property.location.address}, {property.location.city}
            </p>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2">
            {property.owner?.is_verified && (
              <span className="flex items-center gap-1.5 bg-tertiary-fixed text-on-tertiary px-3 py-1.5 rounded-lg text-label-sm font-label-sm font-bold uppercase shadow-card">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                Terverifikasi
              </span>
            )}
            <span className={`text-label-sm font-label-sm font-bold uppercase px-3 py-1.5 rounded-lg shadow-card ${
              availableCount === 0
                ? 'bg-error-container text-on-error-container'
                : 'bg-primary-fixed text-primary'
            }`}>
              {availableCount === 0 ? 'Penuh' : `${availableCount} Kamar Tersedia`}
            </span>
          </div>

          {/* Facilities Snippet - Reference Style */}
          <div className="flex flex-col gap-stack-sm">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Fasilitas Utama</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {property.facilities.slice(0, 6).map((fac) => (
                <div key={fac} className="flex flex-col items-center gap-1 w-16 shrink-0">
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-xl">{getFacilityIcon(fac)}</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant text-center">{fac}</span>
                </div>
              ))}
            </div>
          </div>

          {/* About */}
          <div className="flex flex-col gap-stack-sm">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Tentang Kost</h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {property.description || 'Kost eksklusif di lokasi strategis dengan fasilitas lengkap dan keamanan 24 jam.'}
            </p>
            <button className="font-label-md text-label-md text-primary self-start hover:underline">
              Baca selengkapnya
            </button>
          </div>

          {/* Room Types */}
          <div className="flex flex-col gap-stack-sm">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Tipe Kamar</h2>
            <div className="flex flex-col gap-stack-md">
              {propertyRooms.map((room, idx) => (
                <div
                  key={room.id}
                  className={`bg-surface-container-lowest rounded-xl overflow-hidden border transition-all ${
                    idx === 0 ? 'border-primary shadow-card' : 'border-transparent shadow-card'
                  } relative`}
                >
                  {room.status === 'available' && (
                    <div className="absolute top-0 right-0 bg-primary text-on-primary font-label-sm text-label-sm px-2 py-0.5 rounded-bl-lg">
                      Tersedia
                    </div>
                  )}
                  <div className="flex">
                    <div className="w-24 h-24 bg-surface-variant shrink-0">
                      <img
                        className="w-full h-full object-cover"
                        src={property.media?.[0]?.url_thumbnail || 'https://via.placeholder.com/100x100'}
                        alt={room.room_number}
                      />
                    </div>
                    <div className="p-3 flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="font-label-md text-label-md text-on-surface">Kamar {room.room_number}</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">{room.facilities?.join(' • ') || 'Fasilitas standar'}</p>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-label-md text-label-md text-primary">
                          {formatPrice(room.price_monthly)} <span className="font-label-sm text-label-sm text-on-surface-variant">/bln</span>
                        </span>
                        {idx === 0 && (
                          <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center bg-primary">
                            <span className="material-symbols-outlined text-on-primary text-sm">check</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-surface-container-high px-margin-mobile py-4 flex justify-between items-center shadow-[0_-10px_25px_rgba(0,53,148,0.05)] z-50 md:relative md:shadow-none md:border-0 md:p-0">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Harga untuk 1 bulan</span>
            <span className="font-headline-sm text-headline-sm text-primary font-bold">{formatPrice(lowestPrice)}</span>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => onStartChat(property.owner_id, property.id)}
              className="px-6 py-3 border border-primary text-primary rounded-lg font-label-md font-label-md hover:bg-primary-fixed transition-colors"
            >
              Chat Pemilik
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (!user) return navigate('/login');
                setIsRentOpen(true);
              }}
              disabled={availableCount === 0}
              className="px-6 py-3 bg-primary text-on-primary rounded-lg font-label-md font-label-md hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_4px_10px_rgba(0,53,148,0.2)]"
            >
              Ajukan Sewa
            </motion.button>
          </div>
        </div>
      </div>

      {/* Spacer for sticky bottom bar on mobile */}
      <div className="h-24 md:hidden" />

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg mt-8 border-t border-surface-container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div className="text-left">
              <span className="text-label-sm text-primary uppercase tracking-wider font-bold">Rekomendasi</span>
              <h3 className="font-headline-md text-headline-md text-on-surface">Kost Serupa</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Hunian alternatif terdekat dengan fasilitas serupa</p>
            </div>
            <button
              onClick={() => navigate('/search')}
              className="flex items-center gap-1 font-label-md text-label-md text-primary hover:underline self-start"
            >
              Lihat Semua
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.slice(0, 3).map((p) => {
              const pRooms = p.rooms || [];
              const lowestPriceRec = pRooms.length > 0 ? Math.min(...pRooms.map((r) => r.price_monthly)) : 0;
              const availableRoomsCount = pRooms.filter(r => r.status === 'available').length;

              return (
                <div
                  key={p.id}
                  onClick={() => navigate(`/property/${p.id}`)}
                  className="bg-surface-container-lowest rounded-xl overflow-hidden border border-surface-container hover:border-primary/20 shadow-card hover:shadow-card-hover transition-all cursor-pointer"
                >
                  <div className="relative h-40">
                    <img
                      src={p.media[0]?.url_medium || 'https://via.placeholder.com/400x300'}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                    {p.owner?.is_verified && (
                      <div className="absolute top-3 left-3 bg-tertiary-fixed text-on-tertiary px-2 py-1 rounded-lg text-label-sm font-label-sm font-bold uppercase flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        Verified
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3 bg-surface-container-lowest/90 backdrop-blur-sm px-2 py-1 rounded-lg text-label-sm font-label-sm text-primary">
                      {formatPrice(lowestPriceRec)}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-label-md text-label-md text-on-surface font-semibold line-clamp-1 mb-1">{p.name}</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mb-3">
                      <span className="material-symbols-outlined text-base">location_on</span>
                      {p.location.address}
                    </p>
                    <span className={`text-label-sm font-label-sm ${availableRoomsCount > 0 ? 'text-tertiary' : 'text-error'}`}>
                      {availableRoomsCount > 0 ? `${availableRoomsCount} kamar kosong` : 'Penuh'}
                    </span>
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

function getFacilityIcon(facility: string): string {
  const icons: Record<string, string> = {
    'WiFi': 'wifi',
    'AC': 'ac_unit',
    'Parking': 'local_parking',
    'Bathroom': 'bathtub',
    'Security': 'security',
    'Laundry': 'local_laundry_service',
    'Kitchen': 'kitchen',
    'TV': 'tv',
    'Pool': 'pool',
  };
  return icons[facility] || 'check_circle';
}
