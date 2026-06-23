import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Property } from '../types';
import { useSettings } from '../hooks/useSettings';
import { Footer } from './Footer';
import { 
  Search, 
  MapPin, 
  Shield, 
  ArrowRight, 
  CircleCheck, 
  ChevronDown, 
  ChevronUp, 
  X, 
  Compass, 
  MessageSquare, 
  ClipboardCheck, 
  Sparkles,
  TrendingUp,
  House,
  ShieldCheck
} from 'lucide-react';

interface LandingPageProps {
  featuredProperties: Property[];
  onStartSearching: (city?: string, query?: string) => void;
  onSelectProperty: (id: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  featuredProperties,
  onStartSearching,
  onSelectProperty,
}) => {
  const { settings } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  // Interactive Estimator State
  const [estimatorCampus, setEstimatorCampus] = useState('UNCP');
  const [estimatorBudget, setEstimatorBudget] = useState(1500000);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Workflow Timeline Active State
  const [activeStep, setActiveStep] = useState(0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartSearching(selectedCity || undefined, searchQuery || undefined);
  };

  const handleQuickSearch = (city: string) => {
    onStartSearching(city, undefined);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Dynamic Calculation for Estimator Widget
  const getEstimationResult = () => {
    let count = 0;
    let avgDistance = "0.5 km";
    
    if (estimatorCampus === 'UNCP') {
      count = estimatorBudget < 1500000 ? 6 : estimatorBudget < 2500000 ? 14 : 9;
      avgDistance = "0.4 km";
    } else if (estimatorCampus === 'IAIN Palopo') {
      count = estimatorBudget < 1500000 ? 4 : estimatorBudget < 2500000 ? 11 : 8;
      avgDistance = "0.7 km";
    } else {
      count = estimatorBudget < 1500000 ? 3 : estimatorBudget < 2500000 ? 8 : 12;
      avgDistance = "1.1 km";
    }

    return { count, avgDistance };
  };

  const estimation = getEstimationResult();

  return (
    <div className="bg-slate-50/50 min-h-screen font-sans text-slate-900 antialiased selection:bg-[var(--primary-100)]">
      
      {/* 1. HERO SECTION WITH RADIAL GLOW BLOBS */}
      <section className="relative py-12 sm:py-20 lg:py-32 px-6 sm:px-8 overflow-hidden bg-white border-b border-slate-100">
        
        {/* Glow Blobs */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-[var(--primary-400)]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/10 w-[500px] h-[500px] bg-indigo-300/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center relative z-10">
          
          {/* Hero Left */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--primary-50)] border border-[var(--primary-100)] text-[var(--primary-700)] text-xs font-bold"
            >
              <Sparkles className="w-3.5 h-3.5 text-[var(--primary-600)] animate-spin-slow" />
              <span>{settings.tagline || 'Platform Kos Digital'}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-6xl font-black tracking-tight leading-[1.15] text-slate-900"
            >
              {settings.hero_title || 'Cari kost nyaman tanpa cemas foto menipu'}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-slate-500 text-sm sm:text-base max-w-xl leading-relaxed font-medium"
            >
              {settings.site_name} memverifikasi media listing secara ketat dengan koordinat GPS dan penanda waktu. Menghubungkan langsung pencari kos dengan pemilik kos secara transparan dan real-time.
            </motion.p>

            {/* Premium Search Form */}
            <motion.form
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              onSubmit={handleSearchSubmit}
              className="bg-white p-1.5 rounded-full border border-slate-200 shadow-sm flex items-center gap-0 max-w-2xl focus-within:border-[#ff385c] focus-within:ring-4 focus-within:ring-[#ff385c]/10 transition-all"
            >
              {/* Input: left pill, right square */}
              <div className="flex-1 flex items-center gap-2 pl-4 pr-3 py-2 rounded-l-full">
                <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Cari daerah, nama kampus, atau nama jalan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-0 outline-none w-full text-sm placeholder-slate-400 text-slate-700 focus:ring-0"
                />
              </div>

              {/* Dropdown: all square */}
              <div className="flex items-center gap-2 px-3 py-2 border-l border-slate-100">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-transparent border-0 outline-none text-sm text-slate-700 focus:ring-0 pr-6 cursor-pointer font-semibold"
                >
                  <option value="">Semua Kota</option>
                  {settings.cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* CTA: right pill */}
              <button
                type="submit"
                className="bg-[#ff385c] hover:bg-[#e00b41] active:scale-95 transition-all text-white font-semibold text-sm px-5 py-2.5 rounded-full flex items-center justify-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff385c] focus:ring-offset-2 mr-1"
              >
                Cari Kost
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.form>

            {/* Popular Searches */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="flex flex-wrap items-center gap-2 pt-2"
            >
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pencarian populer:</span>
              {settings.cities.slice(0, 3).map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => handleQuickSearch(city)}
                  className="text-xs text-slate-600 hover:text-[#ff385c] hover:bg-[#ff385c]/5 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white transition-all hover:border-[#ff385c]/30 font-semibold"
                >
                  {city}
                </button>
              ))}
            </motion.div>
          </div>

                  {/* Hero Right: Highly Polished Interactive Device Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.6, delay: 0.15 }} 
            className="lg:col-span-5 relative hidden lg:block"
          >
            {/* Background dashed circle rotation decoration */}
            <div className="absolute inset-0 border border-slate-200/80 rounded-full scale-110 border-dashed animate-spin-slow opacity-60"></div>
            
            {/* Card stack layout */}
            <div className="relative z-10 space-y-4 max-w-sm mx-auto">
              
              {/* Floating Badge Left */}
              <motion.div 
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -left-12 top-1/4 bg-white/95 backdrop-blur-md rounded-xl shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-3 border border-slate-200/80 flex items-center gap-2.5 z-30 pointer-events-none"
              >
                <div className="p-1.5 bg-indigo-50/85 border border-indigo-100/50 text-indigo-600 rounded-lg">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] font-black text-slate-400 block uppercase tracking-wider">Akurasi Geotag</span>
                  <span className="text-xs font-black text-slate-800">100% Cocok</span>
                </div>
              </motion.div>

              {/* Floating Badge Right */}
              <motion.div 
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                className="absolute -right-10 bottom-1/4 bg-white/95 backdrop-blur-md rounded-xl shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-3 border border-slate-200/80 flex items-center gap-2.5 z-30 pointer-events-none"
              >
                <div className="p-1.5 bg-[var(--primary-50)]/85 border border-[var(--primary-100)]/50 text-[var(--primary-600)] rounded-lg">
                  <CircleCheck className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] font-black text-slate-400 block uppercase tracking-wider">Status Listing</span>
                  <span className="text-xs font-black text-slate-800">Terverifikasi</span>
                </div>
              </motion.div>

              {/* Main Card */}
              <div className="bg-white rounded-lg border border-slate-200/80 shadow-[0_24px_50px_rgba(15,23,42,0.06)] p-5 space-y-4 relative overflow-hidden group">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary-400)] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--primary-50)]0"></span>
                    </span>
                    <span className="text-xs font-bold text-slate-900">Kost Leari Ana</span>
                  </div>
                  <span className="text-[9px] font-black tracking-wider uppercase border border-[var(--primary-200)] bg-[var(--primary-50)]/80 text-[var(--primary-700)] px-2 py-0.5 rounded-full">GPS OK</span>
                </div>
                
                <div className="relative aspect-[4/3] rounded-xl bg-slate-100 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80" 
                    alt="Kost Premium" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-[var(--primary-400)]" />
                    Verified Media
                  </div>
                </div>

                <div className="space-y-2 text-left">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Wara, Kota Palopo</h3>
                      <p className="text-[11px] font-semibold text-slate-500 mt-0.5">200m dari Universitas Cokroaminoto</p>
                    </div>
                    <span className="text-[10px] font-bold text-[var(--primary-700)] bg-[var(--primary-50)] border border-[var(--primary-100)]/50 px-2.5 py-0.5 rounded-full">2 Kamar Kosong</span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">Rp 2.100.000 <span className="text-[10px] text-slate-400 font-normal">/bln</span></span>
                    <button 
                      onClick={() => onStartSearching('Palopo')}
                      className="text-xs font-extrabold text-[var(--primary-600)] hover:text-[var(--primary-700)] flex items-center gap-0.5 transition-colors"
                    >
                      Hubungi Pemilik <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. DYNAMIC BUDGET ESTIMATOR WIDGET (SaaS Interactive Simulator) */}
      {settings.feature_estimator && (
      <section className="py-16 px-6 sm:px-8 border-b border-slate-100 bg-slate-50/50 relative overflow-hidden">
        
        {/* Abstract pattern grid background */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Description */}
            <div className="lg:col-span-5 space-y-8 text-left">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--primary-50)] border border-[var(--primary-105)] text-[var(--primary-750)] text-xs font-black uppercase tracking-wider">
                  <Compass className="w-3.5 h-3.5 text-[var(--primary-600)]" />
                  Simulasi Akurat
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.12]">
                  Kalkulator Estimasi <br />Kost Impian Anda
                </h2>
                <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-medium">
                  Pilih universitas terdekat dan sesuaikan anggaran bulanan Anda. Algoritma kami akan langsung memperhitungkan ketersediaan kos, rata-rata jarak tempuh jalan kaki, serta jaminan keakuratan koordinat GPS.
                </p>
              </div>

              {/* Upgraded Features List - Tech Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-lg bg-white/70 border border-slate-200/50 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md hover:shadow-slate-100/50 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                      <CircleCheck className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">Database Akurat</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">Kamar diupdate langsung oleh pengelola setiap hari.</p>
                </div>

                <div className="p-5 rounded-lg bg-white/70 border border-slate-200/50 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md hover:shadow-slate-100/50 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                      <CircleCheck className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">Validasi Geotagging</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">Koordinat kamera wajib cocok dengan lokasi peta.</p>
                </div>
              </div>
            </div>

            {/* Right Estimator Widget Card - Pristine Premium White/Light Glassmorphism */}
            <div className="lg:col-span-7">
              <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-lg p-6 sm:p-8 space-y-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] relative overflow-hidden text-slate-800">
                {/* Subtle emerald glowing circle */}
                <div className="bg-[var(--primary-50)]0/5 blur-3xl absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none"></div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Select Campus (Pill Segmented Control) */}
                  <div className="space-y-3 text-left">
                    <label className="text-[10px] font-black text-slate-450 uppercase tracking-wider">Universitas Terdekat</label>
                    <div className="bg-slate-100/80 p-1 rounded-xl flex gap-1 border border-slate-200/30">
                      {['UNCP', 'IAIN Palopo', 'UM Palopo'].map((camp) => (
                        <button
                          key={camp}
                          type="button"
                          onClick={() => setEstimatorCampus(camp)}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                            estimatorCampus === camp 
                              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/20' 
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {camp}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Budget Slider */}
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-slate-455 uppercase tracking-wider">Maksimum Budget</label>
                      <span className="text-xs font-black text-[var(--primary-600)] bg-[var(--primary-50)] border border-[var(--primary-100)]/50 px-2 py-0.5 rounded-md">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(estimatorBudget)}
                      </span>
                    </div>
                    <div className="pt-2">
                      <input 
                        type="range" 
                        min="800000" 
                        max="4000000" 
                        step="100000"
                        value={estimatorBudget}
                        onChange={(e) => setEstimatorBudget(Number(e.target.value))}
                        className="w-full accent-[var(--primary-500)] cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
                      />
                      <div className="flex justify-between text-[9px] text-slate-400 font-bold pt-1">
                        <span>Rp 800rb</span>
                        <span>Rp 4jt</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Calculation Output Area */}
                <motion.div 
                  key={`${estimatorCampus}-${estimatorBudget}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="bg-slate-50/60 border border-slate-200/50 rounded-lg p-5 grid grid-cols-3 gap-2 text-center shadow-sm"
                >
                  <div className="flex flex-col items-center justify-center py-2">
                    <div className="p-2.5 bg-[var(--primary-50)] text-[var(--primary-600)] border border-[var(--primary-100)]/30 rounded-xl mb-2">
                      <House className="w-4.5 h-4.5 animate-pulse" />
                    </div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Ketersediaan</span>
                    <span className="text-base sm:text-lg font-black text-slate-900 mt-1">{estimation.count} Kos</span>
                  </div>
                  
                  <div className="border-x border-slate-200/80 flex flex-col items-center justify-center py-2">
                    <div className="p-2.5 bg-[var(--primary-50)] text-[var(--primary-600)] border border-[var(--primary-100)]/30 rounded-xl mb-2">
                      <MapPin className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Rata Jarak</span>
                    <span className="text-base sm:text-lg font-black text-slate-900 mt-1">{estimation.avgDistance}</span>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center py-2">
                    <div className="p-2.5 bg-[var(--primary-50)] text-[var(--primary-600)] border border-[var(--primary-100)]/30 rounded-xl mb-2">
                      <ShieldCheck className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Status GPS</span>
                    <span className="text-[10px] font-black text-[var(--primary-600)] bg-[var(--primary-50)] border border-[var(--primary-100)]/50 px-2.5 py-0.5 rounded-full mt-2">100% MATCH</span>
                  </div>
                </motion.div>

                <div className="pt-2">
                  <button
                    onClick={() => onStartSearching(undefined, estimatorCampus)}
                    className="w-full bg-[#ff385c] hover:bg-[#e00b41] active:scale-[0.98] text-white font-semibold text-sm py-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#ff385c]/10 focus:outline-none focus:ring-2 focus:ring-[#ff385c] focus:ring-offset-2"
                  >
                    Lihat Hasil Pencarian Kost
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      )}

      {/* 3. COMPARISON CHECKLIST TABLE (Premium Matrix Section) */}
      <section className="py-16 px-6 sm:px-8 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--primary-50)] border border-[var(--primary-100)]/80 text-[var(--primary-700)] text-xs font-black uppercase tracking-wider">
              Mengapa Memilih Kami
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">
              Perbandingan Layanan & Keamanan
            </h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto leading-relaxed font-medium">
              Kami menghadirkan standardisasi platform kos digital yang berfokus pada transparansi transaksi dan keakuratan koordinat GPS.
            </p>
          </div>

          {/* Premium Comparison Matrix Card */}
          <div className="bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-lg p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.02)] space-y-6">
            
            {/* Header - Desktop Only */}
            <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-slate-150 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <div className="col-span-5">Fitur Utama</div>
              <div className="col-span-3 text-center">Kost Umum / WA</div>
              <div className="col-span-4 text-center">{settings.site_name} Platform</div>
            </div>

            {/* Matrix Rows */}
            <div className="divide-y divide-slate-150">
              {[
                { 
                  name: "Verifikasi Lokasi & Media GPS", 
                  desc: "Menjamin keselarasan visual iklan dengan kondisi riil di lapangan.", 
                  old: "Hanya foto lama / manipulasi", 
                  current: "Wajib Kamera In-App & Geotagging" 
                },
                { 
                  name: "Ketersediaan Kamar Terintegrasi", 
                  desc: "Menghindari survei fisik sia-sia pada kos yang ternyata sudah penuh.", 
                  old: "Harus tanya manual / survei langsung", 
                  current: "Stock Management Terupdate Live" 
                },
                { 
                  name: "Riwayat Chat & Rincian Transaksi", 
                  desc: "Rekam jejak obrolan dan invoice tersimpan aman dalam sistem terpusat.", 
                  old: "Obrolan WhatsApp yang tersebar", 
                  current: "Arsip Chat & Bukti Bayar In-App" 
                },
                { 
                  name: "Transparansi Biaya Sewa", 
                  desc: "Tidak ada biaya administrasi siluman atau markup dari komisi agen.", 
                  old: "Komisi perantara / biaya dadakan", 
                  current: "Bebas Komisi & Hubungkan Langsung" 
                }
              ].map((row, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 py-6 items-center first:pt-0 last:pb-0">
                  
                  {/* Feature Label & Desc */}
                  <div className="col-span-1 md:col-span-5 text-left space-y-1">
                    <span className="text-sm font-black text-slate-800 block">{row.name}</span>
                    <span className="text-[11px] text-slate-400 leading-relaxed block font-medium">{row.desc}</span>
                  </div>

                  {/* Old Way Row */}
                  <div className="col-span-1 md:col-span-3">
                    <div className="flex items-center md:justify-center gap-2 p-3 md:p-0 rounded-xl bg-slate-50 md:bg-transparent border border-slate-100 md:border-0 text-slate-400">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center flex-shrink-0 border border-slate-200/30">
                        <X className="w-3.5 h-3.5 stroke-[2.5]" />
                      </span>
                      <span className="text-xs font-bold text-slate-500">{row.old}</span>
                    </div>
                  </div>

                  {/* New Way Row (KostFind Highlighted) */}
                  <div className="col-span-1 md:col-span-4">
                    <div className="flex items-center md:justify-center gap-2 p-3 md:py-2.5 md:px-4 rounded-xl bg-[var(--primary-50)] border border-[var(--primary-100)] text-[var(--primary-950)]">
                      <span className="w-5 h-5 rounded-full bg-[var(--primary-600)] text-white flex items-center justify-center flex-shrink-0">
                        <CircleCheck className="w-3.5 h-3.5 text-white" />
                      </span>
                      <span className="text-xs font-black text-[var(--primary-800)]">{row.current}</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 4. WORKFLOW / HOW IT WORKS */}
      <section className="py-16 px-6 sm:px-8 max-w-7xl mx-auto border-b border-slate-100">
        <div className="max-w-2xl mx-auto text-center mb-16 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--primary-600)] bg-[var(--primary-50)] px-3 py-1 rounded-full">
            Alur Penggunaan
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Cara Kerja Platform
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed font-semibold">
            Cukup empat langkah mudah untuk mendapatkan kamar kos impian Anda di Palopo tanpa kerumitan survei manual.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Interactive Timeline List */}
          <div className="lg:col-span-5 relative space-y-8 pl-8 text-left">
            {/* Background connecting line */}
            <div className="absolute left-14 top-6 bottom-6 w-[2px] bg-slate-150/70 z-0"></div>
            {/* Dynamic indicator line */}
            <div 
              className="absolute left-14 top-6 w-[2px] bg-[var(--primary-50)]0 transition-all duration-500 z-0"
              style={{ height: `${(activeStep / 3) * 82}%`, maxHeight: 'calc(100% - 48px)' }}
            ></div>

            {[
              { 
                step: "01", 
                title: "Cari & Saring", 
                desc: "Temukan opsi kost terdekat dari kampus menggunakan peta GPS dan saring harga.",
              },
              { 
                step: "02", 
                title: "Verifikasi Visual", 
                desc: "Periksa foto dan video terverifikasi GPS yang diambil langsung di lapangan.",
              },
              { 
                step: "03", 
                title: "Chat Pemilik", 
                desc: "Hubungi langsung pemilik kost melalui obrolan pesan dengan template instan.",
              },
              { 
                step: "04", 
                title: "Kesepakatan Aman", 
                desc: "Simpan rekap biaya tertulis dan lakukan survei koordinat dengan peta akurat.",
              }
            ].map((item, i) => {
              const active = activeStep === i;
              return (
                <div 
                  key={i}
                  onMouseEnter={() => setActiveStep(i)}
                  onClick={() => setActiveStep(i)}
                  className="relative flex gap-6 cursor-pointer group select-none"
                >
                  {/* Circle Indicator */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      active 
                        ? 'border-[var(--primary-500)] bg-[var(--primary-50)]0 text-white shadow-lg shadow-[var(--primary-500)]/20 scale-105' 
                        : 'border-slate-200 bg-white text-slate-400 group-hover:border-slate-350 group-hover:text-slate-650'
                    }`}>
                      {item.step}
                    </div>
                  </div>
                  
                  {/* Text Details */}
                  <div className="space-y-1 pt-1.5 flex-1">
                    <h4 className={`text-base font-black transition-colors duration-200 ${active ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}>
                      {item.title}
                    </h4>
                    <p className={`text-xs font-semibold leading-relaxed transition-colors duration-200 ${active ? 'text-slate-500' : 'text-slate-400'}`}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: High Fidelity Interactive Simulator Screen */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-6 md:p-8 shadow-[0_24px_50px_rgba(15,23,42,0.04)] min-h-[350px] relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--primary-50)]0/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <AnimatePresence mode="wait">
              {activeStep === 0 && (
                <motion.div 
                  key="step-0"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-[var(--primary-600)]" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Simulasi Pencarian & Filter</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl space-y-4">
                    <div className="flex gap-2">
                      <div className="bg-white border border-slate-200 px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-700 flex-1">
                        <MapPin className="w-4 h-4 text-[var(--primary-500)]" />
                        <span>Wara, Kota Palopo</span>
                      </div>
                      <div className="bg-slate-900 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center justify-center">
                        Cari
                      </div>
                    </div>
                    <div className="space-y-2 text-left">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-650">
                        <span>Batas Harga</span>
                        <span className="text-[var(--primary-700)] bg-[var(--primary-50)] px-2 py-0.5 rounded-md text-[10px]">Max: Rp 1.500.000 / bln</span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--primary-50)]0 rounded-full w-2/3"></div>
                      </div>
                    </div>
                  </div>
                  <div className="border border-slate-150 rounded-2xl p-4 bg-white flex items-center justify-between shadow-sm text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex-shrink-0 flex items-center justify-center font-bold text-xs text-slate-400">KOST</div>
                      <div>
                        <h5 className="text-xs font-extrabold text-slate-950">Kost Leari Ana</h5>
                        <p className="text-[11px] text-slate-400 font-semibold mt-0.5">200m dari Universitas Cokroaminoto</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[var(--primary-700)] bg-[var(--primary-50)] border border-[var(--primary-100)] px-2.5 py-0.5 rounded-full">Sesuai Kriteria</span>
                  </div>
                </motion.div>
              )}

              {activeStep === 1 && (
                <motion.div 
                  key="step-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[var(--primary-600)]" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Metadata Survei Terverifikasi</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[var(--primary-700)] bg-[var(--primary-50)] border border-[var(--primary-100)] px-2.5 py-0.5 rounded-full">Lolos Geotag</span>
                  </div>
                  <div className="relative aspect-video rounded-2xl bg-slate-950 overflow-hidden border border-slate-200">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent z-10"></div>
                    <img 
                      src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80" 
                      alt="Verifikasi Visual" 
                      className="w-full h-full object-cover opacity-75"
                    />
                    <div className="absolute bottom-4 left-4 right-4 z-20 text-white space-y-1 text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 bg-[var(--primary-50)]0 rounded-full animate-ping"></span>
                        <span className="text-[10px] font-black tracking-widest uppercase">GPS LOCK MATCHED</span>
                      </div>
                      <p className="text-[10px] text-slate-300 font-semibold">Latitude: -2.9904 | Longitude: 120.1983</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl">
                      <span className="text-[9px] font-black text-slate-400 block uppercase tracking-wider">Status Kamera</span>
                      <span className="text-xs font-bold text-slate-800">Anti-Spoofing Aktif</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl">
                      <span className="text-[9px] font-black text-slate-400 block uppercase tracking-wider">Metode Survei</span>
                      <span className="text-xs font-bold text-slate-800">Pencocokan Koordinat</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeStep === 2 && (
                <motion.div 
                  key="step-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[var(--primary-600)]" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Simulasi Obrolan Chat</span>
                    </div>
                    <span className="text-[10px] font-black text-[var(--primary-600)] bg-[var(--primary-50)] px-2 py-0.5 rounded-full">Respon Cepat</span>
                  </div>
                  <div className="border border-slate-150 rounded-2xl bg-slate-50 p-4 space-y-3.5 text-left max-h-[190px] overflow-y-auto">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center font-bold text-[10px] text-slate-700">P</div>
                      <div className="bg-white border border-slate-200 rounded-xl rounded-tl-none p-3 shadow-sm max-w-[85%] text-xs font-semibold text-slate-700 leading-relaxed">
                        Halo, apakah kamar tipe AC di Kost Leari Ana masih tersedia untuk bulan depan?
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 justify-end">
                      <div className="bg-[var(--primary-600)] text-white rounded-xl rounded-tr-none p-3 shadow-sm max-w-[85%] text-xs font-semibold leading-relaxed">
                        Masih ada 2 kamar kosong dek, silahkan kalau mau lihat atau survey lokasi.
                      </div>
                      <div className="w-7 h-7 rounded-full bg-[var(--primary-100)] flex-shrink-0 flex items-center justify-center font-bold text-[10px] text-[var(--primary-700)]">O</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-start">
                    <span className="text-[10px] font-bold text-[var(--primary-700)] bg-[var(--primary-50)]/80 border border-[var(--primary-100)]/60 px-3 py-1.5 rounded-full cursor-pointer hover:bg-[var(--primary-100)] transition-colors">
                      "Saya tertarik survey besok pak"
                    </span>
                    <span className="text-[10px] font-bold text-[var(--primary-700)] bg-[var(--primary-50)]/80 border border-[var(--primary-100)]/60 px-3 py-1.5 rounded-full cursor-pointer hover:bg-[var(--primary-100)] transition-colors">
                      "Apakah harga sudah termasuk listrik?"
                    </span>
                  </div>
                </motion.div>
              )}

              {activeStep === 3 && (
                <motion.div 
                  key="step-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <ClipboardCheck className="w-4 h-4 text-[var(--primary-600)]" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Rincian Komitmen Pemesanan</span>
                  </div>
                  <div className="bg-[var(--primary-50)]/45 border border-[var(--primary-100)] rounded-2xl p-5 space-y-4 text-left">
                    <div className="flex justify-between items-center pb-2.5 border-b border-[var(--primary-100)]">
                      <div>
                        <h5 className="text-xs font-black text-slate-850">Kost Leari Ana</h5>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Sewa Bulanan</p>
                      </div>
                      <span className="text-sm font-black text-[var(--primary-800)]">Rp 2.100.000 <span className="text-[9px] text-slate-400 font-normal">/ bln</span></span>
                    </div>
                    <div className="space-y-2 text-xs text-slate-650 font-semibold">
                      <div className="flex justify-between">
                        <span>Uang Jaminan (Refundable)</span>
                        <span>Rp 500.000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Periode Sewa Mula</span>
                        <span>01 Juli 2026</span>
                      </div>
                      <div className="flex justify-between font-black text-slate-800 pt-2.5 border-t border-slate-100/50">
                        <span>Total Pembayaran Awal</span>
                        <span>Rp 2.600.000</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border border-slate-150 rounded-xl p-3 flex items-center gap-2.5">
                    <div className="p-1.5 bg-[var(--primary-50)] text-[var(--primary-600)] rounded-lg">
                      <Shield className="w-4 h-4" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 text-left">Rekap kesepakatan tersimpan secara aman dalam log sistem untuk mencegah perubahan sepihak.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* 5. RECOMMENDED PROPERTIES */}
      <section className="py-16 px-6 sm:px-8 max-w-7xl mx-auto">
        <div className="space-y-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="space-y-3 text-left">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--primary-600)] bg-[var(--primary-50)] px-3 py-1 rounded-full">
                Kost Tersedia
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Rekomendasi Kost Terverifikasi
              </h2>
              <p className="text-slate-500 text-sm font-medium">Koordinat GPS diverifikasi, kamar tersedia langsung dari pemilik.</p>
            </div>
            
            <button 
              onClick={() => onStartSearching()}
              className="text-xs font-extrabold text-slate-900 hover:text-[var(--primary-600)] flex items-center gap-1.5 transition-colors border border-slate-200 px-5 py-3 rounded-full bg-white shadow-sm hover:border-slate-300 hover:shadow active:scale-95 transition-all duration-200"
            >
              Lihat Semua Kost 
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProperties.map((p) => {
              const lowestPrice = p.rooms.length > 0 ? Math.min(...p.rooms.map((r) => r.price_monthly)) : 2200000;
              const formatPrice = (price: number) => {
                return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
              };

              const availableRoomsCount = p.rooms.filter(r => r.status === 'available').length;

              return (
                <div 
                  key={p.id}
                  onClick={() => onSelectProperty(p.id)}
                  className="bg-white rounded-lg overflow-hidden border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group flex flex-col relative"
                >
                  {/* Photo area */}
                  <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden">
                    <img 
                      src={p.media[0]?.url_medium} 
                      alt={p.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Floating GPS Badge with blinking pulse */}
                    <div className="absolute top-4 left-4">
                      <span className="flex items-center gap-1.5 bg-white/95 text-slate-800 text-[10px] font-extrabold py-1.5 px-3.5 rounded-full border border-slate-200 shadow-sm">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary-400)] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--primary-50)]0"></span>
                        </span>
                        GPS Terverifikasi
                      </span>
                    </div>

                    {/* Price tag overlay */}
                    <div className="absolute bottom-4 right-4 bg-slate-900/90 text-white font-extrabold text-[11px] px-3.5 py-1.5 rounded-full backdrop-blur-sm">
                      {formatPrice(lowestPrice)}<span className="text-[10px] text-slate-400 font-normal">/bln</span>
                    </div>
                  </div>
                  
                  {/* Content Area */}
                  <div className="p-6 flex-1 flex flex-col justify-between text-left space-y-4">
                    <div className="space-y-2">
                      <span className={`inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                        p.type === 'kost_campur' 
                          ? 'bg-[var(--primary-50)] text-[var(--primary-800)]' 
                          : p.type === 'kost_putra' 
                            ? 'bg-blue-50 text-blue-800' 
                            : 'bg-pink-50 text-pink-800'
                      }`}>
                        {p.type === 'kost_campur' ? 'Campur' : p.type === 'kost_putra' ? 'Putra' : 'Putri'}
                      </span>
                      
                      <h4 className="text-base font-black text-slate-900 group-hover:text-[var(--primary-600)] transition-colors line-clamp-1">{p.name}</h4>
                      
                      <p className="text-slate-500 text-xs flex items-center gap-1 font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="text-slate-400" title={p.location.address}>{p.location.address}</span>
                      </p>
                    </div>

                    {/* Footer Row */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 font-bold">
                        <span className="text-slate-600">Palopo</span>
                        <span>&bull; Terdekat</span>
                      </div>

                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                        availableRoomsCount > 0 ? 'bg-[var(--primary-50)] text-[var(--primary-700)]' : 'bg-red-50 text-red-700'
                      }`}>
                        {availableRoomsCount > 0 ? `${availableRoomsCount} Kamar Tersedia` : 'Penuh'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. FAQ ACCORDION SECTION */}
      <section className="py-16 px-6 sm:px-8 border-t border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left Column Description */}
            <div className="lg:col-span-5 text-left space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--primary-600)] bg-[var(--primary-50)] px-3 py-1 rounded-full">
                  Tanya Jawab
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">
                  Pertanyaan yang <br />Sering Diajukan
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed font-semibold">
                  Masih ragu mengenai validasi GPS atau proses pemesanan {settings.site_name}? Temukan jawaban cepat Anda di sini atau hubungi pusat dukungan kami.
                </p>
              </div>

              <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-sm text-xs space-y-3 text-left">
                <span className="font-bold text-slate-900 block">Butuh Bantuan Lain?</span>
                <p className="text-slate-500 leading-relaxed font-medium">Tim customer support {settings.site_name} aktif 24/7 untuk memvalidasi kendala pembayaran atau verifikasi koordinat lokasi.</p>
                <a href={`mailto:${settings.support_email}`} className="inline-flex items-center gap-1 text-[var(--primary-600)] font-extrabold hover:underline">
                  Hubungi Email Support 
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Right Column Accordions */}
            <div className="lg:col-span-7 space-y-4">
              {[
                {
                  q: `Bagaimana cara kerja verifikasi GPS di ${settings.site_name}?`,
                  a: "Saat pemilik mengunggah media kos (foto/video), sistem kami merekam koordinat geolocation secara langsung dari sensor perangkat mereka dan mencocokkannya dengan koordinat alamat kos yang terdaftar untuk memastikan keaslian lokasi."
                },
                {
                  q: "Apakah ketersediaan kamar dijamin akurat?",
                  a: "Ya. Setiap kamar dikelola langsung melalui dashboard pemilik kos. Saat ada transaksi atau perubahan status harian, data ketersediaan kamar langsung diperbarui ke index pencarian secara real-time."
                },
                {
                  q: "Apakah ada biaya administrasi tambahan?",
                  a: `Tidak. ${settings.site_name} tidak membebankan biaya perantara atau komisi sewa tersembunyi kepada pencari kos. Anda membayar sewa kos secara langsung kepada pemilik.`
                },
                {
                  q: "Bagaimana jika saya ingin mendaftarkan kost saya?",
                  a: "Anda bisa masuk sebagai pemilik kos melalui tombol 'Pasang Iklan' di bagian bawah. Anda dapat mengunggah kost, mengatur persediaan kamar, dan menerima chat pertanyaan dari calon penyewa langsung dari satu dashboard."
                }
              ].map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div 
                    key={idx} 
                    className={`bg-white border rounded-2xl overflow-hidden transition-all duration-200 shadow-sm ${
                      isOpen ? 'border-[var(--primary-500)] ring-2 ring-[var(--primary-500)]/5' : 'border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-5 text-left font-extrabold text-slate-900 flex justify-between items-center gap-4 text-sm sm:text-base focus:outline-none"
                    >
                      <span>{faq.q}</span>
                      <span className={`p-1 rounded-full bg-slate-50 text-slate-400 group-hover:text-slate-600 transition-colors ${
                        isOpen ? 'bg-[var(--primary-50)] text-[var(--primary-600)]' : ''
                      }`}>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </span>
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial="collapsed"
                          animate="open"
                          exit="collapsed"
                          variants={{
                            open: { opacity: 1, height: "auto" },
                            collapsed: { opacity: 0, height: 0 }
                          }}
                          transition={{ duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pt-1 text-slate-500 text-xs sm:text-sm leading-relaxed border-t border-slate-100 text-left">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* 7. PREMIUM SITEMAP FOOTER */}
      <Footer />

    </div>
  );
};
