import { useParams, useNavigate } from 'react-router-dom';
import { DetailPage } from '../components/DetailPage';
import { useProperty, useProperties } from '../hooks/useProperties';
import { useAuthStore } from '../stores/authStore';
import { conversationService } from '../services/api/conversation.service';

/**
 * Route container for /property/:id.
 * GET /listings/:id is JWT-guarded on the backend.
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
        ownerId,
        propertyId,
      });
      navigate(`/chat?c=${conversation.id}`);
    } catch {
      alert('Gagal memulai percakapan. Silakan coba lagi.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-32 bg-surface min-h-screen">
        <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4 animate-pulse">
          <span className="material-symbols-outlined text-3xl text-primary">search</span>
        </div>
        <p className="text-body-md font-semibold text-on-surface">Memuat detail kost...</p>
        <p className="text-body-sm text-outline mt-2">Mohon tunggu sebentar</p>
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-32 bg-surface min-h-screen">
        <div className="w-16 h-16 bg-error-container rounded-full flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-3xl text-error">error</span>
        </div>
        <p className="text-body-md font-semibold text-on-surface mb-2">Kost tidak ditemukan</p>
        <p className="text-body-sm text-outline mb-4">Terjadi kesalahan saat mengambil data</p>
        <div className="flex gap-3">
          <button
            onClick={() => refetch()}
            className="bg-primary text-on-primary px-6 py-3 rounded-lg text-label-md font-label-md hover:brightness-90 transition-all shadow-[0_4px_10px_rgba(0,53,148,0.2)]"
          >
            Coba Lagi
          </button>
          <button
            onClick={() => navigate('/search')}
            className="border border-outline text-on-surface px-6 py-3 rounded-lg text-label-md font-label-md hover:bg-surface-container transition-all"
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
