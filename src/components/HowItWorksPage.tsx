import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from './Footer';
import { Search, MapPin, Calendar, MessageSquare, Key, ArrowRight, CheckCircle, ChevronDown, Shield, BadgeCheck, Lock, Headphones } from 'lucide-react';

export const HowItWorksPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const steps = [
    {
      icon: Search,
      title: 'Cari Kost',
      description: 'Gunakan filter pencarian untuk menemukan kost sesuai kebutuhan Anda - lokasi, tipe kamar, fasilitas, dan budget.',
      detail: [
        'Filter berdasarkan lokasi & radius',
        'Pilih tipe kamar (AC/non-AC, dalam/luar)',
        'Atur budget bulanan',
        'Cek fasilitas yang tersedia',
      ],
    },
    {
      icon: MapPin,
      title: 'Lihat Lokasi',
      description: 'Setiap kost dilengkapi peta GPS yang menunjukkan lokasi persis relative ke titik-titik penting.',
      detail: [
        'Jarak ke kampus/kantor terdekat',
        'Akses transportasi publik',
        'Lokasi sekitar (ATM, minimarket, dll)',
        'Foto 360° jika tersedia',
      ],
    },
    {
      icon: Calendar,
      title: 'Booking & Bayar',
      description: 'Setelah menemukan kost impian, lakukan booking langsung dan pembayaran melalui platform yang aman.',
      detail: [
        'Booking real-time dengan kalender',
        'Pembayaran aman via platform',
        'Konfirmasi instan via WhatsApp',
        'Digital contract agreement',
      ],
    },
    {
      icon: MessageSquare,
      title: 'Komunikasi',
      description: 'Chat langsung dengan pemilik kost untuk tanya jawab sebelum dan sesudah booking.',
      detail: [
        'Chat real-time dengan pemilik',
        'Kirim foto/video pertanyaan',
        'Diskusi kontrak & syarat',
        'Koordinasi jadwal survei',
      ],
    },
    {
      icon: Key,
      title: 'Pindah & Nikmati',
      description: 'Setelah semua proses selesai, dapatkan kunci dan nikmati kost baru Anda!',
      detail: [
        'Digital handover checklist',
        'Video walkthrough kost',
        'Hubungi support jika butuh',
        'Review & rating setelah settle',
      ],
    },
  ];

  const benefits = [
    {
      icon: BadgeCheck,
      title: 'Tanpa Biaya Admin',
      description: 'Tidak ada biaya tersembunyi. Harga yang Anda lihat adalah harga yang Anda bayar.',
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: Shield,
      title: 'Verifikasi Profesional',
      description: 'Tim kami visit setiap kost sebelum diverifikasi untuk memastikan kualitas.',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: Lock,
      title: 'Keamanan Transaksi',
      description: 'Pembayaran melalui platform dengan escrow system untuk keamanan kedua belah pihak.',
      color: 'from-purple-500 to-violet-600',
    },
    {
      icon: Headphones,
      title: 'Support 24/7',
      description: 'Tim support siap membantu Anda kapan saja melalui WhatsApp dan chat.',
      color: 'from-orange-500 to-red-500',
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
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

        <div className="relative max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-label-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Platform Kost #1 di Indonesia
            </div>

            <h1 className="font-headline text-headline-xl md:text-headline-2xl font-bold text-on-surface mb-6 leading-tight">
              Cara Kerja <span className="text-primary">KostFind</span>
            </h1>
            <p className="text-body-lg text-on-surface-variant leading-relaxed max-w-2xl mx-auto">
              Temukan kost impian dalam 5 langkah mudah. Dari pencarian hingga pindah ke kost baru, semua bisa dilakukan dalam satu platform.
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section - Horizontal Timeline */}
      <section className="py-16 md:py-24 relative">
        {/* Connecting line */}
        <div className="hidden lg:block absolute top-24 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl h-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 rounded-full" />

        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          {/* Mobile/Tablet: Vertical Steps */}
          <div className="lg:hidden space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step Card */}
                <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-elevation-2 border border-outline-variant/50 hover:shadow-elevation-hover transition-shadow duration-300">
                  <div className="flex items-start gap-4">
                    {/* Icon with number */}
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25">
                        <step.icon className="w-7 h-7 text-on-primary" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-headline text-headline-sm font-bold text-on-surface mb-2">
                        {step.title}
                      </h3>
                      <p className="text-body-sm text-on-surface-variant leading-relaxed mb-4">
                        {step.description}
                      </p>
                      <ul className="space-y-2">
                        {step.detail.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                            <span className="text-label-sm text-on-surface-variant">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Connector */}
                {index < steps.length - 1 && (
                  <div className="absolute left-7 top-full w-0.5 h-8 bg-gradient-to-b from-primary/30 to-transparent" />
                )}
              </div>
            ))}
          </div>

          {/* Desktop: Horizontal Cards */}
          <div className="hidden lg:grid grid-cols-5 gap-4">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Step Card */}
                <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-elevation-2 border border-outline-variant/50 hover:shadow-elevation-hover hover:border-primary/30 transition-all duration-300 h-full flex flex-col">
                  {/* Icon */}
                  <div className="relative mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25 mx-auto">
                      <step.icon className="w-6 h-6 text-on-primary" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="font-headline text-body-md font-bold text-on-surface mb-2 text-center">
                    {step.title}
                  </h3>
                  <p className="text-label-sm text-on-surface-variant leading-relaxed mb-4 text-center flex-1">
                    {step.description}
                  </p>

                  {/* Detail list */}
                  <ul className="space-y-1.5">
                    {step.detail.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" />
                        <span className="text-label-xs text-on-surface-variant">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

        <div className="relative max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-12">
            <h2 className="font-headline text-headline-lg md:text-headline-xl font-bold text-on-surface mb-4">
              Kenapa Pakai <span className="text-primary">KostFind</span>?
            </h2>
            <p className="text-body-md text-on-surface-variant max-w-xl mx-auto">
              Keunggulan yang membuat kami berbeda dari platform lainnya
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group relative bg-surface-container-lowest rounded-2xl p-6 shadow-elevation-1 hover:shadow-elevation-hover transition-all duration-300 border border-outline-variant/50 hover:border-transparent overflow-hidden"
              >
                {/* Gradient accent on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="font-headline text-headline-sm font-bold text-on-surface mb-2">
                  {benefit.title}
                </h3>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-12">
            <h2 className="font-headline text-headline-lg md:text-headline-xl font-bold text-on-surface mb-4">
              Pertanyaan Umum
            </h2>
            <p className="text-body-md text-on-surface-variant max-w-xl mx-auto">
              Temukan jawaban untuk pertanyaan yang sering ditanyakan
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 overflow-hidden hover:border-primary/20 transition-colors duration-300"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="font-headline text-body-md font-semibold text-on-surface pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-on-surface-variant flex-shrink-0 transition-transform duration-300 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === index ? 'max-h-48' : 'max-h-0'
                  }`}
                >
                  <p className="px-5 pb-5 text-body-sm text-on-surface-variant leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(255,255,255,0.1)_0%,_transparent_50%)]" />

        {/* Decorative shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

        <div className="relative max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <h2 className="font-headline text-headline-lg md:text-headline-xl font-bold text-on-primary mb-4">
            Mulai Pencarian Sekarang
          </h2>
          <p className="text-body-md text-on-primary/80 mb-8 max-w-xl mx-auto">
            Bergabung dengan ribuan pengguna yang telah menemukan kost impian mereka.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/search"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-body text-body-sm font-bold hover:bg-white/95 transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <Search className="w-5 h-5" />
              Cari Kost Sekarang
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register?role=owner"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white/40 text-white px-8 py-4 rounded-xl font-body text-body-sm font-semibold hover:bg-white/10 hover:border-white/60 transition-all duration-200"
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
