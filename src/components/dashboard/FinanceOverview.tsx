import React from 'react';
import type { Property } from '../../types';
import { useMyOrders } from '../../hooks/useOrders';
import { useAuthStore } from '../../stores/authStore';
import { Wallet, Users, Clock, TrendingUp, MoreHorizontal, ArrowUpRight, Building2 } from 'lucide-react';

interface FinanceOverviewProps {
  properties: Property[];
  formatPrice: (price: number) => string;
}

export const FinanceOverview: React.FC<FinanceOverviewProps> = ({ properties, formatPrice }) => {
  const { user } = useAuthStore();
  const { orders } = useMyOrders();

  // Only orders where the logged-in user is the OWNER count toward their income.
  const ownerOrders = orders.filter((o) => o.ownerId === user?.id);
  const activeOrders = ownerOrders.filter((o) => o.status === 'active');
  const awaitingOrders = ownerOrders.filter((o) => o.status === 'awaiting_payment');

  // Real monthly income = sum of monthly price across ACTIVE rental contracts.
  const monthlyRevenue = activeOrders.reduce((sum, o) => sum + (o.priceMonthly || 0), 0);
  const activeTenants = activeOrders.length;
  const awaitingAmount = awaitingOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Potential income = monthly price of rooms still available across the owner's kosts.
  const availableRooms = properties.flatMap((p) => p.rooms || []).filter((r) => r.status === 'available');
  const potentialRevenue = availableRooms.reduce((sum, r) => sum + (r.price_monthly || 0), 0);

  if (properties.length === 0) {
    return (
      <div className="bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/50 p-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <Wallet className="w-8 h-8 text-slate-300" />
        </div>
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Data Keuangan Kosong</h2>
        <p className="text-[13px] text-slate-500 max-w-md mx-auto">
          Anda belum menambahkan kost apa pun. Pendapatan dihitung otomatis dari sewa yang aktif.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Ringkasan Keuangan</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active monthly income — derived from active rental orders */}
        <div className="relative overflow-hidden bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/50">
          {/* soft emerald glow accent (no flat green block) */}
          <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 bg-emerald-400/10 blur-3xl rounded-full" />
          <div className="relative flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-slate-600 font-medium text-[13px]">
              <div className="bg-emerald-50 p-1.5 rounded-lg">
                <Wallet className="w-4 h-4 text-emerald-600" />
              </div>
              <span>Pendapatan Aktif</span>
            </div>
            <button className="text-slate-400 hover:bg-slate-50 p-1 rounded-md cursor-pointer">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="relative mb-4">
            <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{formatPrice(monthlyRevenue)}</h3>
            <p className="text-[12px] text-slate-400 mt-1">per bulan, dari {activeTenants} sewa aktif</p>
          </div>

          <div className="relative flex items-center gap-2 text-[12px]">
            <span className="flex items-center gap-0.5 bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-md font-medium">
              <ArrowUpRight className="w-3 h-3" /> Real-time
            </span>
            <span className="text-slate-400">diperbarui otomatis saat sewa berubah</span>
          </div>
        </div>

        {/* Breakdown card */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-600 font-medium text-[13px] mb-6">
              <div className="bg-blue-50 p-1.5 rounded-lg">
                <Building2 className="w-4 h-4 text-blue-600" />
              </div>
              <span>Rincian Pendapatan</span>
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="bg-emerald-50 p-2 rounded-lg">
                    <Users className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-700">Penyewa Aktif</p>
                    <p className="text-[11px] text-slate-400">{activeTenants} sewa berjalan</p>
                  </div>
                </div>
                <span className="text-[14px] font-bold text-slate-800">{formatPrice(monthlyRevenue)}</span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-5">
                <div className="flex items-center gap-2.5">
                  <div className="bg-amber-50 p-2 rounded-lg">
                    <Clock className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-700">Menunggu Pembayaran</p>
                    <p className="text-[11px] text-slate-400">{awaitingOrders.length} order belum dibayar</p>
                  </div>
                </div>
                <span className="text-[14px] font-semibold text-amber-600">{formatPrice(awaitingAmount)}</span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-5">
                <div className="flex items-center gap-2.5">
                  <div className="bg-slate-100 p-2 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-700">Potensi Pendapatan</p>
                    <p className="text-[11px] text-slate-400">{availableRooms.length} kamar tersedia</p>
                  </div>
                </div>
                <span className="text-[14px] font-semibold text-slate-400">+ {formatPrice(potentialRevenue)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-start gap-2 bg-slate-50 text-slate-500 p-3 rounded-xl text-[11px] font-medium border border-slate-100">
            <TrendingUp className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
            <p>Pendapatan dihitung dari sewa berstatus aktif. Potensi dihitung dari kamar yang masih tersedia.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
