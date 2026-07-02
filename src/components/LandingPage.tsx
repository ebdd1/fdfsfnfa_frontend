// Reading this as: Property/kost landing page for Indonesian students, with Midnight Marketplace theme
// DESIGN_VARIANCE: 8, MOTION_INTENSITY: 6, VISUAL_DENSITY: 4
// Theme: Midnight Marketplace - light theme with gradient orbs, dark accents, modern trustworthy feel

"use client";

import React, { useState } from 'react';
import { motion, useReducedMotion } from "framer-motion";
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
  Play,
  Quote,
  ChevronRight,
} from 'lucide-react';

interface LandingPageProps {
  featuredProperties: Property[];
  onStartSearching: (city?: string, query?: string) => void;
  onSelectProperty: (id: string) => void;
}

// City data for discovery grid
const CITIES = [
  { name: 'Palopo', count: 342, image: 'https://images.unsplash.com/photo-1580422825099-5a0fa3e6e26c?w=400&q=80' },
  { name: 'Makassar', count: 891, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
  { name: 'Jakarta', count: 2341, image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&q=80' },
  { name: 'Bandung', count: 756, image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80' },
  { name: 'Yogyakarta', count: 534, image: 'https://images.unsplash.com/photo-1555992828-ca4dbe41d294?w=400&q=80' },
  { name: 'Surabaya', count: 678, image: 'https://images.unsplash.com/photo-1580508174046-170816f65662?w=400&q=80' },
];

// Testimonial data
const TESTIMONIALS = [
  {
    name: 'Rina Andriani',
    role: 'Mahasiswi S2 UGM',
    quote: 'Akhirnya nemu kost yang fotonya sesuai realita. GPS verificationnya beneran akurat, tidak mengecewakan.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    rating: 5,
  },
  {
    name: 'Budi Santoso',
    role: 'Pemilik Kost, Palopo',
    quote: 'Listingan saya langsung naik rank karena badge verified. Penyewa percaya karena ada GPS verification.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    rating: 5,
  },
  {
    name: 'Siti Nurhaliza',
    role: 'Mahasiswi Semester 4 UNHAS',
    quote: 'Features real-time availability sangat membantu. Tidak perlu tanya-tanya lagi apakah masih kosong.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    rating: 5,
  },
];

// Comparison data
const COMPARISONS = [
  {
    title: 'Verifikasi Lokasi',
    kostfind: '100% GPS Match',
    others: 'Tanpa verifikasi',
    icon: MapPin,
  },
  {
    title: 'Ketersediaan',
    kostfind: 'Real-time update',
    others: 'Data outdated',
    icon: TrendingUp,
  },
  {
    title: 'Komunikasi',
    kostfind: 'Langsung ke pemilik',
    others: 'Lewat broker',
    icon: CircleCheck,
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
      {/* Gradient Orbs Background - Midnight Marketplace Effect */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#3859f9]/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-[#047e4a]/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-[#3859f9]/3 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-[1200px] mx-auto px-6">

        {/* 1. HERO - Asymmetric Split with Bento Preview */}
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

              {/* Headline - Weight Contrast Typography */}
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

            {/* Hero Right - Bento Preview Card */}
            <motion.div
              initial={reduce ? undefined : { opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 relative hidden lg:block"
            >
              {/* Main Bento Card */}
              <div className="bg-white rounded-[36px] border border-border-subtle shadow-[0_24px_50px_rgba(15,23,42,0.06)] p-6 space-y-5 relative overflow-hidden group">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ink opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-ink"></span>
                    </span>
                    <span className="text-sm font-semibold text-body">Kost Leari Ana</span>
                  </div>
                  <AwesomicBadge variant="filled-dark">GPS OK</AwesomicBadge>
                </div>

                {/* Image */}
                <div className="relative aspect-[4/3] rounded-[28px] bg-canvas overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80"
                    alt="Kost Premium di Wara"
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
                      <h3 className="text-xs font-semibold text-muted">Wara, Kota Palopo</h3>
                      <p className="text-sm font-medium text-muted mt-0.5">200m dari Universitas Cokroaminoto</p>
                    </div>
                    <span className="text-xs font-medium text-ink bg-canvas px-2.5 py-1 rounded-full">2 Tersedia</span>
                  </div>

                  <div className="pt-3 border-t border-canvas flex items-center justify-between">
                    <span className="text-base font-bold text-body">Rp 2.100.000 <span className="text-xs text-muted font-normal">/bln</span></span>
                    <button
                      onClick={() => onStartSearching('Palopo')}
                      className="text-xs font-semibold text-ink hover:underline flex items-center gap-0.5"
                    >
                      Hubungi Pemilik <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Row - Bento Style */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-white rounded-[28px] border border-border-subtle p-4 text-left">
                  <span className="text-[10px] font-medium text-muted uppercase tracking-wider block">Akurasi</span>
                  <span className="text-sm font-bold text-body">100% Cocok</span>
                </div>
                <div className="bg-white rounded-[28px] border border-border-subtle p-4 text-left">
                  <span className="text-[10px] font-medium text-muted uppercase tracking-wider block">Status</span>
                  <span className="text-sm font-bold text-[#047e4a]">Terverifikasi</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. PROBLEM PANEL - Dark Surface */}
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

        {/* 4. CITY DISCOVERY GRID */}
        <section className="py-12 md:py-20">
          <div className="space-y-10">
            <SectionHeader
              headline="Temukan di Kota Terdekat"
              subtext="Pilihan kost terverifikasi di berbagai kota di Indonesia."
            />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {CITIES.map((city, index) => (
                <motion.button
                  key={city.name}
                  initial={reduce ? undefined : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  onClick={() => handleQuickSearch(city.name)}
                  className="group relative bg-white rounded-[24px] overflow-hidden border border-border-subtle hover:border-primary/30 hover:shadow-lg transition-all duration-300 text-left"
                >
                  {/* City Image */}
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={city.image}
                      alt={`Kost di ${city.name}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-sm mb-1">{city.name}</h3>
                    <p className="text-white/70 text-xs">{city.count}+ kost tersedia</p>
                  </div>
                  {/* Hover Arrow */}
                  <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-4 h-4 text-body" />
                  </div>
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

        {/* 5. FEATURE CARDS - Bento Grid */}
        <section className="py-12 md:py-20">
          <div className="space-y-10">
            <SectionHeader
              headline="Kenapa memilih KostFind"
              subtext="Platform yang menghubungkan pencari kos dengan pemilik secara transparan dan real-time."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <AwesomicCard hoverable>
                <div className="w-12 h-12 rounded-[16px] bg-canvas flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-ink" />
                </div>
                <h3 className="text-lg font-semibold text-body mb-2">Verifikasi GPS</h3>
                <p className="text-sm text-muted leading-relaxed">
                  Koordinat kamera wajib cocok dengan lokasi peta. Anti foto menipu.
                </p>
              </AwesomicCard>

              {/* Feature 2 */}
              <AwesomicCard hoverable>
                <div className="w-12 h-12 rounded-[16px] bg-canvas flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-ink" />
                </div>
                <h3 className="text-lg font-semibold text-body mb-2">Ketersediaan Real-Time</h3>
                <p className="text-sm text-muted leading-relaxed">
                  Stok kamar diupdate langsung oleh pengelola setiap hari.
                </p>
              </AwesomicCard>

              {/* Feature 3 */}
              <AwesomicCard hoverable className="md:col-span-2 lg:col-span-1">
                <div className="w-12 h-12 rounded-[16px] bg-canvas flex items-center justify-center mb-4">
                  <CircleCheck className="w-6 h-6 text-ink" />
                </div>
                <h3 className="text-lg font-semibold text-body mb-2">Bebas Komisi</h3>
                <p className="text-sm text-muted leading-relaxed">
                  Hubungi langsung pemilik kost tanpa perantara dan biaya tambahan.
                </p>
              </AwesomicCard>
            </div>
          </div>
        </section>

        {/* 6. COMPARISON TABLE */}
        <section className="py-12 md:py-20">
          <DarkPanel padding="lg" className="max-w-full">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-[28px] md:text-[36px] font-bold text-white mb-3">
                  KostFind vs Cara Lama
                </h2>
                <p className="text-muted text-sm">
                  Bandingkan pengalaman mencari kost dengan dan tanpa KostFind
                </p>
              </div>

              <div className="space-y-4">
                {COMPARISONS.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={reduce ? undefined : { opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center justify-between bg-white/5 rounded-[16px] p-4 md:p-5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-[12px] bg-primary/20 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-white font-medium text-sm md:text-base">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-4 md:gap-8">
                      <div className="text-right">
                        <span className="text-[#10b981] font-semibold text-xs md:text-sm block">{item.kostfind}</span>
                        <span className="text-muted text-[10px] md:text-xs">KostFind</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[#ef4444] font-semibold text-xs md:text-sm block">{item.others}</span>
                        <span className="text-muted text-[10px] md:text-xs">Cara Lama</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </DarkPanel>
        </section>

        {/* 7. VIDEO DEMO SECTION */}
        <section className="py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            <SectionHeader
              headline="Lihat Cara Kerjanya"
              subtext="Video singkat ini menunjukkan bagaimana KostFind membantu Anda menemukan kost ideal."
              align="center"
            />

            <motion.div
              initial={reduce ? undefined : { opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative mt-8 rounded-[32px] overflow-hidden bg-black aspect-video max-w-3xl mx-auto group cursor-pointer"
            >
              {/* Thumbnail Image */}
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80"
                alt="KostFind Demo Video"
                className="w-full h-full object-cover opacity-70 group-hover:opacity-60 transition-opacity"
              />

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-8 h-8 md:w-10 md:h-10 text-body ml-1" fill="currentColor" />
                </div>
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Caption */}
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white font-semibold text-sm md:text-base">Demo: Cari Kost dalam 3 Langkah</p>
                <p className="text-white/70 text-xs mt-1">Durasi: 1 menit</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 8. TESTIMONIALS */}
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
                  {/* Quote Icon */}
                  <Quote className="w-8 h-8 text-primary/20" />

                  {/* Rating */}
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#fcbe11] text-[#fcbe11]" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-body text-sm leading-relaxed italic">
                    "{testimonial.quote}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-canvas">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-ink text-sm">{testimonial.name}</p>
                      <p className="text-muted text-xs">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. PROPERTY PREVIEW - Horizontal Scroll Tiles */}
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
                        src={property.media[0]?.url_medium}
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

        {/* 10. CTA SECTION */}
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

        {/* 11. TRUST INDICATORS */}
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

      {/* 12. FOOTER */}
      <Footer />
    </div>
  );
};
