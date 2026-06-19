import React, { useState, useMemo } from 'react';
import { X, CalendarDays, CheckCircle, Loader2, AlertCircle, Banknote, HandCoins } from 'lucide-react';
import type { Room, PaymentMethod } from '../types';
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
  const availableRooms = useMemo(() => rooms.filter((r) => r.status === 'available'), [rooms]);
  const { createOrder, isCreating } = useOrderActions();

  const [roomId, setRoomId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [durationMonths, setDurationMonths] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transfer');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  if (!isOpen) return null;

  const selectedRoom = availableRooms.find((r) => r.id === roomId);
  const total = selectedRoom ? selectedRoom.price_monthly * durationMonths : 0;

  const handleSubmit = async () => {
    setError('');
    if (!roomId) return setError('Pilih kamar terlebih dahulu.');
    if (!startDate) return setError('Pilih tanggal mulai sewa.');
    try {
      await createOrder({ roomId, startDate, durationMonths, paymentMethod });
      setDone(true);
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
    setDone(false);
    onClose();
  };

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
          {done ? (
            <div className="py-8 text-center animate-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">Pengajuan Terkirim!</h3>
              <p className="text-sm text-slate-500 font-medium mb-8">
                Permintaan sewa Anda dikirim ke pemilik. Pantau statusnya di <b>Dasbor → Riwayat Sewa</b>.
              </p>
              <button onClick={reset} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm py-3 rounded-xl transition-all">
                Selesai
              </button>
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
