import React, { useState, useRef } from 'react';
import {
  Home, Loader2,
  Upload, AlertCircle, X,
  Receipt, Check,
} from 'lucide-react';
import { useMyOrders, useOrderActions } from '../hooks/useOrders';
import { useAuthStore } from '../stores/authStore';
import { uploadService } from '../services/api/upload.service';
import { useProperties } from '../hooks/useProperties';
import type { RentalOrder } from '../types';

const fmtIDR = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

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
      <div className="bg-surface-container-lowest rounded-2xl shadow-level-3 w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-outline-variant bg-surface-container-low">
          <h3 className="font-headline text-lg font-bold text-on-surface">Upload Bukti Transfer</h3>
          <button onClick={onClose} className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {/* Rekening tujuan */}
          <div className="bg-primary-fixed/20 border border-primary-fixed rounded-2xl p-4 space-y-3">
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2">Rekening Tujuan Transfer</p>
            {hasBank ? (
              <>
                <div className="flex justify-between text-body-sm">
                  <span className="text-on-surface-variant font-medium">Bank</span>
                  <span className="font-semibold text-on-surface">{owner?.bankName || '—'}</span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-on-surface-variant font-medium">No. Rekening</span>
                  <span className="font-bold text-on-surface tracking-wider">{owner?.bankAccountNumber}</span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-on-surface-variant font-medium">Atas Nama</span>
                  <span className="font-bold text-on-surface">{owner?.bankAccountHolder}</span>
                </div>
              </>
            ) : (
              <p className="text-label-sm text-primary font-medium">Pemilik belum mengisi data rekening. Hubungi via pesan.</p>
            )}
            <div className="border-t border-primary-fixed-dim pt-3 mt-2 flex justify-between text-body-sm">
              <span className="font-bold text-on-surface">Total Transfer</span>
              <span className="font-bold text-primary">{fmtIDR(order.totalAmount)}</span>
            </div>
          </div>

          {/* Upload area */}
          <div>
            <p className="text-label-sm font-bold text-on-surface mb-2">Foto Bukti Transfer</p>
            <div
              onClick={() => fileRef.current?.click()}
              className="cursor-pointer border-2 border-dashed border-outline-variant hover:border-primary rounded-xl transition-colors overflow-hidden"
            >
              {preview ? (
                <img src={preview} alt="preview" className="w-full h-40 object-cover" />
              ) : (
                <div className="h-28 flex flex-col items-center justify-center gap-2 text-on-surface-variant">
                  <Upload className="w-6 h-6" />
                  <span className="text-label-sm font-medium">Klik untuk pilih foto</span>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-error-container rounded-xl border border-error">
              <AlertCircle className="w-4 h-4 text-error shrink-0" />
              <span className="text-label-sm font-medium text-error">{error}</span>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-label-sm rounded-xl transition-all cursor-pointer">
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={uploading || isSubmitting || !file}
              className="flex-1 py-3 bg-primary hover:bg-primary-container disabled:opacity-50 text-on-primary font-semibold text-label-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {uploading || isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
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
    <img src={url} alt="bukti transfer" className="max-w-[90vw] max-h-[85vh] rounded-2xl shadow-level-3" />
    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-surface-container-lowest/20 hover:bg-surface-container-lowest/30 rounded-full text-on-surface transition-colors cursor-pointer">
      <X className="w-5 h-5" />
    </button>
  </div>
);

/* ── Order Detail Modal (Premium Dwelling Style) ── */
interface OrderDetailModalProps {
  order: RentalOrder;
  properties: ReturnType<typeof useProperties>['properties'];
  onClose: () => void;
  onChat?: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, properties, onClose, onChat }) => {
  const propertyData = properties.find(p => p.id === order.propertyId);
  const coverImage = propertyData?.media?.[0]?.url_original;

  const status = statusConfig[order.status] || statusConfig.pending;

  // Format date
  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Steps based on payment method (COD vs Transfer)
  const steps = order.paymentMethod === 'cod'
    ? [
        { label: 'Menunggu Persetujuan Pemilik', desc: 'Pemilik akan meninjau profil dan permintaan Anda dalam 1x24 jam.' },
        { label: 'Koordinasi Waktu Check-in', desc: 'Gunakan fitur chat untuk membuat janji temu dengan pengelola properti.' },
        { label: 'Bayar di Lokasi', desc: 'Lakukan pembayaran penuh saat Anda menerima kunci kamar.' },
      ]
    : [
        { label: 'Menunggu Persetujuan Pemilik', desc: 'Pemilik akan meninjau profil dan permintaan Anda dalam 1x24 jam.' },
        { label: 'Upload Bukti Bayar', desc: 'Transfer ke rekening yang tertera, lalu upload bukti transfer.' },
        { label: 'Konfirmasi Pemilik', desc: 'Pemilik akan mengonfirmasi pembayaran Anda.' },
      ];

  // Get current step based on status
  const getCurrentStep = (): number => {
    const statusStep: Record<string, number> = {
      pending: 0,
      awaiting_payment: 1,
      awaiting_confirmation: 2,
      active: 3,
    };
    return statusStep[order.status] ?? 0;
  };

  const currentStep = getCurrentStep();

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-surface shadow-sm h-16">
        <div className="flex items-center px-4 h-full max-w-2xl mx-auto">
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <h1 className="ml-2 font-headline font-semibold text-xl text-primary">Detail Sewa</h1>
        </div>
      </header>

      {/* Content */}
      <main className="pt-24 px-4 max-w-2xl mx-auto space-y-6 pb-24 overflow-y-auto">
        {/* Success Header */}
        <section className="text-center space-y-4 py-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-container rounded-full" style={{ boxShadow: '0 0 20px rgba(0, 74, 198, 0.2)' }}>
            <span className="material-symbols-outlined text-on-primary-container text-4xl" style={{ fontVariationSettings: "'wght' 700" }}>check_circle</span>
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-on-surface">Pengajuan Sewa Terkirim</h2>
            <p className="text-on-surface-variant text-sm">Pesanan Anda telah kami sampaikan ke pengelola properti.</p>
          </div>
        </section>

        {/* Payment Info Box */}
        <section className="bg-surface-container-highest border border-primary/10 rounded-xl p-5 flex gap-4">
          <div className="flex-shrink-0">
            <span className="material-symbols-outlined text-primary text-2xl">payments</span>
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-primary text-sm">
              {order.paymentMethod === 'cod' ? 'Bayar di Tempat (COD)' : 'Transfer Bank'}
            </h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              {order.paymentMethod === 'cod'
                ? 'Pembayaran sewa dilakukan secara langsung kepada pengelola properti saat Anda tiba di lokasi.'
                : `Transfer ke rekening pemilik kost. Upload bukti transfer setelah transfer selesai.`}
            </p>
          </div>
        </section>

        {/* Booking Summary Card */}
        <section className="bg-surface-container-lowest rounded-xl shadow-level-1 overflow-hidden border border-outline-variant/30">
          {/* Header */}
          <div className="p-4 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low/30">
            <span className="text-label-sm font-semibold text-on-surface-variant">
              ORDER ID: {order.id.slice(0, 8).toUpperCase()}
            </span>
            <span className={`${status.bg} ${status.text} px-2 py-1 rounded-full text-[10px] font-bold tracking-wider`}>
              {status.label.toUpperCase()}
            </span>
          </div>

          {/* Content */}
          <div className="p-5 flex gap-4">
            {/* Property Image */}
            <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
              {coverImage ? (
                <img src={coverImage} alt={order.property?.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-surface-variant flex items-center justify-center">
                  <Home className="w-8 h-8 text-on-surface-variant" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-grow space-y-1">
              <h4 className="font-bold text-lg text-on-surface leading-tight">{order.property?.name || 'Kost'}</h4>
              <p className="text-on-surface-variant text-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-base">meeting_room</span>
                Kamar {order.room?.roomNumber || order.room?.id?.slice(0, 4) || '-'}
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                <span className="bg-surface-container text-primary px-2 py-1 rounded text-[11px] font-semibold">
                  {order.durationMonths} Bulan
                </span>
                <span className="bg-surface-container text-primary px-2 py-1 rounded text-[11px] font-semibold">
                  Mulai {formatDate(order.startDate)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps Timeline */}
        <section className="space-y-4">
          <h3 className="font-bold text-on-surface text-lg px-1">Langkah Selanjutnya</h3>
          <div className="relative pl-8 space-y-8">
            {/* Vertical line */}
            <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-outline-variant/40" />

            {steps.map((step, idx) => {
              const isCompleted = idx < currentStep;
              const isCurrent = idx === currentStep;
              const isPending = idx > currentStep;

              return (
                <div key={idx} className="relative">
                  {/* Circle */}
                  <div
                    className={`absolute -left-8 w-6 h-6 rounded-full flex items-center justify-center z-10 border-4 border-background transition-all ${
                      isCompleted
                        ? 'bg-primary'
                        : isCurrent
                        ? 'bg-primary text-white'
                        : 'bg-surface-variant border-2 border-outline-variant'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3 h-3 text-white" />
                    ) : (
                      <span className={`text-[10px] font-bold ${isPending ? 'text-on-surface-variant' : 'text-white'}`}>
                        {idx + 1}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className={`space-y-1 ${isPending ? 'opacity-60' : ''}`}>
                    <h4 className={`font-bold text-sm ${isCurrent ? 'text-primary' : 'text-on-surface'}`}>
                      {step.label}
                    </h4>
                    <p className="text-on-surface-variant text-sm">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Action Buttons */}
        <section className="pt-6 flex flex-col gap-3">
          <button
            onClick={onChat}
            className="w-full bg-primary hover:bg-primary-container text-white font-bold py-4 rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
            Hubungi Pengelola
          </button>
          <button
            onClick={onClose}
            className="w-full bg-transparent border border-outline-variant text-on-surface-variant font-bold py-4 rounded-xl transition-all hover:bg-surface-container-low active:scale-[0.98] cursor-pointer"
          >
            Lihat Riwayat Sewa
          </button>
        </section>
      </main>
    </div>
  );
};

/* ── Status badge colors (Premium Dwelling System) ── */
const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-secondary-container/10', text: 'text-secondary', label: 'Menunggu Persetujuan' },
  awaiting_payment: { bg: 'bg-warning/10', text: 'text-warning', label: 'Menunggu Pembayaran' },
  awaiting_confirmation: { bg: 'bg-secondary-container/10', text: 'text-secondary', label: 'Menunggu Konfirmasi' },
  active: { bg: 'bg-tertiary-container/10', text: 'text-tertiary', label: 'Aktif' },
  rejected: { bg: 'bg-error-container', text: 'text-error', label: 'Ditolak' },
  cancelled: { bg: 'bg-surface-container', text: 'text-on-surface-variant', label: 'Dibatalkan' },
  completed: { bg: 'bg-surface-container-highest', text: 'text-on-surface-variant', label: 'Selesai' },
};

/* ── Progress Stepper Component (Premium Style) ── */
const OrderProgressStepper: React.FC<{ status: RentalOrder['status'] }> = ({ status }) => {
  // Step definitions: Ajukan → Persetujuan → Bayar → Aktif
  const steps = [
    { label: 'Ajukan', key: 'submitted' },
    { label: 'Persetujuan', key: 'approved' },
    { label: 'Bayar', key: 'paid' },
    { label: 'Aktif', key: 'active' },
  ];

  // Determine current step based on status
  const getStepState = (stepKey: string): 'completed' | 'current' | 'upcoming' => {
    const statusOrder: Record<string, number> = {
      pending: 0,
      awaiting_payment: 1,
      awaiting_confirmation: 1,
      active: 3,
      rejected: -1,
      cancelled: -1,
      completed: 4,
    };
    const currentStep = statusOrder[status] ?? 0;
    const stepIndex = steps.findIndex(s => s.key === stepKey);

    if (currentStep === -1) return 'upcoming';
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'upcoming';
  };

  // Calculate progress line width
  const getProgressWidth = (): string => {
    const statusOrder: Record<string, number> = {
      pending: 0,
      awaiting_payment: 1,
      awaiting_confirmation: 1,
      active: 3,
      rejected: -1,
      cancelled: -1,
      completed: 4,
    };
    const currentStep = statusOrder[status] ?? 0;
    if (currentStep <= 0) return 'w-0';
    if (currentStep >= 3) return 'w-full';
    const percentage = (currentStep / (steps.length - 1)) * 100;
    return `${percentage}%`;
  };

  return (
    <div className="relative flex items-center justify-between px-8">
      {/* Background Line */}
      <div className="absolute left-8 right-8 top-3 h-0.5 bg-surface-variant" />
      {/* Active Progress Line */}
      <div
        className="absolute left-8 top-3 h-0.5 bg-primary transition-all duration-500"
        style={{ width: `calc(${getProgressWidth()} * (100% - 4rem))` }}
      />

      {steps.map((step, idx) => {
        const state = getStepState(step.key);
        return (
          <div key={step.key} className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shadow-sm transition-all ${
              state === 'completed'
                ? 'bg-primary text-on-primary'
                : state === 'current'
                ? 'bg-surface-container-lowest border-2 border-primary text-primary'
                : 'bg-surface-variant text-on-surface-variant'
            }`}>
              {state === 'completed' ? (
                <Check className="w-4 h-4 font-bold" />
              ) : (
                <span className="text-[11px] font-bold">{idx + 1}</span>
              )}
            </div>
            <span className={`text-[10px] font-medium text-center ${
              state === 'completed' ? 'text-primary font-bold' : state === 'current' ? 'text-on-background font-bold' : 'text-on-surface-variant'
            }`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/* ── Order card (Premium Dwelling System) ── */
const OrderCard: React.FC<{
  order: RentalOrder;
  properties: ReturnType<typeof useProperties>['properties'];
  onTransferPay?: (order: RentalOrder) => void;
  onCancel?: (id: string) => void;
  onViewDetail?: (order: RentalOrder) => void;
  isMutating: boolean;
}> = ({ order, properties, onTransferPay, onCancel, onViewDetail, isMutating }) => {
  const [lightbox, setLightbox] = useState('');
  const status = statusConfig[order.status] || statusConfig.pending;

  // Get property image from full properties data
  const propertyData = properties.find(p => p.id === order.propertyId);
  const coverImage = propertyData?.media?.[0]?.url_original;

  const isTerminalStatus = ['rejected', 'cancelled', 'completed'].includes(order.status);

  return (
    <article className="bg-surface-container-lowest rounded-2xl shadow-level-1 overflow-hidden border border-surface-container transition-shadow hover:shadow-level-2">
      {lightbox && <Lightbox url={lightbox} onClose={() => setLightbox('')} />}

      {/* Main Content Row */}
      <div className="flex p-4 gap-4">
        {/* Property Image */}
        <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
          {coverImage ? (
            <img src={coverImage} alt={order.property?.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-surface-variant flex items-center justify-center">
              <Home className="w-8 h-8 text-on-surface-variant" />
            </div>
          )}
        </div>

        {/* Property Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-1 gap-2">
              <h3 className="font-headline text-lg font-bold text-on-surface line-clamp-1">{order.property?.name || 'Kost'}</h3>
              <span className={`${status.bg} ${status.text} font-semibold text-[10px] px-2 py-1 rounded-md whitespace-nowrap shrink-0`}>
                {status.label}
              </span>
            </div>
            <div className="flex items-center text-on-surface-variant text-xs mb-1">
              <span className="material-symbols-outlined text-sm mr-1">location_on</span>
              {order.property?.city || 'Lokasi'}
            </div>
          </div>
          <div className="font-headline font-bold text-primary">
            {fmtIDR(order.priceMonthly)}
            <span className="text-xs font-normal text-on-surface-variant"> / bulan</span>
          </div>
        </div>
      </div>

      {/* Progress Stepper (for non-terminal statuses) */}
      {!isTerminalStatus && (
        <div className="px-6 py-4 bg-surface-container-low/50 border-t border-surface-container-low">
          <OrderProgressStepper status={order.status} />
        </div>
      )}

      {/* Action Buttons */}
      <div className="p-4 flex gap-3">
        {/* Cancel button */}
        {(order.status === 'pending' || order.status === 'awaiting_payment' || order.status === 'awaiting_confirmation') && (
          <button
            onClick={() => onCancel?.(order.id)}
            disabled={isMutating}
            className="flex-1 py-2.5 rounded-lg border border-outline-variant text-on-surface-variant font-semibold text-label-sm hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            Batalkan
          </button>
        )}

        {/* Pay now button */}
        {order.status === 'awaiting_payment' && order.paymentMethod === 'transfer' && (
          <button
            onClick={() => onTransferPay?.(order)}
            className="flex-1 py-2.5 rounded-lg bg-surface-container text-on-surface-variant font-semibold text-label-sm opacity-50 cursor-not-allowed"
            disabled
          >
            Bayar Sekarang
          </button>
        )}

        {/* Active - View Detail */}
        {order.status === 'active' && (
          <button
            onClick={() => onViewDetail?.(order)}
            className="w-full py-2.5 rounded-lg bg-primary/5 text-primary border border-primary/20 font-semibold text-label-sm hover:bg-primary/10 transition-colors cursor-pointer"
          >
            Lihat Detail
          </button>
        )}

        {/* Completed - Rent Again */}
        {order.status === 'completed' && (
          <button className="px-6 py-2.5 rounded-lg bg-surface-container text-primary font-semibold text-label-sm hover:bg-surface-container-high transition-colors cursor-pointer">
            Sewa Lagi
          </button>
        )}
      </div>
    </article>
  );
};

export const SeekerOrdersSection: React.FC = () => {
  const [tab, setTab] = useState<'all' | 'pending' | 'awaiting_payment' | 'awaiting_confirmation' | 'active' | 'completed'>('all');
  const [transferTarget, setTransferTarget] = useState<RentalOrder | null>(null);
  const [detailOrder, setDetailOrder] = useState<RentalOrder | null>(null);
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

  // Premium Dwelling System tabs
  const TABS: { key: typeof tab; label: string }[] = [
    { key: 'all', label: 'Semua' },
    { key: 'pending', label: 'Menunggu' },
    { key: 'active', label: 'Berjalan' },
    { key: 'completed', label: 'Selesai' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <section>
        <h1 className="font-headline text-[30px] font-bold leading-tight tracking-tight text-on-background mb-1">
          Riwayat Sewa
        </h1>
        <p className="text-on-surface-variant text-body-md">
          Pantau status aplikasi dan hunian aktif Anda.
        </p>
      </section>

      {/* Filter Tabs (Premium Style) */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
        {TABS.map(({ key, label }) => {
          const count = key === 'all' ? orders.length : orders.filter((o) => o.status === key).length;
          if (key !== 'all' && count === 0) return null;
          const isActive = tab === key;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-5 py-2 rounded-full font-semibold text-label-sm whitespace-nowrap transition-all active:scale-95 cursor-pointer ${
                isActive
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container text-on-surface-variant font-medium hover:bg-surface-container-high'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-8 text-center">
          <p className="text-body-md font-semibold text-error mb-3">Gagal memuat riwayat sewa</p>
          <button onClick={() => refetch()} className="text-label-md font-semibold text-primary hover:text-primary/80 underline cursor-pointer">
            Coba lagi
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-8 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center mb-4">
            <Receipt className="w-7 h-7 text-on-surface-variant" />
          </div>
          <p className="font-headline text-lg font-semibold text-on-surface mb-2">Belum ada pengajuan sewa</p>
          <p className="text-body-sm text-on-surface-variant max-w-xs">
            Ajukan sewa kamar kost yang Anda minati di halaman detail kost.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              properties={properties}
              onTransferPay={setTransferTarget}
              onCancel={cancelOrder}
              onViewDetail={setDetailOrder}
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

      {detailOrder && (
        <OrderDetailModal
          order={detailOrder}
          properties={properties}
          onClose={() => setDetailOrder(null)}
          onChat={() => {
            // Navigate to chat - close modal first
            setDetailOrder(null);
          }}
        />
      )}
    </div>
  );
};
