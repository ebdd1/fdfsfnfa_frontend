// Dark Premium Landing Page - No white backgrounds
// Theme: Midnight Premium - Black canvas with orange accents
// DESIGN_VARIANCE: 9, MOTION_INTENSITY: 6, VISUAL_DENSITY: 5

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
  Star,
  Users,
  Building2,
  Home,
} from 'lucide-react';

interface LandingPageProps {
  featuredProperties: Property[];
  onStartSearching: (city?: string, query?: string) => void;
  onSelectProperty: (id: string) => void;
}

// City data
const CITIES = [
  { name: 'Palopo', count: 342 },
  { name: 'Makassar', count: 891 },
  { name: 'Jakarta', count: 2341 },
  { name: 'Bandung', count: 756 },
  { name: 'Yogyakarta', count: 534 },
  { name: 'Surabaya', count: 678 },
];

// Testimonial data
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
    <div className="bg-[#09090B] min-h-screen font-sans text-[#E5E5E5] antialiased">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#FF6B35]/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-[#FF6B35]/3 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-[#FF6B35]/2 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
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
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#27272A] border border-[rgba(255,255,255,0.1)] text-[#A1A1AA] text-xs font-medium">
                  <Home className="w-3.5 h-3.5 text-[#FF6B35]" />
                  <span>{settings.tagline || 'Kost Terverifikasi GPS'}</span>
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={reduce ? undefined : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-[40px] md:text-[56px] lg:text-[64px] font-bold tracking-tight leading-[1.05] text-[#FAFAFA]"
              >
                Cari kost tanpa{' '}
                <span className="text-[#FF6B35]">takut</span>{' '}
                foto menipu
              </motion.h1>

              {/* Subtext */}
              <motion.p
                initial={reduce ? undefined : { opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-[#A1A1AA] text-base md:text-lg leading-relaxed max-w-xl"
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
                    className="flex-1 bg-[#18181B] text-[#E5E5E5] placeholder-[#71717A] rounded-[14px] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF6B35]/30 transition-all border border-[rgba(255,255,255,0.1)] focus:border-[#FF6B35]/50"
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
                <span className="text-xs text-[#71717A] font-medium">Populer:</span>
                {settings.cities.slice(0, 3).map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => handleQuickSearch(city)}
                    className="text-xs text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#27272A] hover:border-[#FF6B35]/30 px-3 py-1.5 rounded-full border border-[rgba(255,255,255,0.1)] bg-[#18181B] transition-all font-medium"
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
                  className="bg-[#18181B] rounded-[36px] border border-[rgba(255,255,255,0.08)] shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.4)] p-6 space-y-5 relative overflow-hidden group cursor-pointer"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B35] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6B35]"></span>
                      </span>
                      <span className="text-sm font-semibold text-[#FAFAFA]">{heroProperty.name}</span>
                    </div>
                    <AwesomicBadge variant="filled-dark">GPS OK</AwesomicBadge>
                  </div>

                  {/* Image */}
                  <div className="relative aspect-[4/3] rounded-[28px] bg-[#27272A] overflow-hidden">
                    <img
                      src={heroProperty.media[0]?.url_medium || heroProperty.media[0]?.url_thumbnail || heroProperty.media[0]?.url_original}
                      alt={heroProperty.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 bg-[#18181B]/80 backdrop-blur-sm text-[#FAFAFA] text-[10px] font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-[rgba(255,255,255,0.1)]">
                      <Shield className="w-3.5 h-3.5" />
                      Verified Media
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xs font-semibold text-[#A1A1AA]">{heroProperty.location.city}</h3>
                        <p className="text-sm font-medium text-[#71717A] mt-0.5">{heroProperty.location.address}</p>
                      </div>
                      <span className="text-xs font-medium text-[#FAFAFA] bg-[#27272A] px-2.5 py-1 rounded-full border border-[rgba(255,255,255,0.1)]">
                        {heroProperty.rooms.filter(r => r.status === 'available').length} Tersedia
                      </span>
                    </div>

                    <div className="pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between">
                      <span className="text-base font-bold text-[#FAFAFA]">
                        {formatPrice(Math.min(...heroProperty.rooms.map(r => r.price_monthly)))} <span className="text-xs text-[#71717A] font-normal">/bln</span>
                      </span>
                      <button className="text-xs font-semibold text-[#FF6B35] hover:underline flex items-center gap-0.5">
                        Lihat Detail <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty State */
                <div className="bg-[#18181B] rounded-[36px] border border-[rgba(255,255,255,0.08)] shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.4)] p-6 space-y-5 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B35] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6B35]"></span>
                      </span>
                      <span className="text-sm font-semibold text-[#FAFAFA]">Segera Hadir</span>
                    </div>
                    <AwesomicBadge variant="filled-dark">Coming Soon</AwesomicBadge>
                  </div>

                  <div className="aspect-[4/3] rounded-[28px] bg-gradient-to-br from-[#FF6B35]/10 to-[#FF6B35]/5 flex items-center justify-center border border-[rgba(255,107,53,0.2)]">
                    <div className="text-center">
                      <Building2 className="w-12 h-12 text-[#FF6B35]/30 mx-auto mb-2" />
                      <p className="text-sm font-medium text-[#71717A]">100+ Kost Terverifikasi</p>
                    </div>
                  </div>

                  <div className="text-center py-4">
                    <p className="text-[#71717A] text-sm">Mulai cari kost di kotamu</p>
                    <button
                      onClick={() => onStartSearching()}
                      className="mt-2 text-[#FF6B35] text-sm font-semibold hover:underline"
                    >
                      Jelajahi Kost
                    </button>
                  </div>
                </div>
              )}

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-[#18181B] rounded-[28px] border border-[rgba(255,255,255,0.08)] p-4 text-left">
                  <span className="text-[10px] font-medium text-[#71717A] uppercase tracking-wider block">Akurasi</span>
                  <span className="text-sm font-bold text-[#FAFAFA]">98% Match</span>
                </div>
                <div className="bg-[#18181B] rounded-[28px] border border-[rgba(255,255,255,0.08)] p-4 text-left">
                  <span className="text-[10px] font-medium text-[#71717A] uppercase tracking-wider block">Status</span>
                  <span className="text-sm font-bold text-[#10B981]">Terverifikasi</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. PROBLEM PANEL */}
        <section className="py-12 md:py-16">
          <DarkPanel padding="lg" className="max-w-full">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-[32px] md:text-[40px] font-semibold leading-[1.2] text-[#FAFAFA]">
                <span className="font-light text-[#71717A]">Takut</span> foto menipu.{' '}
                <span className="font-light text-[#71717A]">Capek</span> survei sana-sini.{' '}
                <span className="font-light text-[#71717A]">Bingung</span> harga asli.
              </h2>
              <p className="text-[#A1A1AA] text-base">
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

        {/* 4. CITY DISCOVERY GRID */}
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
                  className="group bg-[#18181B] rounded-[16px] border border-[rgba(255,255,255,0.08)] p-4 hover:border-[#FF6B35]/30 hover:shadow-[0_0_24px_rgba(255,107,53,0.1)] transition-all duration-200 text-left"
                >
                  <h3 className="font-semibold text-[#FAFAFA] text-sm mb-1">{city.name}</h3>
                  <p className="text-[#71717A] text-xs">{city.count}+ kost</p>
                </motion.button>
              ))}
            </div>

            {/* View All Link */}
            <div className="text-center">
              <button
                onClick={() => onStartSearching()}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF6B35] hover:text-[#E85A28] transition-colors"
              >
                Lihat semua kota
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* 5. HOW IT WORKS */}
        <section className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <SectionHeader
              headline="Cara Kerja KostFind"
              subtext="Cari kost dalam 3 langkah sederhana."
            />

            {/* Process Steps */}
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
                  <div className="w-12 h-12 rounded-full bg-[#FF6B35] text-white font-bold text-lg flex items-center justify-center">1</div>
                </div>
                <div className="pt-2">
                  <h3 className="text-lg font-semibold text-[#FAFAFA] mb-2">Cari di Peta</h3>
                  <p className="text-[#A1A1AA] text-sm leading-relaxed">
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
                  <div className="w-12 h-12 rounded-full bg-[#FF6B35] text-white font-bold text-lg flex items-center justify-center">2</div>
                </div>
                <div className="pt-2">
                  <h3 className="text-lg font-semibold text-[#FAFAFA] mb-2">Cek Ketersediaan</h3>
                  <p className="text-[#A1A1AA] text-sm leading-relaxed">
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
                  <div className="w-12 h-12 rounded-full bg-[#FF6B35] text-white font-bold text-lg flex items-center justify-center">3</div>
                </div>
                <div className="pt-2">
                  <h3 className="text-lg font-semibold text-[#FAFAFA] mb-2">Hubungi Pemilik</h3>
                  <p className="text-[#A1A1AA] text-sm leading-relaxed">
                    Langsung chat via WhatsApp. Tidak ada biaya tambahan atau perantara.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 6. SOCIAL PROOF */}
        <section className="py-16 md:py-24">
          <DarkPanel padding="lg" className="max-w-full">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h2 className="text-[28px] md:text-[36px] font-bold text-[#FAFAFA] leading-tight">
                Kenapa GPS verification penting?
              </h2>
              <p className="text-[#A1A1AA] text-base leading-relaxed">
                Karena 7 dari 10 listingan kost online pakai foto yang tidak sesuai realita.
                KostFind menyelesaikan masalah ini dengan wajibkan verifikasi lokasi GPS pada setiap media.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => onStartSearching()}
                  className="inline-flex items-center gap-2 bg-[#FF6B35] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#E85A28] transition-colors shadow-[0_0_24px_rgba(255,107,53,0.3)]"
                >
                  Mulai Cari Kost
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </DarkPanel>
        </section>

        {/* 7. TESTIMONIALS */}
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
                  className="bg-[#18181B] rounded-[24px] border border-[rgba(255,255,255,0.08)] p-6 space-y-4 hover:border-[rgba(255,255,255,0.12)] transition-all"
                >
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#E85A28] flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.initials}
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-[#E5E5E5] text-sm leading-relaxed">
                    "{testimonial.quote}"
                  </p>

                  {/* Author */}
                  <div className="pt-4 border-t border-[rgba(255,255,255,0.06)]">
                    <p className="font-semibold text-[#FAFAFA] text-sm">{testimonial.name}</p>
                    <p className="text-[#71717A] text-xs">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. PROPERTY PREVIEW */}
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

            {/* Horizontal Scroll */}
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
                    className="flex-shrink-0 w-[300px] bg-[#18181B] rounded-[36px] overflow-hidden border border-[rgba(255,255,255,0.08)] cursor-pointer group hover:-translate-y-1 hover:border-[rgba(255,255,255,0.15)] transition-all duration-200"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] bg-[#27272A] overflow-hidden">
                      <img
                        src={property.media[0]?.url_medium || property.media[0]?.url_thumbnail || property.media[0]?.url_original}
                        alt={property.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* GPS Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="flex items-center gap-1.5 bg-[#18181B]/90 backdrop-blur-sm text-[#FAFAFA] text-[10px] font-medium py-1.5 px-3 rounded-full border border-[rgba(255,255,255,0.1)]">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B35] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#FF6B35]"></span>
                          </span>
                          GPS
                        </span>
                      </div>
                      {/* Price */}
                      <div className="absolute bottom-3 right-3 bg-[#18181B] text-[#FAFAFA] text-xs font-semibold px-3 py-1.5 rounded-full border border-[rgba(255,255,255,0.1)]">
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
                          availableRooms > 0 ? 'text-[#10B981]' : 'text-[#EF4444]'
                        }`}>
                          {availableRooms > 0 ? `${availableRooms} Tersedia` : 'Penuh'}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-[#FAFAFA] line-clamp-1 mb-1">
                        {property.name}
                      </h4>
                      <p className="text-xs text-[#71717A] flex items-center gap-1">
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
              <h2 className="text-[32px] md:text-[40px] font-semibold leading-[1.2] text-[#FAFAFA]">
                Siap cari kost impian?
              </h2>
              <p className="text-[#A1A1AA] text-base">
                Masukkan email untuk menerima update listingan kost terbaru di kotamu.
              </p>
              <AwesomicInput
                placeholder="email@example.com"
                buttonText="Daftar Gratis"
                onSubmit={(email) => console.log('Email submitted:', email)}
                className="max-w-md mx-auto"
              />
              <p className="text-[#71717A] text-xs">
                Gratis, tanpa komitmen. Unsubscribe kapan saja.
              </p>
            </div>
          </DarkPanel>
        </section>

        {/* 10. TRUST INDICATORS */}
        <section className="py-12 pb-8">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 text-[#A1A1AA]">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
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
