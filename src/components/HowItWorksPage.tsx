// Premium How It Works Page
// Clean, professional design dengan real images

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from './Footer';
import { Search, MapPin, Calendar, MessageSquare, Key, ArrowRight, ChevronDown, Shield, BadgeCheck, Lock, Headphones, Check } from 'lucide-react';

export const HowItWorksPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const steps = [
    {
      num: '01',
      icon: Search,
      title: 'Cari Kost',
      description: 'Gunakan filter untuk menemukan kost sesuai lokasi, tipe kamar, fasilitas, dan budget.',
      image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&q=80',
    },
    {
      num: '02',
      icon: MapPin,
      title: 'Lihat Lokasi',
      description: 'Lihat lokasi persis di peta dengan jarak ke kampus, kantor, dan fasilitas umum.',
      image: 'https://images.unsplash.com/photo-1529619768328-e37af76c6fe5?w=600&q=80',
    },
    {
      num: '03',
      icon: Calendar,
      title: 'Booking & Bayar',
      description: 'Booking real-time dengan kalender dan pembayaran aman melalui platform terenkripsi.',
      image: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=600&q=80',
    },
    {
      num: '04',
      icon: MessageSquare,
      title: 'Komunikasi',
      description: 'Chat langsung dengan pemilik kost untuk tanya jawab sebelum dan sesudah booking.',
      image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=600&q=80',
    },
    {
      num: '05',
      icon: Key,
      title: 'Pindah & Nikmati',
      description: 'Dapatkan kunci dan nikmati kost baru Anda dengan handover checklist digital.',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
    },
  ];

  const benefits = [
    {
      icon: BadgeCheck,
      title: 'Tanpa Biaya Admin',
      description: 'Tidak ada biaya tersembunyi. Harga yang Anda lihat adalah harga yang Anda bayar.',
    },
    {
      icon: Shield,
      title: 'Verifikasi Profesional',
      description: 'Tim kami visit setiap kost sebelum diverifikasi untuk memastikan kualitas.',
    },
    {
      icon: Lock,
      title: 'Keamanan Transaksi',
      description: 'Pembayaran melalui platform dengan escrow system untuk keamanan.',
    },
    {
      icon: Headphones,
      title: 'Support 24/7',
      description: 'Tim support siap membantu Anda kapan saja melalui WhatsApp dan chat.',
    },
  ];

  const faqs = [
    {
      q: 'Bagaimana cara verifikasi kost?',
      a: 'Tim kami melakukan visit langsung ke setiap kost untuk memverifikasi informasi, mengambil foto, dan memastikan ketersediaan. Hanya kost yang lolos verifikasi yang ditampilkan.',
    },
    {
      q: 'Apakah pembayaran aman?',
      a: 'Ya, kami menggunakan sistem escrow di mana pembayaran ditahan hingga Anda check-in dan konfirmasi. Jika ada masalah, dana dapat dikembalikan penuh.',
    },
    {
      q: 'Bagaimana jika kost tidak sesuai ekspektasi?',
      a: 'Anda dapat cancel booking sebelum check-in dengan refund penuh. Tim kami juga siap membantu mediasi dengan pemilik kost jika ada ketidaksesuaian.',
    },
    {
      q: 'Apakah bisa survei kost sebelum booking?',
      a: 'Tentu! Setelah chat dengan pemilik, Anda bisa arrange jadwal survei. Beberapa kost bahkan menyediakan video walkthrough virtual.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero Section */}
      <section className="py-24 md:py-36 border-b border-outline-variant">
        <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <p className="text-label-md text-primary font-medium uppercase tracking-widest mb-4">
            Platform Pencarian Kost
          </p>
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold text-on-surface mb-6 leading-[1.1]">
            Cari Kost Impian<br />
            <span className="text-primary">Dalam 5 Langkah</span>
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-xl mx-auto">
            Dari pencarian hingga booking. Semua bisa dilakukan di satu platform, tanpa ribet.
          </p>
        </div>
      </section>

      {/* Steps Section - With Images */}
      <section className="py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="space-y-20 md:space-y-32">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`grid md:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Content */}
                <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-label-sm font-medium text-primary">
                      {step.num}
                    </span>
                    <span className="w-8 h-px bg-outline-variant" />
                  </div>

                  <h3 className="font-headline text-2xl md:text-3xl font-bold text-on-surface mb-4">
                    {step.title}
                  </h3>
                  <p className="text-body-md text-on-surface-variant leading-relaxed mb-6">
                    {step.description}
                  </p>

                  <Link
                    to="/search"
                    className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
                  >
                    Mulai Cari
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Image */}
                <div className={`relative ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Subtle overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                  </div>
                  {/* Decorative element */}
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/5 rounded-full -z-10" />
                  <div className="absolute -top-4 -left-4 w-16 h-16 bg-secondary/5 rounded-full -z-10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-32 bg-surface-container-low">
        <div className="max-w-6xl mx-auto px-margin-mobile md:px-margin-desktop">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface text-center mb-16">
            Kenapa Pakai KostFind
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-surface-container-lowest">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <benefit.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-headline text-body-md font-semibold text-on-surface mb-2">
                  {benefit.title}
                </h3>
                <p className="text-label-sm text-on-surface-variant leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section with Image */}
      <section className="py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"
                alt="Tim KostFind"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface mb-6">
                Dipercaya Ribuan<br />
                <span className="text-primary">Pencari Kost</span>
              </h2>
              <p className="text-body-md text-on-surface-variant leading-relaxed mb-8">
                Kami telah membantu ribuan orang menemukan kost impian mereka. Dengan sistem verifikasi profesional dan dukungan 24/7, pengalaman pencarian kost Anda akan lebih mudah dan aman.
              </p>
              <ul className="space-y-3">
                {[
                  'Verifikasi setiap kost sebelum publikasi',
                  'Sistem pembayaran escrow yang aman',
                  'Tim support siap membantu 24/7',
                  'Garansi uang kembali jika tidak puas',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-secondary" strokeWidth={2.5} />
                    </div>
                    <span className="text-body-sm text-on-surface-variant">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-2xl mx-auto px-margin-mobile md:px-margin-desktop">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface text-center mb-12">
            Pertanyaan Umum
          </h2>

          <div className="space-y-0">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-outline-variant last:border-b-0">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left hover:text-primary transition-colors"
                >
                  <span className="font-body text-body-md font-medium text-on-surface">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-on-surface-variant flex-shrink-0 transition-transform duration-200 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    openFaq === index ? 'max-h-48 pb-5' : 'max-h-0'
                  }`}
                >
                  <p className="text-body-sm text-on-surface-variant leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-primary">
        <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-primary mb-4">
            Siap Mencari Kost?
          </h2>
          <p className="text-body-md text-on-primary/80 mb-10 max-w-md mx-auto">
            Bergabung dengan ribuan pengguna yang telah menemukan kost impian mereka.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/search"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary px-10 py-4 rounded-xl font-body text-body-sm font-semibold hover:bg-white/95 transition-colors shadow-lg"
            >
              <Search className="w-5 h-5" />
              Cari Kost Sekarang
            </Link>
            <Link
              to="/register?role=owner"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white/40 text-white px-10 py-4 rounded-xl font-body text-body-sm font-medium hover:bg-white/10 hover:border-white/60 transition-colors"
            >
              Pasang Iklan Kost
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
