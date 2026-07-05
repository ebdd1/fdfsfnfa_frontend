import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface ChatHeaderProps {
  partnerName?: string;
  partnerAvatar?: string;
  partnerId?: string;
  onlineUsers?: Set<string>;
  onBack?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  partnerName,
  partnerAvatar,
  partnerId,
  onlineUsers,
  onBack,
}) => {
  const isOnline = partnerId && onlineUsers?.has(partnerId);

  return (
    <div className="flex items-center gap-3 px-4 sm:px-6 h-[68px] bg-surface-container-lowest border-b border-outline-variant shrink-0">
      {onBack && (
        <button
          onClick={onBack}
          className="md:hidden p-2 -ml-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer"
          aria-label="Kembali ke daftar percakapan"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}
      <div
        className="w-10 h-10 rounded-full overflow-hidden bg-primary-50 border border-primary-100 flex items-center justify-center shrink-0">
        {partnerAvatar ? (
          <img src={partnerAvatar} alt={partnerName} className="w-full h-full object-cover" />
        ) : (
          <span className="text-[0.9em] font-bold text-primary-700">{(partnerName || '?')[0]?.toUpperCase()}</span>
        )}
      </div>
      <div className="min-w-0">
        <h3 className="text-[14px] font-semibold text-on-surface truncate">
          {partnerName || 'Pengguna'}
        </h3>
        {partnerId && (
          <span className={`text-[11px] font-medium flex items-center gap-1.5 ${
            isOnline ? 'text-secondary' : 'text-outline'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-secondary' : 'bg-outline'}`} />
            {isOnline ? 'Online' : 'Offline'}
          </span>
        )}
      </div>
    </div>
  );
};
