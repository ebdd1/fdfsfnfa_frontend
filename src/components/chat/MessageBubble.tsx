import React from 'react';
import { Check, CheckCheck, Clock, AlertCircle } from 'lucide-react';
import { MapPin } from 'lucide-react';

interface MessageBubbleProps {
  content: string;
  contentType: string;
  createdAt: string;
  isMe: boolean;
  status?: string;
  onRetry?: () => void;
  partnerAvatar?: string;
}

const fmtTime = (d: string) =>
  new Date(d).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  contentType,
  createdAt,
  isMe,
  status,
  onRetry,
  partnerAvatar,
}) => {
  const isImage = contentType === 'image';
  const isLocation = contentType === 'location';

  return (
    <div className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
      {!isMe && (
        <div className="w-7 shrink-0">
          {partnerAvatar && (
            <img src={partnerAvatar} alt="" className="w-7 h-7 rounded-full object-cover" />
          )}
        </div>
      )}
      <div
        className={`max-w-[78%] sm:max-w-[65%] px-3.5 py-2.5 shadow-sm ${
          isMe
            ? 'bg-primary text-on-primary rounded-2xl rounded-tr-md rounded-br-md'
            : 'bg-surface-container-lowest text-on-surface border border-outline-variant rounded-2xl rounded-tl-md rounded-bl-md'
        }`}
      >
        {isImage ? (
          <img
            src={content}
            alt="Gambar"
            loading="lazy"
            className="w-auto max-w-[220px] sm:max-w-[260px] max-h-48 object-cover rounded-lg cursor-pointer"
            onClick={() => window.open(content, '_blank')}
          />
        ) : isLocation ? (
          <a
            href={`https://maps.google.com/?q=${content}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[13px] font-medium hover:underline"
          >
            <MapPin className="w-4 h-4 shrink-0" />
            <span>Lihat Lokasi di Peta</span>
          </a>
        ) : (
          <p className="text-[13px] leading-relaxed whitespace-pre-wrap break-words">{content}</p>
        )}
        <div className={`flex items-center justify-end gap-1 mt-1 ${isMe ? 'text-on-primary/70' : 'text-outline'}`}>
          <span className="text-[9px] font-medium">{fmtTime(createdAt)}</span>
          {isMe && (
            <>
              {status === 'sending' && <Clock className="w-3 h-3 animate-spin" />}
              {status === 'failed' && onRetry && (
                <button onClick={onRetry} title="Kirim ulang" className="cursor-pointer">
                  <AlertCircle className="w-3 h-3 text-error" />
                </button>
              )}
              {(status === 'sent' || !status) && <Check className="w-3 h-3" />}
              {status === 'read' && <CheckCheck className="w-3 h-3" />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
