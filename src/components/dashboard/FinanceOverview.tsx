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
      <div className="bg-surface rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-outline/50 p-6 sm:p-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-surface-low rounded-full flex items-center justify-center mb-6">
          <Wallet className="w-8 h-8 text-on-surface-variant" />
        </div>
        <h2 className="text-lg font-semibold text-on-surface mb-2">Data Keuangan Kosong</h2>
        <p className="text-sm text-on-surface max-w-md mx-auto">
          Anda belum menambahkan kost apa pun. Pendapatan dihitung otomatis dari sewa yang aktif.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 md:pb-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <h2 className="text-xl font-semibold text-on-surface tracking-tight">Ringkasan Keuangan</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Active monthly income — derived from active rental orders */}
        <div className="relative overflow-hidden bg-surface rounded-[24px] p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-outline/50">
          {/* soft emerald glow accent (no flat green block) */}
          <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 bg-[var(--primary-400)]/10 blur-3xl rounded-full" />
          <div className="relative flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 text-on-surface font-medium text-sm">
              <div className="bg-[var(--primary-50)] p-1.5 rounded-lg">
                <Wallet className="w-4 h-4 text-[var(--primary-600)]" />
              </div>
              <span>Pendapatan Aktif</span>
            </div>
            <button className="text-on-surface-variant hover:bg-surface-low p-1 rounded-md cursor-pointer" aria-label="Menu Opsi Keuangan">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="relative mb-3 sm:mb-4">
            <h3 className="text-3xl font-bold text-on-surface tracking-tight">{formatPrice(monthlyRevenue)}</h3>
            <p className="text-xs text-on-surface-variant mt-1">per bulan, dari {activeTenants} sewa aktif</p>
          </div>

          <div className="relative flex items-center gap-2 text-xs">
            <span className="flex items-center gap-0.5 bg-[var(--primary-50)] text-[var(--primary-600)] px-1.5 py-0.5 rounded-md font-medium">
              <ArrowUpRight className="w-3 h-3" /> Real-time
            </span>
            <span className="text-on-surface-variant">diperbarui otomatis saat sewa berubah</span>
          </div>
        </div>

        {/* Breakdown card */}
        <div className="bg-surface rounded-[24px] p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-outline/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-on-surface font-medium text-sm mb-4 sm:mb-6">
              <div className="bg-[var(--primary-50)] p-1.5 rounded-lg">
                <Building2 className="w-4 h-4 text-[var(--primary-600)]" />
              </div>
              <span>Rincian Pendapatan</span>
            </div>

            <div className="space-y-4 sm:space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="bg-[var(--primary-50)] p-2 rounded-lg">
                    <Users className="w-4 h-4 text-[var(--primary-600)]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface">Penyewa Aktif</p>
                    <p className="text-xs text-on-surface-variant">{activeTenants} sewa berjalan</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-on-surface">{formatPrice(monthlyRevenue)}</span>
              </div>

              <div className="flex items-center justify-between border-t border-outline pt-4 sm:pt-5">
                <div className="flex items-center gap-2.5">
                  <div className="bg-tertiary-fixed-dim p-2 rounded-lg">
                    <Clock className="w-4 h-4 text-tertiary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface">Menunggu Pembayaran</p>
                    <p className="text-xs text-on-surface-variant">{awaitingOrders.length} order belum dibayar</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-tertiary">{formatPrice(awaitingAmount)}</span>
              </div>

              <div className="flex items-center justify-between border-t border-outline pt-4 sm:pt-5">
                <div className="flex items-center gap-2.5">
                  <div className="bg-surface-low p-2 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-on-surface-variant" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface">Potensi Pendapatan</p>
                    <p className="text-xs text-on-surface-variant">{availableRooms.length} kamar tersedia</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-on-surface">+ {formatPrice(potentialRevenue)}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 flex items-start gap-2 bg-surface-low text-on-surface p-3 rounded-xl text-xs font-medium border border-outline">
            <TrendingUp className="w-3.5 h-3.5 shrink-0 mt-0.5 text-on-surface-variant" />
            <p>Pendapatan dihitung dari sewa berstatus aktif. Potensi dihitung dari kamar yang masih tersedia.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
