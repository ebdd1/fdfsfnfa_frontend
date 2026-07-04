import React, { useState, useRef } from 'react';
import {
  Home, Loader2,
  Upload, AlertCircle, X,
  MapPin, Calendar, Receipt,
} from 'lucide-react';
import { useMyOrders, useOrderActions } from '../hooks/useOrders';
import { useAuthStore } from '../stores/authStore';
import { uploadService } from '../services/api/upload.service';
import { OrderTimeline } from '../components/OrderTimeline';
import { useProperties } from '../hooks/useProperties';
import type { RentalOrder } from '../types';

const fmtIDR = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

/* ── Transfer payment modal ── */
interface TransferModalProps {
  order: RentalOrder;
  onClose: () => void;
  onSubmit: (proofUrl: string) => Promise<void>;
  isSubmitting: boolean;
}

const TransferModal: React.FC<TransferModalProps> = ({ order, onClose, onSubmit, isSubmitting }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const owner = order.owner;
  const hasBank = owner?.bankAccountNumber;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError('');
  };

  const handleSubmit = async () => {
    if (!file) return setError('Pilih foto bukti transfer terlebih dahulu.');
    setUploading(true);
    setError('');
    try {
      const res = await uploadService.uploadImage(file);
      await onSubmit(res.url);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Gagal upload bukti. Coba lagi.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/50 backdrop-blur-sm">
      <div className="bg-surface-container-lowest rounded-2xl shadow-elevation-modal w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-outline-variant bg-surface-container-low">
          <h3 className="font-headline text-[16px] font-semibold text-on-surface">Upload Bukti Transfer</h3>
          <button onClick={onClose} className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {/* Rekening tujuan */}
          <div className="bg-primary-fixed/30 border border-primary-fixed-dim rounded-xl p-4 space-y-1.5">
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2">Rekening Tujuan Transfer</p>
            {hasBank ? (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant font-medium">Bank</span>
                  <span className="font-semibold text-on-surface">{owner?.bankName || '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant font-medium">No. Rekening</span>
                  <span className="font-bold text-on-surface tracking-wider">{owner?.bankAccountNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant font-medium">Atas Nama</span>
                  <span className="font-bold text-on-surface">{owner?.bankAccountHolder}</span>
                </div>
              </>
            ) : (
              <p className="text-xs text-primary font-medium">Pemilik belum mengisi data rekening. Hubungi via pesan.</p>
            )}
            <div className="border-t border-primary-fixed-dim pt-2 mt-2 flex justify-between text-sm">
              <span className="text-on-surface-variant font-bold">Total Transfer</span>
              <span className="font-bold text-primary">{fmtIDR(order.totalAmount)}</span>
            </div>
          </div>

          {/* Upload area */}
          <div>
            <p className="text-xs font-bold text-on-surface mb-2">Foto Bukti Transfer</p>
            <div
              onClick={() => fileRef.current?.click()}
              className="cursor-pointer border-2 border-dashed border-outline-variant hover:border-primary rounded-xl transition-colors overflow-hidden"
            >
              {preview ? (
                <img src={preview} alt="preview" className="w-full h-40 object-cover" />
              ) : (
                <div className="h-28 flex flex-col items-center justify-center gap-2 text-on-surface-variant">
                  <Upload className="w-6 h-6" />
                  <span className="text-xs font-medium">Klik untuk pilih foto</span>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>

          {error && (
            <p className="flex items-center gap-1.5 text-xs font-medium text-error">
              <AlertCircle className="w-4 h-4" /> {error}
            </p>
          )}

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs rounded-xl transition-all cursor-pointer">
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={uploading || isSubmitting || !file}
              className="flex-1 py-2.5 bg-primary hover:bg-primary-container disabled:opacity-50 text-on-primary font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {uploading || isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              Kirim Bukti
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Image lightbox ── */
const Lightbox: React.FC<{ url: string; onClose: () => void }> = ({ url, onClose }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-inverse-surface/80 backdrop-blur-sm" onClick={onClose}>
    <img src={url} alt="bukti transfer" className="max-w-[90vw] max-h-[85vh] rounded-2xl shadow-elevation-modal" />
    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-surface-container-lowest/20 hover:bg-surface-container-lowest/30 rounded-full text-on-surface transition-colors cursor-pointer">
      <X className="w-5 h-5" />
    </button>
  </div>
);

/* ── Status badge colors ── */
const statusConfig: Record<string, { bg: string; text: string; border: string; label: string }> = {
  pending: { bg: 'bg-warning-light', text: 'text-warning', border: 'border-warning', label: 'MENUNGGU' },
  awaiting_payment: { bg: 'bg-warning-light', text: 'text-warning', border: 'border-warning', label: 'MENUNGGU BAYAR' },
  awaiting_confirmation: { bg: 'bg-warning-light', text: 'text-warning', border: 'border-warning', label: 'MENUNGGU KONFIRMASI' },
  active: { bg: 'bg-success-light', text: 'text-success', border: 'border-success', label: 'AKTIF' },
  rejected: { bg: 'bg-error-container', text: 'text-error', border: 'border-error', label: 'DITOLAK' },
  cancelled: { bg: 'bg-surface-container', text: 'text-on-surface-variant', border: 'border-outline', label: 'DIBATALKAN' },
  completed: { bg: 'bg-surface-container', text: 'text-on-surface-variant', border: 'border-outline', label: 'SELESAI' },
};

/* ── Order card ── */
const OrderCard: React.FC<{
  order: RentalOrder;
  properties: ReturnType<typeof useProperties>['properties'];
  onTransferPay?: (order: RentalOrder) => void;
  onCancel?: (id: string) => void;
  isMutating: boolean;
}> = ({ order, properties, onTransferPay, onCancel, isMutating }) => {
  const [lightbox, setLightbox] = useState('');
  const status = statusConfig[order.status] || statusConfig.pending;

  // Get property image from full properties data
  const propertyData = properties.find(p => p.id === order.propertyId);
  const coverImage = propertyData?.media?.[0]?.url_original;

  return (
    <div className="bg-surface-container-lowest rounded-lg shadow-elevation-1 border border-outline-variant/20 overflow-hidden transition-shadow hover:shadow-elevation-hover">
      {lightbox && <Lightbox url={lightbox} onClose={() => setLightbox('')} />}

      {/* Image header */}
      <div className="h-48 relative">
        {coverImage ? (
          <img src={coverImage} alt={order.property?.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-surface-container flex items-center justify-center">
            <Home className="w-12 h-12 text-on-surface-variant" />
          </div>
        )}
        {/* Status badge */}
        <div className={`absolute top-3 left-3 ${status.bg} ${status.text} ${status.border} px-2.5 py-1 rounded-sm font-label text-[11px] font-semibold tracking-wide border`}>
          {status.label}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        {/* Header row */}
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="font-headline font-semibold text-[18px] text-on-surface">{order.property?.name || 'Kost'}</h3>
            <div className="flex items-center gap-1 text-outline mt-1">
              <MapPin className="w-[14px] h-[14px]" />
              <span className="font-body text-[13px]">{order.property?.city || 'Lokasi'}</span>
            </div>
          </div>
          <div className="text-right">
            <span className={`font-headline font-bold block ${order.status === 'completed' || order.status === 'cancelled' || order.status === 'rejected' ? 'text-on-surface-variant' : 'text-primary'}`}>
              {fmtIDR(order.priceMonthly)}
            </span>
            <span className="font-body text-[11px] text-on-surface-variant">/ bulan</span>
          </div>
        </div>

        {/* Date info */}
        <div className="flex items-center gap-2">
          <Calendar className="w-[16px] h-[16px] text-outline" />
          <span className="font-body text-[13px] text-on-surface-variant">
            {order.status === 'completed' || order.status === 'cancelled' ? (
              <>Selesai pada: <strong className="text-on-surface-variant">{fmtDate(order.createdAt)}</strong></>
            ) : order.status === 'active' ? (
              <>Periode: <strong className="text-on-surface">{fmtDate(order.startDate)}</strong></>
            ) : (
              <>Mulai: <strong className="text-on-surface">{fmtDate(order.startDate)}</strong></>
            )}
          </span>
        </div>

        {/* Progress indicator - for non-terminal statuses */}
        {!['rejected', 'cancelled', 'completed'].includes(order.status) && (
          <div className="mt-2 pt-3 border-t border-outline-variant/30">
            <OrderTimeline
              status={order.status}
              createdAt={order.createdAt}
              paidAt={order.paidAt}
            />
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-end gap-2 mt-2 pt-2">
          {/* Cancel button */}
          {(order.status === 'pending' || order.status === 'awaiting_payment' || order.status === 'awaiting_confirmation') && (
            <button
              onClick={() => onCancel?.(order.id)}
              disabled={isMutating}
              className="px-4 py-2 font-label text-[13px] font-semibold rounded bg-surface-container-lowest text-error border border-error hover:bg-error-container transition-colors active:scale-[0.98] cursor-pointer"
            >
              Batalkan
            </button>
          )}

          {/* Pay now button */}
          {order.status === 'awaiting_payment' && order.paymentMethod === 'transfer' && (
            <button
              onClick={() => onTransferPay?.(order)}
              className="px-4 py-2 font-label text-[13px] font-semibold rounded bg-primary text-on-primary hover:bg-primary-container transition-colors active:scale-[0.98] shadow-sm cursor-pointer"
            >
              Bayar Sekarang
            </button>
          )}

          {/* View detail button */}
          {order.status === 'active' && (
            <button className="px-4 py-2 font-label text-[13px] font-semibold rounded bg-surface-container-lowest text-primary border border-primary hover:bg-surface-container-low transition-colors active:scale-[0.98] cursor-pointer">
              Lihat Detail
            </button>
          )}

          {/* Completed - rent again */}
          {order.status === 'completed' && (
            <button className="px-4 py-2 font-label text-[13px] font-semibold rounded text-on-surface-variant hover:bg-surface-container-low transition-colors active:scale-[0.98] cursor-pointer">
              Sewa Lagi
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const SeekerOrdersSection: React.FC = () => {
  const [tab, setTab] = useState<'all' | 'pending' | 'awaiting_payment' | 'awaiting_confirmation' | 'active' | 'completed'>('all');
  const [transferTarget, setTransferTarget] = useState<RentalOrder | null>(null);
  const { user } = useAuthStore();
  const { orders: allOrders, isLoading, isError, refetch } = useMyOrders();
  const { properties } = useProperties();
  const { submitPayment, isSubmittingPayment, cancelOrder, isMutating } = useOrderActions();

  const orders = allOrders.filter((o) => o.seekerId === user?.id);
  const filtered = tab === 'all' ? orders : orders.filter((o) => o.status === tab);

  const handleTransferSubmit = async (proofUrl: string) => {
    if (!transferTarget) return;
    await submitPayment({ id: transferTarget.id, paymentProofUrl: proofUrl });
    setTransferTarget(null);
  };

  const TABS: { key: typeof tab; label: string }[] = [
    { key: 'all', label: 'Semua' },
    { key: 'pending', label: 'Menunggu' },
    { key: 'awaiting_payment', label: 'Bayar' },
    { key: 'awaiting_confirmation', label: 'Konfirmasi' },
    { key: 'active', label: 'Berjalan' },
    { key: 'completed', label: 'Selesai' },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <section className="flex flex-col gap-1">
        <h1 className="font-headline text-[28px] md:text-[40px] font-bold tracking-tight text-on-surface">
          Riwayat Sewa
        </h1>
        <p className="font-body text-[14px] text-on-surface-variant">
          Pantau status pengajuan dan sewa aktif Anda.
        </p>
      </section>

      {/* Tabs */}
      <nav className="flex overflow-x-auto gap-4 pb-2 border-b border-outline-variant/30">
        {TABS.map(({ key, label }) => {
          const count = key === 'all' ? orders.length : orders.filter((o) => o.status === key).length;
          if (key !== 'all' && count === 0) return null;
          const isActive = tab === key;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`pb-2 border-b-2 font-label text-[13px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'border-primary text-primary font-semibold'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {label}
            </button>
          );
        })}
      </nav>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-8 text-center">
          <p className="font-body text-[14px] font-semibold text-error mb-3">Gagal memuat riwayat sewa</p>
          <button onClick={() => refetch()} className="font-label text-[13px] font-semibold text-primary hover:text-primary/80 underline cursor-pointer">
            Coba lagi
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-8 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center mb-4">
            <Receipt className="w-7 h-7 text-on-surface-variant" />
          </div>
          <p className="font-headline text-[16px] font-semibold text-on-surface mb-2">Belum ada pengajuan sewa</p>
          <p className="font-body text-[13px] text-on-surface-variant max-w-xs">
            Ajukan sewa kamar kost yang Anda minati di halaman detail kost.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              properties={properties}
              onTransferPay={setTransferTarget}
              onCancel={cancelOrder}
              isMutating={isMutating}
            />
          ))}
        </div>
      )}

      {transferTarget && (
        <TransferModal
          order={transferTarget}
          onClose={() => setTransferTarget(null)}
          onSubmit={handleTransferSubmit}
          isSubmitting={isSubmittingPayment}
        />
      )}
    </div>
  );
};
