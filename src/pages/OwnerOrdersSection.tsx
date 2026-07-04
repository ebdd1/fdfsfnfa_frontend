import React, { useState } from 'react';
import {
  CheckCircle, XCircle, Clock, Loader2,
  Banknote, HandCoins, ZoomIn, X, Bed, Building2, Calendar, FileText,
} from 'lucide-react';
import { useMyOrders, useOrderActions } from '../hooks/useOrders';
import { useAuthStore } from '../stores/authStore';
import { OrderTimeline } from '../components/OrderTimeline';
import type { RentalOrder } from '../types';

const fmtIDR = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

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

  const isCOD = order.paymentMethod === 'cod';
  const isTransfer = order.paymentMethod === 'transfer';

  return (
    <div className="bg-surface-container-lowest rounded-[16px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-surface-container-high hover:shadow-[0_10px_25px_rgba(0,53,148,0.05)] transition-shadow duration-300 overflow-hidden">
      {lightbox && <Lightbox url={lightbox} onClose={() => setLightbox('')} />}

      <div className="p-6">
        {/* Header / User Info */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            {seeker?.avatar_url ? (
              <img
                src={seeker.avatar_url}
                alt={seeker.name}
                className="w-14 h-14 rounded-xl object-cover border border-surface-container"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-surface-dim flex items-center justify-center text-on-surface-variant font-headline text-xl border border-surface-container">
                {(seeker?.name || '?')[0].toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="font-headline text-headline-sm text-on-surface leading-none mb-1">
                {seeker?.name || 'Pencari Kost'}
              </h3>
              <p className="text-body-sm text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>call</span>
                {seeker?.phone || '—'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-headline text-headline-sm text-primary mb-1">
              {fmtIDR(order.priceMonthly)}
            </p>
            <p className="text-[11px] text-outline uppercase tracking-wide">per bulan</p>
          </div>
        </div>

        {/* Request Details */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="flex items-center gap-1.5 bg-surface-container-low text-on-surface text-sm px-3 py-1.5 rounded-lg border border-surface-container">
            <Bed className="w-4 h-4 text-primary" />
            <span className="font-medium">{order.room?.roomNumber || `Kamar ${order.roomId.slice(0, 4)}`}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-surface-container-low text-on-surface text-sm px-3 py-1.5 rounded-lg border border-surface-container">
            <Building2 className="w-4 h-4 text-primary" />
            <span className="font-medium">{order.property?.name || 'Kost'}</span>
          </div>
          {isCOD && (
            <div className="flex items-center gap-1.5 bg-secondary-fixed text-on-secondary-fixed text-sm px-3 py-1.5 rounded-lg">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}>local_shipping</span>
              <span className="font-bold">COD</span>
            </div>
          )}
          {isTransfer && (
            <div className="flex items-center gap-1.5 bg-tertiary-fixed text-on-tertiary-fixed text-sm px-3 py-1.5 rounded-lg">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}>account_balance</span>
              <span className="font-bold">Transfer</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 bg-surface-container-low text-on-surface text-sm px-3 py-1.5 rounded-lg border border-surface-container ml-auto">
            <Calendar className="w-4 h-4 text-outline" />
            <span>Mulai: <strong className="text-on-surface">{fmtDate(order.startDate)}</strong> ({order.durationMonths} bulan)</span>
          </div>
        </div>

        {/* Timeline progress */}
        {!['rejected', 'cancelled', 'completed'].includes(order.status) && (
          <div className="mb-6">
            <OrderTimeline
              status={order.status}
              createdAt={order.createdAt}
              paidAt={order.paidAt}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end items-center pt-4 border-t border-surface-container-low">
          <span className="mr-auto inline-flex items-center gap-1 bg-surface-variant text-primary text-xs font-bold px-2 py-1 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {order.status === 'pending' && 'MENUNGGU PERSETUJUAN'}
            {order.status === 'awaiting_payment' && 'MENUNGGU PEMBAYARAN'}
            {order.status === 'awaiting_confirmation' && 'MENUNGGU KONFIRMASI'}
            {order.status === 'active' && 'AKTIF'}
          </span>
          <div className="text-sm text-outline mr-4">
            Total: <strong className="text-on-surface">{fmtIDR(order.totalAmount)}</strong>
          </div>

          {/* Tab: pending */}
          {tab === 'pending' && (
            <>
              <button
                onClick={() => onReject?.(order.id)}
                disabled={isMutating}
                className="px-5 py-2.5 rounded-lg font-label text-label-md bg-surface-container-lowest border border-error text-error hover:bg-error-container hover:text-on-error-container transition-colors flex items-center gap-2"
              >
                {isMutating ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                Tolak
              </button>
              <button
                onClick={() => onAccept?.(order.id)}
                disabled={isMutating}
                className="px-5 py-2.5 rounded-lg font-label text-label-md bg-primary text-on-primary hover:bg-primary/90 hover:scale-[1.02] transition-all flex items-center gap-2 shadow-sm"
              >
                {isMutating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                Terima
              </button>
            </>
          )}

          {/* Tab: payment */}
          {tab === 'payment' && (
            <>
              {order.status === 'awaiting_confirmation' && (
                <>
                  {order.paymentProofUrl && (
                    <div
                      className="relative cursor-pointer rounded-xl overflow-hidden border border-outline-variant group mb-3"
                      onClick={() => setLightbox(order.paymentProofUrl!)}
                    >
                      <img src={order.paymentProofUrl} alt="bukti transfer" className="w-full h-28 object-cover" />
                      <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ZoomIn className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => onRejectPayment?.(order.id)}
                    disabled={isMutating}
                    className="px-5 py-2.5 rounded-lg font-label text-label-md bg-surface-container-lowest border border-error text-error hover:bg-error-container hover:text-on-error-container transition-colors flex items-center gap-2"
                  >
                    {isMutating ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                    Tolak
                  </button>
                  <button
                    onClick={() => onConfirmPayment?.(order.id)}
                    disabled={isMutating}
                    className="px-5 py-2.5 rounded-lg font-label text-label-md bg-primary text-on-primary hover:bg-primary/90 hover:scale-[1.02] transition-all flex items-center gap-2 shadow-sm"
                  >
                    {isMutating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    Konfirmasi Transfer
                  </button>
                </>
              )}
              {order.status === 'awaiting_payment' && order.paymentMethod === 'cod' && (
                <>
                  <p className="text-[11px] text-amber-600 font-medium bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 mb-3">
                    Penyewa akan membayar tunai {fmtIDR(order.totalAmount)} saat check-in. Klik konfirmasi setelah menerima pembayaran.
                  </p>
                  <button
                    onClick={() => onConfirmPayment?.(order.id)}
                    disabled={isMutating}
                    className="w-full px-5 py-2.5 rounded-lg font-label text-label-md bg-secondary text-on-secondary hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    {isMutating ? <Loader2 className="w-4 h-4 animate-spin" /> : <HandCoins className="w-4 h-4" />}
                    Konfirmasi Terima Pembayaran COD
                  </button>
                </>
              )}
            </>
          )}

          {/* Tab: active */}
          {tab === 'active' && order.status === 'active' && (
            <button
              onClick={() => onComplete?.(order.id)}
              disabled={isMutating}
              className="px-5 py-2.5 rounded-lg font-label text-label-md bg-surface-container-lowest border border-surface-container text-on-surface hover:bg-surface-container transition-colors flex items-center gap-2"
            >
              {isMutating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Tandai Selesai
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const OrderEmptyStateNew: React.FC<{ message: { title: string; description: string } }> = ({ message }) => (
  <div className="bg-surface-container-lowest rounded-xl p-16 flex flex-col items-center justify-center text-center shadow-level-1 border border-outline-variant/20 min-h-[400px]">
    <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mb-6 shadow-inner">
      <FileText className="w-10 h-10 text-primary opacity-80" />
    </div>
    <h3 className="font-headline text-headline-sm font-semibold text-on-surface mb-2">{message.title}</h3>
    <p className="text-body-sm text-on-surface-variant max-w-md">{message.description}</p>
  </div>
);

export const OwnerOrdersSection: React.FC = () => {
  const [tab, setTab] = useState<TabKey>('pending');
  const { user } = useAuthStore();
  const { orders, isLoading, isError, refetch } = useMyOrders();
  const { acceptOrder, rejectOrder, confirmPayment, rejectPayment, completeOrder, isMutating } = useOrderActions();

  const ownerOrders = orders.filter((o) => o.ownerId === user?.id);
  const pending = ownerOrders.filter((o) => o.status === 'pending');
  const payment = ownerOrders.filter(
    (o) =>
      (o.status === 'awaiting_payment' && o.paymentMethod === 'cod') ||
      o.status === 'awaiting_confirmation',
  );
  const active = ownerOrders.filter((o) => o.status === 'active' || o.status === 'completed');

  const listMap: Record<TabKey, RentalOrder[]> = { pending, payment, active };
  const list = listMap[tab];

  const getEmptyMessage = (tab: TabKey) => {
    switch (tab) {
      case 'pending':
        return {
          title: 'Tidak ada permintaan masuk',
          description: 'Ketika pencari kost mengajukan sewa, permintaan akan muncul di sini.',
        };
      case 'payment':
        return {
          title: 'Tidak ada pembayaran menunggu verifikasi',
          description: 'Pembayaran dari penyewa akan muncul di sini setelah Anda menerima pengajuan dan mereka melakukan transfer.',
        };
      case 'active':
        return {
          title: 'Belum ada penyewa aktif',
          description: 'Penyewaan aktif akan muncul di sini setelah Anda mengkonfirmasi pembayaran.',
        };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-surface-container-lowest p-6 rounded-xl shadow-level-1 border border-outline-variant/10">
        <div>
          <h2 className="font-headline text-headline-lg text-on-surface mb-1">Permintaan Sewa</h2>
          <p className="text-body-sm text-on-surface-variant">Kelola pengajuan sewa dari pencari kost</p>
        </div>
        <div className="flex items-center gap-2 text-label-sm text-outline font-medium bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/20">
          <span className="text-primary font-bold">{ownerOrders.length}</span> TOTAL
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setTab('pending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors text-label-sm whitespace-nowrap ${
            tab === 'pending'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/50 hover:bg-surface-container-low'
          }`}
        >
          <Clock className="w-[18px] h-[18px]" />
          Menunggu
          {pending.length > 0 && (
            <span className="bg-error text-on-error text-[10px] px-1.5 rounded-full font-bold">{pending.length}</span>
          )}
        </button>
        <button
          onClick={() => setTab('payment')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors text-label-sm whitespace-nowrap ${
            tab === 'payment'
              ? 'bg-primary-container text-on-primary-container shadow-sm'
              : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/50 hover:bg-surface-container-low'
          }`}
        >
          <Banknote className="w-[18px] h-[18px]" />
          Pembayaran
        </button>
        <button
          onClick={() => setTab('active')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors text-label-sm whitespace-nowrap ${
            tab === 'active'
              ? 'bg-secondary-container text-on-secondary-container shadow-sm'
              : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/50 hover:bg-surface-container-low'
          }`}
        >
          <CheckCircle className="w-[18px] h-[18px]" />
          Aktif
          {active.length > 0 && (
            <span className="bg-secondary text-on-secondary text-[10px] px-1.5 rounded-full font-bold">{active.length}</span>
          )}
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="bg-surface-container-lowest rounded-xl p-8 text-center shadow-level-1 border border-outline-variant/10">
          <p className="text-body-md font-semibold text-error mb-3">Gagal memuat data permintaan sewa</p>
          <button
            onClick={() => refetch()}
            className="px-6 py-2.5 bg-surface text-primary border border-primary/20 rounded-lg text-label-md font-semibold hover:bg-surface-container-low transition-colors shadow-sm"
          >
            Coba lagi
          </button>
        </div>
      ) : list.length === 0 ? (
        <OrderEmptyStateNew message={getEmptyMessage(tab)} />
      ) : (
        <div className="space-y-6">
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
