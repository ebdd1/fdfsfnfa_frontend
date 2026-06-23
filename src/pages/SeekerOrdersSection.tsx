import React, { useState, useRef } from 'react';
import {
  Home, Loader2, XCircle, Banknote, HandCoins,
  Upload, CheckCircle, Clock, AlertCircle, X, ZoomIn,
} from 'lucide-react';
import { useMyOrders, useOrderActions } from '../hooks/useOrders';
import { useAuthStore } from '../stores/authStore';
import { ORDER_STATUS_LABEL } from '../services/api/order.service';
import { uploadService } from '../services/api/upload.service';
import { OrderTimeline } from '../components/OrderTimeline';
import type { RentalOrder, OrderStatus } from '../types';

const fmtIDR = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-base font-black text-slate-800">Upload Bukti Transfer</h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {/* Rekening tujuan */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-1.5">
            <p className="text-[10px] font-black text-blue-700 uppercase tracking-wider mb-2">Rekening Tujuan Transfer</p>
            {hasBank ? (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Bank</span>
                  <span className="font-bold text-slate-800">{owner?.bankName || '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">No. Rekening</span>
                  <span className="font-black text-slate-900 tracking-widest">{owner?.bankAccountNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Atas Nama</span>
                  <span className="font-bold text-slate-800">{owner?.bankAccountHolder}</span>
                </div>
              </>
            ) : (
              <p className="text-xs text-blue-600 font-medium">Pemilik belum mengisi data rekening. Hubungi via pesan.</p>
            )}
            <div className="border-t border-blue-200 pt-2 mt-2 flex justify-between text-sm">
              <span className="text-slate-500 font-bold">Total Transfer</span>
              <span className="font-black text-[var(--primary-600)]">{fmtIDR(order.totalAmount)}</span>
            </div>
          </div>

          {/* Upload area */}
          <div>
            <p className="text-xs font-bold text-slate-700 mb-2">Foto Bukti Transfer</p>
            <div
              onClick={() => fileRef.current?.click()}
              className="cursor-pointer border-2 border-dashed border-slate-200 hover:border-[var(--primary-400)] rounded-2xl transition-colors overflow-hidden"
            >
              {preview ? (
                <img src={preview} alt="preview" className="w-full h-40 object-cover" />
              ) : (
                <div className="h-28 flex flex-col items-center justify-center gap-2 text-slate-400">
                  <Upload className="w-6 h-6" />
                  <span className="text-xs font-medium">Klik untuk pilih foto</span>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>

          {error && (
            <p className="flex items-center gap-1.5 text-xs font-medium text-rose-600">
              <AlertCircle className="w-4 h-4" /> {error}
            </p>
          )}

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-all cursor-pointer">
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={uploading || isSubmitting || !file}
              className="flex-1 py-2.5 bg-[var(--primary-600)] hover:bg-[var(--primary-700)] disabled:opacity-50 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm" onClick={onClose}>
    <img src={url} alt="bukti transfer" className="max-w-[90vw] max-h-[85vh] rounded-2xl shadow-2xl" />
    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors">
      <X className="w-5 h-5" />
    </button>
  </div>
);

/* ── Order row ── */
const OrderRow: React.FC<{
  order: RentalOrder;
  onTransferPay?: (order: RentalOrder) => void;
  onCancel?: (id: string) => void;
  isMutating: boolean;
}> = ({ order, onTransferPay, onCancel, isMutating }) => {
  const [lightbox, setLightbox] = useState('');
  const owner = order.owner;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-shadow">
      {lightbox && <Lightbox url={lightbox} onClose={() => setLightbox('')} />}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="w-11 h-11 rounded-xl bg-[var(--primary-50)] border border-[var(--primary-100)] flex items-center justify-center text-[var(--primary-600)] font-black text-sm shrink-0 overflow-hidden">
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
              <MethodBadge method={order.paymentMethod} />
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
            <span className="text-[10px] text-[var(--primary-600)] font-semibold">Lunas: {fmtDate(order.paidAt)}</span>
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

      {/* Info / action row */}
      <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
        {/* Transfer: awaiting_payment → tampil tombol upload */}
        {order.status === 'awaiting_payment' && order.paymentMethod === 'transfer' && (
          <button
            onClick={() => onTransferPay?.(order)}
            className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Bukti Transfer
          </button>
        )}

        {/* COD: awaiting_payment → instruksi tunggu */}
        {order.status === 'awaiting_payment' && order.paymentMethod === 'cod' && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-start gap-2">
            <HandCoins className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-700">Bayar Tunai saat Check-in</p>
              <p className="text-[11px] text-amber-600 font-medium mt-0.5">
                Siapkan uang tunai {fmtIDR(order.totalAmount)} untuk dibayarkan langsung kepada pemilik kost.
                {owner?.phone && ` Hubungi: ${owner.phone}`}
              </p>
            </div>
          </div>
        )}

        {/* Transfer: awaiting_confirmation → info menunggu */}
        {order.status === 'awaiting_confirmation' && (
          <div className="bg-violet-50 border border-violet-100 rounded-xl p-3 flex items-start gap-2">
            <Clock className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-bold text-violet-700">Bukti Transfer Terkirim</p>
              <p className="text-[11px] text-violet-600 font-medium mt-0.5">Menunggu konfirmasi dari pemilik kost.</p>
              {order.paymentProofUrl && (
                <button
                  onClick={() => setLightbox(order.paymentProofUrl!)}
                  className="mt-2 flex items-center gap-1 text-[10px] font-bold text-violet-700 hover:text-violet-900 underline"
                >
                  <ZoomIn className="w-3 h-3" /> Lihat bukti yang dikirim
                </button>
              )}
            </div>
          </div>
        )}

        {/* Cancel + total */}
        <div className="flex items-center gap-2">
          {(order.status === 'pending' || order.status === 'awaiting_payment' || order.status === 'awaiting_confirmation') && (
            <button
              onClick={() => onCancel?.(order.id)}
              disabled={isMutating}
              className="flex items-center justify-center gap-1.5 bg-white hover:bg-rose-50 text-rose-600 font-extrabold text-xs py-2 px-3 rounded-xl border border-rose-100 transition-all cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" />
              Batalkan
            </button>
          )}
          {order.status === 'active' && (
            <span className="flex items-center gap-1 text-[11px] text-[var(--primary-600)] font-bold">
              <CheckCircle className="w-3.5 h-3.5" /> Sewa Aktif
            </span>
          )}
          <span className="text-[10px] text-slate-400 font-medium ml-auto">
            Total: <b>{fmtIDR(order.totalAmount)}</b>
          </span>
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
  const { submitPayment, isSubmittingPayment, cancelOrder, isMutating } = useOrderActions();

  const orders = allOrders.filter((o) => o.seekerId === user?.id);
  const filtered = tab === 'all' ? orders : orders.filter((o) => o.status === tab);
  const activeOrders = orders.filter((o) => o.status === 'active');

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
    { key: 'active', label: 'Aktif' },
    { key: 'completed', label: 'Selesai' },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Riwayat Sewa</h2>
          <p className="text-[12px] text-slate-400 mt-0.5">Pantau status pengajuan dan sewa aktif Anda</p>
        </div>
        {activeOrders.length > 0 && (
          <span className="inline-flex items-center gap-1.5 bg-[var(--primary-50)] text-[var(--primary-700)] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-[var(--primary-100)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-500)] animate-pulse" />
            {activeOrders.length} Aktif
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto">
        {TABS.map(({ key, label }) => {
          const count = key === 'all' ? orders.length : orders.filter((o) => o.status === key).length;
          if (key !== 'all' && count === 0) return null;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                tab === key ? 'bg-white text-[var(--primary-700)] shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {label}
              {count > 0 && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                  tab === key ? 'bg-[var(--primary-100)] text-[var(--primary-700)]' : 'bg-slate-200 text-slate-500'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--primary-500)]" />
        </div>
      ) : isError ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-8 text-center">
          <p className="text-sm font-semibold text-rose-500 mb-3">Gagal memuat riwayat sewa</p>
          <button onClick={() => refetch()} className="text-xs font-bold text-[var(--primary-600)] hover:text-[var(--primary-700)] underline">
            Coba lagi
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-12 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Home className="w-6 h-6 text-slate-300" />
          </div>
          <p className="text-sm font-bold text-slate-600 mb-1">Belum ada pengajuan sewa</p>
          <p className="text-xs text-slate-400 max-w-xs">Ajukan sewa kamar kost yang Anda minati di halaman detail kost.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
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
