import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import type { Property, Room } from '../types';

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom marker icons
const createMarkerIcon = (isHovered: boolean) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: ${isHovered ? '#059669' : 'white'};
        color: ${isHovered ? 'white' : '#1e293b'};
        padding: 6px 10px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 900;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        border: 2px solid ${isHovered ? '#059669' : '#e2e8f0'};
        white-space: nowrap;
        transition: all 0.2s ease;
        transform: scale(${isHovered ? 1.1 : 1});
      ">
        <span style="
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 10px;
          height: 10px;
          background: ${isHovered ? '#059669' : 'white'};
          border-right: 2px solid ${isHovered ? '#059669' : '#e2e8f0'};
          border-bottom: 2px solid ${isHovered ? '#059669' : '#e2e8f0'};
          transform: translateX(-50%) rotate(45deg);
        "></span>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
};

interface PropertyMarker {
  property: Property;
  rooms: Room[];
}

interface MapViewProps {
  properties: PropertyMarker[];
  hoveredPropertyId: string | null;
  onSelectProperty: (id: string) => void;
  onHoverProperty: (id: string | null) => void;
  selectedCity?: string;
}

// Component to fit bounds when properties change
const MapBounds: React.FC<{ properties: PropertyMarker[] }> = ({ properties }) => {
  const map = useMap();

  useEffect(() => {
    if (properties.length === 0) return;

    const validProps = properties.filter(
      (p) => p.property.location.latitude && p.property.location.longitude
    );

    if (validProps.length === 0) return;

    if (validProps.length === 1) {
      map.setView(
        [validProps[0].property.location.latitude, validProps[0].property.location.longitude],
        15
      );
    } else {
      const bounds = L.latLngBounds(
        validProps.map((p) => [
          p.property.location.latitude,
          p.property.location.longitude,
        ])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [properties, map]);

  return null;
};

export const MapView: React.FC<MapViewProps> = ({
  properties,
  hoveredPropertyId,
  onSelectProperty,
  onHoverProperty,
  selectedCity,
}) => {
  // Calculate center from properties or default to Indonesia
  const getDefaultCenter = (): [number, number] => {
    if (properties.length === 0) return [-3.3, 120.2]; // Indonesia center

    const validProps = properties.filter(
      (p) => p.property.location.latitude && p.property.location.longitude
    );

    if (validProps.length === 0) return [-3.3, 120.2];

    const avgLat = validProps.reduce((sum, p) => sum + p.property.location.latitude, 0) / validProps.length;
    const avgLng = validProps.reduce((sum, p) => sum + p.property.location.longitude, 0) / validProps.length;

    return [avgLat, avgLng];
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `Rp ${(price / 1000000).toFixed(1)}jt`;
    }
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const getLowestPrice = (rooms: Room[]) => {
    if (rooms.length === 0) return 0;
    return Math.min(...rooms.map((r) => r.price_monthly));
  };

  // Filter properties with valid coordinates
  const validProperties = properties.filter(
    (p) => p.property.location.latitude && p.property.location.longitude
  );

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={getDefaultCenter()}
        zoom={12}
        className="h-full w-full rounded-none"
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapBounds properties={validProperties} />

        {validProperties.map(({ property, rooms }) => {
          const isHovered = hoveredPropertyId === property.id;
          const lowestPrice = getLowestPrice(rooms);

          return (
            <Marker
              key={property.id}
              position={[property.location.latitude, property.location.longitude]}
              icon={createMarkerIcon(isHovered)}
              eventHandlers={{
                click: () => onSelectProperty(property.id),
                mouseover: () => onHoverProperty(property.id),
                mouseout: () => onHoverProperty(null),
              }}
            >
              <Popup>
                <div className="min-w-[180px]">
                  <img
                    src={property.media[0]?.url_thumbnail || property.media[0]?.url_medium}
                    alt={property.name}
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                  <h4 className="font-bold text-sm text-slate-800 line-clamp-1">
                    {property.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mb-1">
                    {property.location.address}
                  </p>
                  <p className="text-emerald-600 font-extrabold">
                    {formatPrice(lowestPrice)}
                    <span className="text-slate-400 font-normal text-[10px]"> /bln</span>
                  </p>
                  <button
                    onClick={() => onSelectProperty(property.id)}
                    className="mt-2 w-full bg-emerald-600 text-white text-xs font-bold py-1.5 px-3 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Lihat Detail
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Overlay header — removed backdrop-blur for performance */}
      <div className="absolute top-4 left-4 right-4 z-[1000]">
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-100 text-left">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">
            Peta Kost
          </h4>
          <p className="text-sm font-extrabold text-slate-800">
            {validProperties.length} kost di{' '}
            <span className="text-[#004ac6]">{selectedCity || 'semua kota'}</span>
          </p>
        </div>
      </div>

      {/* Legend */}
      {validProperties.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-[1000] bg-slate-100/80">
          <div className="text-center p-6">
            <p className="text-sm font-bold text-slate-600 mb-1">Tidak ada kost dengan koordinat</p>
            <p className="text-xs text-slate-400">
              Kost belum memiliki data GPS yang valid
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
