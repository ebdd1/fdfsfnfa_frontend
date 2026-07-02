import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import Map, { Marker, Popup, GeolocateControl, NavigationControl, ScaleControl, Source, Layer } from 'react-map-gl/mapbox';
import type { MapRef, ViewStateChangeEvent } from 'react-map-gl/mapbox';
import { motion, AnimatePresence } from 'framer-motion';
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
  Car,
  Navigation,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Compass,
  Navigation2,
} from 'lucide-react';
import type { Property, Room } from '../types';
import 'mapbox-gl/dist/mapbox-gl.css';

// Palopo city center coordinates [longitude, latitude]
const PALOPO_CENTER: [number, number] = [120.19, -2.99];

// City-to-coordinate mapping for selectedCity flyTo
const CITY_COORDS: Record<string, [number, number]> = {
  Palopo: [120.19, -2.99],
  Jakarta: [106.82, -6.20],
  Bandung: [107.61, -6.90],
  Surabaya: [112.75, -7.25],
  Yogyakarta: [110.37, -7.80],
};

// Filter bounds for validating property GPS coords
const PALOPO_VALID_BOUNDS: [[number, number], [number, number]] = [
  [119.50, -3.50],
  [120.80, -2.30],
];

// Map navigation bounds
const SULAWESI_BOUNDS: [[number, number], [number, number]] = [
  [118.00, -6.50],
  [124.00, 2.00],
];

// Google Maps-style map configurations
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
  navigation: {
    label: 'Navigasi',
    url: 'mapbox://styles/mapbox/navigation-night-v1',
    icon: Navigation,
  },
} as const;

type MapStyleKey = keyof typeof MAP_STYLES;

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

// FlyToOptions type (from mapbox-gl)
interface FlyToOptions {
  center?: [number, number];
  zoom?: number;
  bearing?: number;
  pitch?: number;
  curve?: number;
  duration?: number;
  essential?: boolean;
}

// Google Maps-like animation presets
const FLY_TO_PRESETS: Record<string, FlyToOptions> = {
  default: { duration: 1000, essential: true },
  fast: { duration: 500, essential: true },
  smooth: { duration: 2000, curve: 1.42, essential: true },
};

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

// Zoom threshold for price disclosure.
// Below this zoom, markers render as a compact dot to avoid clutter at city/district view.
// At or above this zoom, streets are clearly visible and the full price tag is shown.
// Hover or selection always promotes the marker to the full price tag regardless of zoom.
const PRICE_VISIBLE_ZOOM = 15;

// Memoized PriceMarker - prevents re-renders when props haven't changed
type PriceMarkerProps = {
  property: Property;
  rooms: Room[];
  isHovered: boolean;
  isSelected: boolean;
  zoom: number;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

const PriceMarker = React.memo<PriceMarkerProps>((props) => {
  const { property, rooms, isHovered, isSelected, zoom, onClick, onMouseEnter, onMouseLeave } = props;
  const lowestPrice = getLowestPrice(rooms);
  const priceText = formatPriceShort(lowestPrice);
  const isActive = isHovered || isSelected;
  const showFullPrice = isActive || zoom >= PRICE_VISIBLE_ZOOM;

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
      <motion.div
        className="relative cursor-pointer"
        initial={false}
        animate={{
          scale: isActive ? 1.15 : 1,
          y: isActive ? -4 : 0,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {showFullPrice ? (
            <motion.div
              key="full"
              layout
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: 'spring', stiffness: 420, damping: 26 }}
              className="relative"
            >
              {/* Shadow */}
              <motion.div
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-black/20 rounded-full blur-sm"
                animate={{
                  width: isActive ? 24 : 18,
                  height: isActive ? 6 : 4,
                }}
                transition={{ duration: 0.2 }}
              />

              {/* Price body */}
              <motion.div
                className={`
                  relative px-3 py-1.5 rounded-full text-sm font-bold shadow-lg whitespace-nowrap
                  ${isActive
                    ? 'bg-[#004ac6] text-white ring-4 ring-[#004ac6]/30'
                    : property.is_verified
                      ? 'bg-white text-slate-800 border-2 border-[#004ac6]'
                      : 'bg-white text-slate-800 border-2 border-slate-200'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {property.is_verified && !isActive && (
                  <span className="inline-block w-1.5 h-1.5 bg-[#006c49] rounded-full mr-1 align-middle" />
                )}
                {priceText}
              </motion.div>

              {/* Arrow pointer */}
              <div
                className={`
                  absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-0 h-0
                  border-l-[6px] border-r-[6px] border-t-[8px]
                  border-l-transparent border-r-transparent
                  ${isActive ? 'border-t-[#004ac6]' : 'border-t-white'}
                `}
              />
            </motion.div>
          ) : (
            <motion.div
              key="dot"
              layout
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={{ type: 'spring', stiffness: 420, damping: 26 }}
              aria-label={`Kost ${property.name}, ${priceText} per bulan. Perbesar peta untuk melihat harga.`}
              className={`
                relative w-3 h-3 rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.25)]
                ring-2 ring-white
                ${property.is_verified ? 'bg-[#004ac6]' : 'bg-slate-500'}
              `}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </Marker>
  );
});

// Memoized Zoom Controls - Google Maps style
const ZoomControls = React.memo<{
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetBearing: () => void;
}>(({ onZoomIn, onZoomOut, onResetBearing }) => (
  <div className="flex flex-col gap-0.5 bg-white rounded-lg shadow-lg overflow-hidden">
    <button
      onClick={onZoomIn}
      aria-label="Zoom in"
      className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer border-b border-slate-100"
    >
      <ZoomIn className="w-4 h-4 text-slate-700" />
    </button>
    <button
      onClick={onZoomOut}
      aria-label="Zoom out"
      className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer border-b border-slate-100"
    >
      <ZoomOut className="w-4 h-4 text-slate-700" />
    </button>
    <button
      onClick={onResetBearing}
      aria-label="Reset bearing"
      className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer"
    >
      <Compass className="w-4 h-4 text-slate-700" />
    </button>
  </div>
));

// Memoized Layer Toggle Panel - Google Maps style
const LayerPanel = React.memo<{
  isOpen: boolean;
  onToggle: () => void;
  mapStyle: MapStyleKey;
  onStyleChange: (style: MapStyleKey) => void;
  showTraffic: boolean;
  onToggleTraffic: () => void;
}>(({ isOpen, onToggle, mapStyle, onStyleChange, showTraffic, onToggleTraffic }) => (
  <div className="relative">
    <button
      onClick={onToggle}
      aria-label="Toggle layers"
      className="bg-white rounded-full shadow-lg w-11 h-11 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#004ac6] focus:ring-offset-2"
    >
      <Layers className="w-5 h-5" />
    </button>

    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ duration: 0.15 }}
          className="absolute top-12 right-0 bg-white rounded-xl shadow-xl border border-slate-200 p-2 min-w-[160px] z-[1001]"
        >
          <p className="text-xs font-bold text-slate-500 px-2 pb-2">Tipe Peta</p>
          {(['streets', 'satellite', 'navigation'] as MapStyleKey[]).map((key) => {
            const Style = MAP_STYLES[key];
            const Icon = Style.icon;
            return (
              <button
                key={key}
                onClick={() => onStyleChange(key)}
                className={`
                  w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer
                  ${mapStyle === key
                    ? 'bg-[#004ac6] text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {Style.label}
              </button>
            );
          })}

          <div className="border-t border-slate-100 my-2" />

          <button
            onClick={onToggleTraffic}
            className={`
              w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer
              ${showTraffic
                ? 'bg-[#004ac6] text-white'
                : 'text-slate-700 hover:bg-slate-100'
              }
            `}
          >
            <Car className="w-4 h-4" />
            Lalu Lintas
            {showTraffic && (
              <span className="ml-auto w-2 h-2 bg-green-400 rounded-full" />
            )}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
));

// Fullscreen Property Card - Google Maps bottom sheet style
const PropertyCard: React.FC<{
  property: Property;
  rooms: Room[];
  onClose: () => void;
  onViewDetails: () => void;
  isLoadingRoute: boolean;
}> = ({ property, rooms, onClose, onViewDetails, isLoadingRoute }) => {
  const lowestPrice = getLowestPrice(rooms);
  const [currentImage, setCurrentImage] = useState(0);
  const images = property.media.length > 0 ? property.media : [{ url_thumbnail: '/placeholder.jpg', url_medium: '/placeholder.jpg' }];

  const handleExternalNavigation = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${property.location.latitude},${property.location.longitude}`;
    window.open(url, '_blank');
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="bg-white rounded-t-2xl shadow-2xl overflow-hidden z-[1002]"
    >
      {/* Handle */}
      <div className="flex justify-center pt-3 pb-2">
        <div className="w-10 h-1 bg-slate-300 rounded-full" />
      </div>

      {/* Image carousel */}
      <div className="relative h-48">
        <img
          src={images[currentImage]?.url_medium || images[currentImage]?.url_thumbnail}
          alt={property.name}
          className="w-full h-full object-cover"
        />

        {/* Image navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentImage((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Image counter */}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
          {currentImage + 1}/{images.length}
        </div>

        {/* Verified badge */}
        {property.is_verified && (
          <div className="absolute top-2 left-2 bg-[#006c49] text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Verified
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-slate-800 mb-1">{property.name}</h3>
        <p className="text-sm text-slate-500 flex items-center gap-1 mb-3">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          {property.location.address}
        </p>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-[#004ac6] font-extrabold text-xl">
              {formatPriceShort(lowestPrice)}
            </p>
            <p className="text-xs text-slate-400">per bulan</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-700">{rooms.length} kamar</p>
            <p className="text-xs text-slate-400">tersedia</p>
          </div>
        </div>

        <button
          onClick={onViewDetails}
          className="w-full mt-4 bg-[#004ac6] text-white font-bold py-3 px-4 rounded-xl hover:bg-[#003a9e] active:bg-[#002d7a] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#004ac6] focus:ring-offset-2"
        >
          Lihat Detail & Booking
        </button>

        <button
          onClick={handleExternalNavigation}
          disabled={isLoadingRoute}
          className="w-full mt-2 bg-white border-2 border-[#004ac6] text-[#004ac6] font-bold py-3 px-4 rounded-xl hover:bg-[#004ac6] hover:text-white active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoadingRoute ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Menghitung Rute...
            </>
          ) : (
            <>
              <Navigation2 className="w-4 h-4" />
              Navigasi ke Lokasi
            </>
          )}
        </button>
      </div>
    </motion.div>
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
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const [showTraffic, setShowTraffic] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [zoom, setZoom] = useState(14);
  const [routeGeometry, setRouteGeometry] = useState<{
    type: 'Feature';
    geometry: { type: 'LineString'; coordinates: number[][] };
    properties: Record<string, unknown>;
  } | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [showGestureHint, setShowGestureHint] = useState(true);

  // Debounce ref for route fetching - prevents rapid API calls
  const routeFetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-hide mobile gesture hint after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowGestureHint(false), 3000);
    return () => {
      clearTimeout(timer);
      // Clean up route fetch timeout on unmount
      if (routeFetchTimeoutRef.current) {
        clearTimeout(routeFetchTimeoutRef.current);
      }
    };
  }, []);

  // Fly to selected city when prop changes
  useEffect(() => {
    if (!selectedCity || !mapRef.current) return;
    const coords = CITY_COORDS[selectedCity];
    if (!coords) return;
    mapRef.current.flyTo({
      center: coords,
      zoom: 12,
      pitch: 0,
      bearing: 0,
      duration: 1500,
      essential: true,
    });
  }, [selectedCity]);

  const mapRef = useRef<MapRef | null>(null);

  // Filter properties with valid coordinates
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

  const filteredProperties = useMemo(() => {
    if (activeFilter === 'all') return validProperties;
    if (activeFilter === 'verified') {
      return validProperties.filter((p) => p.property.is_verified);
    }
    return validProperties.filter((p) => p.property.type === activeFilter);
  }, [validProperties, activeFilter]);

  // Fetch driving route from Directions API (debounced)
  const fetchRoute = useCallback(async (start: [number, number], end: [number, number]) => {
    if (!accessToken) return;

    // Clear existing timeout (debounce)
    if (routeFetchTimeoutRef.current) {
      clearTimeout(routeFetchTimeoutRef.current);
    }

    routeFetchTimeoutRef.current = setTimeout(async () => {
      setIsLoadingRoute(true);
      try {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${accessToken}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.routes?.[0]) {
          setRouteGeometry(data.routes[0]);
        }
      } catch (err) {
        console.warn('[Map] Failed to fetch route:', err);
      } finally {
        setIsLoadingRoute(false);
      }
    }, 500); // 500ms debounce
  }, [accessToken]);

  // Open preview only. Redirect to the detail page is intentionally NOT triggered here —
  // it is the bottom sheet's "View Details" button (onViewDetails prop) that owns navigation,
  // so users on mobile can read the preview and decide before being routed away.
  const handleMarkerClick = useCallback((prop: PropertyMarker) => {
    setPopupInfo(prop);
    setIsBottomSheetOpen(true);

    // Calculate route from city center to property
    fetchRoute(PALOPO_CENTER, [prop.property.location.longitude, prop.property.location.latitude]);

    mapRef.current?.flyTo({
      center: [prop.property.location.longitude, prop.property.location.latitude],
      zoom: 16,
      pitch: 45,
      bearing: 0,
      ...FLY_TO_PRESETS.smooth,
    });
  }, [fetchRoute]);

  // Handle map load with 3D buildings + Indonesian language labels
  const handleMapLoad = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const style = map.getStyle();
    if (!style?.layers) return;

    // Set Indonesian language labels for all symbol layers
    style.layers.forEach((layer) => {
      if (layer.type === 'symbol' && layer.layout?.['text-field']) {
        try {
          map.setLayoutProperty(layer.id, 'text-field', [
            'coalesce',
            ['get', 'name_id'],   // Bahasa Indonesia
            ['get', 'name'],      // fallback
          ]);
        } catch (e) {
          // Some layers may not support this, silently skip
        }
      }
    });

    const layers = style.layers;
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

  // Custom zoom controls
  const handleZoomIn = useCallback(() => {
    mapRef.current?.zoomIn({ duration: 300 });
  }, []);

  const handleZoomOut = useCallback(() => {
    mapRef.current?.zoomOut({ duration: 300 });
  }, []);

  const handleResetBearing = useCallback(() => {
    mapRef.current?.easeTo({
      bearing: 0,
      pitch: 0,
      duration: 500,
    });
  }, []);

  // Handle view state changes
  const handleMove = useCallback((evt: ViewStateChangeEvent) => {
    setZoom(Math.round(evt.viewState.zoom));
  }, []);

  // Close bottom sheet and clear route
  const handleCloseBottomSheet = useCallback(() => {
    setIsBottomSheetOpen(false);
    setPopupInfo(null);
    setRouteGeometry(null);
    mapRef.current?.flyTo({
      center: PALOPO_CENTER,
      zoom: 14,
      pitch: 0,
      bearing: 0,
      ...FLY_TO_PRESETS.smooth,
    });
  }, []);

  // No access token placeholder
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
    <div className="h-full w-full relative overflow-hidden" style={{ cursor: 'grab' }}>
      {/* Mobile gesture hint - auto-hides after 3 seconds */}
      {showGestureHint && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-slate-900/80 text-white text-xs px-3 py-2 rounded-full backdrop-blur-sm z-10 pointer-events-none md:hidden">
          Gunakan 2 jari untuk zoom
        </div>
      )}

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
        minZoom={4}
        maxZoom={20}
        onLoad={handleMapLoad}
        onMove={handleMove}
        dragRotate={true}
        touchPitch={true}
        attributionControl={false}
      >
        {/* Native controls - enabled for Google Maps UX */}
        <NavigationControl showCompass={true} showZoom={true} visualizePitch={true} position="bottom-right" />
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

        {/* Route line layer */}
        {routeGeometry && (
          <Source id="route" type="geojson" data={routeGeometry}>
            <Layer
              id="route-line"
              type="line"
              paint={{
                'line-color': '#004ac6',
                'line-width': 4,
                'line-opacity': 0.8,
              }}
            />
            <Layer
              id="route-line-outline"
              type="line"
              paint={{
                'line-color': '#ffffff',
                'line-width': 6,
                'line-opacity': 0.5,
              }}
            />
          </Source>
        )}

        {/* Property markers — render as compact dot until zoom ≥ PRICE_VISIBLE_ZOOM */}
        {filteredProperties.map(({ property, rooms }) => (
          <PriceMarker
            key={property.id}
            property={property}
            rooms={rooms}
            isHovered={hoveredPropertyId === property.id}
            isSelected={popupInfo?.property.id === property.id}
            zoom={zoom}
            onClick={() => handleMarkerClick({ property, rooms })}
            onMouseEnter={() => onHoverProperty(property.id)}
            onMouseLeave={() => onHoverProperty(null)}
          />
        ))}

        {/* Popup for quick preview */}
        {popupInfo && !isBottomSheetOpen && (
          <Popup
            longitude={popupInfo.property.location.longitude}
            latitude={popupInfo.property.location.latitude}
            anchor="bottom"
            offset={28}
            closeOnClick={false}
            onClose={() => setPopupInfo(null)}
            maxWidth="280px"
          >
            <div className="w-full">
              <img
                src={popupInfo.property.media[0]?.url_thumbnail || '/placeholder.jpg'}
                alt={popupInfo.property.name}
                className="w-full h-28 object-cover rounded-t-lg"
                loading="lazy"
              />
              <div className="p-3">
                <h4 className="font-bold text-sm text-slate-800 line-clamp-1 mb-0.5">
                  {popupInfo.property.name}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-1 mb-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  {popupInfo.property.location.address}
                </p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[#004ac6] font-extrabold text-base">
                      {formatPriceShort(getLowestPrice(popupInfo.rooms))}
                    </p>
                    <p className="text-xs text-slate-400">/bulan</p>
                  </div>
                  <button
                    onClick={() => handleMarkerClick(popupInfo)}
                    className="text-xs font-bold text-[#004ac6] hover:text-[#003a9e]"
                  >
                    Detail
                  </button>
                </div>
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* ===== Google Maps-style Custom UI ===== */}

      {/* Top: Search bar + filter button */}
      <div className="absolute top-3 left-3 right-3 z-[1000] pointer-events-none">
        <div className="pointer-events-auto space-y-2">
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
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Filter chips */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none"
              >
                {FILTER_CHIPS.map((chip) => {
                  const Icon = chip.icon;
                  const isActive = activeFilter === chip.id;
                  return (
                    <motion.button
                      key={chip.id}
                      onClick={() => setActiveFilter(chip.id)}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className={`
                        flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full
                        text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer
                        ${isActive
                          ? 'bg-[#004ac6] text-white shadow-md'
                          : 'bg-white text-slate-700 border border-slate-200 hover:border-[#004ac6] hover:text-[#004ac6]'
                        }
                      `}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {chip.label}
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right: Custom zoom controls */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2">
        <ZoomControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetBearing={handleResetBearing}
        />

        {/* Layer toggle */}
        <LayerPanel
          isOpen={showLayerPanel}
          onToggle={() => setShowLayerPanel(!showLayerPanel)}
          mapStyle={mapStyle}
          onStyleChange={setMapStyle}
          showTraffic={showTraffic}
          onToggleTraffic={() => setShowTraffic(!showTraffic)}
        />
      </div>

      {/* Bottom: Zoom level indicator */}
      <div className="absolute bottom-20 right-3 z-[1000]">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-medium text-slate-600 shadow">
          {zoom}x
        </div>
      </div>

      {/* Empty state */}
      {filteredProperties.length === 0 && (
        <div className="absolute inset-x-3 bottom-20 z-[999] pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-4 pointer-events-auto"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#004ac6]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-[#004ac6]" />
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
                    <X className="w-3 h-3" />
                    Hapus Filter
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Bottom Sheet - Full Property Card */}
      <AnimatePresence>
        {isBottomSheetOpen && popupInfo && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseBottomSheet}
              className="fixed inset-0 bg-black/30 z-[1001]"
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-[1002] max-h-[85vh] overflow-auto"
            >
              <PropertyCard
                property={popupInfo.property}
                rooms={popupInfo.rooms}
                onClose={handleCloseBottomSheet}
                onViewDetails={() => onSelectProperty(popupInfo.property.id)}
                isLoadingRoute={isLoadingRoute}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapboxMapView;
