import { useMemo } from 'react';
import { useNavigate, useSearchParams, useLocation, Navigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { SearchPage } from '../components/SearchPage';
import { useProperties } from '../hooks/useProperties';
import { useWatchlist } from '../hooks/useWatchlist';
import { useAuthStore } from '../stores/authStore';

/**
 * Route container for /search.
 * Fetches real listings from GET /listings, derives rooms from the listing
 * payload, and wires watchlist + navigation to real handlers.
 */
export const SearchPageContainer = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const { user, isAuthenticated } = useAuthStore();

  if (pathname === '/search' && isAuthenticated && user && user.role === 'seeker') {
    return <Navigate to={`/anda/home?section=search${window.location.search ? '&' + window.location.search.substring(1) : ''}`} replace />;
  }

  const initialCity = searchParams.get('city') || '';
  const initialQuery = searchParams.get('q') || '';

  const { properties, isLoading, isError, refetch } = useProperties(
    initialCity ? { city: initialCity } : undefined
  );
  const { watchlistIds, toggleWatchlist } = useWatchlist();

  // Rooms are embedded in each property; flatten them for the presentational page.
  const rooms = useMemo(() => properties.flatMap((p) => p.rooms || []), [properties]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-32 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mb-3" />
        <p className="text-sm font-semibold">Memuat daftar kost...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-32 text-slate-500">
        <AlertCircle className="w-8 h-8 text-red-400 mb-3" />
        <p className="text-sm font-semibold mb-4">Gagal memuat daftar kost.</p>
        <button
          onClick={() => refetch()}
          className="text-xs font-bold bg-[var(--primary-600)] text-white px-5 py-2.5 rounded-full hover:bg-[var(--primary-700)] transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <SearchPage
      properties={properties}
      rooms={rooms}
      watchlist={watchlistIds}
      onToggleWatchlist={(id) => {
        if (!isAuthenticated) {
          navigate('/login');
          return;
        }
        toggleWatchlist(id);
      }}
      onSelectProperty={(id) => navigate(`/property/${id}`)}
      initialCity={initialCity}
      initialQuery={initialQuery}
    />
  );
};
