// Reading this as: Property/kost landing page for Indonesian students, with Awesomic-style rounded marketplace aesthetic, leaning toward Tailwind + Motion + restrained motion
// DESIGN_VARIANCE: 7, MOTION_INTENSITY: 6, VISUAL_DENSITY: 4
// Design language: "Rounded midnight marketplace" - light theme, 36px cards, dark pill CTAs, weight-contrast typography

"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Property } from '../types';
import { useSettings } from '../hooks/useSettings';
import { Footer } from './Footer';
import {
  AwesomicButton,
  AwesomicCard,
  AwesomicBadge,
  AwesomicInput,
  SectionHeader,
  StatBlock,
  DarkPanel,
} from './landing';
import {
  MapPin,
  Shield,
  ArrowRight,
  CircleCheck,
  Sparkles,
  TrendingUp,
  Star,
  Users,
  Building2,
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartSearching(undefined, searchQuery || undefined);
  };

  const handleQuickSearch = (city: string) => {
    onStartSearching(city, undefined);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-[#f4f4f5] min-h-screen font-sans text-[#18181b] antialiased selection:bg-[#09090b] selection:text-white">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* 1. HERO - Asymmetric Split with Bento Preview */}
        <section className="py-16 md:py-24 lg:py-28 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

            {/* Hero Left - Text Content */}
            <div className="lg:col-span-7 space-y-8">
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#e8e8ea] text-[#71717a] text-xs font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-[#09090b]" />
                  <span>{settings.tagline || 'Platform Kos Digital'}</span>
                </span>
              </motion.div>

              {/* Headline - Display typography with weight contrast */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-[40px] md:text-[56px] lg:text-[64px] font-bold tracking-tight leading-[1.05] text-[#09090b]"
              >
                Cari kost tanpa{' '}
                <span className="text-[#a1a1aa] font-light">takut</span>{' '}
                foto menipu
              </motion.h1>

              {/* Subtext - max 20 words */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-[#52525b] text-base md:text-lg leading-relaxed max-w-xl"
              >
                {settings.site_name} memverifikasi media listing secara ketat dengan koordinat GPS dan penanda waktu.
              </motion.p>

              {/* Email Input + CTA */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex flex-col sm:flex-row gap-3 max-w-lg"
                >
                  <input
                    type="text"
                    placeholder="Cari daerah, kampus, atau jalan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-white text-[#18181b] placeholder-[#a1a1aa] rounded-[14px] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#09090b]/10 transition-all border border-transparent focus:border-[#09090b]/20"
                  />
                  <AwesomicButton type="submit" size="md">
                    Cari Kost
                  </AwesomicButton>
                </form>
              </motion.div>

              {/* Popular Searches */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="flex flex-wrap items-center gap-2"
              >
                <span className="text-xs text-[#71717a] font-medium">Populer:</span>
                {settings.cities.slice(0, 3).map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => handleQuickSearch(city)}
                    className="text-xs text-[#52525b] hover:text-[#09090b] hover:bg-[#09090b] hover:text-white px-3 py-1.5 rounded-full border border-[#d4d4d8] bg-white transition-all font-medium"
                  >
                    {city}
                  </button>
                ))}
              </motion.div>
            </div>

            {/* Hero Right - Bento Preview Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 relative hidden lg:block"
            >
              {/* Main Bento Card */}
              <div className="bg-white rounded-[36px] border border-[#e8e8ea] shadow-[0_24px_50px_rgba(15,23,42,0.06)] p-6 space-y-5 relative overflow-hidden group">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#09090b] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#09090b]"></span>
                    </span>
                    <span className="text-sm font-semibold text-[#18181b]">Kost Leari Ana</span>
                  </div>
                  <AwesomicBadge variant="filled-dark">GPS OK</AwesomicBadge>
                </div>

                {/* Image */}
                <div className="relative aspect-[4/3] rounded-[28px] bg-[#f4f4f5] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80"
                    alt="Kost Premium di Wara"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-[#09090b]/80 backdrop-blur-sm text-white text-[10px] font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    Verified Media
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xs font-semibold text-[#71717a]">Wara, Kota Palopo</h3>
                      <p className="text-sm font-medium text-[#52525b] mt-0.5">200m dari Universitas Cokroaminoto</p>
                    </div>
                    <span className="text-xs font-medium text-[#09090b] bg-[#f4f4f5] px-2.5 py-1 rounded-full">2 Tersedia</span>
                  </div>

                  <div className="pt-3 border-t border-[#f4f4f5] flex items-center justify-between">
                    <span className="text-base font-bold text-[#18181b]">Rp 2.100.000 <span className="text-xs text-[#71717a] font-normal">/bln</span></span>
                    <button
                      onClick={() => onStartSearching('Palopo')}
                      className="text-xs font-semibold text-[#09090b] hover:underline flex items-center gap-0.5"
                    >
                      Hubungi Pemilik <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Row - Bento Style */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-white rounded-[28px] border border-[#e8e8ea] p-4 text-left">
                  <span className="text-[10px] font-medium text-[#71717a] uppercase tracking-wider block">Akurasi</span>
                  <span className="text-sm font-bold text-[#18181b]">100% Cocok</span>
                </div>
                <div className="bg-white rounded-[28px] border border-[#e8e8ea] p-4 text-left">
                  <span className="text-[10px] font-medium text-[#71717a] uppercase tracking-wider block">Status</span>
                  <span className="text-sm font-bold text-[#006c49]">Terverifikasi</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. PROBLEM PANEL - Dark Surface with Weight Contrast */}
        <section className="py-12 md:py-16">
          <DarkPanel padding="lg" className="max-w-full">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-[32px] md:text-[40px] font-semibold leading-[1.2] text-white">
                <span className="font-light text-[#a1a1aa]">Takut</span> foto menipu.{' '}
                <span className="font-light text-[#a1a1aa]">Capek</span> survei sana-sini.{' '}
                <span className="font-light text-[#a1a1aa]">Bingung</span> harga asli.
              </h2>
              <p className="text-[#71717a] text-base">
                Kami memastikan setiap listingan kost diverifikasi dengan GPS dan media asli dari kamera.
              </p>
            </div>
          </DarkPanel>
        </section>

        {/* 3. STATS ROW */}
        <section className="py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <StatBlock value="2,500+" label="Kost Terverifikasi" />
            <StatBlock value="98%" label="Akurasi Geotag" />
            <StatBlock value="15K+" label="Pencari Kos Aktif" />
            <StatBlock value="50+" label="Kota Tersedia" />
          </div>
        </section>

        {/* 4. FEATURE CARDS - Bento Grid */}
        <section className="py-12 md:py-20">
          <div className="space-y-10">
            <SectionHeader
              headline="Kenapa memilih KostFind"
              subtext="Platform yang menghubungkan pencari kos dengan pemilik secara transparan dan real-time."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <AwesomicCard hoverable>
                <div className="w-12 h-12 rounded-[16px] bg-[#f4f4f5] flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-[#09090b]" />
                </div>
                <h3 className="text-lg font-semibold text-[#18181b] mb-2">Verifikasi GPS</h3>
                <p className="text-sm text-[#52525b] leading-relaxed">
                  Koordinat kamera wajib cocok dengan lokasi peta. Anti foto menipu.
                </p>
              </AwesomicCard>

              {/* Feature 2 */}
              <AwesomicCard hoverable>
                <div className="w-12 h-12 rounded-[16px] bg-[#f4f4f5] flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-[#09090b]" />
                </div>
                <h3 className="text-lg font-semibold text-[#18181b] mb-2">Ketersediaan Real-Time</h3>
                <p className="text-sm text-[#52525b] leading-relaxed">
                  Stok kamar diupdate langsung oleh pengelola setiap hari.
                </p>
              </AwesomicCard>

              {/* Feature 3 */}
              <AwesomicCard hoverable className="md:col-span-2 lg:col-span-1">
                <div className="w-12 h-12 rounded-[16px] bg-[#f4f4f5] flex items-center justify-center mb-4">
                  <CircleCheck className="w-6 h-6 text-[#09090b]" />
                </div>
                <h3 className="text-lg font-semibold text-[#18181b] mb-2">Bebas Komisi</h3>
                <p className="text-sm text-[#52525b] leading-relaxed">
                  Hubungi langsung pemilik kost tanpa perantara dan biaya tambahan.
                </p>
              </AwesomicCard>
            </div>
          </div>
        </section>

        {/* 5. PROPERTY PREVIEW - Horizontal Scroll Tiles */}
        <section className="py-12 md:py-20">
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <SectionHeader
                headline="Kost Terverifikasi"
                subtext="Pilihan kost dengan GPS dan media diverifikasi."
              />
              <AwesomicButton variant="outline" size="sm" onClick={() => onStartSearching()}>
                Lihat Semua
              </AwesomicButton>
            </div>

            {/* Horizontal Scroll Tiles */}
            <div className="flex gap-5 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-none">
              {featuredProperties.slice(0, 5).map((property) => {
                const lowestPrice =
                  property.rooms.length > 0
                    ? Math.min(...property.rooms.map((r) => r.price_monthly))
                    : 2200000;
                const availableRooms = property.rooms.filter(
                  (r) => r.status === 'available'
                ).length;

                return (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    onClick={() => onSelectProperty(property.id)}
                    className="flex-shrink-0 w-[300px] bg-white rounded-[36px] overflow-hidden border border-[#e8e8ea] cursor-pointer group hover:-translate-y-1 transition-transform duration-200"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] bg-[#f4f4f5] overflow-hidden">
                      <img
                        src={property.media[0]?.url_medium}
                        alt={property.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* GPS Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-[#18181b] text-[10px] font-medium py-1.5 px-3 rounded-full border border-[#e8e8ea]">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#09090b] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#09090b]"></span>
                          </span>
                          GPS
                        </span>
                      </div>
                      {/* Price */}
                      <div className="absolute bottom-3 right-3 bg-[#09090b] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                        {formatPrice(lowestPrice)}/bln
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 text-left">
                      <div className="flex items-center gap-2 mb-2">
                        <AwesomicBadge variant="filled-dark">
                          {property.type === 'kost_campur'
                            ? 'Campur'
                            : property.type === 'kost_putra'
                              ? 'Putra'
                              : 'Putri'}
                        </AwesomicBadge>
                        <span className={`text-[10px] font-medium ${
                          availableRooms > 0 ? 'text-[#006c49]' : 'text-[#ba1a1a]'
                        }`}>
                          {availableRooms > 0 ? `${availableRooms} Tersedia` : 'Penuh'}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-[#18181b] line-clamp-1 mb-1">
                        {property.name}
                      </h4>
                      <p className="text-xs text-[#71717a] flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="line-clamp-1">{property.location.address}</span>
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. CTA SECTION - Dark Panel with Email Capture */}
        <section className="py-12 md:py-20">
          <DarkPanel padding="xl" className="text-center">
            <div className="max-w-xl mx-auto space-y-6">
              <h2 className="text-[32px] md:text-[40px] font-semibold leading-[1.2] text-white">
                Siap cari kost impian?
              </h2>
              <p className="text-[#71717a] text-base">
                Masukkan email untuk menerima update listingan kost terbaru di kotamu.
              </p>
              <AwesomicInput
                placeholder="email@example.com"
                buttonText="Daftar Gratis"
                onSubmit={(email) => console.log('Email submitted:', email)}
                className="max-w-md mx-auto"
              />
              <p className="text-[#52525b] text-xs">
                Gratis, tanpa komitmen. Unsubscribe kapan saja.
              </p>
            </div>
          </DarkPanel>
        </section>

        {/* 7. TRUST INDICATORS */}
        <section className="py-12 pb-8">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 text-[#71717a]">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-[#09090b] text-[#09090b]" />
              <span className="text-sm font-medium">4.9 rating pengguna</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">15,000+ pengguna aktif</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span className="text-sm font-medium">2,500+ kost terverifikasi</span>
            </div>
          </div>
        </section>
      </div>

      {/* 8. PREMIUM SITEMAP FOOTER */}
      <Footer />
    </div>
  );
};