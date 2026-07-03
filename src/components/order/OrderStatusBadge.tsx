import React from 'react';
import { ORDER_STATUS_LABEL } from '../../services/api/order.service';
import type { OrderStatus } from '../../types';

const STATUS_CONFIG: Record<OrderStatus, { chip: string; dot: string; label: string }> = {
  pending: {
    chip: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    label: 'Menunggu Persetujuan',
  },
  awaiting_payment: {
    chip: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
    label: 'Menunggu Pembayaran',
  },
  awaiting_confirmation: {
    chip: 'bg-violet-50 text-violet-700 border-violet-200',
    dot: 'bg-violet-500',
    label: 'Menunggu Konfirmasi',
  },
  active: {
    chip: 'bg-[var(--primary-50)] text-[var(--primary-700)] border-[var(--primary-200)]',
    dot: 'bg-[var(--primary-500)]',
    label: 'Aktif',
  },
  rejected: {
    chip: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
    label: 'Ditolak',
  },
  cancelled: {
    chip: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
    label: 'Dibatalkan',
  },
  completed: {
    chip: 'bg-slate-50 text-slate-500 border-slate-200',
    dot: 'bg-slate-400',
    label: 'Selesai',
  },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
  showDot?: boolean;
  size?: 'sm' | 'md';
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
  showDot = true,
  size = 'md',
}) => {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-black uppercase tracking-wider ${
        size === 'sm'
          ? 'px-2 py-0.5 text-[9px]'
          : 'px-2.5 py-1 text-[10px]'
      } ${config.chip}`}
    >
      {showDot && (
        <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      )}
      {ORDER_STATUS_LABEL[status] || config.label}
    </span>
  );
};
