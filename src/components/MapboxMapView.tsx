import React, { useState, useCallback, useMemo, useRef } from 'react';
import Map, { Marker, Popup, GeolocateControl, NavigationControl, ScaleControl } from 'react-map-gl/mapbox';
import type { MapRef } from 'react-map-gl/mapbox';
import { Map as MapIcon, MapPin } from 'lucide-react';
import type { Property, Room } from '../types';
import 'mapbox-gl/dist/mapbox-gl.css';

// Palopo city center coordinates [longitude, latitude]
const PALOPO_CENTER: [number, number] = [120.19, -2.99];
// PALOPO_BOUNDS format: [[lng, lat], [lng, lat]]
const PALOPO_BOUNDS: [[number, number], [number, number]] = [
  [120.10, -3.05], // SouthWest [lng, lat]
  [120.30, -2.90], // NorthEast [lng, lat]
];

// Google Maps-like style — Mapbox Streets v12
// Features: clear roads, street names, POIs, similar to Google Maps Default
const MAPBOX_STYLE = 'mapbox://styles/mapbox/streets-v12';

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
  return `Rp ${price.toLocaleString('id-ID')}`;
};

const getLowestPrice = (rooms: Room[]): number => {
  if (rooms.length === 0) return 0;
  return Math.min(...rooms.map((r) => r.price_monthly));
};

// Price marker component
const PriceMarker: React.FC<{
  property: Property;
  rooms: Room[];
  isHovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}> = ({ property, rooms, isHovered, onClick, onMouseEnter, onMouseLeave }) => {
  const lowestPrice = getLowestPrice(rooms);
  const priceText = formatPriceShort(lowestPrice);

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
        className="relative cursor-pointer transition-transform duration-200"
        style={{ transform: isHovered ? 'scale(1.15)' : 'scale(1)' }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div
          className={`
            px-3 py-1.5 rounded-full text-xs font-black shadow-lg whitespace-nowrap
            transition-all duration-200
            ${isHovered
              ? 'bg-[#004ac6] text-white ring-4 ring-[#004ac6]/30'
              : 'bg-white text-slate-800 border-2 border-slate-200 hover:border-[#004ac6]'
            }
          `}
        >
          {priceText}
        </div>
        {/* Arrow pointer */}
        <div
          className={`
            absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-0 h-0
            border-l-[6px] border-r-[6px] border-t-[8px]
            border-l-transparent border-r-transparent
            ${isHovered ? 'border-t-[#004ac6]' : 'border-t-white'}
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
  const mapRef = useRef<MapRef | null>(null);

  // Filter properties with valid coordinates in Palopo area
  // CRITICAL FIX: Bounds check was backwards (latitude compared with longitude bounds)
  // PALOPO_BOUNDS format: [[lng, lat], [lng, lat]]
  const validProperties = useMemo(() => {
    return properties.filter((p) => {
      const { latitude, longitude } = p.property.location;
      if (!latitude || !longitude) return false;

      const [sw, ne] = PALOPO_BOUNDS;
      // sw = [lng_sw, lat_sw], ne = [lng_ne, lat_ne]
      return (
        longitude >= sw[0] && // lng compared with lng bounds
        longitude <= ne[0] &&
        latitude >= sw[1] && // lat compared with lat bounds
        latitude <= ne[1]
      );
    });
  }, [properties]);

  const handleMarkerClick = useCallback(
    (prop: PropertyMarker) => {
      setPopupInfo(prop);
      onSelectProperty(prop.property.id);
    },
    [onSelectProperty],
  );

  // Add 3D buildings & enhance roads for Google Maps-like appearance
  const handleMapLoad = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    // Add 3D buildings layer (Google Maps-like building visualization)
    const layers = map.getStyle()?.layers;
    if (!layers) return;
    const labelLayerId = layers.find(
      (layer) => layer.type === 'symbol' && layer.layout?.['text-field'],
    )?.id;

    // Only add if not already present
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
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'height'],
              ],
              'fill-extrusion-base': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15,
                0,
                15.05,
                ['get', 'min_height'],
              ],
              'fill-extrusion-opacity': 0.6,
            },
          },
          labelLayerId,
        );
      } catch (e) {
        // Style might not have 'composite' source, skip silently
        console.warn('[Map] Could not add 3D buildings layer');
      }
    }
  }, []);

  // If no access token, show placeholder
  if (!accessToken) {
    return (
      <div className="h-full w-full bg-slate-100 flex items-center justify-center relative">
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-100 text-left">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">
              Peta Kost
            </h4>
            <p className="text-sm font-extrabold text-slate-800">
              {validProperties.length} kost di{' '}
              <span className="text-[#004ac6]">Palopo</span>
            </p>
          </div>
        </div>
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
          pitch: 0, // Set to 45 for 3D angle by default
          bearing: 0,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={MAPBOX_STYLE}
        mapboxAccessToken={accessToken}
        maxBounds={PALOPO_BOUNDS}
        minZoom={11}
        maxZoom={18}
        onLoad={handleMapLoad}
        // Google Maps-like interactions
        dragRotate={true}
        touchPitch={true}
        attributionControl={false}
      >
        {/* Navigation controls (zoom + compass + 3D pitch) */}
        <NavigationControl position="bottom-right" visualizePitch={true} />

        {/* Geolocate control — "use my location" like Google Maps */}
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

        {/* Scale bar (distance reference like Google Maps) */}
        <ScaleControl position="bottom-left" unit="metric" />

        {/* Price markers */}
        {validProperties.map(({ property, rooms }) => {
          const isHovered = hoveredPropertyId === property.id;

          return (
            <PriceMarker
              key={property.id}
              property={property}
              rooms={rooms}
              isHovered={isHovered}
              onClick={() => handleMarkerClick({ property, rooms })}
              onMouseEnter={() => onHoverProperty(property.id)}
              onMouseLeave={() => onHoverProperty(null)}
            />
          );
        })}

        {/* Popup */}
        {popupInfo && (
          <Popup
            longitude={popupInfo.property.location.longitude}
            latitude={popupInfo.property.location.latitude}
            anchor="bottom"
            offset={25}
            closeOnClick={false}
            onClose={() => setPopupInfo(null)}
            className="rounded-2xl"
          >
            <div className="min-w-[180px] p-0">
              <img
                src={popupInfo.property.media[0]?.url_thumbnail || popupInfo.property.media[0]?.url_medium}
                alt={popupInfo.property.name}
                className="w-full h-24 object-cover rounded-t-xl"
                loading="lazy"
              />
              <div className="p-3">
                <h4 className="font-bold text-sm text-slate-800 line-clamp-1">
                  {popupInfo.property.name}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-1 mb-1">
                  {popupInfo.property.location.address}
                </p>
                <p className="text-[#004ac6] font-extrabold">
                  {formatPriceShort(getLowestPrice(popupInfo.rooms))}
                  <span className="text-slate-400 font-normal text-xs"> /bln</span>
                </p>
                <button
                  onClick={() => onSelectProperty(popupInfo.property.id)}
                  className="mt-2 w-full bg-[#004ac6] text-white text-xs font-bold py-1.5 px-3 rounded-lg hover:bg-[#003a9e] transition-colors cursor-pointer"
                >
                  Lihat Detail
                </button>
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* Header overlay — Google Maps-style search bar look */}
      <div className="absolute top-4 left-4 right-4 z-[1000] pointer-events-none">
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-100 text-left pointer-events-auto">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">
            Peta Kost
          </h4>
          <p className="text-sm font-extrabold text-slate-800">
            {validProperties.length} kost di{' '}
            <span className="text-[#004ac6]">{selectedCity || 'Palopo'}</span>
          </p>
        </div>
      </div>

      {/* Empty state overlay */}
      {validProperties.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-[1000] bg-slate-100/90">
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg mx-4">
            <div className="w-12 h-12 bg-[#004ac6]/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-6 h-6 text-[#004ac6]" aria-hidden="true" />
            </div>
            <p className="text-sm font-bold text-slate-600 mb-1">
              Belum Ada Kost di Palopo
            </p>
            <p className="text-xs text-slate-400">
              Kost dengan koordinat GPS akan muncul di sini
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapboxMapView;
