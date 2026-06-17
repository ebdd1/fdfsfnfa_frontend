import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Home, Loader2 } from 'lucide-react';
import { useMyOrders, useOrderActions } from '../hooks/useOrders';
import { useAuthStore } from '../stores/authStore';
import { ORDER_STATUS_LABEL } from '../services/api/order.service';
import type { RentalOrder, OrderStatus } from '../types';

const fmtIDR = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

const STATUS_BADGE: Record<OrderStatus, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-100',
  awaiting_payment: 'bg-blue-50 text-blue-700 border-blue-100',
  active: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  rejected: 'bg-rose-50 text-rose-700 border-rose-100',
  cancelled: 'bg-slate-100 text-slate-600 border-slate-200',
  completed: 'bg-slate-50 text-slate-500 border-slate-200',
};

interface OrderCardProps {
  order: RentalOrder;
  actions: 'accept' | 'active';
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onComplete?: (id: string) => void;
  isMutating?: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, actions, onAccept, onReject, onComplete, isMutating }) => {
  const seeker = order.seeker;
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        {/* Left: seeker info + property */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {/* Avatar */}
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
              <span className="text-[10px] font-semibold text-slate-500">
                {order.property?.name}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-slate-400 font-medium">
              <span>Mulai: {fmtDate(order.startDate)}</span>
              <span>{order.durationMonths} bulan</span>
            </div>
          </div>
        </div>

        {/* Right: price + status + actions */}
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

      {/* Action row */}
      {actions === 'accept' && (
        <div className="mt-4 flex items-center gap-2 pt-4 border-t border-slate-100">
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

      {actions === 'active' && order.status === 'active' && (
        <div className="mt-4 flex items-center gap-2 pt-4 border-t border-slate-100">
          <button
            onClick={() => onComplete?.(order.id)}
            disabled={isMutating}
            className="w-full flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
          >
            {isMutating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
            Tandai Selesai
          </button>
        </div>
      )}
    </div>
  );
};

export const OwnerOrdersSection: React.FC = () => {
  const [tab, setTab] = useState<'pending' | 'active'>('pending');
  const { user } = useAuthStore();
  const { orders, isLoading, isError, refetch } = useMyOrders();
  const { acceptOrder, rejectOrder, completeOrder, isMutating } = useOrderActions();

  // Only orders where the logged-in user is the property owner.
  const ownerOrders = orders.filter((o) => o.ownerId === user?.id);
  const pending = ownerOrders.filter((o) => o.status === 'pending');
  const active = ownerOrders.filter((o) => o.status === 'active' || o.status === 'completed');

  const handleAccept = (id: string) => {
    acceptOrder(id);
  };

  const handleReject = (id: string) => {
    rejectOrder(id);
  };

  const handleComplete = (id: string) => {
    completeOrder(id);
  };

  const list = tab === 'pending' ? pending : active;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Permintaan Sewa</h2>
          <p className="text-[12px] text-slate-400 mt-0.5">
            Kelola pengajuan sewa dari pencari kost
          </p>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full font-mono">
          {ownerOrders.length} total
        </span>
      </div>

      {/* Tab switcher */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setTab('pending')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            tab === 'pending'
              ? 'bg-white text-emerald-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Menunggu
          {pending.length > 0 && (
            <span className="bg-amber-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black">
              {pending.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('active')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            tab === 'active'
              ? 'bg-white text-emerald-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          Aktif
          {active.length > 0 && (
            <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black">
              {active.length}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
        </div>
      ) : isError ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-8 text-center">
          <p className="text-sm font-semibold text-rose-500 mb-3">Gagal memuat data permintaan sewa</p>
          <button
            onClick={() => refetch()}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline"
          >
            Coba lagi
          </button>
        </div>
      ) : list.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-12 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-slate-300" />
          </div>
          <p className="text-sm font-bold text-slate-600 mb-1">
            {tab === 'pending' ? 'Tidak ada permintaan masuk' : 'Belum ada penyewa aktif'}
          </p>
          <p className="text-xs text-slate-400 max-w-xs">
            {tab === 'pending'
              ? 'Ketika pencari kost mengajukan sewa, permintaan akan muncul di sini.'
              : 'Penyewaan aktif akan muncul di sini setelah penyewa menyelesaikan pembayaran.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              actions={tab === 'pending' ? 'accept' : 'active'}
              onAccept={handleAccept}
              onReject={handleReject}
              onComplete={handleComplete}
              isMutating={isMutating}
            />
          ))}
        </div>
      )}
    </div>
  );
};
