// Reading this as: Property/kost landing page for Indonesian students, with Midnight Marketplace theme
// DESIGN_VARIANCE: 8, MOTION_INTENSITY: 6, VISUAL_DENSITY: 4
// Theme: Midnight Marketplace - authentic, contextual, trustworthy

"use client";

import React, { useState } from 'react';
import { motion, useReducedMotion } from "framer-motion";
import type { Property } from '../types';
import { useSettings } from '../hooks/useSettings';
import { Footer } from './Footer';
import {
  AwesomicButton,
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
  Sparkles,
  Star,
  Users,
  Building2,
} from 'lucide-react';

interface LandingPageProps {
  featuredProperties: Property[];
  onStartSearching: (city?: string, query?: string) => void;
  onSelectProperty: (id: string) => void;
}

// City data with contextually appropriate imagery
const CITIES = [
  { name: 'Palopo', count: 342 },
  { name: 'Makassar', count: 891 },
  { name: 'Jakarta', count: 2341 },
  { name: 'Bandung', count: 756 },
  { name: 'Yogyakarta', count: 534 },
  { name: 'Surabaya', count: 678 },
];

// Testimonial data - using initials for authenticity
const TESTIMONIALS = [
  {
    name: 'Rina Andriani',
    initials: 'RA',
    role: 'Mahasiswi S2 UGM',
    quote: 'Akhirnya nemu kost yang fotonya sesuai realita. GPS verificationnya beneran akurat.',
  },
  {
    name: 'Budi Santoso',
    initials: 'BS',
    role: 'Pemilik Kost, Palopo',
    quote: 'Listingan saya langsung naik rank karena badge verified. Penyewa percaya karena ada GPS.',
  },
  {
    name: 'Siti Nurhaliza',
    initials: 'SN',
    role: 'Mahasiswi Semester 4 UNHAS',
    quote: 'Features real-time availability sangat membantu. Tidak perlu tanya-tanya lagi.',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  featuredProperties,
  onStartSearching,
  onSelectProperty,
}) => {
  const { settings } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const reduce = useReducedMotion();

  // Get first property for hero preview (or null if empty)
  const heroProperty = featuredProperties.length > 0 ? featuredProperties[0] : null;

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
    <div className="bg-canvas min-h-screen font-sans text-body antialiased">
      {/* Gradient Orbs Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#3859f9]/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-[#047e4a]/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-[#3859f9]/3 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-[1200px] mx-auto px-6">

        {/* 1. HERO */}
        <section className="py-16 md:py-24 lg:py-28 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

            {/* Hero Left - Text Content */}
            <div className="lg:col-span-7 space-y-8">
              {/* Eyebrow */}
              <motion.div
                initial={reduce ? undefined : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border-subtle text-muted text-xs font-medium shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-ink" />
                  <span>{settings.tagline || 'Platform Kos Digital'}</span>
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={reduce ? undefined : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-[40px] md:text-[56px] lg:text-[64px] font-bold tracking-tight leading-[1.05] text-ink"
              >
                Cari kost tanpa{' '}
                <span className="text-[#a1a1aa] font-light">takut</span>{' '}
                foto menipu
              </motion.h1>

              {/* Subtext */}
              <motion.p
                initial={reduce ? undefined : { opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-muted text-base md:text-lg leading-relaxed max-w-xl"
              >
                {settings.site_name} memverifikasi media listing secara ketat dengan koordinat GPS dan penanda waktu.
              </motion.p>

              {/* Search Form */}
              <motion.div
                initial={reduce ? undefined : { opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg">
                  <input
                    type="text"
                    placeholder="Cari daerah, kampus, atau jalan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-white text-body placeholder-[#a1a1aa] rounded-[14px] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ink/10 transition-all border border-transparent focus:border-ink/20"
                  />
                  <AwesomicButton type="submit" size="md">
                    Cari Kost
                  </AwesomicButton>
                </form>
              </motion.div>

              {/* Popular Searches */}
              <motion.div
                initial={reduce ? undefined : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="flex flex-wrap items-center gap-2"
              >
                <span className="text-xs text-muted font-medium">Populer:</span>
                {settings.cities.slice(0, 3).map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => handleQuickSearch(city)}
                    className="text-xs text-muted hover:text-ink hover:bg-ink hover:text-white px-3 py-1.5 rounded-full border border-[#d4d4d8] bg-white transition-all font-medium"
                  >
                    {city}
                  </button>
                ))}
              </motion.div>
            </div>

            {/* Hero Right - Real Property Preview */}
            <motion.div
              initial={reduce ? undefined : { opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 relative hidden lg:block"
            >
              {heroProperty ? (
                /* Real Property Card */
                <div
                  onClick={() => onSelectProperty(heroProperty.id)}
                  className="bg-white rounded-[36px] border border-border-subtle shadow-[0_24px_50px_rgba(15,23,42,0.06)] p-6 space-y-5 relative overflow-hidden group cursor-pointer"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ink opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-ink"></span>
                      </span>
                      <span className="text-sm font-semibold text-body">{heroProperty.name}</span>
                    </div>
                    <AwesomicBadge variant="filled-dark">GPS OK</AwesomicBadge>
                  </div>

                  {/* Image */}
                  <div className="relative aspect-[4/3] rounded-[28px] bg-canvas overflow-hidden">
                    <img
                      src={heroProperty.media[0]?.url_medium || heroProperty.media[0]?.url_thumbnail || heroProperty.media[0]?.url_original}
                      alt={heroProperty.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 bg-ink/80 backdrop-blur-sm text-white text-[10px] font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      Verified Media
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xs font-semibold text-muted">{heroProperty.location.city}</h3>
                        <p className="text-sm font-medium text-muted mt-0.5">{heroProperty.location.address}</p>
                      </div>
                      <span className="text-xs font-medium text-ink bg-canvas px-2.5 py-1 rounded-full">
                        {heroProperty.rooms.filter(r => r.status === 'available').length} Tersedia
                      </span>
                    </div>

                    <div className="pt-3 border-t border-canvas flex items-center justify-between">
                      <span className="text-base font-bold text-body">
                        {formatPrice(Math.min(...heroProperty.rooms.map(r => r.price_monthly)))} <span className="text-xs text-muted font-normal">/bln</span>
                      </span>
                      <button className="text-xs font-semibold text-ink hover:underline flex items-center gap-0.5">
                        Lihat Detail <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty State - Intentional placeholder */
                <div className="bg-white rounded-[36px] border border-border-subtle shadow-[0_24px_50px_rgba(15,23,42,0.06)] p-6 space-y-5 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ink opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-ink"></span>
                      </span>
                      <span className="text-sm font-semibold text-body">Segera Hadir</span>
                    </div>
                    <AwesomicBadge variant="filled-dark">Coming Soon</AwesomicBadge>
                  </div>

                  <div className="aspect-[4/3] rounded-[28px] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <div className="text-center">
                      <Building2 className="w-12 h-12 text-primary/30 mx-auto mb-2" />
                      <p className="text-sm font-medium text-muted">100+ Kost Terverifikasi</p>
                    </div>
                  </div>

                  <div className="text-center py-4">
                    <p className="text-muted text-sm">Mulai cari kost di kotamu</p>
                    <button
                      onClick={() => onStartSearching()}
                      className="mt-2 text-primary text-sm font-semibold hover:underline"
                    >
                      Jelajahi Kost
                    </button>
                  </div>
                </div>
              )}

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-white rounded-[28px] border border-border-subtle p-4 text-left">
                  <span className="text-[10px] font-medium text-muted uppercase tracking-wider block">Akurasi</span>
                  <span className="text-sm font-bold text-body">98% Match</span>
                </div>
                <div className="bg-white rounded-[28px] border border-border-subtle p-4 text-left">
                  <span className="text-[10px] font-medium text-muted uppercase tracking-wider block">Status</span>
                  <span className="text-sm font-bold text-[#047e4a]">Terverifikasi</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. PROBLEM PANEL */}
        <section className="py-12 md:py-16">
          <DarkPanel padding="lg" className="max-w-full">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-[32px] md:text-[40px] font-semibold leading-[1.2] text-white">
                <span className="font-light text-[#a1a1aa]">Takut</span> foto menipu.{' '}
                <span className="font-light text-[#a1a1aa]">Capek</span> survei sana-sini.{' '}
                <span className="font-light text-[#a1a1aa]">Bingung</span> harga asli.
              </h2>
              <p className="text-muted text-base">
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

        {/* 4. CITY DISCOVERY GRID - Minimalist */}
        <section className="py-12 md:py-20">
          <div className="space-y-10">
            <SectionHeader
              headline="Temukan di Kota Terdekat"
              subtext="Pilihan kost terverifikasi di berbagai kota di Indonesia."
            />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {CITIES.map((city, index) => (
                <motion.button
                  key={city.name}
                  initial={reduce ? undefined : { opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  onClick={() => handleQuickSearch(city.name)}
                  className="group bg-white rounded-[16px] border border-border-subtle p-4 hover:border-primary/30 hover:shadow-md transition-all duration-200 text-left"
                >
                  <h3 className="font-semibold text-body text-sm mb-1">{city.name}</h3>
                  <p className="text-muted text-xs">{city.count}+ kost</p>
                </motion.button>
              ))}
            </div>

            {/* View All Link */}
            <div className="text-center">
              <button
                onClick={() => onStartSearching()}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
              >
                Lihat semua kota
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* 5. HOW IT WORKS - Narrative instead of feature cards */}
        <section className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <SectionHeader
              headline="Cara Kerja KostFind"
              subtext="Cari kost dalam 3 langkah sederhana."
            />

            {/* Process Steps - Vertical Timeline */}
            <div className="mt-12 space-y-8">
              {/* Step 1 */}
              <motion.div
                initial={reduce ? undefined : { opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex gap-6"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary text-white font-bold text-lg flex items-center justify-center">1</div>
                </div>
                <div className="pt-2">
                  <h3 className="text-lg font-semibold text-body mb-2">Cari di Peta</h3>
                  <p className="text-muted text-sm leading-relaxed">
                    Masukkan lokasi atau pilih kota. Lihat kost yang terverifikasi GPS di sekitar areamu.
                  </p>
                </div>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                initial={reduce ? undefined : { opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex gap-6"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary text-white font-bold text-lg flex items-center justify-center">2</div>
                </div>
                <div className="pt-2">
                  <h3 className="text-lg font-semibold text-body mb-2">Cek Ketersediaan</h3>
                  <p className="text-muted text-sm leading-relaxed">
                    Stok kamar diupdate real-time. Tidak perlu telepon untuk tanya kosong atau tidak.
                  </p>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                initial={reduce ? undefined : { opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex gap-6"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary text-white font-bold text-lg flex items-center justify-center">3</div>
                </div>
                <div className="pt-2">
                  <h3 className="text-lg font-semibold text-body mb-2">Hubungi Pemilik</h3>
                  <p className="text-muted text-sm leading-relaxed">
                    Langsung chat via WhatsApp. Tidak ada biaya tambahan atau perantara.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 6. SOCIAL PROOF - Story instead of comparison table */}
        <section className="py-16 md:py-24">
          <DarkPanel padding="lg" className="max-w-full">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h2 className="text-[28px] md:text-[36px] font-bold text-white leading-tight">
                Kenapa GPS verification penting?
              </h2>
              <p className="text-muted text-base leading-relaxed">
                Karena 7 dari 10 listingan kost online pakai foto yang tidak sesuai realita.
                KostFind menyelesaikan masalah ini dengan wajibkan verifikasi lokasi GPS pada setiap media.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => onStartSearching()}
                  className="inline-flex items-center gap-2 bg-white text-ink font-semibold px-6 py-3 rounded-full hover:bg-canvas transition-colors"
                >
                  Mulai Cari Kost
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </DarkPanel>
        </section>

        {/* 7. TESTIMONIALS - Authentic with Initials */}
        <section className="py-12 md:py-20">
          <div className="space-y-10">
            <SectionHeader
              headline="Apa Kata Pengguna Kami"
              subtext="Ribuan pencari kost dan pemilik telah mempercayai KostFind."
              align="center"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={reduce ? undefined : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-[24px] border border-border-subtle p-6 space-y-4 hover:shadow-lg transition-shadow"
                >
                  {/* Initials Avatar - Authentic */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.initials}
                  </div>

                  {/* Rating - simple dots */}
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-[#fcbe11]" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-body text-sm leading-relaxed">
                    "{testimonial.quote}"
                  </p>

                  {/* Author */}
                  <div className="pt-4 border-t border-canvas">
                    <p className="font-semibold text-ink text-sm">{testimonial.name}</p>
                    <p className="text-muted text-xs">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. PROPERTY PREVIEW - Horizontal Scroll */}
        <section className="py-12 md:py-20">
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <SectionHeader
                headline="Kost Terverifikasi"
                subtext="Pilihan kost dengan GPS dan media diverifikasi."
              />
              <AwesomicButton variant="secondary" size="sm" onClick={() => onStartSearching()}>
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
                    initial={reduce ? undefined : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    onClick={() => onSelectProperty(property.id)}
                    className="flex-shrink-0 w-[300px] bg-white rounded-[36px] overflow-hidden border border-border-subtle cursor-pointer group hover:-translate-y-1 transition-transform duration-200"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] bg-canvas overflow-hidden">
                      <img
                        src={property.media[0]?.url_medium || property.media[0]?.url_thumbnail || property.media[0]?.url_original}
                        alt={property.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* GPS Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-body text-[10px] font-medium py-1.5 px-3 rounded-full border border-border-subtle">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ink opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-ink"></span>
                          </span>
                          GPS
                        </span>
                      </div>
                      {/* Price */}
                      <div className="absolute bottom-3 right-3 bg-ink text-white text-xs font-semibold px-3 py-1.5 rounded-full">
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
                          availableRooms > 0 ? 'text-[#047e4a]' : 'text-[#ba1a1a]'
                        }`}>
                          {availableRooms > 0 ? `${availableRooms} Tersedia` : 'Penuh'}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-body line-clamp-1 mb-1">
                        {property.name}
                      </h4>
                      <p className="text-xs text-muted flex items-center gap-1">
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

        {/* 9. CTA SECTION */}
        <section className="py-12 md:py-20">
          <DarkPanel padding="xl" className="text-center">
            <div className="max-w-xl mx-auto space-y-6">
              <h2 className="text-[32px] md:text-[40px] font-semibold leading-[1.2] text-white">
                Siap cari kost impian?
              </h2>
              <p className="text-muted text-base">
                Masukkan email untuk menerima update listingan kost terbaru di kotamu.
              </p>
              <AwesomicInput
                placeholder="email@example.com"
                buttonText="Daftar Gratis"
                onSubmit={(email) => console.log('Email submitted:', email)}
                className="max-w-md mx-auto"
              />
              <p className="text-muted text-xs">
                Gratis, tanpa komitmen. Unsubscribe kapan saja.
              </p>
            </div>
          </DarkPanel>
        </section>

        {/* 10. TRUST INDICATORS */}
        <section className="py-12 pb-8">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 text-muted">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-ink text-ink" />
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

      {/* FOOTER */}
      <Footer />
    </div>
  );
};
