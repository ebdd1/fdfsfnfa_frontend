import { useMemo } from 'react';
import { useNavigate, useSearchParams, useLocation, Navigate } from 'react-router-dom';
import { SearchPage } from '../components/SearchPage';
import { Footer } from '../components/Footer';
import { useProperties } from '../hooks/useProperties';
import { useWatchlist } from '../hooks/useWatchlist';
import { useAuthStore } from '../stores/authStore';

/**
 * Route container for /search.
 * Fetches real listings from API, derives rooms from the listing
 * payload, and wires watchlist + navigation to real handlers.
 * Footer visible for complete page experience.
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

  const rooms = useMemo(() => properties.flatMap((p) => p.rooms || []), [properties]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-32 bg-surface min-h-[60vh]">
        <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-3xl text-primary animate-spin">progress_activity</span>
        </div>
        <p className="text-body-md font-semibold text-on-surface">Memuat daftar kost...</p>
        <p className="text-body-sm text-outline mt-2">Mohon tunggu sebentar</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-32 bg-surface min-h-[60vh]">
        <div className="w-16 h-16 bg-error-container rounded-full flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-3xl text-error">error</span>
        </div>
        <p className="text-body-md font-semibold text-on-surface mb-2">Gagal memuat daftar kost</p>
        <p className="text-body-sm text-outline mb-4">Terjadi kesalahan saat mengambil data</p>
        <div className="flex gap-3">
          <button
            onClick={() => refetch()}
            className="bg-primary text-on-primary px-6 py-3 rounded-lg text-label-md font-label-md hover:brightness-90 transition-all shadow-[0_4px_10px_rgba(0,53,148,0.2)]"
          >
            Coba Lagi
          </button>
          <button
            onClick={() => navigate('/')}
            className="border border-outline text-on-surface px-6 py-3 rounded-lg text-label-md font-label-md hover:bg-surface-container transition-all"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
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
      </div>
      <Footer />
    </div>
  );
};
