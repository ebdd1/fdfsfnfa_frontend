import React, { useState, useRef, useEffect } from 'react';
import { User, Mail, Shield, LogOut, Settings, Save, Loader2, CheckCircle, AlertCircle, Camera, Phone, UserCircle, Lock } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { authService } from '../../services/api/auth.service';
import { uploadService } from '../../services/api/upload.service';

interface SeekerSettingsProps {
  user: { name?: string; email?: string; role?: string; avatar_url?: string } | null;
  onLogout: () => void;
}

export const SeekerSettings: React.FC<SeekerSettingsProps> = ({ user, onLogout }) => {
  const { user: storeUser, setUser } = useAuthStore();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [origin, setOrigin] = useState({ name: user?.name || '', phone: '', avatar: user?.avatar_url || '' });

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pull the freshest profile (phone isn't in the persisted store).
  useEffect(() => {
    let cancelled = false;
    authService
      .getMe()
      .then((me) => {
        if (cancelled || !me) return;
        setName(me.name ?? '');
        setPhone(me.phone ?? '');
        setAvatarUrl(me.avatar_url ?? '');
        setOrigin({ name: me.name ?? '', phone: me.phone ?? '', avatar: me.avatar_url ?? '' });
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
      });
      if (storeUser) {
        setUser({
          ...storeUser,
          name: updated.name,
          phone: updated.phone,
          avatar_url: updated.avatar_url,
        });
      }
      setOrigin({ name: name.trim(), phone: phone.trim(), avatar: avatarUrl.trim() });
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
          {/* Header with soft glow accent */}
          <div className="relative px-8 pt-8 pb-6 overflow-hidden">
            <div className="pointer-events-none absolute -top-20 -left-10 w-56 h-56 bg-secondary/10 blur-3xl rounded-full" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <button
                type="button"
                onClick={handlePickFile}
                aria-label="Ubah foto profil"
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
                <h3 className="text-[18px] font-semibold text-slate-800 mb-1.5">{name || 'Pencari Kost'}</h3>
                <p className="text-xs font-medium text-secondary bg-secondary/10 px-2.5 py-1 rounded-md inline-flex items-center gap-1.5">
                  <UserCircle className="w-3.5 h-3.5" />
                  Pencari Kost
                </p>
                <p className="text-xs text-slate-500 mt-1.5">Klik foto untuk mengganti.</p>
              </div>
            </div>
          </div>

          <div className="px-8 pb-8 space-y-5 flex-1">
            {/* Editable: name */}
            <div>
              <label htmlFor="seeker-name" className="text-sm font-medium text-slate-600 mb-2 block">Nama Lengkap</label>
              <input
                id="seeker-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda"
                className="w-full bg-slate-50 px-3.5 py-3 rounded-xl border border-slate-100/50 text-base font-medium text-slate-700 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
              />
            </div>

            {/* Editable: phone */}
            <div>
              <label htmlFor="seeker-phone" className="text-sm font-medium text-slate-600 mb-2 block">Nomor Telepon</label>
              <div className="flex items-center gap-3 bg-slate-50 px-3.5 rounded-xl border border-slate-100/50 focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary transition-all">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  id="seeker-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="w-full bg-transparent py-3 text-base font-medium text-slate-700 outline-none"
                />
              </div>
            </div>

            {/* Read-only: email & role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Email Terdaftar</p>
                <div className="flex items-center gap-3 bg-slate-100/70 p-3.5 rounded-xl border border-slate-200/60">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700 truncate">{user?.email || 'email@example.com'}</span>
                  <Lock className="w-3.5 h-3.5 text-slate-400 ml-auto shrink-0" aria-label="Terkunci" />
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Hak Akses Sistem</p>
                <div className="flex items-center gap-3 bg-slate-100/70 p-3.5 rounded-xl border border-slate-200/60">
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700 capitalize">{user?.role || 'seeker'}</span>
                  <Lock className="w-3.5 h-3.5 text-slate-400 ml-auto shrink-0" aria-label="Terkunci" />
                </div>
              </div>
            </div>

            <div aria-live="polite">
              {error && (
                <p className="flex items-center gap-1.5 text-sm font-medium text-rose-600">
                  <AlertCircle className="w-4 h-4" /> {error}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleSave}
                disabled={isSaving || isUploading || !dirty}
                className="flex items-center gap-2 bg-secondary hover:bg-[#005538] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Simpan Profil
              </button>
              <span aria-live="polite">
                {savedOk && (
                  <span className="flex items-center gap-1.5 text-sm font-medium text-secondary animate-in fade-in">
                    <CheckCircle className="w-4 h-4" /> Profil tersimpan!
                  </span>
                )}
              </span>
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
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Keluar dari akun Anda di perangkat ini. Anda perlu masuk kembali menggunakan email dan kata sandi untuk mengakses dasbor.
            </p>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 bg-white border border-rose-100 text-rose-600 hover:bg-rose-50 hover:border-rose-200 font-medium text-sm px-4 py-3 rounded-xl transition-colors cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar (Log Out)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
