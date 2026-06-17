import React, { useState } from 'react';
import { Home, Loader2, CreditCard, XCircle } from 'lucide-react';
import { useMyOrders, useOrderActions } from '../hooks/useOrders';
import { useAuthStore } from '../stores/authStore';
import { ORDER_STATUS_LABEL } from '../services/api/order.service';
import type { RentalOrder, OrderStatus } from '../types';

const fmtIDR = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

const STATUS_STYLE: Record<OrderStatus, { chip: string; dot: string }> = {
  pending: { chip: 'bg-amber-50 text-amber-700 border-amber-100', dot: 'bg-amber-500' },
  awaiting_payment: { chip: 'bg-blue-50 text-blue-700 border-blue-100', dot: 'bg-blue-500' },
  active: { chip: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500' },
  rejected: { chip: 'bg-rose-50 text-rose-700 border-rose-100', dot: 'bg-rose-500' },
  cancelled: { chip: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
  completed: { chip: 'bg-slate-50 text-slate-500 border-slate-200', dot: 'bg-slate-400' },
};

const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${STATUS_STYLE[status].chip}`}>
    <span className={`h-1.5 w-1.5 rounded-full ${STATUS_STYLE[status].dot}`} />
    {ORDER_STATUS_LABEL[status]}
  </span>
);

interface PayModalProps {
  order: RentalOrder;
  onClose: () => void;
  onConfirm: (id: string) => void;
  isPending: boolean;
}

const PayModal: React.FC<PayModalProps> = ({ order, onClose, onConfirm, isPending }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
    <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-base font-black text-slate-800">Konfirmasi Pembayaran</h3>
      </div>
      <div className="p-6 space-y-4">
        <div className="bg-slate-50 rounded-2xl p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Kost</span>
            <span className="font-bold text-slate-800">{order.property?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Kamar</span>
            <span className="font-bold text-slate-800">{order.room?.roomNumber || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Durasi</span>
            <span className="font-bold text-slate-800">{order.durationMonths} bulan</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
            <span className="text-slate-500 font-bold">Total Bayar</span>
            <span className="font-black text-emerald-600">{fmtIDR(order.totalAmount)}</span>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 text-center font-medium">
          Ini adalah simulasi pembayaran. Klik <b>Bayar Sekarang</b> untuk mengaktifkan sewa.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={() => onConfirm(order.id)}
            disabled={isPending}
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
            Bayar Sekarang
          </button>
        </div>
      </div>
    </div>
  </div>
);

const OrderRow: React.FC<{
  order: RentalOrder;
  onPay?: (order: RentalOrder) => void;
  onCancel?: (id: string) => void;
  isMutating: boolean;
}> = ({ order, onPay, onCancel, isMutating }) => {
  const owner = order.owner;
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-black text-sm shrink-0 overflow-hidden">
            {owner?.avatar_url ? (
              <img src={owner.avatar_url} alt={owner.name} className="w-full h-full object-cover" />
            ) : (
              (owner?.name || '?')[0].toUpperCase()
            )}
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="text-sm font-bold text-slate-800 truncate">{order.property?.name}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg">
                <Home className="w-3 h-3" />
                {order.room?.roomNumber || order.roomId.slice(0, 4)}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Pemilik: {owner?.name || '—'}</span>
            </div>
            <div className="mt-1.5 flex flex-wrap gap-3 text-[11px] text-slate-400 font-medium">
              <span>Mulai: {fmtDate(order.startDate)}</span>
              <span>{order.durationMonths} bulan</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="text-base font-black text-slate-900">{fmtIDR(order.priceMonthly)}</span>
          <span className="text-[10px] font-semibold text-slate-400">per bulan</span>
          <StatusBadge status={order.status} />
          {order.status === 'active' && order.paidAt && (
            <span className="text-[10px] text-emerald-600 font-semibold">Lunas: {fmtDate(order.paidAt)}</span>
          )}
        </div>
      </div>

      {/* Action row */}
      <div className="mt-4 flex items-center gap-2 pt-4 border-t border-slate-100">
        {order.status === 'awaiting_payment' && (
          <button
            onClick={() => onPay?.(order)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5" />
            Bayar Sekarang
          </button>
        )}
        {order.status === 'pending' && (
          <button
            onClick={() => onCancel?.(order.id)}
            disabled={isMutating}
            className="flex-1 flex items-center justify-center gap-1.5 bg-white hover:bg-rose-50 text-rose-600 font-extrabold text-xs py-2.5 rounded-xl border border-rose-100 transition-all cursor-pointer"
          >
            <XCircle className="w-3.5 h-3.5" />
            Batalkan
          </button>
        )}
        <span className="text-[10px] text-slate-400 font-medium ml-auto">
          Total: <b>{fmtIDR(order.totalAmount)}</b>
        </span>
      </div>
    </div>
  );
};

export const SeekerOrdersSection: React.FC = () => {
  const [tab, setTab] = useState<'all' | 'pending' | 'awaiting_payment' | 'active' | 'completed'>('all');
  const [payTarget, setPayTarget] = useState<RentalOrder | null>(null);
  const { user } = useAuthStore();
  const { orders: allOrders, isLoading, isError, refetch } = useMyOrders();
  const { payOrder, cancelOrder, isMutating } = useOrderActions();

  // Only orders where the logged-in user is the seeker (renter).
  const orders = allOrders.filter((o) => o.seekerId === user?.id);
  const filtered = tab === 'all' ? orders : orders.filter((o) => o.status === tab);
  const activeOrders = orders.filter((o) => o.status === 'active');

  const handlePay = (order: RentalOrder) => setPayTarget(order);
  const handlePayConfirm = (id: string) => {
    payOrder(id);
    setPayTarget(null);
  };
  const handleCancel = (id: string) => cancelOrder(id);

  const TABS: { key: typeof tab; label: string }[] = [
    { key: 'all', label: 'Semua' },
    { key: 'pending', label: 'Menunggu' },
    { key: 'awaiting_payment', label: 'Bayar' },
    { key: 'active', label: 'Aktif' },
    { key: 'completed', label: 'Selesai' },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Riwayat Sewa</h2>
          <p className="text-[12px] text-slate-400 mt-0.5">Pantau status pengajuan dan sewa aktif Anda</p>
        </div>
        {activeOrders.length > 0 && (
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-emerald-100">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {activeOrders.length} Aktif
          </span>
        )}
      </div>

      {/* Tab switcher */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto">
        {TABS.map(({ key, label }) => {
          const count = key === 'all' ? orders.length : orders.filter((o) => o.status === key).length;
          if (key !== 'all' && count === 0) return null;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                tab === key ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {label}
              {count > 0 && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                  tab === key ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
        </div>
      ) : isError ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-8 text-center">
          <p className="text-sm font-semibold text-rose-500 mb-3">Gagal memuat riwayat sewa</p>
          <button onClick={() => refetch()} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline">
            Coba lagi
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-12 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Home className="w-6 h-6 text-slate-300" />
          </div>
          <p className="text-sm font-bold text-slate-600 mb-1">Belum ada pengajuan sewa</p>
          <p className="text-xs text-slate-400 max-w-xs">
            Ajukan sewa kamar kost yang Anda minati di halaman detail kost.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              onPay={handlePay}
              onCancel={handleCancel}
              isMutating={isMutating}
            />
          ))}
        </div>
      )}

      {/* Pay modal */}
      {payTarget && (
        <PayModal
          order={payTarget}
          onClose={() => setPayTarget(null)}
          onConfirm={handlePayConfirm}
          isPending={isMutating}
        />
      )}
    </div>
  );
};
