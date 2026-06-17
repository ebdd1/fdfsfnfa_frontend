import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { DetailPage } from '../components/DetailPage';
import { useProperty, useProperties } from '../hooks/useProperties';
import { useAuthStore } from '../stores/authStore';
import { conversationService } from '../services/api/conversation.service';

/**
 * Route container for /property/:id.
 * GET /listings/:id is JWT-guarded on the backend, so an unauthenticated user
 * hitting this route will be redirected to /login by the axios 401 interceptor.
 */
export const DetailPageContainer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { property, isLoading, isError, refetch } = useProperty(id);
  const { properties } = useProperties();

  const recommendations = (properties || [])
    .filter((p) => p.id !== id)
    .slice(0, 3);

  const handleStartChat = async (ownerId: string, propertyId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const conversation = await conversationService.create({
        seekerId: user.id,
        ownerId,
        propertyId,
      });
      navigate(`/chat?c=${conversation.id}`);
    } catch {
      // Surface failure without a fake success; keep the user on the page.
      alert('Gagal memulai percakapan. Silakan coba lagi.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-32 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mb-3" />
        <p className="text-sm font-semibold">Memuat detail kost...</p>
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-32 text-slate-500">
        <AlertCircle className="w-8 h-8 text-red-400 mb-3" />
        <p className="text-sm font-semibold mb-4">Kost tidak ditemukan atau gagal dimuat.</p>
        <div className="flex gap-3">
          <button
            onClick={() => refetch()}
            className="text-xs font-bold bg-emerald-600 text-white px-5 py-2.5 rounded-full hover:bg-emerald-700 transition-colors"
          >
            Coba Lagi
          </button>
          <button
            onClick={() => navigate('/search')}
            className="text-xs font-bold border border-slate-300 text-slate-700 px-5 py-2.5 rounded-full hover:bg-slate-50 transition-colors"
          >
            Kembali ke Pencarian
          </button>
        </div>
      </div>
    );
  }

  return (
    <DetailPage
      property={property}
      rooms={property.rooms || []}
      recommendations={recommendations}
      onBack={() => navigate(-1)}
      onStartChat={handleStartChat}
    />
  );
};
