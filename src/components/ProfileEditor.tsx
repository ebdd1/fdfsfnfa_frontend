import React, { useState, useRef } from 'react';
import { Camera, Image, Save, Loader2, X } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/api/auth.service';
import { uploadService } from '../services/api/upload.service';

interface ProfileEditorProps {
  onClose: () => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ onClose }) => {
  const { user, setUser } = useAuthStore();

  const [name, setName] = useState(user?.name || '');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || '');
  const [bannerPreview, setBannerPreview] = useState(user?.banner_url || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!name.trim()) return setError('Nama tidak boleh kosong.');
    setError('');
    setSaving(true);

    try {
      let avatar_url = user?.avatar_url;
      let banner_url = user?.banner_url;

      if (avatarInputRef.current?.files?.[0]) {
        const result = await uploadService.uploadImage(avatarInputRef.current.files[0]);
        avatar_url = result.url;
      }

      if (bannerInputRef.current?.files?.[0]) {
        const result = await uploadService.uploadImage(bannerInputRef.current.files[0]);
        banner_url = result.url;
      }

      const updated = await authService.updateMe({
        name: name.trim(),
        avatar_url,
        banner_url,
      });

      setUser({ ...user!, ...updated });
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Gagal menyimpan. Coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div>
            <h2 className="text-base font-black text-slate-800">Edit Profil</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Ubah foto profil, banner, dan nama Anda.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="p-6 space-y-5">

            {/* Banner Strip */}
            <div className="relative rounded-2xl overflow-hidden h-36 bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm">
              {bannerPreview ? (
                <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-emerald-500 to-teal-500" />
              )}

              {/* Avatar overlap */}
              <div className="absolute -bottom-8 left-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl border-4 border-white bg-emerald-100 overflow-hidden shadow-lg">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-emerald-600 font-black text-xl">
                        {(name || user?.name || '?')[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-6 h-6 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center border-2 border-white shadow cursor-pointer"
                  >
                    <Camera className="w-3 h-3 text-white" />
                  </button>
                </div>
              </div>

              {/* Banner upload button */}
              <button
                onClick={() => bannerInputRef.current?.click()}
                className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/90 hover:bg-white text-slate-700 text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-sm transition-all cursor-pointer backdrop-blur-sm"
              >
                <Image className="w-3 h-3" />
                Ganti Banner
              </button>
            </div>

            {/* Hidden file inputs */}
            <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />

            {/* Form fields */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Nama Lengkap</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 transition-all"
                placeholder="Nama lengkap"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-200 transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                Unggah Foto
              </button>
              <button
                onClick={() => bannerInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-200 transition-all cursor-pointer"
              >
                <Image className="w-4 h-4" />
                Unggah Banner
              </button>
            </div>

            {error && (
              <p className="text-xs font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-4 py-2.5">
                {error}
              </p>
            )}

            <button
              onClick={handleSave}
              disabled={saving || !name.trim()}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-sm py-3 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
