import React, { useState, useRef, useEffect } from 'react';
import { User, Mail, Shield, LogOut, Settings, Save, Loader2, CheckCircle, AlertCircle, Camera, Phone, BadgeCheck, ShieldAlert, Building2, CreditCard, UserCircle } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { authService } from '../../services/api/auth.service';
import { uploadService } from '../../services/api/upload.service';

interface OwnerSettingsProps {
  user: { name?: string; email?: string; role?: string; avatar_url?: string } | null;
  onLogout: () => void;
}

export const OwnerSettings: React.FC<OwnerSettingsProps> = ({ user, onLogout }) => {
  const { token, user: storeUser, setAuth } = useAuthStore();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [isVerified, setIsVerified] = useState(false);
  const [origin, setOrigin] = useState({ name: user?.name || '', phone: '', avatar: user?.avatar_url || '' });

  // Bank account state
  const [bankName, setBankName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankAccountHolder, setBankAccountHolder] = useState('');
  const [originBank, setOriginBank] = useState({ bankName: '', bankAccountNumber: '', bankAccountHolder: '' });

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pull the freshest profile (phone + bank + verification status aren't in the persisted store).
  useEffect(() => {
    let cancelled = false;
    authService
      .getMe()
      .then((me) => {
        if (cancelled || !me) return;
        setName(me.name ?? '');
        setPhone(me.phone ?? '');
        setAvatarUrl(me.avatar_url ?? '');
        setIsVerified(Boolean(me.isVerified ?? me.is_verified));
        setOrigin({ name: me.name ?? '', phone: me.phone ?? '', avatar: me.avatar_url ?? '' });
        // Load bank fields
        setBankName(me.bankName ?? '');
        setBankAccountNumber(me.bankAccountNumber ?? '');
        setBankAccountHolder(me.bankAccountHolder ?? '');
        setOriginBank({ bankName: me.bankName ?? '', bankAccountNumber: me.bankAccountNumber ?? '', bankAccountHolder: me.bankAccountHolder ?? '' });
      })
      .catch(() => {
        /* fall back to whatever the store already gave us */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const dirty =
    name.trim() !== origin.name || phone.trim() !== origin.phone || avatarUrl.trim() !== origin.avatar;
  const dirtyBank =
    bankName.trim() !== originBank.bankName ||
    bankAccountNumber.trim() !== originBank.bankAccountNumber ||
    bankAccountHolder.trim() !== originBank.bankAccountHolder;

  const handlePickFile = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setIsUploading(true);
    try {
      const res = await uploadService.uploadImage(file);
      setAvatarUrl(res.url);
    } catch {
      setError('Gagal mengunggah foto. Coba lagi.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Nama tidak boleh kosong.');
      return;
    }
    setError('');
    setIsSaving(true);
    try {
      const updated = await authService.updateMe({
        name: name.trim(),
        phone: phone.trim(),
        avatar_url: avatarUrl.trim(),
        bankName: bankName.trim(),
        bankAccountNumber: bankAccountNumber.trim(),
        bankAccountHolder: bankAccountHolder.trim(),
      });
      if (token && storeUser) {
        setAuth(token, {
          ...storeUser,
          name: updated.name,
          phone: updated.phone,
          avatar_url: updated.avatar_url,
        });
      }
      setOrigin({ name: name.trim(), phone: phone.trim(), avatar: avatarUrl.trim() });
      setOriginBank({ bankName: bankName.trim(), bankAccountNumber: bankAccountNumber.trim(), bankAccountHolder: bankAccountHolder.trim() });
      setSavedOk(true);
      setTimeout(() => setSavedOk(false), 3000);
    } catch {
      setError('Gagal menyimpan profil. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Pengaturan Akun</h2>
      </div>

      <div className="bg-white rounded-[24px] border border-slate-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col md:flex-row">
        {/* Profile edit */}
        <div className="md:w-2/3 border-b md:border-b-0 md:border-r border-slate-100/50 flex flex-col">
          {/* Header with soft glow accent (no flat green block) */}
          <div className="relative px-8 pt-8 pb-6 overflow-hidden">
            <div className="pointer-events-none absolute -top-20 -left-10 w-56 h-56 bg-emerald-400/10 blur-3xl rounded-full" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <button
                type="button"
                onClick={handlePickFile}
                className="group relative w-20 h-20 rounded-[20px] bg-slate-50 flex items-center justify-center border border-slate-100 overflow-hidden shrink-0 cursor-pointer"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-slate-400" />
                )}
                <span className="absolute inset-0 bg-slate-900/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  {isUploading ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5 text-white" />
                  )}
                </span>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

              <div>
                <h3 className="text-[18px] font-semibold text-slate-800 mb-1.5">{name || 'Pemilik Kost'}</h3>
                {isVerified ? (
                  <p className="text-[12px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md inline-flex items-center gap-1.5">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    Mitra Terverifikasi
                  </p>
                ) : (
                  <p className="text-[12px] font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md inline-flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Belum Terverifikasi
                  </p>
                )}
                <p className="text-[11px] text-slate-400 mt-1.5">Klik foto untuk mengganti.</p>
              </div>
            </div>
          </div>

          <div className="px-8 pb-8 space-y-5 flex-1">
            {/* Editable: name */}
            <div>
              <label className="text-[12px] font-medium text-slate-400 mb-2 block">Nama Lengkap</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda"
                className="w-full bg-slate-50 px-3.5 py-3 rounded-xl border border-slate-100/50 text-[13px] font-medium text-slate-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>

            {/* Editable: phone */}
            <div>
              <label className="text-[12px] font-medium text-slate-400 mb-2 block">Nomor Telepon</label>
              <div className="flex items-center gap-3 bg-slate-50 px-3.5 rounded-xl border border-slate-100/50 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="w-full bg-transparent py-3 text-[13px] font-medium text-slate-700 outline-none"
                />
              </div>
            </div>

            {/* Read-only: email & role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-[12px] font-medium text-slate-400 mb-2">Email Terdaftar</p>
                <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100/50">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-[13px] font-medium text-slate-700 truncate">{user?.email || 'email@example.com'}</span>
                </div>
              </div>

              <div>
                <p className="text-[12px] font-medium text-slate-400 mb-2">Hak Akses Sistem</p>
                <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100/50">
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span className="text-[13px] font-medium text-slate-700 capitalize">{user?.role || 'owner'}</span>
                </div>
              </div>
            </div>

            {error && (
              <p className="flex items-center gap-1.5 text-[12px] font-medium text-rose-600">
                <AlertCircle className="w-4 h-4" /> {error}
              </p>
            )}

            {/* Rekening bank */}
            <div className="border-t border-slate-100 pt-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-[13px] font-semibold text-slate-800">Rekening Bank</h4>
                  <p className="text-[11px] text-slate-400">Untuk menerima pembayaran sewa via transfer</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[12px] font-medium text-slate-400 mb-2 block">Nama Bank</label>
                  <div className="flex items-center gap-2 bg-slate-50 px-3.5 rounded-xl border border-slate-100/50 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="BCA, Mandiri, BRI..."
                      className="w-full bg-transparent py-3 text-[13px] font-medium text-slate-700 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[12px] font-medium text-slate-400 mb-2 block">No. Rekening</label>
                  <div className="flex items-center gap-2 bg-slate-50 px-3.5 rounded-xl border border-slate-100/50 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
                    <CreditCard className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={bankAccountNumber}
                      onChange={(e) => setBankAccountNumber(e.target.value)}
                      placeholder="1234567890"
                      className="w-full bg-transparent py-3 text-[13px] font-medium text-slate-700 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[12px] font-medium text-slate-400 mb-2 block">Atas Nama</label>
                  <div className="flex items-center gap-2 bg-slate-50 px-3.5 rounded-xl border border-slate-100/50 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
                    <UserCircle className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={bankAccountHolder}
                      onChange={(e) => setBankAccountHolder(e.target.value)}
                      placeholder="Nama di rekening"
                      className="w-full bg-transparent py-3 text-[13px] font-medium text-slate-700 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleSave}
                disabled={isSaving || isUploading || !(dirty || dirtyBank)}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-[13px] px-5 py-2.5 rounded-xl transition-colors shadow-sm"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Simpan Profil
              </button>
              {savedOk && (
                <span className="flex items-center gap-1.5 text-[12px] font-medium text-emerald-600 animate-in fade-in">
                  <CheckCircle className="w-4 h-4" /> Profil tersimpan!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Session management */}
        <div className="p-8 md:w-1/3 bg-slate-50/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-slate-500" />
              <h4 className="text-[14px] font-semibold text-slate-800">Manajemen Sesi</h4>
            </div>
            <p className="text-[13px] text-slate-500 leading-relaxed mb-6">
              Keluar dari akun Anda di perangkat ini. Anda perlu masuk kembali menggunakan email dan kata sandi untuk mengakses dasbor.
            </p>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 bg-white border border-rose-100 text-rose-600 hover:bg-rose-50 hover:border-rose-200 font-medium text-[13px] px-4 py-3 rounded-xl transition-colors cursor-pointer shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar (Log Out)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
