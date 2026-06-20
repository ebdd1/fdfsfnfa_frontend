import React, { useState, useRef, useEffect } from 'react';
import type { Conversation, Message } from '../types';
import { useAuthStore } from '../stores/authStore';
import { Send, CheckCheck, Check, ArrowLeft, MessageSquare, Search, Image, MapPin, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { QueuedMessage } from '../services/offlineQueue';

interface InboxPageProps {
  conversations: Conversation[];
  messages: Message[];
  onSendMessage: (convId: string, content: string, contentType?: 'text' | 'image' | 'location') => void;
  onSelectConversation: (convId: string | null) => void;
  selectedConversationId: string | null;
  typingUsers?: Record<string, { name: string }>;
  onTyping?: (convId: string, toUserId: string, isTyping: boolean) => void;
  onlineUsers?: Set<string>;
  queuedMessages?: QueuedMessage[];
  onRetryMessage?: (tempId: string) => void;
}

const fmtTime = (d: string) =>
  new Date(d).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

const dayLabel = (d: string) => {
  const date = new Date(d);
  const today = new Date();
  const yest = new Date();
  yest.setDate(today.getDate() - 1);
  const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  if (sameDay(date, today)) return 'Hari ini';
  if (sameDay(date, yest)) return 'Kemarin';
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

const initials = (name?: string) => (name || '?').trim().charAt(0).toUpperCase();

const Avatar: React.FC<{ src?: string; name?: string; size?: string; className?: string }> = ({
  src,
  name,
  size = 'w-10 h-10',
  className = '',
}) => (
  <div
    className={`${size} rounded-full overflow-hidden bg-emerald-50 border border-emerald-100/60 flex items-center justify-center text-emerald-700 font-bold shrink-0 ${className}`}
  >
    {src ? (
      <img src={src} alt={name} className="w-full h-full object-cover" />
    ) : (
      <span className="text-[0.9em]">{initials(name)}</span>
    )}
  </div>
);

export const InboxPage: React.FC<InboxPageProps> = ({
  conversations,
  messages,
  onSendMessage,
  onSelectConversation,
  selectedConversationId,
  typingUsers,
  onTyping,
  onlineUsers,
  queuedMessages = [],
  onRetryMessage,
}) => {
  const { user } = useAuthStore();
  const currentUserId = user?.id;
  const [inputText, setInputText] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [search, setSearch] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeConversation = conversations.find((c) => c.id === selectedConversationId);
  const activeMessages = messages.filter((m) => m.conversation_id === selectedConversationId);
  const partner = activeConversation
    ? activeConversation.owner_id === currentUserId
      ? activeConversation.seeker
      : activeConversation.owner
    : undefined;
  const partnerId = activeConversation
    ? activeConversation.owner_id === currentUserId
      ? activeConversation.seeker_id
      : activeConversation.owner_id
    : undefined;

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length, selectedConversationId]);

  const handleSend = () => {
    if (!inputText.trim() || !selectedConversationId) return;
    onSendMessage(selectedConversationId, inputText, 'text');
    setInputText('');
    // Stop typing indicator
    if (onTyping && partnerId) {
      onTyping(selectedConversationId, partnerId, false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);

    // Debounced typing indicator
    if (onTyping && partnerId && selectedConversationId) {
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Emit typing=true
      onTyping(selectedConversationId, partnerId, true);

      // Auto-stop after 2s idle
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(selectedConversationId, partnerId, false);
      }, 2000);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedConversationId) return;

    setUploadingImage(true);
    try {
      const { uploadService } = await import('../services/api/upload.service');
      const { url } = await uploadService.uploadImage(file);
      onSendMessage(selectedConversationId, url, 'image');
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Gagal upload gambar');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleShareLocation = () => {
    if (!selectedConversationId) return;

    if (!navigator.geolocation) {
      alert('Browser tidak mendukung GPS');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationStr = `${latitude},${longitude}`;
        onSendMessage(selectedConversationId, locationStr, 'location');
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Gagal mengambil lokasi. Pastikan izin lokasi diaktifkan.');
      }
    );
  };

  const quickReplies = [
    'Apakah kamar masih kosong?',
    'Boleh jadwalkan survey lokasi?',
    'Harga sudah termasuk listrik?',
    'Bagaimana fasilitas parkir?',
  ];

  const visibleThreads = conversations
    .filter((c) => filter === 'all' || c.unread_count > 0)
    .filter((c) => {
      if (!search.trim()) return true;
      const tu = c.owner_id === currentUserId ? c.seeker : c.owner;
      return (tu?.name || '').toLowerCase().includes(search.toLowerCase());
    });

  return (
    <div className="flex h-full w-full min-w-0 overflow-hidden bg-white text-left">
      {/* ─────────────── Thread list ─────────────── */}
      <aside
        className={`flex flex-col flex-shrink-0 border-r border-slate-100 bg-white transition-all duration-300 ${
          selectedConversationId ? 'hidden md:flex md:w-[340px]' : 'w-full md:w-[340px]'
        }`}
      >
        <div className="px-5 pt-5 pb-4 space-y-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">Pesan</h2>
            <span className="text-[11px] font-semibold text-slate-400">{conversations.length} percakapan</span>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari percakapan..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-transparent text-[13px] text-slate-700 placeholder-slate-400 focus:bg-white focus:border-slate-200 outline-none transition-all"
            />
          </div>

          {/* Filter */}
          <div className="flex gap-1.5">
            {(['all', 'unread'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                  filter === f ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {f === 'all' ? 'Semua' : 'Belum Dibaca'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {visibleThreads.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-400 text-[13px] font-medium">
              {search ? 'Tidak ada hasil pencarian' : `Tidak ada pesan${filter === 'unread' ? ' yang belum dibaca' : ''}`}
            </div>
          ) : (
            visibleThreads.map((c) => {
              const isSelected = c.id === selectedConversationId;
              const threadUser = c.owner_id === currentUserId ? c.seeker : c.owner;
              const threadMessages = messages.filter((m) => m.conversation_id === c.id);
              const lastMsg = threadMessages[threadMessages.length - 1];

              return (
                <button
                  key={c.id}
                  onClick={() => onSelectConversation(c.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors relative text-left ${
                    isSelected ? 'bg-emerald-50/60' : 'hover:bg-slate-50'
                  }`}
                >
                  {isSelected && <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-emerald-600 rounded-r-full" />}

                  <div className="relative shrink-0">
                    <Avatar src={threadUser?.avatar_url} name={threadUser?.name} size="w-12 h-12" />
                    {threadUser?.is_verified && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                        <CheckCheck className="w-2 h-2 text-white" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center gap-2 mb-0.5">
                      <h4 className="text-[14px] font-bold text-slate-800 truncate">{threadUser?.name || 'Pengguna'}</h4>
                      {lastMsg && (
                        <span className="text-[10px] font-medium text-slate-400 shrink-0">{fmtTime(lastMsg.created_at)}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-[12.5px] truncate ${c.unread_count > 0 ? 'text-slate-700 font-semibold' : 'text-slate-400'}`}>
                        {lastMsg
                          ? lastMsg.content_type === 'image'
                            ? <span className="inline-flex items-center gap-1"><Image className="w-3 h-3 shrink-0" />Gambar</span>
                            : lastMsg.content_type === 'location'
                            ? <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3 shrink-0" />Lokasi</span>
                            : lastMsg.content
                          : 'Belum ada pesan'}
                      </p>
                      {c.unread_count > 0 && (
                        <span className="shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                          {c.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* ─────────────── Conversation pane ─────────────── */}
      <main
        className={`flex-1 min-w-0 flex flex-col bg-slate-50/60 ${
          selectedConversationId ? 'flex' : 'hidden md:flex'
        }`}
      >
        {activeConversation ? (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 px-4 sm:px-6 h-[68px] bg-white border-b border-slate-100 shrink-0">
              <button
                onClick={() => onSelectConversation(null)}
                className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <Avatar src={partner?.avatar_url} name={partner?.name} size="w-10 h-10" />
              <div className="min-w-0">
                <h3 className="text-[14px] font-bold text-slate-800 truncate">{partner?.name || 'Pengguna'}</h3>
                {partnerId && (
                  <span className={`text-[11px] font-semibold flex items-center gap-1.5 ${
                    onlineUsers?.has(partnerId) ? 'text-emerald-600' : 'text-slate-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      onlineUsers?.has(partnerId) ? 'bg-emerald-500' : 'bg-slate-400'
                    }`} />
                    {onlineUsers?.has(partnerId) ? 'Online' : 'Offline'}
                  </span>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-8 py-6 space-y-1">
              {activeMessages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                  <MessageSquare className="w-8 h-8 mb-2 text-slate-300" />
                  <p className="text-[13px] font-semibold">Mulai percakapan</p>
                  <p className="text-[11px]">Kirim pesan pertama Anda ke {partner?.name || 'pengguna'}.</p>
                </div>
              )}

              {activeMessages.map((m, i) => {
                const isMe = m.sender_id === currentUserId;
                const prev = activeMessages[i - 1];
                const showDay = !prev || dayLabel(prev.created_at) !== dayLabel(m.created_at);
                const grouped = prev && prev.sender_id === m.sender_id && !showDay;

                return (
                  <React.Fragment key={m.id}>
                    {showDay && (
                      <div className="flex justify-center py-3">
                        <span className="px-3 py-1 rounded-full bg-slate-200/70 text-slate-500 text-[10px] font-bold uppercase tracking-wide">
                          {dayLabel(m.created_at)}
                        </span>
                      </div>
                    )}
                    <div className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'} ${grouped ? 'mt-0.5' : 'mt-3'}`}>
                      {!isMe && (
                        <div className="w-7 shrink-0">
                          {!grouped && <Avatar src={partner?.avatar_url} name={partner?.name} size="w-7 h-7" />}
                        </div>
                      )}
                      <div
                        className={`group max-w-[78%] sm:max-w-[65%] px-3.5 py-2.5 shadow-sm ${
                          isMe
                            ? `bg-emerald-600 text-white rounded-2xl ${grouped ? 'rounded-tr-md' : 'rounded-tr-md'} rounded-br-md`
                            : `bg-white text-slate-800 border border-slate-100 rounded-2xl ${grouped ? 'rounded-tl-md' : 'rounded-tl-md'} rounded-bl-md`
                        }`}
                      >
                        {m.content_type === 'image' ? (
                          <img
                            src={m.content}
                            alt="Attachment"
                            className="max-w-full rounded-lg cursor-pointer"
                            onClick={() => window.open(m.content, '_blank')}
                          />
                        ) : m.content_type === 'location' ? (
                          <a
                            href={`https://maps.google.com/?q=${m.content}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-[13.5px] font-medium hover:underline"
                          >
                            <MapPin className="w-4 h-4" />
                            <span>Lihat Lokasi di Peta</span>
                          </a>
                        ) : (
                          <p className="text-[13.5px] leading-relaxed whitespace-pre-wrap break-words">{m.content}</p>
                        )}
                        <div className={`flex items-center justify-end gap-1 mt-1 ${isMe ? 'text-emerald-100/80' : 'text-slate-400'}`}>
                          <span className="text-[9px] font-medium">{fmtTime(m.created_at)}</span>
                          {isMe && (
                            <>
                              {(m as any).status === 'sending' && <Clock className="w-3 h-3 animate-spin" />}
                              {(m as any).status === 'failed' && onRetryMessage && (
                                <div
                                  className="cursor-pointer"
                                  onClick={() => onRetryMessage((m as any).id)}
                                  title="Klik untuk kirim ulang"
                                >
                                  <AlertCircle className="w-3 h-3 text-red-300 hover:text-red-200" />
                                </div>
                              )}
                              {(m as any).status === 'sent' && <Check className="w-3 h-3" />}
                              {!(m as any).status && <CheckCheck className="w-3 h-3" />}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}

              {/* Queued messages (pending/failed) */}
              {queuedMessages
                .filter((q) => q.conversationId === selectedConversationId)
                .map((q) => (
                  <div key={q.id} className="flex items-end gap-2 justify-end mt-0.5">
                    <div className="group max-w-[78%] sm:max-w-[65%] px-3.5 py-2.5 shadow-sm bg-emerald-600/70 text-white rounded-2xl rounded-tr-md rounded-br-md border-2 border-dashed border-emerald-400">
                      <p className="text-[13.5px] leading-relaxed whitespace-pre-wrap break-words">{q.content}</p>
                      <div className="flex items-center justify-end gap-1 mt-1 text-emerald-100/80">
                        <Clock className="w-3 h-3" />
                        <span className="text-[9px] font-medium">
                          {q.status === 'pending' && 'Tertunda'}
                          {q.status === 'sending' && 'Mengirim...'}
                          {q.status === 'failed' && `Gagal (${q.retryCount}/${3})`}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

              <div ref={chatBottomRef} />
            </div>

            {/* Typing indicator */}
            {typingUsers && selectedConversationId && typingUsers[selectedConversationId] && (
              <div className="px-4 sm:px-8 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 shrink-0">
                    <Avatar src={partner?.avatar_url} name={partner?.name} size="w-7 h-7" />
                  </div>
                  <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-md px-3.5 py-2.5 shadow-sm">
                    <p className="text-[12px] text-slate-500 italic">
                      {typingUsers[selectedConversationId].name} sedang mengetik...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick replies */}
            <div className="px-4 sm:px-6 pt-3 bg-white border-t border-slate-100">
              <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {quickReplies.map((qr) => (
                  <button
                    key={qr}
                    onClick={() => onSendMessage(activeConversation.id, qr, 'text')}
                    className="whitespace-nowrap shrink-0 px-3.5 py-1.5 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 text-[11.5px] font-semibold text-slate-500 rounded-full border border-slate-150 hover:border-emerald-200 transition-all active:scale-95 cursor-pointer"
                  >
                    {qr}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="flex items-center gap-2.5 px-4 sm:px-6 py-4 bg-white">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="shrink-0 p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                title="Kirim gambar"
              >
                <Image className="w-5 h-5" />
              </button>
              <button
                onClick={handleShareLocation}
                className="shrink-0 p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Bagikan lokasi"
              >
                <MapPin className="w-5 h-5" />
              </button>
              <input
                type="text"
                placeholder={uploadingImage ? "Uploading..." : "Ketik pesan..."}
                value={inputText}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={uploadingImage}
                className="flex-1 min-w-0 px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-[13.5px] text-slate-700 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all disabled:opacity-50"
              />
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={handleSend}
                disabled={!inputText.trim() || uploadingImage}
                className="shrink-0 w-11 h-11 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white rounded-2xl shadow-sm transition-colors flex items-center justify-center cursor-pointer"
              >
                <Send className="w-[18px] h-[18px]" />
              </motion.button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center text-center px-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
              <MessageSquare className="w-7 h-7 text-emerald-500" />
            </div>
            <h3 className="text-[15px] font-bold text-slate-700 mb-1">Pilih sebuah percakapan</h3>
            <p className="text-[12.5px] text-slate-400 max-w-xs">
              Pilih percakapan dari panel kiri untuk mulai berkirim pesan dengan calon penyewa atau pemilik kost.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
