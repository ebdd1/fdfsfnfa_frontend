import React, { useState, useCallback, useMemo, useRef } from 'react';
import Map, { Marker, Popup, GeolocateControl, NavigationControl, ScaleControl } from 'react-map-gl/mapbox';
import type { MapRef } from 'react-map-gl/mapbox';
import {
  Map as MapIcon,
  MapPin,
  Layers,
  Search,
  SlidersHorizontal,
  X,
  CheckCircle,
  Home,
  Building2,
} from 'lucide-react';
import type { Property, Room } from '../types';
import 'mapbox-gl/dist/mapbox-gl.css';

// Palopo city center coordinates [longitude, latitude]
const PALOPO_CENTER: [number, number] = [120.19, -2.99];

// Filter bounds for validating property GPS coords (lebih luas, mencakup Palopo + sekitar)
// Format: [[lng, lat], [lng, lat]] - SW corner, NE corner
const PALOPO_VALID_BOUNDS: [[number, number], [number, number]] = [
  [119.50, -3.50], // SouthWest — lebih luas
  [120.80, -2.30], // NorthEast — mencakup Luwu, Toraja
];

// Map navigation bounds (Sulawesi Selatan + Tengah region)
// User bisa pan/zoom untuk eksplorasi seperti Google Maps
const SULAWESI_BOUNDS: [[number, number], [number, number]] = [
  [118.00, -6.50], // SW: Sulawesi Selatan bawah
  [124.00, 2.00],  // NE: Sulawesi Utara atas
];

// Available map styles (Google Maps-like options)
const MAP_STYLES = {
  streets: {
    label: 'Peta',
    url: 'mapbox://styles/mapbox/streets-v12',
    icon: MapIcon,
  },
  satellite: {
    label: 'Satelit',
    url: 'mapbox://styles/mapbox/satellite-streets-v12',
    icon: Layers,
  },
} as const;

type MapStyleKey = keyof typeof MAP_STYLES;

// Filter chips for property type (KostFind-specific filters)
const FILTER_CHIPS = [
  { id: 'all', label: 'Semua', icon: Home },
  { id: 'kost_putra', label: 'Putra', icon: Building2 },
  { id: 'kost_putri', label: 'Putri', icon: Building2 },
  { id: 'kost_campur', label: 'Campur', icon: Building2 },
  { id: 'verified', label: 'Verified', icon: CheckCircle },
] as const;

interface PropertyMarker {
  property: Property;
  rooms: Room[];
}

interface MapboxMapViewProps {
  properties: PropertyMarker[];
  hoveredPropertyId: string | null;
  onSelectProperty: (id: string) => void;
  onHoverProperty: (id: string | null) => void;
  selectedCity?: string;
  accessToken?: string;
}

// Format price to Indonesian short format
const formatPriceShort = (price: number): string => {
  if (price >= 1000000) {
    return `Rp ${(price / 1000000).toFixed(1)}jt`;
  }
  return `Rp ${(price / 1000).toFixed(0)}rb`;
};

const getLowestPrice = (rooms: Room[]): number => {
  if (rooms.length === 0) return 0;
  return Math.min(...rooms.map((r) => r.price_monthly));
};

// Price marker component - Google Maps style with KostFind branding
const PriceMarker: React.FC<{
  property: Property;
  rooms: Room[];
  isHovered: boolean;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}> = ({ property, rooms, isHovered, isSelected, onClick, onMouseEnter, onMouseLeave }) => {
  const lowestPrice = getLowestPrice(rooms);
  const priceText = formatPriceShort(lowestPrice);
  const isActive = isHovered || isSelected;

  return (
    <Marker
      longitude={property.location.longitude}
      latitude={property.location.latitude}
      anchor="bottom"
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        onClick();
      }}
    >
      <div
        className="relative cursor-pointer transition-all duration-200"
        style={{ transform: isActive ? 'scale(1.15) translateY(-2px)' : 'scale(1)' }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div
          className={`
            px-3 py-1.5 rounded-full text-sm font-bold shadow-lg whitespace-nowrap
            transition-all duration-200 select-none
            ${isActive
              ? 'bg-[#004ac6] text-white ring-4 ring-[#004ac6]/30'
              : property.is_verified
                ? 'bg-white text-slate-800 border-2 border-[#004ac6] hover:border-[#004ac6]'
                : 'bg-white text-slate-800 border-2 border-slate-200 hover:border-[#004ac6]'
            }
          `}
        >
          {/* Verified badge dot */}
          {property.is_verified && !isActive && (
            <span className="inline-block w-1.5 h-1.5 bg-[#006c49] rounded-full mr-1 align-middle" />
          )}
          {priceText}
        </div>
        {/* Arrow pointer */}
        <div
          className={`
            absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-0 h-0
            border-l-[6px] border-r-[6px] border-t-[8px]
            border-l-transparent border-r-transparent
            ${isActive ? 'border-t-[#004ac6]' : 'border-t-white'}
          `}
        />
      </div>
    </Marker>
  );
};

export const MapboxMapView: React.FC<MapboxMapViewProps> = ({
  properties,
  hoveredPropertyId,
  onSelectProperty,
  onHoverProperty,
  selectedCity,
  accessToken,
}) => {
  const [popupInfo, setPopupInfo] = useState<PropertyMarker | null>(null);
  const [mapStyle, setMapStyle] = useState<MapStyleKey>('streets');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const mapRef = useRef<MapRef | null>(null);

  // Filter properties with valid coordinates in Palopo area
  const validProperties = useMemo(() => {
    return properties.filter((p) => {
      const { latitude, longitude } = p.property.location;
      if (!latitude || !longitude) return false;

      const [sw, ne] = PALOPO_VALID_BOUNDS;
      return (
        longitude >= sw[0] &&
        longitude <= ne[0] &&
        latitude >= sw[1] &&
        latitude <= ne[1]
      );
    });
  }, [properties]);

  // Apply filter chip
  const filteredProperties = useMemo(() => {
    if (activeFilter === 'all') return validProperties;
    if (activeFilter === 'verified') {
      return validProperties.filter((p) => p.property.is_verified);
    }
    return validProperties.filter((p) => p.property.type === activeFilter);
  }, [validProperties, activeFilter]);

  const handleMarkerClick = useCallback(
    (prop: PropertyMarker) => {
      setPopupInfo(prop);
      onSelectProperty(prop.property.id);
    },
    [onSelectProperty],
  );

  const handleMapLoad = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    // Add 3D buildings (visible at zoom 15+) for Google Maps-like depth
    const layers = map.getStyle()?.layers;
    if (!layers) return;
    const labelLayerId = layers.find(
      (layer) => layer.type === 'symbol' && layer.layout?.['text-field'],
    )?.id;

    if (!map.getLayer('3d-buildings') && map.getSource('composite')) {
      try {
        map.addLayer(
          {
            id: '3d-buildings',
            source: 'composite',
            'source-layer': 'building',
            filter: ['==', 'extrude', 'true'],
            type: 'fill-extrusion',
            minzoom: 15,
            paint: {
              'fill-extrusion-color': '#e5e7eb',
              'fill-extrusion-height': [
                'interpolate', ['linear'], ['zoom'],
                15, 0, 15.05, ['get', 'height'],
              ],
              'fill-extrusion-base': [
                'interpolate', ['linear'], ['zoom'],
                15, 0, 15.05, ['get', 'min_height'],
              ],
              'fill-extrusion-opacity': 0.6,
            },
          },
          labelLayerId,
        );
      } catch (e) {
        console.warn('[Map] Could not add 3D buildings layer');
      }
    }
  }, [mapStyle]);

  const toggleMapStyle = useCallback(() => {
    setMapStyle((prev) => (prev === 'streets' ? 'satellite' : 'streets'));
  }, []);

  // If no access token, show placeholder
  if (!accessToken) {
    return (
      <div className="h-full w-full bg-slate-100 flex items-center justify-center relative">
        <div className="text-center p-6 max-w-xs">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapIcon className="w-8 h-8 text-slate-500" aria-hidden="true" />
          </div>
          <p className="text-sm font-bold text-slate-600 mb-1">
            Konfigurasi Mapbox Diperlukan
          </p>
          <p className="text-xs text-slate-400">
            Hubungi admin untuk mengaktifkan peta interaktif
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: PALOPO_CENTER[0],
          latitude: PALOPO_CENTER[1],
          zoom: 14,
          pitch: 0,
          bearing: 0,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={MAP_STYLES[mapStyle].url}
        mapboxAccessToken={accessToken}
        maxBounds={SULAWESI_BOUNDS}
        minZoom={7}
        maxZoom={18}
        onLoad={handleMapLoad}
        dragRotate={true}
        touchPitch={true}
        attributionControl={false}
      >
        {/* Native Mapbox controls */}
        <NavigationControl position="bottom-right" visualizePitch={true} />
        <GeolocateControl
          position="bottom-right"
          trackUserLocation={true}
          showUserHeading={true}
          showAccuracyCircle={true}
          positionOptions={{
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          }}
        />
        <ScaleControl position="bottom-left" unit="metric" />

        {/* Property markers */}
        {filteredProperties.map(({ property, rooms }) => {
          const isHovered = hoveredPropertyId === property.id;
          const isSelected = popupInfo?.property.id === property.id;

          return (
            <PriceMarker
              key={property.id}
              property={property}
              rooms={rooms}
              isHovered={isHovered}
              isSelected={isSelected}
              onClick={() => handleMarkerClick({ property, rooms })}
              onMouseEnter={() => onHoverProperty(property.id)}
              onMouseLeave={() => onHoverProperty(null)}
            />
          );
        })}

        {/* Property popup card */}
        {popupInfo && (
          <Popup
            longitude={popupInfo.property.location.longitude}
            latitude={popupInfo.property.location.latitude}
            anchor="bottom"
            offset={28}
            closeOnClick={false}
            onClose={() => setPopupInfo(null)}
            className="mapbox-popup-kostfind"
            maxWidth="280px"
          >
            <div className="w-full">
              {/* Image with verified badge */}
              <div className="relative">
                <img
                  src={popupInfo.property.media[0]?.url_thumbnail || popupInfo.property.media[0]?.url_medium}
                  alt={popupInfo.property.name}
                  className="w-full h-32 object-cover rounded-t-xl"
                  loading="lazy"
                  width={280}
                  height={128}
                />
                {popupInfo.property.is_verified && (
                  <div className="absolute top-2 left-2 bg-[#006c49] text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" aria-hidden="true" />
                    Verified
                  </div>
                )}
              </div>

              <div className="p-3">
                <h4 className="font-bold text-sm text-slate-800 line-clamp-1 mb-0.5">
                  {popupInfo.property.name}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-1 mb-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                  {popupInfo.property.location.address}
                </p>

                <div className="flex items-end justify-between mb-2">
                  <div>
                    <p className="text-[#004ac6] font-extrabold text-base leading-tight">
                      {formatPriceShort(getLowestPrice(popupInfo.rooms))}
                    </p>
                    <p className="text-xs text-slate-400">/bulan</p>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {popupInfo.rooms.length} kamar
                  </span>
                </div>

                <button
                  onClick={() => onSelectProperty(popupInfo.property.id)}
                  className="w-full bg-[#004ac6] text-white text-sm font-bold py-2 px-3 rounded-lg hover:bg-[#003a9e] active:bg-[#002d7a] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#004ac6] focus:ring-offset-2"
                >
                  Lihat Detail
                </button>
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* ===== Google Maps-style UI Overlay ===== */}

      {/* Top: Search bar + filter button */}
      <div className="absolute top-3 left-3 right-3 z-[1000] pointer-events-none">
        <div className="pointer-events-auto space-y-2">
          {/* Search bar mockup (compact for sidebar context) */}
          <div className="bg-white rounded-full shadow-lg border border-slate-200 flex items-center gap-2 px-3 py-2.5">
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {selectedCity || 'Palopo'}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {filteredProperties.length} kost ditemukan
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              aria-label={showFilters ? 'Sembunyikan filter' : 'Tampilkan filter'}
              className={`
                flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                transition-colors cursor-pointer
                ${showFilters
                  ? 'bg-[#004ac6] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }
              `}
            >
              <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* Filter chips - horizontal scroll */}
          {showFilters && (
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
              {FILTER_CHIPS.map((chip) => {
                const Icon = chip.icon;
                const isActive = activeFilter === chip.id;
                return (
                  <button
                    key={chip.id}
                    onClick={() => setActiveFilter(chip.id)}
                    aria-pressed={isActive}
                    className={`
                      flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full
                      text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer
                      ${isActive
                        ? 'bg-[#004ac6] text-white shadow-md'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-[#004ac6] hover:text-[#004ac6]'
                      }
                    `}
                  >
                    <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                    {chip.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right: Map style toggle button (Google Maps-like layer switcher) */}
      <div className="absolute top-3 right-3 z-[999]">
        <button
          onClick={toggleMapStyle}
          aria-label={`Ganti ke ${mapStyle === 'streets' ? 'Satelit' : 'Peta'}`}
          className="bg-white rounded-full shadow-lg w-11 h-11 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#004ac6] focus:ring-offset-2"
        >
          <Layers className="w-5 h-5" aria-hidden="true" />
        </button>
        <div className="mt-1 text-[10px] font-bold text-slate-700 text-center bg-white rounded-md px-1.5 py-0.5 shadow-sm">
          {MAP_STYLES[mapStyle].label}
        </div>
      </div>

      {/* Empty state overlay */}
      {filteredProperties.length === 0 && (
        <div className="absolute inset-x-3 bottom-20 z-[999] pointer-events-none">
          <div className="bg-white rounded-2xl shadow-lg p-4 pointer-events-auto">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#004ac6]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-[#004ac6]" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 mb-0.5">
                  {activeFilter === 'all'
                    ? 'Belum Ada Kost di Sini'
                    : 'Tidak Ada Hasil'}
                </p>
                <p className="text-xs text-slate-500">
                  {activeFilter === 'all'
                    ? 'Kost dengan GPS akan muncul di sini'
                    : 'Coba ubah filter atau perluas area pencarian'}
                </p>
                {activeFilter !== 'all' && (
                  <button
                    onClick={() => setActiveFilter('all')}
                    className="mt-2 text-xs font-bold text-[#004ac6] hover:text-[#003a9e] flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3 h-3" aria-hidden="true" />
                    Hapus Filter
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapboxMapView;
