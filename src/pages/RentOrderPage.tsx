import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, CheckCircle, Loader2, AlertCircle, Banknote, HandCoins, Copy, Check, Clock, ArrowRight, Home } from 'lucide-react';
import type { Room, PaymentMethod, RentalOrder } from '../types';
import { useOrderActions } from '../hooks/useOrders';
import { useProperties } from '../hooks/useProperties';

const formatIDR = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

export const RentOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { properties } = useProperties();
  const property = properties?.find((p) => p.id === id);

  const availableRooms = useMemo(
    () => (property?.rooms || []).filter((r: Room) => r.status === 'available'),
    [property]
  );

  const { createOrder, isCreating } = useOrderActions();

  const [roomId, setRoomId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [durationMonths, setDurationMonths] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transfer');
  const [error, setError] = useState('');
  const [createdOrder, setCreatedOrder] = useState<RentalOrder | null>(null);
  const [copied, setCopied] = useState(false);

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary-500)] mx-auto mb-4" />
          <p className="text-slate-500">Memuat...</p>
        </div>
      </div>
    );
  }

  const selectedRoom = availableRooms.find((r: Room) => r.id === roomId);
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

  const copyAccount = (accountNumber: string) => {
    navigator.clipboard?.writeText(accountNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  const fmtDate = (d: string) =>
    d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';

  const goBack = () => navigate(`/property/${id}`);

  const goToRiwayat = () => {
    navigate('/anda/home?section=leases');
  };

  // Success state
  if (createdOrder) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-lg mx-auto px-4 py-8">
          {/* Success header */}
          <div className="text-center pt-8 pb-6">
            <div className="w-16 h-16 bg-[var(--primary-100)] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-[var(--primary-600)]" />
            </div>
            <h1 className="text-2xl font-black text-slate-800">Pengajuan Terkirim!</h1>
            <p className="text-sm text-slate-500 mt-2">Permintaan sewa berhasil dibuat</p>
          </div>

          {/* Order summary card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm mb-4">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 bg-[var(--primary-50)] rounded-xl flex items-center justify-center">
                <Home className="w-5 h-5 text-[var(--primary-600)]" />
              </div>
              <div>
                <p className="font-bold text-slate-800">{property.name}</p>
                <p className="text-xs text-slate-400">{property.location?.city}</p>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Kamar</span>
                <span className="font-bold text-slate-800">
                  Kamar {createdOrder.room?.roomNumber || selectedRoom?.room_number || '-'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Mulai Sewa</span>
                <span className="font-bold text-slate-800">{fmtDate(createdOrder.startDate || startDate)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Durasi</span>
                <span className="font-bold text-slate-800">{createdOrder.durationMonths || durationMonths} bulan</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-200">
                <span className="font-bold text-slate-700">Total</span>
                <span className="text-lg font-black text-[var(--primary-700)]">
                  {formatIDR(createdOrder.totalAmount || total)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment instructions */}
          {paymentMethod === 'transfer' ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-extrabold text-amber-700 uppercase">Menunggu Pembayaran</span>
              </div>
              {createdOrder.owner?.bankAccountNumber ? (
                <div className="bg-white rounded-xl border border-amber-100 p-4 space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Transfer ke rekening pemilik</p>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-slate-700">{createdOrder.owner.bankName || 'Bank'}</p>
                      <p className="text-base font-black text-slate-900 tabular-nums">{createdOrder.owner.bankAccountNumber}</p>
                      <p className="text-xs text-slate-500">a.n. {createdOrder.owner.bankAccountHolder || createdOrder.owner.name}</p>
                    </div>
                    <button
                      onClick={() => copyAccount(createdOrder.owner!.bankAccountNumber!)}
                      className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-[var(--primary-600)]" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Tersalin' : 'Salin'}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Detail rekening pemilik akan tersedia di <b>Riwayat Sewa</b>.
                </p>
              )}
              <p className="text-xs text-slate-500 mt-3">
                Setelah transfer, <b>upload bukti pembayaran</b> di Riwayat Sewa agar pemilik dapat mengonfirmasi.
              </p>
            </div>
          ) : (
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-sky-600" />
                <span className="text-xs font-extrabold text-sky-700 uppercase">Menunggu Konfirmasi Pemilik</span>
              </div>
              <p className="text-xs text-slate-600">
                Anda memilih <b>COD / Tunai</b>. Bayar <b>{formatIDR(createdOrder.totalAmount || total)}</b> langsung saat check-in. Pemilik akan mengonfirmasi pengajuan Anda.
              </p>
            </div>
          )}

          {/* CTAs */}
          <div className="space-y-3">
            <button
              onClick={goToRiwayat}
              className="w-full bg-[var(--primary-600)] hover:bg-[var(--primary-700)] text-white font-extrabold text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              Lihat & Pantau di Riwayat Sewa
              <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={goBack} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm py-3 rounded-xl transition-colors cursor-pointer">
              Kembali ke Detail Kost
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Form state
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={goBack}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-lg font-black text-slate-800">Ajukan Sewa Kamar</h1>
            <p className="text-xs text-slate-400">{property.name}</p>
          </div>
        </div>

        {/* Property preview card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex items-center gap-3">
          <div className="w-14 h-14 bg-[var(--primary-50)] rounded-xl flex items-center justify-center overflow-hidden">
            {property.media?.[0] ? (
              <img src={property.media[0].url_medium} alt={property.name} className="w-full h-full object-cover" />
            ) : (
              <Home className="w-6 h-6 text-[var(--primary-400)]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-800 truncate">{property.name}</p>
            <p className="text-xs text-slate-400 truncate">{property.location?.address}</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="space-y-5">
            {/* Pilih kamar */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                Pilih Kamar <span className="text-rose-500">*</span>
              </label>
              {availableRooms.length === 0 ? (
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-sm font-bold text-slate-600">Tidak ada kamar tersedia</p>
                  <p className="text-xs text-slate-400 mt-1">Semua kamar di kost ini sedang terisi.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {availableRooms.map((room: Room) => (
                    <label
                      key={room.id}
                      onClick={() => setRoomId(room.id)}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        roomId === room.id
                          ? 'border-[var(--primary-500)] bg-[var(--primary-50)]'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          roomId === room.id ? 'border-[var(--primary-500)] bg-[var(--primary-500)]' : 'border-slate-300'
                        }`}>
                          {roomId === room.id && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">Kamar {room.room_number || room.id.slice(0, 4)}</p>
                        </div>
                      </div>
                      <span className="text-sm font-black text-[var(--primary-700)]">
                        {formatIDR(room.price_monthly)}<span className="text-xs font-normal text-slate-400">/bln</span>
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Tanggal & durasi */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  Tanggal Mulai <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <CalendarDays className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-[var(--primary-500)] transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Durasi (bulan)</label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(Math.max(1, Math.min(12, Number(e.target.value))))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-800 focus:outline-none focus:border-[var(--primary-500)] transition-all"
                />
              </div>
            </div>

            {/* Metode pembayaran */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">
                Metode Pembayaran
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('transfer')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'transfer'
                      ? 'border-[var(--primary-500)] bg-[var(--primary-50)] text-[var(--primary-700)]'
                      : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <Banknote className="w-6 h-6" />
                  <span className="text-xs font-extrabold">Transfer Bank</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-[var(--primary-500)] bg-[var(--primary-50)] text-[var(--primary-700)]'
                      : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <HandCoins className="w-6 h-6" />
                  <span className="text-xs font-extrabold">COD / Tunai</span>
                </button>
              </div>
            </div>

            {/* Total estimasi */}
            <div className="bg-[var(--primary-50)] border border-[var(--primary-100)] rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-[var(--primary-700)] uppercase tracking-wider">Total Estimasi</p>
                <p className="text-xs text-slate-500">
                  {selectedRoom ? `${formatIDR(selectedRoom.price_monthly)} × ${durationMonths} bulan` : 'Pilih kamar dulu'}
                </p>
              </div>
              <span className="text-xl font-black text-[var(--primary-700)]">{formatIDR(total)}</span>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <p className="text-xs font-medium text-rose-600">{error}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isCreating || !roomId || !startDate || availableRooms.length === 0}
              className="w-full bg-[var(--primary-600)] hover:bg-[var(--primary-700)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  Kirim Pengajuan Sewa
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
