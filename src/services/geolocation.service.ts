/**
 * Geolocation service for getting device GPS location
 * Used when owner shares their location to set kost coordinates
 */

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface GeoLocationError {
  code: number;
  message: string;
}

// Geolocation error codes
export const GEO_ERRORS = {
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3,
} as const;

type GeoSuccessCallback = (location: GeoLocation) => void;
type GeoErrorCallback = (error: GeoLocationError) => void;
type GeoOptions = {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
};

const isGeolocationSupported = (): boolean => {
  return 'geolocation' in navigator;
};

/**
 * Get current position with device GPS
 * @param onSuccess - Callback when location is obtained
 * @param onError - Callback when error occurs
 * @param options - Geolocation options
 */
export const getCurrentPosition = (
  onSuccess: GeoSuccessCallback,
  onError: GeoErrorCallback,
  options?: GeoOptions
): void => {
  if (!isGeolocationSupported()) {
    onError({
      code: -1,
      message: 'Geolocation tidak didukung oleh browser ini',
    });
    return;
  }

  const defaultOptions: GeoOptions = {
    enableHighAccuracy: true, // Use GPS for better accuracy
    timeout: 10000, // 10 seconds
    maximumAge: 60000, // Cache for 1 minute
  };

  navigator.geolocation.getCurrentPosition(
    (position) => {
      onSuccess({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
      });
    },
    (error) => {
      const geoError: GeoLocationError = {
        code: error.code,
        message: getErrorMessage(error.code),
      };
      onError(geoError);
    },
    { ...defaultOptions, ...options }
  );
};

/**
 * Watch position continuously (for real-time tracking)
 * @param onSuccess - Callback when location updates
 * @param onError - Callback when error occurs
 * @param options - Geolocation options
 * @returns watchId to clear watch
 */
export const watchPosition = (
  onSuccess: GeoSuccessCallback,
  onError: GeoErrorCallback,
  options?: GeoOptions
): number => {
  if (!isGeolocationSupported()) {
    onError({
      code: -1,
      message: 'Geolocation tidak didukung oleh browser ini',
    });
    return -1;
  }

  const defaultOptions: GeoOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0, // No cache for watch mode
  };

  return navigator.geolocation.watchPosition(
    (position) => {
      onSuccess({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
      });
    },
    (error) => {
      onError({
        code: error.code,
        message: getErrorMessage(error.code),
      });
    },
    { ...defaultOptions, ...options }
  );
};

/**
 * Stop watching position
 * @param watchId - The watch ID returned by watchPosition
 */
export const clearWatch = (watchId: number): void => {
  if (watchId >= 0) {
    navigator.geolocation.clearWatch(watchId);
  }
};

/**
 * Get human-readable error message from error code
 */
const getErrorMessage = (code: number): string => {
  switch (code) {
    case GEO_ERRORS.PERMISSION_DENIED:
      return 'Izin lokasi ditolak. Mohon aktifkan lokasi di pengaturan browser.';
    case GEO_ERRORS.POSITION_UNAVAILABLE:
      return 'Lokasi tidak tersedia. Pastikan GPS aktif dan coba lagi.';
    case GEO_ERRORS.TIMEOUT:
      return 'Waktu habis. Mohon coba lagi.';
    default:
      return 'Terjadi kesalahan saat mengambil lokasi.';
  }
};

/**
 * Check if location is within Palopo area
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns true if within Palopo bounds
 */
export const isWithinPalopo = (lat: number, lng: number): boolean => {
  // Palopo bounds
  const PALOPO_BOUNDS = {
    minLat: -3.05,
    maxLat: -2.90,
    minLng: 120.10,
    maxLng: 120.30,
  };

  return (
    lat >= PALOPO_BOUNDS.minLat &&
    lat <= PALOPO_BOUNDS.maxLat &&
    lng >= PALOPO_BOUNDS.minLng &&
    lng <= PALOPO_BOUNDS.maxLng
  );
};

/**
 * Calculate distance between two points (Haversine formula)
 * @param lat1 - Latitude of point 1
 * @param lng1 - Longitude of point 1
 * @param lat2 - Latitude of point 2
 * @param lng2 - Longitude of point 2
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (deg: number): number => {
  return deg * (Math.PI / 180);
};
