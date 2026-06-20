import React, { useState } from 'react';
import {
  CheckCircle, XCircle, Clock, Home, Loader2,
  Banknote, HandCoins, ZoomIn, X,
} from 'lucide-react';
import { useMyOrders, useOrderActions } from '../hooks/useOrders';
import { useAuthStore } from '../stores/authStore';
import { ORDER_STATUS_LABEL } from '../services/api/order.service';
import { OrderTimeline } from '../components/OrderTimeline';
import type { RentalOrder, OrderStatus } from '../types';

const fmtIDR = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

const STATUS_BADGE: Record<OrderStatus, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-100',
  awaiting_payment: 'bg-blue-50 text-blue-700 border-blue-100',
  awaiting_confirmation: 'bg-violet-50 text-violet-700 border-violet-100',
  active: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  rejected: 'bg-rose-50 text-rose-700 border-rose-100',
  cancelled: 'bg-slate-100 text-slate-600 border-slate-200',
  completed: 'bg-slate-50 text-slate-500 border-slate-200',
};

const MethodBadge: React.FC<{ method?: string }> = ({ method }) => {
  if (!method) return null;
  return method === 'transfer' ? (
    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
      <Banknote className="w-3 h-3" /> Transfer
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
      <HandCoins className="w-3 h-3" /> COD
    </span>
  );
};

/* ── Lightbox ── */
const Lightbox: React.FC<{ url: string; onClose: () => void }> = ({ url, onClose }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm" onClick={onClose}>
    <img src={url} alt="bukti transfer" className="max-w-[90vw] max-h-[85vh] rounded-2xl shadow-2xl" />
    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors">
      <X className="w-5 h-5" />
    </button>
  </div>
);

type TabKey = 'pending' | 'payment' | 'active';

interface OrderCardProps {
  order: RentalOrder;
  tab: TabKey;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onConfirmPayment?: (id: string) => void;
  onRejectPayment?: (id: string) => void;
  onComplete?: (id: string) => void;
  isMutating?: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order, tab, onAccept, onReject, onConfirmPayment, onRejectPayment, onComplete, isMutating,
}) => {
  const [lightbox, setLightbox] = useState('');
  const seeker = order.seeker;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-shadow">
      {lightbox && <Lightbox url={lightbox} onClose={() => setLightbox('')} />}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-black text-sm shrink-0 overflow-hidden">
            {seeker?.avatar_url ? (
              <img src={seeker.avatar_url} alt={seeker.name} className="w-full h-full object-cover" />
            ) : (
              (seeker?.name || '?')[0].toUpperCase()
            )}
          </div>

          <div className="min-w-0 flex-1 text-left">
            <p className="text-sm font-bold text-slate-800 truncate">{seeker?.name || 'Pencari Kost'}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{seeker?.phone || '—'}</p>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg">
                <Home className="w-3 h-3" />
                {order.room?.roomNumber || order.roomId.slice(0, 4)}
              </span>
              <span className="text-[10px] font-semibold text-slate-500">{order.property?.name}</span>
              <MethodBadge method={order.paymentMethod} />
            </div>

            <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-slate-400 font-medium">
              <span>Mulai: {fmtDate(order.startDate)}</span>
              <span>{order.durationMonths} bulan</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="text-base font-black text-slate-900">{fmtIDR(order.priceMonthly)}</span>
          <span className="text-[10px] font-semibold text-slate-400">per bulan</span>
          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${STATUS_BADGE[order.status]}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
            {ORDER_STATUS_LABEL[order.status]}
          </span>
          {order.status === 'active' && order.paidAt && (
            <span className="text-[10px] text-slate-400">Lunas: {fmtDate(order.paidAt)}</span>
          )}
        </div>
      </div>

      {/* Timeline progress — only for non-terminal statuses */}
      {!['rejected', 'cancelled', 'completed'].includes(order.status) && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <OrderTimeline
            status={order.status}
            createdAt={order.createdAt}
            paidAt={order.paidAt}
          />
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
        {/* Tab: pending — accept / reject */}
        {tab === 'pending' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAccept?.(order.id)}
              disabled={isMutating}
              className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
            >
              {isMutating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
              Terima
            </button>
            <button
              onClick={() => onReject?.(order.id)}
              disabled={isMutating}
              className="flex-1 flex items-center justify-center gap-1.5 bg-white hover:bg-rose-50 disabled:opacity-50 text-rose-600 font-extrabold text-xs py-2.5 rounded-xl border border-rose-100 transition-all cursor-pointer"
            >
              {isMutating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
              Tolak
            </button>
          </div>
        )}

        {/* Tab: payment */}
        {tab === 'payment' && (
          <>
            {/* Transfer: tampilkan bukti + konfirmasi/tolak */}
            {order.status === 'awaiting_confirmation' && (
              <div className="space-y-3">
                {order.paymentProofUrl && (
                  <div
                    className="relative cursor-pointer rounded-xl overflow-hidden border border-slate-200 group"
                    onClick={() => setLightbox(order.paymentProofUrl!)}
                  >
                    <img src={order.paymentProofUrl} alt="bukti transfer" className="w-full h-28 object-cover" />
                    <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ZoomIn className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => onConfirmPayment?.(order.id)}
                    disabled={isMutating}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    {isMutating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                    Konfirmasi Transfer
                  </button>
                  <button
                    onClick={() => onRejectPayment?.(order.id)}
                    disabled={isMutating}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-white hover:bg-rose-50 disabled:opacity-50 text-rose-600 font-extrabold text-xs py-2.5 rounded-xl border border-rose-100 transition-all cursor-pointer"
                  >
                    {isMutating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                    Tolak Bukti
                  </button>
                </div>
              </div>
            )}

            {/* COD: konfirmasi setelah terima uang */}
            {order.status === 'awaiting_payment' && order.paymentMethod === 'cod' && (
              <div className="space-y-2">
                <p className="text-[11px] text-amber-600 font-medium bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                  Penyewa akan membayar tunai {fmtIDR(order.totalAmount)} saat check-in. Klik konfirmasi setelah menerima pembayaran.
                </p>
                <button
                  onClick={() => onConfirmPayment?.(order.id)}
                  disabled={isMutating}
                  className="w-full flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  {isMutating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <HandCoins className="w-3.5 h-3.5" />}
                  Konfirmasi Terima Pembayaran COD
                </button>
              </div>
            )}
          </>
        )}

        {/* Tab: active — mark complete */}
        {tab === 'active' && order.status === 'active' && (
          <button
            onClick={() => onComplete?.(order.id)}
            disabled={isMutating}
            className="w-full flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
          >
            {isMutating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
            Tandai Selesai
          </button>
        )}

        <div className="flex justify-end">
          <span className="text-[10px] text-slate-400 font-medium">Total: <b>{fmtIDR(order.totalAmount)}</b></span>
        </div>
      </div>
    </div>
  );
};

export const OwnerOrdersSection: React.FC = () => {
  const [tab, setTab] = useState<TabKey>('pending');
  const { user } = useAuthStore();
  const { orders, isLoading, isError, refetch } = useMyOrders();
  const { acceptOrder, rejectOrder, confirmPayment, rejectPayment, completeOrder, isMutating } = useOrderActions();

  const ownerOrders = orders.filter((o) => o.ownerId === user?.id);
  const pending = ownerOrders.filter((o) => o.status === 'pending');
  // Tab Pembayaran: COD awaiting_payment + transfer awaiting_confirmation
  const payment = ownerOrders.filter(
    (o) =>
      (o.status === 'awaiting_payment' && o.paymentMethod === 'cod') ||
      o.status === 'awaiting_confirmation',
  );
  const active = ownerOrders.filter((o) => o.status === 'active' || o.status === 'completed');

  const listMap: Record<TabKey, RentalOrder[]> = { pending, payment, active };
  const list = listMap[tab];

  const TABS: { key: TabKey; label: string; count: number; icon: React.ReactNode }[] = [
    { key: 'pending', label: 'Menunggu', count: pending.length, icon: <Clock className="w-3.5 h-3.5" /> },
    { key: 'payment', label: 'Pembayaran', count: payment.length, icon: <Banknote className="w-3.5 h-3.5" /> },
    { key: 'active', label: 'Aktif', count: active.length, icon: <CheckCircle className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Permintaan Sewa</h2>
          <p className="text-[12px] text-slate-400 mt-0.5">Kelola pengajuan sewa dari pencari kost</p>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full font-mono">
          {ownerOrders.length} total
        </span>
      </div>

      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {TABS.map(({ key, label, count, icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === key ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {icon}
            {label}
            {count > 0 && (
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                key === 'pending' ? 'bg-amber-500 text-white' :
                key === 'payment' ? 'bg-blue-500 text-white' :
                'bg-emerald-500 text-white'
              }`}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
        </div>
      ) : isError ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-8 text-center">
          <p className="text-sm font-semibold text-rose-500 mb-3">Gagal memuat data permintaan sewa</p>
          <button onClick={() => refetch()} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline">
            Coba lagi
          </button>
        </div>
      ) : list.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-12 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-slate-300" />
          </div>
          <p className="text-sm font-bold text-slate-600 mb-1">
            {tab === 'pending' ? 'Tidak ada permintaan masuk' :
             tab === 'payment' ? 'Tidak ada pembayaran menunggu verifikasi' :
             'Belum ada penyewa aktif'}
          </p>
          <p className="text-xs text-slate-400 max-w-xs">
            {tab === 'pending' ? 'Ketika pencari kost mengajukan sewa, permintaan akan muncul di sini.' :
             tab === 'payment' ? 'Pembayaran dari penyewa akan muncul di sini setelah Anda menerima pengajuan.' :
             'Penyewaan aktif akan muncul di sini setelah Anda mengkonfirmasi pembayaran.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              tab={tab}
              onAccept={acceptOrder}
              onReject={rejectOrder}
              onConfirmPayment={confirmPayment}
              onRejectPayment={rejectPayment}
              onComplete={completeOrder}
              isMutating={isMutating}
            />
          ))}
        </div>
      )}
    </div>
  );
};
