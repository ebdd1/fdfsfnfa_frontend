import React, { useState } from 'react';
import { Search, Loader2, Home, Building2 } from 'lucide-react';
import { useAdminOrders } from '../../hooks/useOrders';
import { ORDER_STATUS_LABEL } from '../../services/api/order.service';
import type { OrderStatus } from '../../types';

const fmtIDR = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

const STATUS_STYLE: Record<OrderStatus, { chip: string; dot: string }> = {
  pending: { chip: 'bg-amber-50 text-amber-700 border-amber-100', dot: 'bg-amber-500' },
  awaiting_payment: { chip: 'bg-blue-50 text-blue-700 border-blue-100', dot: 'bg-blue-500' },
  awaiting_confirmation: { chip: 'bg-violet-50 text-violet-700 border-violet-100', dot: 'bg-violet-500' },
  active: { chip: 'bg-[var(--primary-50)] text-[var(--primary-700)] border-[var(--primary-100)]', dot: 'bg-[var(--primary-500)]' },
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

const AvatarChip: React.FC<{ name?: string; avatar_url?: string; label: string }> = ({ name, avatar_url, label }) => (
  <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 overflow-hidden shrink-0">
    {avatar_url ? (
      <img src={avatar_url} alt={name || label} className="w-full h-full object-cover" />
    ) : (
      <span className="text-[10px] font-black text-slate-500">{(name || label)[0]?.toUpperCase()}</span>
    )}
  </div>
);

export const AdminOrdersTab: React.FC = () => {
  const { orders, isLoading, isError, refetch } = useAdminOrders();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      o.property?.name?.toLowerCase().includes(q) ||
      o.seeker?.name?.toLowerCase().includes(q) ||
      o.owner?.name?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const activeOrders = orders.filter((o) => o.status === 'active');
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const totalRevenue = activeOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const FILTERS: { key: OrderStatus | 'all'; label: string }[] = [
    { key: 'all', label: `Semua (${orders.length})` },
    { key: 'pending', label: `Menunggu (${pendingOrders.length})` },
    { key: 'awaiting_payment', label: `Menunggu Bayar` },
    { key: 'active', label: `Aktif (${activeOrders.length})` },
    { key: 'rejected', label: `Ditolak` },
    { key: 'cancelled', label: `Dibatalkan` },
    { key: 'completed', label: `Selesai` },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* KPI Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Order</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{orders.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">Menunggu</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{pendingOrders.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--primary-500)]">Aktif</p>
          <p className="text-2xl font-black text-[var(--primary-600)] mt-1">{activeOrders.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pendapatan Aktif</p>
          <p className="text-lg font-black text-slate-900 mt-1">{fmtIDR(totalRevenue)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kost, pencari, pemilik..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[var(--primary-500)] transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`px-3.5 py-2 rounded-xl text-[11px] font-bold transition-all border ${
                statusFilter === key
                  ? 'bg-[var(--primary-600)] text-white border-[var(--primary-600)] shadow-sm'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--primary-500)]" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <p className="text-sm font-semibold text-rose-500">Gagal memuat data order</p>
            <button onClick={() => refetch()} className="text-xs font-bold text-[var(--primary-600)] hover:text-[var(--primary-700)] underline">
              Coba lagi
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-1">
              <Home className="w-5 h-5 text-slate-300" />
            </div>
            <p className="text-sm font-bold text-slate-600">Tidak ada order</p>
            <p className="text-xs text-slate-400">
              {search || statusFilter !== 'all' ? 'Coba ubah filter atau kata kunci pencarian.' : 'Belum ada pengajuan sewa.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Kost</th>
                  <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Pemilik</th>
                  <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Pencari</th>
                  <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Kamar</th>
                  <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Tanggal</th>
                  <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Total</th>
                  <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[var(--primary-50)] border border-[var(--primary-100)] flex items-center justify-center text-[var(--primary-500)] shrink-0">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{order.property?.name || '—'}</p>
                          <p className="text-[10px] text-slate-400">{order.property?.city || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <AvatarChip name={order.owner?.name} avatar_url={order.owner?.avatar_url} label="Owner" />
                        <span className="text-xs font-semibold text-slate-700">{order.owner?.name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <AvatarChip name={order.seeker?.name} avatar_url={order.seeker?.avatar_url} label="Seeker" />
                        <span className="text-xs font-semibold text-slate-700">{order.seeker?.name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-semibold text-slate-700">{order.room?.roomNumber || '—'}</span>
                      <p className="text-[10px] text-slate-400">{order.room ? fmtIDR(order.room.priceMonthly) + '/bln' : ''}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs font-semibold text-slate-600">{fmtDate(order.startDate)}</p>
                      <p className="text-[10px] text-slate-400">{order.durationMonths} bulan</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-black text-slate-900">{fmtIDR(order.totalAmount)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
