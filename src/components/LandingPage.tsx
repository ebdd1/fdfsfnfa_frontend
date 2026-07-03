// Premium Luxury Landing Page
// Hero dengan gambar background + 4 section baru

"use client";

import React, { useState } from 'react';
import type { Property } from '../types';

interface LandingPageProps {
  siteName: string;
  featuredProperties: Property[];
  onStartSearching: (city?: string, query?: string) => void;
}

// Data untuk sections
const WHY_CHOOSE_US = [
  {
    icon: 'verified',
    title: 'Verified Properties',
    description: 'Setiap kost diverifikasi langsung oleh tim kami sebelum dipublikasikan.',
  },
  {
    icon: 'shield',
    title: 'Transaksi Aman',
    description: 'Pembayaran terjamin melalui sistem escrow yang aman dan terpercaya.',
  },
  {
    icon: 'support_agent',
    title: 'Support 24/7',
    description: 'Tim customer service siap membantu Anda kapan saja.',
  },
  {
    icon: 'location_on',
    title: 'Lokasi Strategis',
    description: 'Kost di lokasi strategis dekat kampus, kantor, dan transportasi.',
  },
];

const POPULAR_CITIES = [
  { name: 'Jakarta', count: 2341, image: 'https://images.unsplash.com/photo-1555834959-0a8858ca0dc0?w=600' },
  { name: 'Bandung', count: 756, image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=600' },
  { name: 'Surabaya', count: 678, image: 'https://images.unsplash.com/photo-1565610222536-ef125e59ef4e?w=600' },
  { name: 'Yogyakarta', count: 534, image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600' },
  { name: 'Makassar', count: 891, image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600' },
  { name: 'Semarang', count: 423, image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: 'search',
    title: 'Cari Kost',
    description: 'Gunakan filter untuk menemukan kost sesuai lokasi, budget, dan fasilitas yang Anda butuhkan.',
  },
  {
    step: '02',
    icon: 'visibility',
    title: 'Kunjugi Properti',
    description: 'Schedule kunjungan langsung ke kost yang Anda pilih dan lihat kondisi sebenarnya.',
  },
  {
    step: '03',
    icon: 'home',
    title: 'Pindah & Huni',
    description: 'Booking online, signing kontrak, dan mulai tinggal di kost baru Anda.',
  },
];

const getTestimonials = (siteName: string) => [
  {
    name: 'Rina Marlina',
    role: 'Mahasiswa',
    city: 'Jakarta',
    text: `Dulu cari kost ribet banget, tapi sejak pakai ${siteName} semuanya jadi lebih mudah. Kost-nya juga berkualitas!`,
    rating: 5,
    avatar: 'RM',
  },
  {
    name: 'Budi Santoso',
    role: 'Pekerja Swasta',
    city: 'Bandung',
    text: 'Aplikasi yang sangat membantu. Proses booking cepat dan transparent. Recommended!',
    rating: 5,
    avatar: 'BS',
  },
  {
    name: 'Siti Nurhaliza',
    role: 'Freelancer',
    city: 'Yogyakarta',
    text: `Fitur map-nya sangat membantu saya menemukan kost di lokasi strategis. Thank you ${siteName}!`,
    rating: 5,
    avatar: 'SN',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  siteName,
  featuredProperties,
  onStartSearching,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartSearching(undefined, searchQuery || undefined);
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
    <div className="min-h-screen relative bg-background">
      {/* Pattern Background */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(#003594 0.5px, transparent 0.5px)',
          backgroundSize: '24px 24px',
        }}
      />

      <main className="relative z-10">
        {/* 1. HERO SECTION - Gambar Background dengan Overlay */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          {/* Background Image dengan Overlay Gradient */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1920&q=80"
              alt="Kost premium interior"
              className="w-full h-full object-cover"
            />
            {/* Overlay gradient - transparant sehingga gambar visible tapi teks tetap readable */}
            <div className="absolute inset-0 bg-gradient-to-r from-on-surface/90 via-on-surface/70 to-on-surface/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-on-surface/60 via-transparent to-transparent" />
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] pointer-events-none" />
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-32 w-full">
            <div className="max-w-3xl">
              {/* Badge */}
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-xs font-bold mb-8 border border-white/20">
                <span className="material-symbols-outlined text-base text-white" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                Platform Kost #1 di Indonesia
              </span>

              {/* Headline */}
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-white mb-8 leading-[1.1]">
                Temukan Kost Impian Anda dengan{' '}
                <span className="text-primary-light">Mudah & Aman</span>
              </h1>

              {/* Subtitle */}
              <p className="font-body text-lg md:text-xl text-white/80 max-w-2xl mb-14 leading-relaxed">
                Ribuan kost berkualitas di seluruh Indonesia. Diverifikasi, aman, dan langsung bisa dipesan online.
              </p>

              {/* Search Bar - Glass Card */}
              <div className="glass-card rounded-2xl p-3 flex flex-col md:flex-row gap-2 max-w-5xl backdrop-blur-xl bg-white/10 border border-white/20">
                {/* Lokasi Input */}
                <div className="flex-1 relative flex items-center hover:bg-white/10 rounded-xl p-4 transition-all cursor-text group">
                  <span className="material-symbols-outlined text-base text-white/60 group-focus-within:text-white mr-4 scale-110">location_on</span>
                  <div className="flex flex-col flex-1 text-left">
                    <label className="text-[10px] uppercase font-bold text-white/60 tracking-widest">Lokasi</label>
                    <input
                      className="bg-transparent border-none p-0 text-base font-body font-semibold text-white w-full placeholder:text-white/40 outline-none focus:ring-0"
                      placeholder="Cari kota atau area..."
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="hidden md:block w-px bg-white/20 my-4" />

                {/* Check-in Input */}
                <div className="flex-1 relative flex items-center hover:bg-white/10 rounded-xl p-4 transition-all cursor-text group">
                  <span className="material-symbols-outlined text-base text-white/60 group-focus-within:text-white mr-4 scale-110">calendar_today</span>
                  <div className="flex flex-col flex-1 text-left">
                    <label className="text-[10px] uppercase font-bold text-white/60 tracking-widest">Check-in</label>
                    <span className="text-base font-body font-semibold text-white/40">Pilih Tanggal</span>
                  </div>
                </div>

                <div className="hidden md:block w-px bg-white/20 my-4" />

                {/* Penghuni Input */}
                <div className="flex-1 relative flex items-center hover:bg-white/10 rounded-xl p-4 transition-all cursor-text group">
                  <span className="material-symbols-outlined text-base text-white/60 group-focus-within:text-white mr-4 scale-110">group</span>
                  <div className="flex flex-col flex-1 text-left">
                    <label className="text-[10px] uppercase font-bold text-white/60 tracking-widest">Penghuni</label>
                    <span className="text-base font-body font-semibold text-white/40">1 Orang</span>
                  </div>
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearchSubmit}
                  className="bg-primary hover:bg-primary/95 text-white rounded-xl px-8 py-4 flex items-center justify-center font-body text-sm font-semibold shadow-lg hover:shadow-xl transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-base mr-2">search</span>
                  Cari
                </button>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/20">
                <div>
                  <p className="font-display text-3xl md:text-4xl text-white font-bold">15K+</p>
                  <p className="font-body text-sm text-white/60">Kost Tersedia</p>
                </div>
                <div>
                  <p className="font-display text-3xl md:text-4xl text-white font-bold">50+</p>
                  <p className="font-body text-sm text-white/60">Kota Covered</p>
                </div>
                <div>
                  <p className="font-display text-3xl md:text-4xl text-white font-bold">98%</p>
                  <p className="font-body text-sm text-white/60">User Puas</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED PROPERTIES - Property Cards */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop">
          <div className="max-w-container-max mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
              <div className="max-w-xl mb-6 md:mb-0">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4">
                  Kost Pilihan
                </span>
                <h2 className="font-display text-3xl md:text-5xl text-on-background mb-3">
                  Properti <span className="italic font-normal">Terpopuler</span>
                </h2>
                <p className="font-body text-on-surface-variant/70">
                  Pilihan kost terbaik yang paling banyak dilihat pengguna kami.
                </p>
              </div>
              <button className="flex items-center gap-2 text-primary font-body font-semibold text-sm hover:gap-3 transition-all">
                Lihat Semua <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.slice(0, 6).map((property) => {
                const lowestPrice = property.rooms.length > 0 ? Math.min(...property.rooms.map((r) => r.price_monthly)) : 0;

                return (
                  <div key={property.id} className="group relative rounded-2xl overflow-hidden bg-surface-container-lowest border border-outline-variant/50 hover:border-primary/30 hover:shadow-[0_20px_40px_-15px_rgba(0,53,148,0.12)] transition-all duration-500">
                    {/* Image */}
                    <div className="relative h-[200px] overflow-hidden">
                      <img
                        alt={property.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        src={property.media?.[0]?.url_medium || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600'}
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                        <span className="material-symbols-outlined text-xs text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        <span className="font-body text-[10px] font-bold text-on-surface uppercase tracking-wider">Verified</span>
                      </div>
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                        <span className="material-symbols-outlined text-sm text-warning" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="font-body text-xs font-bold">4.9</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-display text-lg text-on-surface mb-2 group-hover:text-primary transition-colors line-clamp-1">{property.name}</h3>
                      <div className="flex items-center gap-1.5 text-on-surface-variant/70 font-body text-sm mb-4">
                        <span className="material-symbols-outlined text-base">location_on</span>
                        <span className="line-clamp-1">{property.location.address}, {property.location.city}</span>
                      </div>

                      {/* Facilities */}
                      <div className="flex items-center gap-4 text-outline mb-4">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-lg">ac_unit</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-lg">wifi</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-lg">local_parking</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-outline-variant/30">
                        <div>
                          <p className="font-body text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">per bulan</p>
                          <p className="font-display text-xl text-primary font-bold">{formatPrice(lowestPrice)}</p>
                        </div>
                        <button className="p-2.5 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all">
                          <span className="material-symbols-outlined text-lg">arrow_outward</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 2. WHY CHOOSE US - Keunggulan KostFind */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-lowest">
          <div className="max-w-container-max mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4">
                Kenapa {siteName}?
              </span>
              <h2 className="font-display text-3xl md:text-5xl text-on-background mb-4">
                Platform Kost yang <span className="italic font-normal">Terpercaya</span>
              </h2>
              <p className="font-body text-on-surface-variant/70">
                Kami memberikan pengalaman mencari kost terbaik dengan jaminan kualitas dan keamanan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {WHY_CHOOSE_US.map((item, index) => (
                <div
                  key={index}
                  className="group p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/50 hover:border-primary/30 hover:shadow-[0_20px_40px_-15px_rgba(0,53,148,0.1)] transition-all duration-500"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <span className="material-symbols-outlined text-2xl text-primary group-hover:text-white transition-colors" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {item.icon}
                    </span>
                  </div>
                  <h3 className="font-display text-xl text-on-background mb-3">{item.title}</h3>
                  <p className="font-body text-sm text-on-surface-variant/70 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. POPULAR CITIES - Lokasi Populer */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop">
          <div className="max-w-container-max mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
              <div className="max-w-xl mb-6 md:mb-0">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold mb-4">
                  Lokasi Populer
                </span>
                <h2 className="font-display text-3xl md:text-5xl text-on-background mb-3">
                  Kost di <span className="italic font-normal">Kota Besar</span>
                </h2>
                <p className="font-body text-on-surface-variant/70">
                  Temukan kost berkualitas di kota-kota besar favorit Anda.
                </p>
              </div>
              <button className="flex items-center gap-2 text-primary font-body font-semibold text-sm hover:gap-3 transition-all">
                Lihat Semua Kota <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {POPULAR_CITIES.map((city, index) => (
                <div
                  key={index}
                  className={`group relative rounded-2xl overflow-hidden cursor-pointer ${
                    index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                  }`}
                >
                  <div className={`relative ${index === 0 ? 'h-[320px] md:h-[440px]' : 'h-[160px] md:h-[200px]'}`}>
                    <img
                      src={city.image}
                      alt={city.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-on-surface/20 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                    <h3 className={`font-display text-white mb-1 ${index === 0 ? 'text-2xl md:text-3xl' : 'text-lg'}`}>
                      {city.name}
                    </h3>
                    <p className="font-body text-sm text-white/70">
                      {city.count.toLocaleString()} kost tersedia
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. HOW IT WORKS - Cara Kerja */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop bg-gradient-to-b from-surface-container-lowest to-background">
          <div className="max-w-container-max mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-tertiary/10 text-tertiary text-xs font-bold mb-4">
                Simpel & Mudah
              </span>
              <h2 className="font-display text-3xl md:text-5xl text-on-background mb-4">
                Cara Kerja {siteName}
              </h2>
              <p className="font-body text-on-surface-variant/70">
                Hanya 3 langkah mudah untuk menemukan dan memesan kost impian Anda.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting Line */}
              <div className="hidden md:block absolute top-[60px] left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary via-secondary to-tertiary opacity-30" />

              {HOW_IT_WORKS.map((item, index) => (
                <div key={index} className="relative text-center">
                  <div className="relative z-10 w-[120px] h-[120px] mx-auto mb-8 rounded-full bg-surface-container-lowest border-2 border-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-5xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {item.icon}
                    </span>
                    <span className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-primary text-white font-display text-sm font-bold flex items-center justify-center">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-display text-xl md:text-2xl text-on-background mb-4">{item.title}</h3>
                  <p className="font-body text-sm text-on-surface-variant/70 max-w-xs mx-auto leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>

            {/* CTA inside section */}
            <div className="text-center mt-16">
              <button
                onClick={() => onStartSearching()}
                className="bg-primary hover:bg-primary/95 text-white font-body font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
              >
                Mulai Cari Kost <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        {/* 5. TESTIMONIALS - Testimoni User */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop">
          <div className="max-w-container-max mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-warning/10 text-warning text-xs font-bold mb-4">
                Testimoni
              </span>
              <h2 className="font-display text-3xl md:text-5xl text-on-background mb-4">
                Kata <span className="italic font-normal">Mereka</span>
              </h2>
              <p className="font-body text-on-surface-variant/70">
                Dengarkan pengalaman пользователи kami yang sudah menemukan kost impian.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {getTestimonials(siteName).map((testimonial, index) => (
                <div
                  key={index}
                  className="p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/50 hover:border-primary/30 transition-all"
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-warning text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="font-body text-on-surface-variant/80 mb-6 leading-relaxed italic">
                    "{testimonial.text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-4 border-t border-outline-variant/30">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-display text-sm font-bold text-primary">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <p className="font-body font-semibold text-on-background">{testimonial.name}</p>
                      <p className="font-body text-xs text-on-surface-variant/60">{testimonial.role} • {testimonial.city}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. FINAL CTA - Call to Action */}
        <section className="py-32 px-margin-mobile md:px-margin-desktop relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary" />
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)',
            backgroundSize: '24px 24px',
          }} />

          <div className="relative z-10 max-w-container-max mx-auto text-center">
            <h2 className="font-display text-4xl md:text-6xl text-white mb-6">
              Siap Menemukan Kost Impian?
            </h2>
            <p className="font-body text-lg text-white/80 mb-12 max-w-2xl mx-auto">
              Bergabung dengan ribuan pengguna yang sudah menemukan tempat tinggal ideal mereka bersama {siteName}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onStartSearching()}
                className="bg-white text-primary font-body font-bold px-10 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                Cari Kost Sekarang
              </button>
              <button className="bg-transparent border-2 border-white text-white font-body font-semibold px-10 py-4 rounded-xl hover:bg-white/10 transition-all">
                Pelajari Lebih Lanjut
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
