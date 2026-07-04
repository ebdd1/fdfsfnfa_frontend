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
  watchlist,
  onSelectProperty,
  initialCity = '',
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

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
    <div className="h-screen w-screen overflow-hidden relative bg-background">
      {/* Desktop Layout */}
      <div className="hidden md:flex h-full">
        {/* Left Panel - Filters & Listings */}
        <section className="w-[40%] h-full flex flex-col border-r border-outline-variant bg-surface-bright relative z-10">
          {/* Filters Header */}
          <div className="px-margin-desktop py-stack-md border-b border-outline-variant bg-surface-bright sticky top-0 z-20">
            <h1 className="font-headline-sm font-bold mb-stack-sm text-on-surface">
              {selectedCity || 'Semua Lokasi'}
            </h1>
            <p className="text-body-sm text-on-surface-variant mb-stack-md">
              {filteredProperties.length} kost ditemukan
            </p>

            {/* Filter Chips */}
            <div className="flex items-center gap-stack-sm overflow-x-auto pb-2">
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

          {/* Property Cards */}
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
                    className={`bg-surface-container-lowest rounded-xl shadow-elevation-1 overflow-hidden group cursor-pointer border transition-all ${
                      hoveredPropertyId === p.id ? 'ring-2 ring-primary shadow-elevation-hover' : 'border-transparent hover:shadow-elevation-2'
                    }`}
                  >
                    {/* Image */}
                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={p.media[0]?.url_medium || '/placeholder.svg'}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {p.is_verified && (
                        <div className="absolute top-3 left-3 bg-surface-container-lowest px-2 py-1 rounded text-[10px] font-label-sm font-semibold flex items-center gap-1 shadow-sm">
                          <span className="material-symbols-outlined text-xs text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Verified
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-stack-md flex flex-col gap-stack-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-body-lg font-semibold text-on-surface line-clamp-1">{p.name}</h2>
                          <div className="flex items-center gap-1 text-on-surface-variant text-body-sm mt-1">
                            <span className="material-symbols-outlined text-base">location_on</span> {p.location.address}, {p.location.city}
                          </div>
                        </div>
                      </div>

                      {/* Facilities */}
                      <div className="flex items-center gap-stack-md text-outline py-2">
                        {p.facilities.slice(0, 4).map((f) => (
                          <div key={f} className="flex items-center gap-1" title={f}>
                            <span className="material-symbols-outlined text-base">{getFacilityIcon(f)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Price */}
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

        {/* Right Panel - Map */}
        <section className="flex-1 h-full relative bg-surface-container-highest">
          <Suspense fallback={
            <div className="h-full w-full flex items-center justify-center bg-surface-container-low">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
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
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden absolute inset-0 flex flex-col z-10">
        {/* Top Search Bar */}
        <div className="px-margin-mobile pt-stack-md pb-stack-sm z-20">
          <div className="flex items-center gap-stack-sm">
            <div className="flex-1 bg-surface-container-lowest shadow-elevation-2 rounded-full flex items-center px-4 py-3 border border-outline-variant/30">
              <span className="material-symbols-outlined text-on-surface-variant mr-2">search</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={selectedCity || 'Cari kost...'}
                className="flex-1 bg-transparent border-none focus:ring-0 p-0 text-body-sm text-on-surface placeholder:text-on-surface-variant outline-none"
              />
              {query && (
                <button onClick={() => setQuery('')} className="ml-2 bg-surface-container text-on-surface-variant rounded-full p-1 hover:bg-surface-high transition-colors">
                  <span className="material-symbols-outlined text-sm">close</span>
              </button>
              )}
            </div>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="bg-surface-container-lowest shadow-elevation-2 rounded-full p-3 border border-outline-variant/30 text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined">tune</span>
            </button>
          </div>

          {/* Quick Filter Chips */}
          <div className="flex gap-stack-sm mt-stack-sm overflow-x-auto hide-scrollbar pb-2">
            <button
              onClick={() => setActiveFilter(null)}
              className={`whitespace-nowrap bg-surface-container-lowest border border-outline-variant/50 text-on-surface text-label-sm px-4 py-1.5 rounded-full shadow-elevation-1 hover:bg-surface-container transition-colors ${
                activeFilter === null ? 'ring-2 ring-primary' : ''
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setActiveFilter('exclusive')}
              className={`whitespace-nowrap bg-surface-container-lowest border border-outline-variant/50 text-on-surface text-label-sm px-4 py-1.5 rounded-full shadow-elevation-1 hover:bg-surface-container transition-colors flex items-center gap-1 ${
                activeFilter === 'exclusive' ? 'ring-2 ring-primary' : ''
              }`}
            >
              <span className="material-symbols-outlined text-sm">bolt</span> Exclusive
            </button>
            <button
              onClick={() => setActiveFilter('verified')}
              className={`whitespace-nowrap bg-surface-container-lowest border border-outline-variant/50 text-on-surface text-label-sm px-4 py-1.5 rounded-full shadow-elevation-1 hover:bg-surface-container transition-colors ${
                activeFilter === 'verified' ? 'ring-2 ring-primary' : ''
              }`}
            >
              Terverifikasi
            </button>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="whitespace-nowrap bg-surface-container-lowest border border-outline-variant/50 text-on-surface text-label-sm px-4 py-1.5 rounded-full shadow-elevation-1 hover:bg-surface-container transition-colors flex items-center gap-1"
            >
              Lainnya <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
          </div>
        </div>

        {/* Bottom Sheet with Property List */}
        <div className="absolute bottom-0 left-0 right-0 bg-surface-container-lowest rounded-t-3xl shadow-elevation-3 z-30 flex flex-col" style={{ height: '55vh' }}>
          {/* Drag Handle */}
          <div className="w-full flex justify-center py-3 cursor-grab active:cursor-grabbing">
            <div className="w-12 h-1.5 bg-outline-variant/50 rounded-full" />
          </div>

          {/* Scrollable List */}
          <div className="flex-1 overflow-y-auto px-margin-mobile pb-safe pb-8 hide-scrollbar">
            <div className="flex justify-between items-center mb-4">
              <p className="font-headline-sm text-on-surface">{filteredProperties.length} Properti Ditemukan</p>
            </div>

            {/* Property Cards - Horizontal Layout */}
            <div className="space-y-3">
              {filteredProperties.map((p) => {
                const propRooms = getPropertyRooms(p.id);
                const lowestPrice = propRooms.length > 0 ? Math.min(...propRooms.map((r) => r.price_monthly)) : 0;
                const isWatchlisted = watchlist.includes(p.id);

                return (
                  <div
                    key={p.id}
                    onClick={() => onSelectProperty(p.id)}
                    className="w-full bg-surface-container-lowest rounded-xl shadow-elevation-1 overflow-hidden flex border border-outline-variant/20 hover:shadow-elevation-2 transition-shadow cursor-pointer"
                  >
                    {/* Image */}
                    <div className="w-32 h-28 relative shrink-0">
                      <img
                        src={p.media[0]?.url_medium || '/placeholder.svg'}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                      {p.is_verified && (
                        <div className="absolute top-2 left-2 bg-surface-container-lowest/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-semibold text-primary shadow-sm">
                          Verified
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-3 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-headline-sm text-on-surface text-sm truncate pr-2">{p.name}</h3>
                          <button
                            onClick={(e) => { e.stopPropagation(); }}
                            className="text-on-surface-variant hover:text-error transition-colors"
                          >
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                              {isWatchlisted ? 'favorite' : 'favorite_border'}
                            </span>
                          </button>
                        </div>
                        <p className="text-body-sm text-on-surface-variant flex items-center gap-1 text-xs mt-1">
                          <span className="material-symbols-outlined text-sm">location_on</span> {p.location.address}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          {p.facilities.slice(0, 3).map((f) => (
                            <span key={f} className="bg-surface-container text-on-surface-variant text-[10px] px-1.5 py-0.5 rounded font-label-sm">{f}</span>
                          ))}
                        </div>
                        <p className="font-headline-sm text-primary text-sm">
                          {formatPrice(lowestPrice)}
                          <span className="text-xs text-on-surface-variant font-normal ml-1">/bln</span>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 z-50 bg-on-surface/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsFilterOpen(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-surface-container-lowest rounded-t-3xl p-margin-mobile pb-8 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex justify-center py-3 mb-4">
              <div className="w-12 h-1.5 bg-outline-variant rounded-full" />
            </div>
            <h2 className="font-headline-sm font-bold text-on-surface mb-6">Filter</h2>
            <div className="space-y-4">
              <div>
                <label className="text-label-md font-semibold text-on-surface block mb-2">Kota</label>
                <div className="flex flex-wrap gap-2">
                  {['Semua', 'Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta'].map((city) => (
                    <button
                      key={city}
                      onClick={() => setSelectedCity(city === 'Semua' ? '' : city)}
                      className={`px-4 py-2 rounded-full text-label-sm ${
                        (city === 'Semua' && !selectedCity) || selectedCity === city
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-full bg-primary text-on-primary py-3 rounded-lg font-semibold mt-4"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}
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
