import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Check, Copy, CheckCircle, Loader2, AlertCircle, ArrowRight, Home, Calendar, Clock, Banknote, HandCoins, ShieldCheck, Headset, HelpCircle } from 'lucide-react';
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
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-on-surface-variant">Memuat...</p>
        </div>
      </div>
    );
  }

  const selectedRoom = availableRooms.find((r: Room) => r.id === roomId);
  const serviceFee = 50000;
  const tax = Math.round((selectedRoom?.price_monthly || 0) * 0.11);
  const total = selectedRoom ? (selectedRoom.price_monthly * durationMonths) + serviceFee + tax : 0;

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
  const goToRiwayat = () => navigate('/anda/home?section=leases');

  // Success state
  if (createdOrder) {
    return (
      <div className="min-h-screen bg-surface">
        {/* Mobile Layout */}
        <div className="max-w-lg mx-auto md:max-w-6xl md:grid md:grid-cols-12 md:gap-10 md:items-start">
          {/* Mobile Success Card */}
          <div className="md:col-span-8 md:bg-white md:rounded-2xl md:p-8 md:shadow-sm md:border md:border-outline-variant">
            {/* Mobile Header */}
            <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-surface-container-high px-4 h-16 flex items-center gap-3 md:hidden">
              <button onClick={goBack} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low active:scale-95 transition-all cursor-pointer">
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <h1 className="font-headline font-bold text-lg">Ajukan Sewa</h1>
            </div>

            {/* Success Content */}
            <div className="px-5 py-6 md:p-0">
              {/* Success header */}
              <div className="text-center pt-8 pb-6">
                <div className="w-16 h-16 bg-tertiary-fixed rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-tertiary" />
                </div>
                <h1 className="text-headline-lg font-bold text-on-surface">Pengajuan Terkirim!</h1>
                <p className="text-body-sm text-on-surface-variant mt-2">Permintaan sewa berhasil dibuat</p>
              </div>

              {/* Order summary card */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant mb-6">
                <div className="flex items-center gap-3 pb-4 border-b border-outline-variant">
                  <div className="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center">
                    <Home className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">{property.name}</p>
                    <p className="text-label-sm text-on-surface-variant">{property.location?.city}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex justify-between text-body-md">
                    <span className="text-on-surface-variant">Kamar</span>
                    <span className="font-bold text-on-surface">
                      Kamar {createdOrder.room?.roomNumber || selectedRoom?.room_number || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between text-body-md">
                    <span className="text-on-surface-variant">Mulai Sewa</span>
                    <span className="font-bold text-on-surface">{fmtDate(createdOrder.startDate || startDate)}</span>
                  </div>
                  <div className="flex justify-between text-body-md">
                    <span className="text-on-surface-variant">Durasi</span>
                    <span className="font-bold text-on-surface">{createdOrder.durationMonths || durationMonths} bulan</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-outline-variant">
                    <span className="font-bold text-on-surface">Total</span>
                    <span className="text-headline-sm font-extrabold text-primary">
                      {formatIDR(createdOrder.totalAmount || total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment instructions */}
              {paymentMethod === 'transfer' ? (
                <div className="bg-tertiary-fixed/20 border border-tertiary-fixed rounded-2xl p-5 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-tertiary" />
                    <span className="text-label-sm font-bold text-tertiary uppercase">Menunggu Pembayaran</span>
                  </div>
                  {createdOrder.owner?.bankAccountNumber ? (
                    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 space-y-3">
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase">Transfer ke rekening pemilik</p>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-body-md font-bold text-on-surface">{createdOrder.owner.bankName || 'Bank'}</p>
                          <p className="text-headline-sm font-extrabold text-on-surface tabular-nums">{createdOrder.owner.bankAccountNumber}</p>
                          <p className="text-label-sm text-on-surface-variant">a.n. {createdOrder.owner.bankAccountHolder || createdOrder.owner.name}</p>
                        </div>
                        <button
                          onClick={() => copyAccount(createdOrder.owner!.bankAccountNumber!)}
                          className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant text-label-sm font-bold transition-colors cursor-pointer"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                          {copied ? 'Tersalin' : 'Salin'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-body-sm text-on-surface-variant">
                      Detail rekening pemilik akan tersedia di <b>Riwayat Sewa</b>.
                    </p>
                  )}
                  <p className="text-body-sm text-on-surface-variant mt-3">
                    Setelah transfer, <b>upload bukti pembayaran</b> di Riwayat Sewa agar pemilik dapat mengonfirmasi.
                  </p>
                </div>
              ) : (
                <div className="bg-primary-fixed/20 border border-primary-fixed rounded-2xl p-5 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-label-sm font-bold text-primary uppercase">Menunggu Konfirmasi Pemilik</span>
                  </div>
                  <p className="text-body-sm text-on-surface">
                    Anda memilih <b>COD / Tunai</b>. Bayar <b>{formatIDR(createdOrder.totalAmount || total)}</b> langsung saat check-in. Pemilik akan mengonfirmasi pengajuan Anda.
                  </p>
                </div>
              )}

              {/* CTAs */}
              <div className="space-y-3 pb-8">
                <button
                  onClick={goToRiwayat}
                  className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold text-body-md py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 cursor-pointer"
                >
                  Lihat & Pantau di Riwayat Sewa
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button onClick={goBack} className="w-full bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-body-md py-4 rounded-xl transition-colors cursor-pointer">
                  Kembali ke Detail Kost
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form state
  return (
    <div className="min-h-screen bg-surface">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-surface-container-high px-4 h-16 flex items-center justify-between md:hidden">
        <button onClick={goBack} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low active:scale-95 transition-all cursor-pointer">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-headline font-bold text-lg text-on-surface">Ajukan Sewa</h1>
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low active:scale-95 transition-all cursor-pointer">
          <span className="material-symbols-outlined">help_outline</span>
        </button>
      </header>

      {/* Progress Indicator */}
      <div className="hidden md:block bg-surface-container-lowest border-b border-outline-variant">
        <div className="max-w-6xl mx-auto px-10 py-6">
          <div className="flex items-center justify-center max-w-3xl mx-auto">
            {/* Step 1 */}
            <div className="flex items-center text-primary">
              <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold shadow-md">
                <span className="material-symbols-outlined text-lg">check</span>
              </div>
              <span className="ml-3 font-headline font-bold text-lg">Booking Details</span>
            </div>
            <div className="h-0.5 flex-grow bg-primary mx-4" />
            {/* Step 2 */}
            <div className="flex items-center text-primary">
              <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold shadow-md">
                2
              </div>
              <span className="ml-3 font-headline font-bold text-lg">Payment</span>
            </div>
            <div className="h-0.5 flex-grow bg-outline-variant mx-4" />
            {/* Step 3 */}
            <div className="flex items-center text-outline-variant">
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold">
                3
              </div>
              <span className="ml-3 font-headline font-semibold text-lg">Confirmation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-lg mx-auto md:max-w-6xl md:grid md:grid-cols-12 md:gap-10 md:items-start md:px-10 md:py-10">
        {/* Left Column - Form */}
        <div className="md:col-span-8">
          {/* Mobile Content */}
          <div className="px-5 py-6 md:p-0">
            {/* Progress Mobile */}
            <div className="mb-8 md:hidden">
              <div className="flex justify-between items-end mb-3">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Step 1 of 2</p>
                  <h2 className="font-headline font-bold text-lg text-on-surface">Detail Pengajuan</h2>
                </div>
                <span className="text-xs font-medium text-primary bg-primary-fixed px-3 py-1 rounded-full">50% Complete</span>
              </div>
              <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
                <div className="bg-primary h-full rounded-full w-1/2 transition-all duration-500 ease-out" />
              </div>
            </div>

            {/* Property Summary Card */}
            <div className="bg-surface-container-lowest rounded-2xl p-3 border border-outline-variant shadow-sm flex gap-4 mb-8">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                {property.media?.[0] ? (
                  <img src={property.media[0].url_medium} alt={property.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-surface-variant flex items-center justify-center">
                    <Home className="w-8 h-8 text-on-surface-variant" />
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center py-1">
                <div className="flex items-center gap-1.5 mb-1">
                  {property.is_verified && (
                    <span className="bg-tertiary-fixed text-on-tertiary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tight">Verified</span>
                  )}
                </div>
                <h3 className="font-headline font-bold text-on-surface leading-tight">{property.name}</h3>
                <div className="flex items-center text-on-surface-variant text-xs mt-1">
                  <span className="material-symbols-outlined text-sm mr-1">location_on</span>
                  {property.location.address}, {property.location.city}
                </div>
              </div>
            </div>

            <form className="space-y-10">
              {/* Room Selection */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-headline font-bold text-lg text-on-surface">Pilih Kamar</h3>
                  <span className="text-label-sm text-primary font-semibold">{availableRooms.length} Tersedia</span>
                </div>
                <div className="space-y-3">
                  {availableRooms.length === 0 ? (
                    <div className="bg-surface-container-lowest rounded-2xl p-6 text-center border border-outline-variant">
                      <p className="text-body-md font-bold text-on-surface">Tidak ada kamar tersedia</p>
                      <p className="text-body-sm text-on-surface-variant mt-1">Semua kamar di kost ini sedang terisi.</p>
                    </div>
                  ) : (
                    availableRooms.map((room: Room) => (
                      <label
                        key={room.id}
                        className="relative flex flex-col cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="room"
                          value={room.id}
                          checked={roomId === room.id}
                          onChange={() => setRoomId(room.id)}
                          className="peer sr-only"
                        />
                        <div className={`p-4 rounded-2xl bg-surface-container-lowest border-2 transition-all duration-200 ${
                          roomId === room.id
                            ? 'border-primary shadow-[0_0_0_3px_rgba(0,53,148,0.1)]'
                            : 'border-transparent hover:border-outline-variant'
                        }`}>
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className={`font-bold text-lg ${roomId === room.id ? 'text-primary' : 'text-on-surface'}`}>
                                Kamar {room.room_number}
                              </h4>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {room.facilities.slice(0, 4).map((facility, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-[10px] font-semibold text-on-surface-variant"
                                  >
                                    <span className="material-symbols-outlined text-[12px]">{getFacilityIcon(facility)}</span>
                                    {facility}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                              roomId === room.id
                                ? 'bg-primary border-primary'
                                : 'border-outline-variant bg-white'
                            }`}>
                              <Check className={`w-4 h-4 text-white transition-all ${roomId === room.id ? 'opacity-100' : 'opacity-0'}`} />
                            </div>
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className={`text-xl font-extrabold ${roomId === room.id ? 'text-primary' : 'text-on-surface'}`}>
                              {formatIDR(room.price_monthly)}
                            </span>
                            <span className="text-xs text-on-surface-variant">/ bulan</span>
                          </div>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </section>

              {/* Schedule */}
              <section>
                <h3 className="font-headline font-bold text-lg text-on-surface mb-4">Jadwal Sewa</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="relative flex flex-col">
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5 ml-1">Tanggal Mulai</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors pointer-events-none">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full h-14 pl-12 pr-4 bg-surface-container-lowest border border-outline-variant rounded-xl text-on-surface font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="relative flex flex-col">
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5 ml-1">Durasi Sewa</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors pointer-events-none">
                        <Clock className="w-5 h-5" />
                      </div>
                      <select
                        value={durationMonths}
                        onChange={(e) => setDurationMonths(Number(e.target.value))}
                        className="w-full h-14 pl-12 pr-10 bg-surface-container-lowest border border-outline-variant rounded-xl text-on-surface font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none cursor-pointer"
                      >
                        <option value={1}>1 Bulan</option>
                        <option value={3}>3 Bulan</option>
                        <option value={6}>6 Bulan</option>
                        <option value={12}>12 Bulan (1 Tahun)</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                        <span className="material-symbols-outlined">expand_more</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section>
                <h3 className="font-headline font-bold text-lg text-on-surface mb-4">Metode Pembayaran</h3>
                <div className="space-y-3">
                  {/* Transfer Bank */}
                  <label className={`relative flex items-center p-4 cursor-pointer rounded-xl border-2 transition-all ${
                    paymentMethod === 'transfer'
                      ? 'bg-primary-fixed/10 border-primary'
                      : 'bg-surface-container-lowest border-transparent hover:border-outline-variant'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="transfer"
                      checked={paymentMethod === 'transfer'}
                      onChange={() => setPaymentMethod('transfer')}
                      className="peer sr-only"
                    />
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 transition-colors ${
                      paymentMethod === 'transfer'
                        ? 'bg-primary text-white'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}>
                      <Banknote className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <span className="block text-body-md font-bold text-on-surface">Transfer Bank</span>
                      <span className="block text-label-sm text-on-surface-variant">BCA, Mandiri, BNI, BRI</span>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                      paymentMethod === 'transfer'
                        ? 'border-primary bg-primary'
                        : 'border-outline-variant bg-white'
                    }`}>
                      <div className={`w-2.5 h-2.5 rounded-full bg-white transition-all ${paymentMethod === 'transfer' ? 'opacity-100' : 'opacity-0'}`} />
                    </div>
                  </label>

                  {/* COD */}
                  <label className={`relative flex items-center p-4 cursor-pointer rounded-xl border-2 transition-all ${
                    paymentMethod === 'cod'
                      ? 'bg-primary-fixed/10 border-primary'
                      : 'bg-surface-container-lowest border-transparent hover:border-outline-variant'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="peer sr-only"
                    />
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 transition-colors ${
                      paymentMethod === 'cod'
                        ? 'bg-primary text-white'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}>
                      <HandCoins className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <span className="block text-body-md font-bold text-on-surface">Tunai / Bayar di Tempat</span>
                      <span className="block text-label-sm text-on-surface-variant"> Melalui pengelola properti</span>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                      paymentMethod === 'cod'
                        ? 'border-primary bg-primary'
                        : 'border-outline-variant bg-white'
                    }`}>
                      <div className={`w-2.5 h-2.5 rounded-full bg-white transition-all ${paymentMethod === 'cod' ? 'opacity-100' : 'opacity-0'}`} />
                    </div>
                  </label>
                </div>
              </section>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-4 bg-error-container rounded-xl border border-error">
                  <AlertCircle className="w-5 h-5 text-error shrink-0" />
                  <p className="text-body-sm font-medium text-error">{error}</p>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Right Column - Order Summary (Desktop Only) */}
        <aside className="hidden md:block md:col-span-4 sticky top-28">
          <div className="bg-surface-container-lowest rounded-2xl shadow-lg border border-outline-variant p-8 space-y-6">
            <h2 className="font-headline font-bold text-xl text-on-surface border-b border-outline-variant pb-4">Ringkasan Pesanan</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-body-md">
                <span className="text-on-surface-variant">Harga Sewa ({durationMonths} Bulan)</span>
                <span className="text-on-surface font-semibold">
                  {selectedRoom ? formatIDR(selectedRoom.price_monthly * durationMonths) : '-'}
                </span>
              </div>
              <div className="flex justify-between items-center text-body-md">
                <span className="text-on-surface-variant">Biaya Layanan</span>
                <span className="text-on-surface font-semibold">{formatIDR(serviceFee)}</span>
              </div>
              <div className="flex justify-between items-center text-body-md">
                <span className="text-on-surface-variant">Pajak (PPN 11%)</span>
                <span className="text-on-surface font-semibold">{formatIDR(tax)}</span>
              </div>

              {/* Voucher Input */}
              <div className="pt-2">
                <div className="relative">
                  <input
                    className="w-full pl-4 pr-20 py-3 bg-surface-container rounded-xl border-none focus:ring-2 focus:ring-primary text-body-sm"
                    placeholder="Punya kode promo?"
                    type="text"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 text-primary font-bold text-label-sm px-4 py-1 hover:bg-primary-fixed rounded-lg transition-colors cursor-pointer">
                    Pakai
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-dashed border-outline-variant pt-6">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-body-sm text-on-surface-variant font-medium">Total Pembayaran</p>
                  <h3 className="text-headline-lg font-extrabold text-primary">{formatIDR(total)}</h3>
                </div>
              </div>
              <button
                onClick={handleSubmit}
                disabled={isCreating || !roomId || !startDate || availableRooms.length === 0}
                className="w-full bg-primary hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed text-on-primary font-bold text-body-md py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 cursor-pointer"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    Lanjutkan ke Pembayaran
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              <p className="text-center text-label-sm text-on-surface-variant mt-4 leading-relaxed">
                Dengan menekan tombol di atas, Anda menyetujui <br />
                <a className="text-primary font-bold underline" href="#">Syarat & Ketentuan</a> serta <a className="text-primary font-bold underline" href="#">Kebijakan Privasi</a> KostFind.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
                <ShieldCheck className="w-4 h-4 text-tertiary" />
                Safe Payment
              </div>
              <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
                <Headset className="w-4 h-4 text-tertiary" />
                24/7 Support
              </div>
            </div>
          </div>

          {/* Assistance Card */}
          <div className="mt-6 p-4 bg-secondary-fixed/10 rounded-xl border border-secondary-fixed/20 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-label-sm font-bold text-on-surface">Butuh bantuan memesan?</p>
              <p className="text-[10px] text-on-surface-variant">Hubungi tim concierge kami yang ramah.</p>
            </div>
          </div>
        </aside>
      </div>

      {/* Fixed Bottom Bar (Mobile Only) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-surface-container-high shadow-[0_-10px_25px_rgba(0,53,148,0.08)] p-5 pb-8 md:hidden">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant leading-none mb-1">Total Sewa</span>
            <span className="text-xl font-headline font-extrabold text-primary tracking-tight">{formatIDR(total)}</span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isCreating || !roomId || !startDate || availableRooms.length === 0}
            className="flex-1 h-14 bg-primary hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-primary/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                Lanjutkan
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Spacer for Mobile */}
      <div className="h-28 md:hidden" />
    </div>
  );
};

function getFacilityIcon(facility: string): string {
  const icons: Record<string, string> = {
    'WiFi': 'wifi',
    'AC': 'ac_unit',
    'Parking': 'local_parking',
    'Bathroom': 'bathtub',
    'Security': 'security',
    'Laundry': 'local_laundry_service',
    'Kitchen': 'kitchen',
    'TV': 'tv',
    'Pool': 'pool',
    'Fan': 'mode_fan',
    'Bed': 'bed',
    'Wardrobe': ' wardrobe',
    'Table': 'desk',
    'Chair': 'chair',
    'Water': 'water_drop',
    'Electricity': 'bolt',
    'Internet': 'wifi',
  };
  return icons[facility] || 'check_circle';
}
