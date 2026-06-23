import React, { useState } from 'react';
import {
  MessagesSquare,
  Loader2,
  Search,
  Building2,
  ArrowLeftRight,
  ArrowLeft,
  ShieldCheck,
  MapPin,
  Inbox,
} from 'lucide-react';
import { useAdminConversations, useAdminConversationMessages } from '../../hooks/useAdmin';

const fmtClock = (d: string) =>
  new Date(d).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

const fmtThreadTime = (d: string) => {
  const date = new Date(d);
  const today = new Date();
  const sameDay = date.toDateString() === today.toDateString();
  return sameDay
    ? fmtClock(d)
    : date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
};

const dayLabel = (d: string) => {
  const date = new Date(d);
  const today = new Date();
  const yest = new Date();
  yest.setDate(today.getDate() - 1);
  const same = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  if (same(date, today)) return 'Hari ini';
  if (same(date, yest)) return 'Kemarin';
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

const initial = (name?: string) => (name || '?').trim().charAt(0).toUpperCase();

const Avatar: React.FC<{ name?: string; url?: string; size?: string; tone?: 'seeker' | 'owner' }> = ({
  name,
  url,
  size = 'w-9 h-9',
  tone = 'seeker',
}) => {
  const toneCls = tone === 'owner' ? 'bg-[var(--primary-50)] text-[var(--primary-700)] border-[var(--primary-100)]' : 'bg-sky-50 text-sky-700 border-sky-100';
  return (
    <div className={`${size} rounded-full overflow-hidden border flex items-center justify-center font-bold shrink-0 ${toneCls}`}>
      {url ? <img src={url} alt={name || '?'} className="w-full h-full object-cover" /> : <span className="text-[0.7em]">{initial(name)}</span>}
    </div>
  );
};

export const AdminConversationsTab: React.FC = () => {
  const { conversations, isLoading, isError, refetch } = useAdminConversations();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const { messages, isLoading: msgLoading } = useAdminConversationMessages(selectedId);

  const filtered = conversations.filter((c) => {
    const q = search.toLowerCase();
    return (
      !q ||
      c.seeker?.name?.toLowerCase().includes(q) ||
      c.owner?.name?.toLowerCase().includes(q) ||
      c.property?.name?.toLowerCase().includes(q)
    );
  });

  const selected = conversations.find((c) => c.id === selectedId);

  return (
    <div className="flex flex-col h-[calc(100vh-9rem)] animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Percakapan</h2>
          <p className="text-[12px] text-slate-400 mt-0.5">Pantau seluruh percakapan antara pemilik & pencari kost</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[var(--primary-700)] bg-[var(--primary-50)] border border-[var(--primary-100)] px-3 py-1.5 rounded-full shrink-0">
          <MessagesSquare className="w-3.5 h-3.5" />
          {conversations.length} Percakapan
        </span>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* ───── Thread list ───── */}
        <div
          className={`lg:col-span-2 bg-white rounded-2xl border border-slate-200/70 shadow-sm flex-col overflow-hidden min-h-0 ${
            selected ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <div className="p-3 border-b border-slate-100 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari pemilik, pencari, kost..."
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-transparent rounded-xl text-[13px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[var(--primary-500)] transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-5 h-5 animate-spin text-[var(--primary-500)]" />
              </div>
            ) : isError ? (
              <div className="py-16 text-center">
                <p className="text-sm font-semibold text-rose-500 mb-2">Gagal memuat percakapan</p>
                <button onClick={() => refetch()} className="text-xs font-bold text-[var(--primary-600)] underline cursor-pointer">
                  Coba lagi
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 flex flex-col items-center text-center gap-2 px-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mb-1">
                  <Inbox className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-600">{search ? 'Tidak ada hasil' : 'Belum ada percakapan'}</p>
                <p className="text-[11px] text-slate-400">{search ? 'Coba kata kunci lain.' : 'Percakapan akan muncul di sini.'}</p>
              </div>
            ) : (
              filtered.map((c) => {
                const active = selectedId === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={`relative w-full text-left px-4 py-3.5 border-b border-slate-50 transition-colors cursor-pointer ${
                      active ? 'bg-[var(--primary-50)]/60' : 'hover:bg-slate-50'
                    }`}
                  >
                    {active && <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-[var(--primary-500)] rounded-r-full" />}

                    {/* Participants */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center -space-x-2">
                        <Avatar name={c.seeker?.name} url={c.seeker?.avatar_url} size="w-7 h-7" tone="seeker" />
                        <Avatar name={c.owner?.name} url={c.owner?.avatar_url} size="w-7 h-7" tone="owner" />
                      </div>
                      <div className="min-w-0 flex items-center gap-1.5 text-[12px] font-bold text-slate-700">
                        <span className="truncate max-w-[5.5rem]">{c.seeker?.name || 'Pencari'}</span>
                        <ArrowLeftRight className="w-3 h-3 text-slate-300 shrink-0" />
                        <span className="truncate max-w-[5.5rem]">{c.owner?.name || 'Pemilik'}</span>
                      </div>
                      {c.updatedAt && <span className="ml-auto text-[10px] text-slate-400 shrink-0">{fmtThreadTime(c.updatedAt)}</span>}
                    </div>

                    {/* Property */}
                    <div className="flex items-center gap-1.5 text-[10.5px] text-slate-400 mb-1">
                      <Building2 className="w-3 h-3 shrink-0" />
                      <span className="truncate">{c.property?.name || '—'}</span>
                    </div>

                    {/* Last message + count */}
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[12px] text-slate-500 truncate">{c.lastMessage || 'Belum ada pesan'}</p>
                      <span className="shrink-0 text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">
                        {c._count?.messages ?? 0}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ───── Message viewer (read-only) ───── */}
        <div
          className={`lg:col-span-3 bg-white rounded-2xl border border-slate-200/70 shadow-sm flex-col overflow-hidden min-h-0 ${
            selected ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-[var(--primary-50)] flex items-center justify-center text-[var(--primary-400)] mb-4">
                <MessagesSquare className="w-7 h-7" />
              </div>
              <p className="text-[15px] font-bold text-slate-700 mb-1">Pilih sebuah percakapan</p>
              <p className="text-[12px] text-slate-400 max-w-xs">Klik salah satu percakapan di panel kiri untuk memantau isinya secara read-only.</p>
            </div>
          ) : (
            <>
              {/* Viewer header */}
              <div className="flex items-center gap-3 px-4 h-[68px] border-b border-slate-100 shrink-0">
                <button
                  onClick={() => setSelectedId(null)}
                  className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  aria-label="Kembali"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center -space-x-2.5">
                  <Avatar name={selected.seeker?.name} url={selected.seeker?.avatar_url} size="w-9 h-9" tone="seeker" />
                  <Avatar name={selected.owner?.name} url={selected.owner?.avatar_url} size="w-9 h-9" tone="owner" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-slate-800 flex items-center gap-1.5 truncate">
                    <span className="truncate">{selected.seeker?.name || 'Pencari'}</span>
                    <ArrowLeftRight className="w-3 h-3 text-slate-300 shrink-0" />
                    <span className="truncate">{selected.owner?.name || 'Pemilik'}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 shrink-0" />
                    {selected.property?.name}
                    {selected.property?.city ? ` · ${selected.property.city}` : ''}
                  </p>
                </div>
                <span className="ml-auto inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-1 rounded-full shrink-0">
                  <ShieldCheck className="w-3 h-3" />
                  Read-only
                </span>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto min-h-0 px-4 sm:px-6 py-5 bg-slate-50/50 space-y-1">
                {msgLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="w-5 h-5 animate-spin text-[var(--primary-500)]" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                    <MessagesSquare className="w-8 h-8 mb-2 text-slate-300" />
                    <p className="text-[13px] font-semibold">Belum ada pesan</p>
                    <p className="text-[11px]">Percakapan ini belum memiliki pesan.</p>
                  </div>
                ) : (
                  messages.map((m, i) => {
                    const fromOwner = m.senderId === selected.ownerId;
                    const prev = messages[i - 1];
                    const showDay = !prev || dayLabel(prev.createdAt) !== dayLabel(m.createdAt);
                    const grouped = prev && prev.senderId === m.senderId && !showDay;
                    return (
                      <React.Fragment key={m.id}>
                        {showDay && (
                          <div className="flex justify-center py-3">
                            <span className="px-3 py-1 rounded-full bg-slate-200/70 text-slate-500 text-[10px] font-bold uppercase tracking-wide">
                              {dayLabel(m.createdAt)}
                            </span>
                          </div>
                        )}
                        <div className={`flex items-end gap-2 ${fromOwner ? 'justify-end' : 'justify-start'} ${grouped ? 'mt-0.5' : 'mt-3'}`}>
                          {!fromOwner && (
                            <div className="w-6 shrink-0">
                              {!grouped && <Avatar name={m.sender?.name} url={m.sender?.avatar_url} size="w-6 h-6" tone="seeker" />}
                            </div>
                          )}
                          <div className="max-w-[78%] sm:max-w-[62%]">
                            {!grouped && (
                              <div className={`flex items-center gap-1.5 mb-1 ${fromOwner ? 'justify-end' : 'justify-start'}`}>
                                <span className="text-[10px] font-bold text-slate-500">{m.sender?.name}</span>
                                <span className="text-[9px] font-semibold text-slate-300">{fmtClock(m.createdAt)}</span>
                              </div>
                            )}
                            <div
                              className={`px-3.5 py-2.5 text-[13.5px] leading-relaxed shadow-sm whitespace-pre-wrap break-words ${
                                fromOwner
                                  ? 'bg-[var(--primary-600)] text-white rounded-2xl rounded-tr-md'
                                  : 'bg-white text-slate-800 border border-slate-100 rounded-2xl rounded-tl-md'
                              }`}
                            >
                              {m.content}
                            </div>
                          </div>
                          {fromOwner && (
                            <div className="w-6 shrink-0">
                              {!grouped && <Avatar name={m.sender?.name} url={m.sender?.avatar_url} size="w-6 h-6" tone="owner" />}
                            </div>
                          )}
                        </div>
                      </React.Fragment>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
