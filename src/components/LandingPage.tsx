// KostFind Landing Page
// Pattern: Marketplace / Directory (/ui-ux-pro-max)
// Audited: /ui-skills taste-skill Pre-Flight (Section 14) + pbakaus/bolder amplification.
// Shape rule: rounded-md for surfaces, rounded-sm for controls / inline badges.
// Theme rule: light page, single dark closing color block (allowed once per Section 4.11).
// Type rule: italic emphasis inside same family (Section 4.1 emphasis rule).
// Global Navbar is mounted in App.tsx, so this file renders no header.

import { lazy, Suspense, useMemo, useState } from 'react';
import type { Property } from '../types';
import { useSettings } from '../hooks/useSettings';
import { Footer } from './Footer';
import { Search, MapPin, ArrowUpRight, ArrowRight, ShieldCheck } from 'lucide-react';

// Lazy-load the Mapbox view — the chunk is ~1.8MB; we keep it out of first paint.
const MapboxMapView = lazy(() =>
  import('./MapboxMapView').then((m) => ({ default: m.MapboxMapView }))
);

interface LandingPageProps {
  featuredProperties: Property[];
  onStartSearching: (city?: string, query?: string) => void;
  onSelectProperty: (id: string) => void;
}

const TYPE_LABEL: Record<Property['type'], string> = {
  kost_putra: 'Kost putra',
  kost_putri: 'Kost putri',
  kost_campur: 'Kost campur',
  apartment: 'Apartemen',
};

const BUDGET_OPTIONS = [
  { value: '', label: 'Semua budget' },
  { value: '< 1000000', label: 'Di bawah Rp 1jt' },
  { value: '1000000-2000000', label: 'Rp 1jt sampai 2jt' },
  { value: '2000000-3000000', label: 'Rp 2jt sampai 3jt' },
  { value: '> 3000000', label: 'Di atas Rp 3jt' },
];

const TYPE_OPTIONS: Array<{ value: '' | Property['type']; label: string }> = [
  { value: '', label: 'Semua tipe' },
  { value: 'kost_putra', label: 'Putra' },
  { value: 'kost_putri', label: 'Putri' },
  { value: 'kost_campur', label: 'Campur' },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

const COMMITMENTS = [
  {
    n: '01',
    title: 'Kami yang datang ke lokasi.',
    body:
      'Setiap kost kami kunjungi sendiri sebelum tayang. Foto kamar, foto luar, dan koordinat GPS diambil langsung oleh tim kami. Bukan re-upload, bukan dari arsip pemilik.',
  },
  {
    n: '02',
    title: 'Yang di peta, itu yang di realita.',
    body:
      'Lokasi yang tertera adalah lokasi yang sebenarnya, bukan radius kira-kira. Cek jarak ke kampus di peta sebelum kamu jadwalkan survei.',
  },
  {
    n: '03',
    title: 'Harga satu pintu.',
    body:
      'Harga yang muncul adalah harga yang kamu bayarkan ke pemilik. Tidak ada komisi KostFind, tidak ada biaya admin yang tiba-tiba muncul di akhir.',
  },
];

// Subtle dot pattern. Adds texture to hero without slop blobs.
const dotPatternStyle: React.CSSProperties = {
  backgroundImage:
    'radial-gradient(circle, rgba(15,23,42,0.06) 1px, transparent 1px)',
  backgroundSize: '24px 24px',
};

export const LandingPage = ({
  featuredProperties,
  onStartSearching,
  onSelectProperty,
}: LandingPageProps) => {
  const { settings } = useSettings();
  const [city, setCity] = useState('');
  const [type, setType] = useState<'' | Property['type']>('');
  const [budget, setBudget] = useState('');
  const [query, setQuery] = useState('');
  const [mapCity, setMapCity] = useState<string | undefined>(undefined);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = [
      query.trim(),
      type ? TYPE_LABEL[type as Property['type']] : '',
      budget,
    ]
      .filter(Boolean)
      .join(' ');
    onStartSearching(city || undefined, q || undefined);
  };

  const cities = useMemo(
    () =>
      settings.cities && settings.cities.length > 0
        ? settings.cities
        : ['Jakarta', 'Bandung', 'Yogyakarta', 'Surabaya'],
    [settings.cities]
  );

  const phone = (settings.support_phone || '').replace(/\D/g, '');
  const waHref = phone ? `https://wa.me/${phone}` : '#';

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* ============================================================
          HERO  ·  Weight-contrast typography. Dot pattern bg texture.
          ============================================================ */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-60"
          style={dotPatternStyle}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white pointer-events-none"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 lg:pt-32 pb-20 sm:pb-28">
          <h1 className="max-w-5xl text-[3rem] sm:text-7xl lg:text-[8.5rem] leading-[0.92] tracking-[-0.035em] text-slate-900">
            <span className="font-black">Foto asli.</span>{' '}
            <span className="block sm:inline italic font-medium text-slate-700">
              Lokasi&nbsp;pas.
            </span>{' '}
            <span className="block sm:inline font-black text-secondary">
              Harga itu satu.
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg sm:text-xl text-slate-600 leading-relaxed">
            Setiap kost di KostFind kami kunjungi sendiri. Yang kamu lihat di sini, foto sampai harga, adalah yang kamu temukan saat survei.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-2 bg-white border border-slate-300 rounded-md p-2 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.18)]"
          >
            <label className="md:col-span-3 relative">
              <span className="sr-only">Kota</span>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full appearance-none px-4 py-4 text-sm bg-white text-slate-900 rounded-sm border border-transparent focus:outline-none focus:border-slate-900 cursor-pointer"
              >
                <option value="">Semua kota</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="md:col-span-2 relative md:border-l md:border-slate-200">
              <span className="sr-only">Tipe</span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as '' | Property['type'])}
                className="w-full appearance-none px-4 py-4 text-sm bg-white text-slate-900 rounded-sm border border-transparent focus:outline-none focus:border-slate-900 cursor-pointer"
              >
                {TYPE_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="md:col-span-3 relative md:border-l md:border-slate-200">
              <span className="sr-only">Budget</span>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full appearance-none px-4 py-4 text-sm bg-white text-slate-900 rounded-sm border border-transparent focus:outline-none focus:border-slate-900 cursor-pointer"
              >
                {BUDGET_OPTIONS.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="md:col-span-2 relative md:border-l md:border-slate-200">
              <span className="sr-only">Kampus atau area</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Kampus / area"
                className="w-full px-4 py-4 text-sm bg-white text-slate-900 placeholder:text-slate-400 rounded-sm border border-transparent focus:outline-none focus:border-slate-900"
              />
            </label>
            <button
              type="submit"
              className="md:col-span-2 inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-sm transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
            >
              <Search className="w-4 h-4" />
              Cari kost
            </button>
          </form>
        </div>
      </section>

      {/* ============================================================
          PETA  ·  Live Mapbox preview of verified kost. Lazy-loaded.
          ============================================================ */}
      <section className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-slate-900 leading-[1.05] max-w-2xl">
                Lihat semua kost{' '}
                <span className="italic font-medium text-slate-700">di peta.</span>
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-xl">
                Klik penanda harga untuk lihat detail. Pilih kota untuk arahkan peta.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onStartSearching(mapCity)}
              className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-slate-900 hover:text-slate-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900 rounded-sm px-1 shrink-0"
            >
              Buka peta lengkap
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* City quick-jump pills — pan the embedded map, no navigation */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <button
              type="button"
              onClick={() => setMapCity(undefined)}
              className={[
                'px-4 py-2 text-sm font-medium rounded-sm border transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2',
                mapCity === undefined
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-900',
              ].join(' ')}
            >
              Semua
            </button>
            {cities.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setMapCity(c)}
                className={[
                  'px-4 py-2 text-sm font-medium rounded-sm border transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2',
                  mapCity === c
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-900',
                ].join(' ')}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Map canvas — fixed height, rounded surface, lazy mounted */}
          <div className="relative w-full h-[480px] sm:h-[560px] lg:h-[640px] rounded-md overflow-hidden border border-slate-200 bg-slate-100">
            <Suspense
              fallback={
                <div className="absolute inset-0 grid place-items-center bg-slate-50">
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                    <MapPin className="w-8 h-8 animate-pulse" aria-hidden />
                    <p className="text-sm">Memuat peta...</p>
                  </div>
                </div>
              }
            >
              <MapboxMapView
                properties={featuredProperties.map((p) => ({
                  property: p,
                  rooms: p.rooms,
                }))}
                hoveredPropertyId={hoveredPropertyId}
                onSelectProperty={onSelectProperty}
                onHoverProperty={setHoveredPropertyId}
                selectedCity={mapCity}
                accessToken={import.meta.env.VITE_MAPBOX_TOKEN}
              />
            </Suspense>
          </div>

          <div className="mt-8 md:hidden">
            <button
              type="button"
              onClick={() => onStartSearching(mapCity)}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-4 text-base font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-sm transition-colors cursor-pointer"
            >
              Buka peta lengkap
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================
          LISTINGS  ·  4-col cards. Verified is inline, not overlay.
          ============================================================ */}
      <section id="kost" className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="flex items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-slate-900 leading-[1.05] max-w-xl">
                Baru terverifikasi minggu ini.
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-xl">
                Kost yang sudah kami kunjungi dan kami foto sendiri.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onStartSearching()}
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-slate-900 hover:text-slate-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900 rounded-sm px-1"
            >
              Lihat semua
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {featuredProperties.length === 0 ? (
            <div className="rounded-md border border-dashed border-slate-200 py-16 text-center">
              <p className="text-sm text-slate-500">
                Belum ada listing yang terverifikasi minggu ini. Coba pencarian di atas.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredProperties.slice(0, 8).map((p) => {
                const lowestPrice =
                  p.rooms.length > 0
                    ? Math.min(...p.rooms.map((r) => r.price_monthly))
                    : null;
                const availableRooms = p.rooms.filter((r) => r.status === 'available').length;
                const photo = p.media[0]?.url_medium;

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onSelectProperty(p.id)}
                    className="group text-left bg-white border border-slate-200 rounded-md overflow-hidden hover:border-slate-300 hover:shadow-[0_8px_24px_-8px_rgba(15,23,42,0.12)] transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                  >
                    <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                      {photo ? (
                        <img
                          src={photo}
                          alt={p.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                        />
                      ) : (
                        <div className="w-full h-full grid place-items-center text-slate-300">
                          <MapPin className="w-7 h-7" aria-hidden />
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                        <span>{TYPE_LABEL[p.type] ?? 'Kost'}</span>
                        {p.is_verified && (
                          <span className="inline-flex items-center gap-1 text-secondary font-medium">
                            <ShieldCheck className="w-3.5 h-3.5" aria-hidden />
                            Terverifikasi
                          </span>
                        )}
                      </div>
                      <h3 className="mt-2 text-base font-semibold text-slate-900 line-clamp-1">
                        {p.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500 line-clamp-1">
                        {p.location.address}, {p.location.city}
                      </p>
                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-baseline justify-between gap-2">
                        <span>
                          <span className="text-lg font-bold text-slate-900 tracking-tight">
                            {lowestPrice ? formatPrice(lowestPrice) : 'Harga belum tersedia'}
                          </span>
                          {lowestPrice && (
                            <span className="ml-1 text-sm text-slate-500">/bulan</span>
                          )}
                        </span>
                        <span
                          className={
                            availableRooms > 0
                              ? 'text-xs text-slate-600 font-medium'
                              : 'text-xs text-slate-400'
                          }
                        >
                          {availableRooms > 0 ? `${availableRooms} kamar` : 'Penuh'}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-10 sm:hidden">
            <button
              type="button"
              onClick={() => onStartSearching()}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-4 text-base font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-sm transition-colors cursor-pointer"
            >
              Lihat semua
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================
          JANJI  ·  Oversized typographic numerals as visual anchors.
          ============================================================ */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <h2 className="text-4xl sm:text-6xl font-semibold tracking-tight text-slate-900 leading-[1.02] max-w-3xl">
            Tiga hal yang kami pegang untuk{' '}
            <span className="italic font-medium text-slate-700">setiap listing.</span>
          </h2>
          <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-2xl">
            Bukan slogan marketing. Ini cara kerja tim kami sebelum sebuah kost muncul di pencarian.
          </p>

          <ol className="mt-16">
            {COMMITMENTS.map(({ n, title, body }, idx) => (
              <li
                key={n}
                className={[
                  'grid grid-cols-12 gap-6 sm:gap-10 py-10 sm:py-14',
                  idx !== 0 ? 'border-t border-slate-200' : '',
                ].join(' ')}
              >
                <span className="col-span-12 sm:col-span-3 text-7xl sm:text-8xl lg:text-[9rem] font-black text-slate-200 tabular-nums leading-[0.85] tracking-[-0.04em] select-none">
                  {n}
                </span>
                <div className="col-span-12 sm:col-span-9">
                  <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900 leading-tight">
                    {title}
                  </h3>
                  <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                    {body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============================================================
          OWNER CTA  ·  Premium owner registration section
          ============================================================ */}
      <section id="tentang" className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-[#004ac6]/20 text-white overflow-hidden">
        {/* Decorative gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#004ac6]/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#006c49]/10 rounded-full blur-3xl" />
        </div>

        {/* Dot pattern overlay */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#004ac6]/20 border border-[#004ac6]/30 text-sm font-medium text-[#004ac6]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#004ac6] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#004ac6]" />
                </span>
                Pendaftaran Terbuka
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]">
                Pemilik Kost?{' '}
                <span className="bg-gradient-to-r from-[#004ac6] to-[#006c49] bg-clip-text text-transparent">
                  Daftarkan Tempatmu
                </span>
              </h2>

              <div className="space-y-4">
                <p className="text-lg text-slate-300 leading-relaxed">
                  Tim kami yang verifikasi setiap properti secara langsung di lokasi.
                </p>

                {/* Benefits grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="w-12 h-12 rounded-xl bg-[#006c49]/20 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-6 h-6 text-[#006c49]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Verifikasi Gratis</h4>
                      <p className="text-sm text-slate-400">Kunjungan tim kami tanpa biaya</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="w-12 h-12 rounded-xl bg-[#004ac6]/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-[#004ac6]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">GPS Akurat</h4>
                      <p className="text-sm text-slate-400">Koordinat lokasi terverifikasi</p>
                    </div>
                  </div>
                </div>

                {/* WhatsApp CTA */}
                <div className="flex items-center gap-4 mt-6 p-4 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20">
                  <div className="w-14 h-14 rounded-2xl bg-[#25D366] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#25D366]/25">
                    <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.326.156 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.336 11.89-11.867a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Hubungi via WhatsApp</p>
                    <p className="font-bold text-white">Respons dalam 3 hari kerja</p>
                    <p className="text-xs text-slate-500">Gratis dan tanpa komitmen</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right CTA */}
            <div className="lg:col-span-5 lg:flex lg:justify-end">
              <a
                href={waHref}
                target={phone ? '_blank' : undefined}
                rel={phone ? 'noopener noreferrer' : undefined}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-5 text-lg font-bold text-white bg-gradient-to-r from-[#004ac6] to-[#003a9e] rounded-2xl shadow-xl shadow-[#004ac6]/25 hover:shadow-2xl hover:shadow-[#004ac6]/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#004ac6] focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                <span className="relative flex items-center gap-3">
                  <span className="text-2xl">🏠</span>
                  Daftarkan Kost
                  <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
