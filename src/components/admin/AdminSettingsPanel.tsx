import React, { useState, useEffect } from 'react';
import {
  Globe,
  Phone,
  MapPin,
  Palette,
  Save,
  Plus,
  X,
  Loader2,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  Mail,
  Sparkles,
  Eye,
  FileText,
  ServerCog,
  Lock,
  Upload,
  AlertTriangle,
} from 'lucide-react';
import { useAdminSettings } from '../../hooks/useSettings';
import { uploadService } from '../../services/api/upload.service';
import { DEFAULT_SETTINGS, type SiteSettings } from '../../services/api/settings.service';

type SubTab = 'identity' | 'contact' | 'location' | 'appearance' | 'content' | 'system';

const COLOR_OPTIONS = [
  { key: 'emerald', label: 'Emerald', dot: 'bg-emerald-500' },
  { key: 'blue', label: 'Biru', dot: 'bg-blue-500' },
  { key: 'indigo', label: 'Indigo', dot: 'bg-indigo-500' },
  { key: 'rose', label: 'Rose', dot: 'bg-rose-500' },
  { key: 'amber', label: 'Amber', dot: 'bg-amber-500' },
];

const PREVIEW_ACCENT: Record<string, string> = {
  emerald: 'text-emerald-500',
  blue: 'text-blue-500',
  indigo: 'text-indigo-500',
  rose: 'text-rose-500',
  amber: 'text-amber-500',
};

export const AdminSettingsPanel: React.FC = () => {
  const { data, isLoading, updateSettings, isSaving } = useAdminSettings();
  const [form, setForm] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [subTab, setSubTab] = useState<SubTab>('identity');
  const [newCity, setNewCity] = useState('');
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleLogoUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploadingLogo(true);
    try {
      const { url } = await uploadService.uploadImage(file);
      set('logo_url', url);
    } catch {
      alert('Gagal mengunggah logo. Coba lagi.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async () => {
    await updateSettings(form);
    setSavedAt(Date.now());
    setTimeout(() => setSavedAt(null), 3000);
  };

  const addCity = () => {
    const c = newCity.trim();
    if (c && !form.cities.includes(c)) {
      set('cities', [...form.cities, c]);
      setNewCity('');
    }
  };
  const removeCity = (city: string) => set('cities', form.cities.filter((c) => c !== city));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-300">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const subTabs: { key: SubTab; label: string; icon: React.ReactNode }[] = [
    { key: 'identity', label: 'Identitas Web', icon: <Globe className="h-4 w-4" /> },
    { key: 'contact', label: 'Kontak & Sosial', icon: <Phone className="h-4 w-4" /> },
    { key: 'content', label: 'Konten & Hukum', icon: <FileText className="h-4 w-4" /> },
    { key: 'location', label: 'Lokasi & Kota', icon: <MapPin className="h-4 w-4" /> },
    { key: 'appearance', label: 'Tampilan & Fitur', icon: <Palette className="h-4 w-4" /> },
    { key: 'system', label: 'Sistem', icon: <ServerCog className="h-4 w-4" /> },
  ];

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10';
  const labelClass = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700';

  // Render brand name two-tone for the live preview
  const splitIdx = form.site_name.slice(1).search(/[A-Z]/);
  const brandHead = splitIdx === -1 ? form.site_name : form.site_name.slice(0, splitIdx + 1);
  const brandTail = splitIdx === -1 ? '' : form.site_name.slice(splitIdx + 1);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-800">Pengaturan Web</h1>
        <p className="mt-1 text-xs font-medium text-slate-400">Atur identitas dan konfigurasi global. Perubahan langsung berlaku di seluruh halaman.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ===== LEFT: form ===== */}
        <div className="space-y-5 lg:col-span-2">
          {/* Sub-tabs */}
          <div className="flex flex-wrap gap-2">
            {subTabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setSubTab(t.key)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 ${
                  subTab === t.key ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/15' : 'border border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-7">
            {subTab === 'identity' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div>
                  <label className={labelClass}>Nama Website</label>
                  <input className={inputClass} value={form.site_name} onChange={(e) => set('site_name', e.target.value)} placeholder="KostFind" />
                  <p className="mt-1.5 text-[11px] text-slate-400">Tampil di navbar, footer, judul tab, dan seluruh dashboard.</p>
                </div>
                <div>
                  <label className={labelClass}>Tagline / Slogan</label>
                  <input className={inputClass} value={form.tagline} onChange={(e) => set('tagline', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Judul Hero (Landing)</label>
                  <textarea className={`${inputClass} resize-none`} rows={2} value={form.hero_title} onChange={(e) => set('hero_title', e.target.value)} />
                </div>

                {/* Logo upload */}
                <div className="border-t border-slate-100 pt-5">
                  <label className={labelClass}>Logo Website</label>
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                      {form.logo_url ? (
                        <img src={form.logo_url} alt="Logo" className="h-full w-full object-contain" />
                      ) : (
                        <Sparkles className="h-6 w-6 text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50">
                        {uploadingLogo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        {uploadingLogo ? 'Mengunggah...' : 'Unggah Logo'}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleLogoUpload(e.target.files?.[0])} disabled={uploadingLogo} />
                      </label>
                      {form.logo_url && (
                        <button onClick={() => set('logo_url', '')} className="ml-2 text-[11px] font-bold text-rose-500 hover:text-rose-600">
                          Hapus
                        </button>
                      )}
                      <p className="mt-1.5 text-[11px] text-slate-400">Kosongkan untuk pakai logo ikon default.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {subTab === 'contact' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div>
                  <label className={labelClass}>Email Support</label>
                  <input className={inputClass} type="email" value={form.support_email} onChange={(e) => set('support_email', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Nomor Telepon / WhatsApp</label>
                  <input className={inputClass} value={form.support_phone} onChange={(e) => set('support_phone', e.target.value)} placeholder="+62812345678" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Instagram (URL)</label>
                    <input className={inputClass} value={form.social_instagram} onChange={(e) => set('social_instagram', e.target.value)} placeholder="https://instagram.com/..." />
                  </div>
                  <div>
                    <label className={labelClass}>Twitter / X (URL)</label>
                    <input className={inputClass} value={form.social_twitter} onChange={(e) => set('social_twitter', e.target.value)} placeholder="https://x.com/..." />
                  </div>
                </div>
              </div>
            )}

            {subTab === 'location' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <label className={labelClass}>Daftar Kota</label>
                  <p className="mb-3 text-[11px] text-slate-400">Kota ini muncul di semua dropdown pencarian & filter di seluruh website.</p>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {form.cities.map((city) => (
                      <span key={city} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                        {city}
                        <button onClick={() => removeCity(city)} className="text-emerald-500 transition-colors hover:text-rose-500">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                    {form.cities.length === 0 && <span className="text-xs italic text-slate-400">Belum ada kota.</span>}
                  </div>
                  <div className="flex gap-2">
                    <input
                      className={inputClass}
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addCity();
                        }
                      }}
                      placeholder="Tambah kota baru..."
                    />
                    <button onClick={addCity} className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-xl bg-emerald-600 px-4 text-xs font-bold text-white transition-all hover:bg-emerald-750 hover:shadow-lg hover:shadow-emerald-600/10 active:scale-95 duration-150">
                      <Plus className="h-4 w-4" /> Tambah
                    </button>
                  </div>
                </div>
              </div>
            )}

            {subTab === 'content' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div>
                  <label className={labelClass}>Teks Footer</label>
                  <textarea className={`${inputClass} resize-none`} rows={2} value={form.footer_text} onChange={(e) => set('footer_text', e.target.value)} placeholder="Platform pencari kost terverifikasi..." />
                </div>
                <div>
                  <label className={labelClass}>Alamat Perusahaan</label>
                  <input className={inputClass} value={form.company_address} onChange={(e) => set('company_address', e.target.value)} placeholder="Jl. ... , Kota" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>URL Kebijakan Privasi</label>
                    <input className={inputClass} value={form.privacy_url} onChange={(e) => set('privacy_url', e.target.value)} placeholder="https://.../privacy" />
                  </div>
                  <div>
                    <label className={labelClass}>URL Syarat &amp; Ketentuan</label>
                    <input className={inputClass} value={form.terms_url} onChange={(e) => set('terms_url', e.target.value)} placeholder="https://.../terms" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Deskripsi SEO</label>
                  <textarea className={`${inputClass} resize-none`} rows={2} value={form.seo_description} onChange={(e) => set('seo_description', e.target.value)} />
                  <p className="mt-1.5 text-[11px] text-slate-400">Dipakai untuk meta description (hasil pencarian Google).</p>
                </div>
              </div>
            )}

            {subTab === 'system' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Maintenance */}
                <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
                  <FeatureToggle
                    label="Mode Pemeliharaan"
                    desc="Website ditutup untuk pengunjung non-admin. Anda tetap bisa masuk."
                    value={form.maintenance_mode}
                    onChange={(v) => set('maintenance_mode', v)}
                  />
                  {form.maintenance_mode && (
                    <div className="mt-3 flex items-start gap-2 text-[11px] font-semibold text-amber-700">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      Saat aktif, semua pengunjung diarahkan ke halaman pemeliharaan.
                    </div>
                  )}
                  <div className="mt-4">
                    <label className={labelClass}>Pesan Pemeliharaan</label>
                    <textarea className={`${inputClass} resize-none`} rows={2} value={form.maintenance_message} onChange={(e) => set('maintenance_message', e.target.value)} />
                  </div>
                </div>

                {/* Registration */}
                <FeatureToggle
                  label="Izinkan Registrasi Baru"
                  desc="Jika nonaktif, pendaftaran akun baru ditutup."
                  value={form.allow_registration}
                  onChange={(v) => set('allow_registration', v)}
                />

                {/* Upload limits */}
                <div className="grid grid-cols-1 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Maks Ukuran Upload (MB)</label>
                    <input
                      className={inputClass}
                      type="number"
                      min={1}
                      max={50}
                      value={form.max_upload_mb}
                      onChange={(e) => set('max_upload_mb', Math.max(1, Number(e.target.value) || 1))}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Maks Foto per Kost</label>
                    <input
                      className={inputClass}
                      type="number"
                      min={1}
                      max={20}
                      value={form.max_photos_per_listing}
                      onChange={(e) => set('max_photos_per_listing', Math.max(1, Number(e.target.value) || 1))}
                    />
                  </div>
                </div>

                {/* Auto-verify (private) */}
                <div className="border-t border-slate-100 pt-5">
                  <FeatureToggle
                    label="Verifikasi Kost Otomatis"
                    desc="Lewati antrean moderasi — kost baru langsung terverifikasi."
                    value={form.auto_verify_listings}
                    onChange={(v) => set('auto_verify_listings', v)}
                  />
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                    <Lock className="h-3 w-3" /> Pengaturan privat — tidak ditampilkan ke publik.
                  </div>
                </div>
              </div>
            )}

            {subTab === 'appearance' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <label className={labelClass}>Warna Utama Brand</label>
                  <div className="flex flex-wrap gap-3">
                    {COLOR_OPTIONS.map((c) => (
                      <button
                        key={c.key}
                        onClick={() => set('primary_color', c.key)}
                        className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                          form.primary_color === c.key ? 'border-slate-900 ring-2 ring-slate-900/10' : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span className={`h-4 w-4 rounded-full ${c.dot}`} />
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3 border-t border-slate-100 pt-5">
                  <label className={labelClass}>Toggle Fitur</label>
                  <FeatureToggle label="Smart Alerts" desc="Form notifikasi otomatis di halaman watchlist." value={form.feature_smart_alerts} onChange={(v) => set('feature_smart_alerts', v)} />
                  <FeatureToggle label="Kalkulator Estimasi (Landing)" desc="Widget simulasi anggaran di beranda." value={form.feature_estimator} onChange={(v) => set('feature_estimator', v)} />
                </div>
              </div>
            )}

            {/* Save bar */}
            <div className="mt-7 flex items-center gap-3 border-t border-slate-100 pt-6">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-60"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Simpan Perubahan
              </button>
              {savedAt && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 animate-in fade-in">
                  <CheckCircle className="h-4 w-4" /> Tersimpan & berlaku di seluruh website!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ===== RIGHT: live preview ===== */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-4">
            <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/60 px-5 py-3">
                <Eye className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-700">Pratinjau Langsung</span>
              </div>

              {/* Mock navbar */}
              <div className="space-y-4 p-5">
                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10">
                      <Sparkles className={`h-3.5 w-3.5 ${PREVIEW_ACCENT[form.primary_color] ?? 'text-emerald-500'}`} />
                    </span>
                    <span className="text-sm font-black tracking-tight text-slate-900">
                      {brandHead}
                      <span className={PREVIEW_ACCENT[form.primary_color] ?? 'text-emerald-500'}>{brandTail}</span>
                    </span>
                  </div>
                  <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[8px] font-bold text-white">Masuk</span>
                </div>

                {/* Tagline */}
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tagline</p>
                  <p className="mt-0.5 text-xs font-semibold text-slate-700">{form.tagline || '—'}</p>
                </div>

                {/* Contact */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                    <Mail className="h-3.5 w-3.5 text-slate-400" /> {form.support_email || '—'}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                    <Phone className="h-3.5 w-3.5 text-slate-400" /> {form.support_phone || '—'}
                  </div>
                </div>

                {/* Cities */}
                <div>
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">{form.cities.length} Kota Aktif</p>
                  <div className="flex flex-wrap gap-1">
                    {form.cities.slice(0, 6).map((c) => (
                      <span key={c} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">{c}</span>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                  <FeatureChip on={form.feature_smart_alerts} label="Smart Alerts" />
                  <FeatureChip on={form.feature_estimator} label="Estimator" />
                </div>
              </div>
            </div>
            <p className="px-1 text-[11px] leading-relaxed text-slate-400">
              Pratinjau memperbarui secara langsung. Klik <span className="font-bold text-slate-500">Simpan Perubahan</span> agar berlaku di seluruh website.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureToggle: React.FC<{ label: string; desc: string; value: boolean; onChange: (v: boolean) => void }> = ({ label, desc, value, onChange }) => (
  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4">
    <div>
      <p className="text-sm font-bold text-slate-800">{label}</p>
      <p className="text-[11px] text-slate-400">{desc}</p>
    </div>
    <button onClick={() => onChange(!value)} className="flex-shrink-0">
      {value ? <ToggleRight className="h-9 w-9 text-emerald-600" /> : <ToggleLeft className="h-9 w-9 text-slate-300" />}
    </button>
  </div>
);

const FeatureChip: React.FC<{ on: boolean; label: string }> = ({ on, label }) => (
  <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold ${on ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400 line-through'}`}>
    <span className={`h-1.5 w-1.5 rounded-full ${on ? 'bg-emerald-500' : 'bg-slate-300'}`} />
    {label}
  </span>
);
