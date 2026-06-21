import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CalendarDays, CheckCircle, Loader2, AlertCircle, Banknote, HandCoins, Copy, Check, Clock, ArrowRight } from 'lucide-react';
import type { Room, PaymentMethod, RentalOrder } from '../types';
import { useOrderActions } from '../hooks/useOrders';

interface RentOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyName: string;
  rooms: Room[];
}

const formatIDR = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

export const RentOrderModal: React.FC<RentOrderModalProps> = ({ isOpen, onClose, propertyName, rooms }) => {
  const navigate = useNavigate();
  const availableRooms = useMemo(() => rooms.filter((r) => r.status === 'available'), [rooms]);
  const { createOrder, isCreating } = useOrderActions();

  const [roomId, setRoomId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [durationMonths, setDurationMonths] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transfer');
  const [error, setError] = useState('');
  const [createdOrder, setCreatedOrder] = useState<RentalOrder | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const selectedRoom = availableRooms.find((r) => r.id === roomId);
  const total = selectedRoom ? selectedRoom.price_monthly * durationMonths : 0;

  const handleSubmit = async () => {
    setError('');
    if (!roomId) return setError('Pilih kamar terlebih dahulu.');
    if (!startDate) return setError('Pilih tanggal mulai sewa.');
    try {
      const order = await createOrder({ roomId, startDate, durationMonths, paymentMethod });
      setCreatedOrder(order);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Gagal mengajukan sewa. Coba lagi.');
    }
  };

  const reset = () => {
    setRoomId('');
    setStartDate('');
    setDurationMonths(1);
    setPaymentMethod('transfer');
    setError('');
    setCreatedOrder(null);
    setCopied(false);
    onClose();
  };

  const goToRiwayat = () => {
    reset();
    navigate('/anda/home?section=leases');
  };

  const copyAccount = (accountNumber: string) => {
    navigator.clipboard?.writeText(accountNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  const fmtDate = (d: string) =>
    d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-black text-slate-800">Ajukan Sewa Kamar</h2>
            <p className="text-xs text-slate-500 font-medium mt-1">{propertyName}</p>
          </div>
          <button onClick={reset} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {createdOrder ? (
            <div className="animate-in fade-in zoom-in-95 duration-200 space-y-4">
              {/* Success header */}
              <div className="text-center pt-1">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-600">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-slate-800">Pengajuan Terkirim!</h3>
                <p className="text-xs text-slate-500 mt-1">Permintaan sewa berhasil dibuat</p>
              </div>

              {/* Order summary */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-2.5 border border-slate-100">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Kamar</span>
                  <span className="font-bold text-slate-800">Kamar {createdOrder.room?.roomNumber || selectedRoom?.room_number || '-'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Mulai Sewa</span>
                  <span className="font-bold text-slate-800">{fmtDate(createdOrder.startDate || startDate)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Durasi</span>
                  <span className="font-bold text-slate-800">{createdOrder.durationMonths || durationMonths} bulan</span>
                </div>
                <div className="flex justify-between items-center pt-2.5 border-t border-slate-200">
                  <span className="text-sm font-bold text-slate-700">Total</span>
                  <span className="text-base font-black text-emerald-700">{formatIDR(createdOrder.totalAmount || total)}</span>
                </div>
              </div>

              {/* Payment instructions — method specific */}
              {paymentMethod === 'transfer' ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="text-xs font-extrabold text-amber-700 uppercase tracking-wide">Menunggu Pembayaran</span>
                  </div>
                  {createdOrder.owner?.bankAccountNumber ? (
                    <div className="bg-white rounded-xl border border-amber-100 p-3.5 space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Transfer ke rekening pemilik</p>
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-black text-slate-800">{createdOrder.owner.bankName || 'Bank'}</p>
                          <p className="text-base font-black text-slate-900 tabular-nums tracking-wide">{createdOrder.owner.bankAccountNumber}</p>
                          <p className="text-[11px] text-slate-500 font-semibold">a.n. {createdOrder.owner.bankAccountHolder || createdOrder.owner.name}</p>
                        </div>
                        <button
                          onClick={() => copyAccount(createdOrder.owner!.bankAccountNumber!)}
                          className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          {copied ? 'Tersalin' : 'Salin'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Detail rekening pemilik akan tersedia di <b>Riwayat Sewa</b>.
                    </p>
                  )}
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Setelah transfer, <b>upload bukti pembayaran</b> di Riwayat Sewa agar pemilik dapat mengonfirmasi.
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-sky-200 bg-sky-50/60 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-sky-600 shrink-0" />
                    <span className="text-xs font-extrabold text-sky-700 uppercase tracking-wide">Menunggu Konfirmasi Pemilik</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Anda memilih <b>COD / Tunai</b>. Bayar <b>{formatIDR(createdOrder.totalAmount || total)}</b> langsung saat check-in. Pemilik akan mengonfirmasi pengajuan Anda.
                  </p>
                </div>
              )}

              {/* CTAs */}
              <div className="space-y-2.5 pt-1">
                <button
                  onClick={goToRiwayat}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-[0.98]"
                >
                  Lihat & Pantau di Riwayat Sewa
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={reset} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm py-3 rounded-xl transition-colors cursor-pointer">
                  Tutup
                </button>
              </div>
            </div>
          ) : availableRooms.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm font-bold text-slate-700 mb-1">Tidak ada kamar tersedia</p>
              <p className="text-xs text-slate-400">Semua kamar di kost ini sedang terisi.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Pilih kamar */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Pilih Kamar</label>
                <select
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
                >
                  <option value="">— Pilih kamar tersedia —</option>
                  {availableRooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      Kamar {r.room_number || r.id.slice(0, 4)} — {formatIDR(r.price_monthly)}/bln
                    </option>
                  ))}
                </select>
              </div>

              {/* Tanggal & durasi */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Tanggal Mulai</label>
                  <div className="relative">
                    <CalendarDays className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Durasi (bulan)</label>
                  <input
                    type="number"
                    min={1}
                    value={durationMonths}
                    onChange={(e) => setDurationMonths(Math.max(1, Number(e.target.value)))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-800 focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              {/* Metode pembayaran */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Metode Pembayaran</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('transfer')}
                    className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'transfer'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <Banknote className="w-5 h-5" />
                    <span className="text-xs font-extrabold">Transfer Bank</span>
                    <span className="text-[10px] font-medium text-center leading-tight opacity-70">Upload bukti setelah transfer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <HandCoins className="w-5 h-5" />
                    <span className="text-xs font-extrabold">COD / Tunai</span>
                    <span className="text-[10px] font-medium text-center leading-tight opacity-70">Bayar langsung saat check-in</span>
                  </button>
                </div>
              </div>

              {/* Total estimasi */}
              <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Total Estimasi</p>
                  <p className="text-[11px] text-slate-500">{selectedRoom ? `${formatIDR(selectedRoom.price_monthly)} × ${durationMonths} bulan` : 'Pilih kamar dulu'}</p>
                </div>
                <span className="text-xl font-black text-emerald-700">{formatIDR(total)}</span>
              </div>

              {error && (
                <p className="flex items-center gap-1.5 text-xs font-medium text-rose-600">
                  <AlertCircle className="w-4 h-4" /> {error}
                </p>
              )}

              <button
                onClick={handleSubmit}
                disabled={isCreating}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-extrabold text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Kirim Pengajuan Sewa
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
