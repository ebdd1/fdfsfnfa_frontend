import React, { useState } from 'react';
import type { Property, Room } from '../types';
import { Search, MapPin, Heart, SlidersHorizontal, X } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { MapView } from './MapView';

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
  onToggleWatchlist,
  onSelectProperty,
  initialCity = '',
  initialQuery = '',
}) => {
  const { settings } = useSettings();
  const [query, setQuery] = useState(initialQuery);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedType, setSelectedType] = useState('');
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleFacility = (fac: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(fac) ? prev.filter((f) => f !== fac) : [...prev, fac]
    );
  };

  const getPropertyRooms = (propId: string) => {
    return rooms.filter((r) => r.property_id === propId);
  };

  // Filter listings based on selections
  const filteredProperties = properties.filter((p) => {
    const propRooms = getPropertyRooms(p.id);
    const lowestPrice = propRooms.length > 0 ? Math.min(...propRooms.map((r) => r.price_monthly)) : 0;
    
    const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase()) || 
                         p.location.address.toLowerCase().includes(query.toLowerCase());
    const matchesCity = selectedCity ? p.location.city === selectedCity : true;
    const matchesType = selectedType ? p.type === selectedType : true;
    const matchesPrice = lowestPrice <= maxPrice;
    const matchesFacilities = selectedFacilities.every((fac) => p.facilities.includes(fac));

    return matchesQuery && matchesCity && matchesType && matchesPrice && matchesFacilities;
  });

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden relative">
      
      {/* Mobile Filter Backdrop */}
      {isFilterOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsFilterOpen(false)}
        />
      )}
      
      {/* 1. Left Sidebar - Filters */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-white p-6 border-r border-slate-200/80 overflow-y-auto flex-shrink-0 transition-transform duration-300 ease-in-out
        ${isFilterOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        md:relative md:translate-x-0 md:flex md:flex-col md:w-80 md:z-30
      `}>
        
        {/* Header Title */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-left">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 leading-tight">Filter Pencarian</h2>
              <p className="text-[10px] text-slate-400">Temukan kost terverifikasi</p>
            </div>
          </div>
          <button 
            onClick={() => setIsFilterOpen(false)}
            className="md:hidden p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* City Filter */}
        <div className="mb-6 text-left space-y-1.5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Kota</label>
          <select 
            value={selectedCity} 
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full rounded-xl border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all py-2.5 px-3"
          >
            <option value="">Semua Kota</option>
            {settings.cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Tipe Properti */}
        <div className="mb-6 text-left space-y-1.5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Tipe Kost</label>
          <select 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full rounded-xl border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all py-2.5 px-3"
          >
            <option value="">Semua Tipe</option>
            <option value="kost_campur">Campur</option>
            <option value="kost_putra">Putra</option>
            <option value="kost_putri">Putri</option>
          </select>
        </div>

        {/* Rentang Harga Slider */}
        <div className="mb-6 text-left space-y-2">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Maksimum Sewa</label>
          <div className="space-y-1">
            <input 
              type="range" 
              min={500000} 
              max={10000000} 
              step={250000}
              value={maxPrice} 
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none"
            />
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-600">
              <span>Rp 500rb</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Maks: Rp {(maxPrice / 1000000).toFixed(1)}jt</span>
            </div>
          </div>
        </div>

        {/* Fasilitas Grid Pills */}
        <div className="mb-6 text-left space-y-2">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Fasilitas</label>
          <div className="grid grid-cols-2 gap-2">
            {['WiFi', 'AC', 'Parking', 'Bathroom', 'Security', 'Laundry'].map((fac) => {
              const isChecked = selectedFacilities.includes(fac);
              return (
                <button
                  key={fac}
                  onClick={() => toggleFacility(fac)}
                  className={`py-2 px-3 rounded-xl border text-[11px] font-semibold text-center transition-all cursor-pointer ${
                    isChecked 
                      ? 'border-emerald-500 bg-emerald-50/50 text-emerald-800 ring-2 ring-emerald-500/5' 
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {fac}
                </button>
              );
            })}
          </div>
        </div>

        <button 
          onClick={() => {
            setSelectedCity('');
            setSelectedType('');
            setMaxPrice(5000000);
            setSelectedFacilities([]);
          }}
          className="w-full py-3 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-500 hover:text-slate-800 hover:bg-slate-50 active:scale-98 transition-all duration-200 cursor-pointer"
        >
          Reset Filter
        </button>
      </aside>

      {/* 2. Middle - Search Input & Listing Cards Grid */}
      <main className="flex-1 bg-slate-50 p-4 sm:p-6 md:p-8 overflow-y-auto flex flex-col">
        {/* Search header bar */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Mau ngekost di mana? Cari jalan, kota, atau nama kost..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200/80 bg-white text-xs font-medium focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 shadow-sm transition-all outline-none"
            />
          </div>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="md:hidden flex items-center justify-center p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Results title */}
        <div className="flex justify-between items-center mb-6 text-left">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Menampilkan <span className="font-extrabold text-slate-800">{filteredProperties.length} kost</span> terbaik
          </p>
        </div>

        {/* Grid Feed */}
        {filteredProperties.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-7 h-7 text-slate-300" />
            </div>
            <p className="text-sm font-bold text-slate-700 mb-1">Tidak ada kost yang cocok</p>
            <p className="text-xs text-slate-400">Coba ubah filter kota, harga, atau kata kunci pencarian Anda.</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
          {filteredProperties.map((p) => {
            const propRooms = getPropertyRooms(p.id);
            const total = propRooms.length;
            const available = propRooms.filter((r) => r.status === 'available').length;
            const isWatched = watchlist.includes(p.id);

            const lowestPrice = total > 0 ? Math.min(...propRooms.map((r) => r.price_monthly)) : 0;
            const formatPrice = (price: number) => {
              return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
            };

            const isHovered = hoveredPropertyId === p.id;

            return (
              <div 
                key={p.id} 
                onClick={() => onSelectProperty(p.id)}
                onMouseEnter={() => setHoveredPropertyId(p.id)}
                onMouseLeave={() => setHoveredPropertyId(null)}
                className={`bg-white rounded-[28px] overflow-hidden border transition-all duration-300 cursor-pointer group flex flex-col relative ${
                  isHovered ? 'border-emerald-500 shadow-xl shadow-slate-100/60 y-[-4px]' : 'border-slate-200/80 shadow-sm'
                }`}
              >
                {/* Image & badging */}
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img 
                    src={p.media[0]?.url_medium} 
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  
                  {/* Verified badge */}
                  <div className="absolute top-4 left-4">
                    <span className="flex items-center gap-1.5 bg-white/95 text-slate-800 text-[10px] font-bold py-1.5 px-3 rounded-full border border-slate-200 shadow-sm">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      GPS Terverifikasi
                    </span>
                  </div>

                  {/* Watchlist toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWatchlist(p.id);
                    }}
                    className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200/50 text-slate-400 hover:text-red-500 shadow-md transition-all active:scale-95 z-20"
                  >
                    <Heart className={`w-4 h-4 ${isWatched ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>

                  {/* Available count label */}
                  <div className="absolute bottom-4 right-4">
                    <span className={`text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm ${
                      available > 0 ? 'bg-white/90 text-emerald-800' : 'bg-red-50 text-red-700'
                    }`}>
                      {available === 0 ? 'Penuh' : `Sisa ${available} Kamar`}
                    </span>
                  </div>
                </div>

                {/* Content info */}
                <div className="p-6 flex-1 flex flex-col text-left justify-between space-y-4">
                  <div className="space-y-2">
                    <span className={`inline-block text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${
                      p.type === 'kost_campur' 
                        ? 'bg-emerald-50 text-emerald-800' 
                        : p.type === 'kost_putra' 
                          ? 'bg-blue-50 text-blue-800' 
                          : 'bg-pink-50 text-pink-800'
                    }`}>
                      {p.type === 'kost_campur' ? 'Campur' : p.type === 'kost_putra' ? 'Putra' : 'Putri'}
                    </span>

                    <h3 className="text-base font-extrabold text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-1">{p.name}</h3>
                    
                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                      <span className="truncate">{p.location.address}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {p.facilities.slice(0, 3).map((f) => (
                      <span key={f} className="text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-200/50 py-1 px-2.5 rounded-lg">
                        {f}
                      </span>
                    ))}
                    {p.facilities.length > 3 && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 py-1 px-2.5 rounded-lg">
                        +{p.facilities.length - 3} Lainnya
                      </span>
                    )}
                  </div>

                  <div className="border-t border-slate-100 pt-4 mt-auto flex justify-between items-center">
                    <div className="flex items-baseline">
                      <span className="text-lg font-black text-slate-900">{formatPrice(lowestPrice)}</span>
                      <span className="text-slate-400 text-xs ml-0.5">/bln</span>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-600 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                      Detail Kost &rarr;
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </main>

      {/* 3. Right Panel - Real Map with Leaflet */}
      <section className="w-96 border-l border-slate-200/80 overflow-hidden flex-shrink-0 relative hidden lg:flex flex-col">
        <MapView
          properties={filteredProperties.map((p) => ({
            property: p,
            rooms: getPropertyRooms(p.id),
          }))}
          hoveredPropertyId={hoveredPropertyId}
          onSelectProperty={onSelectProperty}
          onHoverProperty={setHoveredPropertyId}
          selectedCity={selectedCity}
        />
      </section>

    </div>
  );
};

