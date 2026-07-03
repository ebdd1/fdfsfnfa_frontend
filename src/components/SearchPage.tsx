import React, { useState, useMemo, useCallback, Suspense } from 'react';
import type { Property, Room } from '../types';
import { MapboxMapView } from './MapboxMapView';
import { Loader2 } from 'lucide-react';

interface SearchPageProps {
  properties: Property[];
  rooms: Room[];
  watchlist: string[];
  onToggleWatchlist: (id: string) => void;
  onSelectProperty: (id: string) => void;
  initialCity?: string;
  initialQuery?: string;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  properties,
  rooms,
  onSelectProperty,
  initialCity = '',
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const getPropertyRooms = useCallback((propId: string) => {
    return rooms.filter((r) => r.property_id === propId);
  }, [rooms]);

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase()) ||
                           p.location.address.toLowerCase().includes(query.toLowerCase());
      const matchesCity = selectedCity ? p.location.city === selectedCity : true;

      return matchesQuery && matchesCity;
    });
  }, [properties, query, selectedCity]);

  const propertyMarkers = useMemo(() => {
    return filteredProperties.map((p) => ({
      property: p,
      rooms: getPropertyRooms(p.id),
    }));
  }, [filteredProperties, getPropertyRooms]);

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `Rp ${(price / 1000000).toFixed(1)}M`;
    }
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Mobile Filter Backdrop */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsFilterOpen(false)}
        />
      )}

      {/* 1. Left Panel - Filters & Horizontal List (40%) */}
      <section className="w-full md:w-[40%] h-full flex flex-col border-r border-outline-variant bg-surface-bright relative z-10">
        {/* Filters Header */}
        <div className="px-margin-desktop py-stack-md border-b border-outline-variant bg-surface-bright sticky top-0 z-20">
          <h1 className="font-headline-sm font-headline-sm mb-stack-sm text-on-surface">
            {selectedCity || 'Semua Lokasi'}
          </h1>
          <p className="text-body-sm text-body-sm text-on-surface-variant mb-stack-md">
            {filteredProperties.length} kost ditemukan
          </p>

          {/* Filter Chips - Reference Style */}
          <div className="flex items-center gap-stack-sm overflow-x-auto pb-2 -mx-margin-desktop px-margin-desktop no-scrollbar">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-full text-label-sm whitespace-nowrap hover:border-primary transition-colors cursor-pointer"
            >
              Semua Harga <span className="material-symbols-outlined text-base">expand_more</span>
            </button>
            <button
              onClick={() => setSelectedCity(selectedCity === 'Jakarta' ? '' : 'Jakarta')}
              className={`flex items-center gap-2 px-4 py-1.5 bg-surface-container-lowest border rounded-full text-label-sm whitespace-nowrap transition-colors cursor-pointer ${
                selectedCity === 'Jakarta' ? 'border-primary text-primary' : 'border-outline-variant hover:border-primary'
              }`}
            >
              {selectedCity || 'Jakarta'}
            </button>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-full text-label-sm whitespace-nowrap hover:border-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">tune</span> Filters
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Listing Cards - Reference Style */}
        <div className="flex-1 overflow-y-auto px-margin-desktop py-stack-lg flex flex-col gap-stack-lg bg-surface hide-scrollbar">
          {filteredProperties.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl text-outline">search_off</span>
              </div>
              <p className="text-body-md font-semibold text-on-surface mb-2">Tidak ada kost yang cocok</p>
              <p className="text-body-sm text-outline">Coba ubah filter atau kata kunci pencarian.</p>
            </div>
          ) : (
            filteredProperties.map((p) => {
              const propRooms = getPropertyRooms(p.id);
              const lowestPrice = propRooms.length > 0 ? Math.min(...propRooms.map((r) => r.price_monthly)) : 0;

              return (
                <article
                  key={p.id}
                  onClick={() => onSelectProperty(p.id)}
                  onMouseEnter={() => setHoveredPropertyId(p.id)}
                  onMouseLeave={() => setHoveredPropertyId(null)}
                  className={`bg-surface-container-lowest rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-all duration-300 overflow-hidden group cursor-pointer border border-transparent hover:border-primary/20`}
                >
                  {/* Card Image - Reference Style */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={p.media[0]?.url_medium || 'https://via.placeholder.com/400x300'}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Verified Badge - Reference Style */}
                    <div className="absolute top-3 left-3 bg-tertiary-fixed text-on-tertiary-fixed-variant px-2 py-1 rounded text-[10px] font-label-md font-bold uppercase tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Verified
                    </div>

                    {/* Rating Badge - Reference Style */}
                    <div className="absolute top-3 right-3 bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface px-2 py-1 rounded-lg text-label-sm flex items-center gap-1 shadow-sm">
                      <span className="material-symbols-outlined text-sm text-yellow-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> 4.9
                    </div>
                  </div>

                  {/* Card Content - Reference Style */}
                  <div className="p-stack-md flex flex-col gap-stack-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-body-lg font-body-lg font-semibold text-on-surface line-clamp-1">{p.name}</h2>
                        <div className="flex items-center gap-1 text-on-surface-variant text-body-sm mt-1">
                          <span className="material-symbols-outlined text-base">location_on</span> {p.location.address}, {p.location.city}
                        </div>
                      </div>
                    </div>

                    {/* Facilities Icons - Reference Style */}
                    <div className="flex items-center gap-stack-md text-outline py-2">
                      {p.facilities.slice(0, 4).map((f) => (
                        <div key={f} className="flex items-center gap-1" title={f}>
                          <span className="material-symbols-outlined text-base">{getFacilityIcon(f)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Price - Reference Style */}
                    <div className="mt-auto pt-2 border-t border-outline-variant flex justify-between items-end">
                      <div className="text-label-sm text-on-surface-variant">per bulan</div>
                      <div className="text-headline-sm text-primary font-bold">{formatPrice(lowestPrice)}</div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>

      {/* 2. Right Panel - Mapbox Map (60%) - Reference Style */}
      <section className="hidden md:flex w-[60%] h-full relative bg-surface-container-highest overflow-hidden flex-col">
        <Suspense fallback={
          <div className="h-full w-full bg-surface-container-highest flex items-center justify-center">
            <div className="text-center p-6">
              <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
              <p className="text-body-sm font-semibold text-on-surface-variant">Memuat peta...</p>
            </div>
          </div>
        }>
          <MapboxMapView
            properties={propertyMarkers}
            hoveredPropertyId={hoveredPropertyId}
            onSelectProperty={onSelectProperty}
            onHoverProperty={setHoveredPropertyId}
            selectedCity={selectedCity}
            accessToken={import.meta.env.VITE_MAPBOX_TOKEN || ''}
          />
        </Suspense>
      </section>

      {/* Mobile Search Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant p-margin-mobile py-3 md:hidden z-30">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">search</span>
          <input
            type="text"
            placeholder="Cari kost..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-body-sm text-on-surface"
          />
        </div>
      </div>
    </div>
  );
};

// Helper function to get icon name for facilities
function getFacilityIcon(facility: string): string {
  const icons: Record<string, string> = {
    'WiFi': 'wifi',
    'AC': 'ac_unit',
    'Parking': 'local_parking',
    'Bathroom': 'bathtub',
    'Security': 'security',
    'Laundry': 'local_laundry_service',
  };
  return icons[facility] || 'check_circle';
}
