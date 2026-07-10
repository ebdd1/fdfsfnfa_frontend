import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from './Footer';
import { Search, MapPin, Calendar, MessageSquare, Key, ArrowRight, CheckCircle, ChevronDown } from 'lucide-react';

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
      title: 'Tanpa Biaya Admin',
      description: 'Tidak ada biaya tersembunyi. Harga yang Anda lihat adalah harga yang Anda bayar.',
    },
    {
      title: 'Verifikasi Profesional',
      description: 'Tim kami visit setiap kost sebelum diverifikasi untuk memastikan kualitas.',
    },
    {
      title: 'Keamanan Transaksi',
      description: 'Pembayaran melalui platform dengan escrow system untuk keamanan kedua belah pihak.',
    },
    {
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
      <section className="py-16 md:py-24 border-b border-outline-variant">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-label-md text-primary font-medium uppercase tracking-wider mb-4">
              Langkah Mudah
            </p>
            <h1 className="font-headline text-headline-xl md:text-headline-2xl font-bold text-on-surface mb-6">
              Cara Kerja KostFind
            </h1>
            <p className="text-body-lg text-on-surface-variant leading-relaxed">
              Temukan kost impian dalam 5 langkah mudah. Dari pencarian hingga pindah ke kost baru, semua bisa dilakukan dalam satu platform.
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-5 md:gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Step Card */}
                <div className="md:h-full md:flex md:flex-col bg-surface-container-lowest rounded-xl p-6 border border-outline-variant hover:border-primary/30 transition-colors duration-200">
                  {/* Icon */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                      <step.icon className="w-6 h-6 text-on-primary" />
                    </div>
                    <span className="text-label-sm font-medium text-on-surface-variant">
                      Langkah {index + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="font-headline text-body-md font-semibold text-on-surface mb-2">
                    {step.title}
                  </h3>
                  <p className="text-label-sm text-on-surface-variant leading-relaxed mb-4">
                    {step.description}
                  </p>

                  {/* Detail list */}
                  <ul className="space-y-2 mt-auto">
                    {step.detail.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                        <span className="text-label-xs text-on-surface-variant">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Connector Arrow (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
                    <div className="w-6 h-6 rounded-full bg-surface-container-lowest border border-outline-variant flex items-center justify-center">
                      <ArrowRight className="w-3 h-3 text-on-surface-variant" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-12">
            <h2 className="font-headline text-headline-lg md:text-headline-xl font-bold text-on-surface mb-4">
              Kenapa Pakai KostFind?
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant hover:shadow-elevation-hover transition-shadow duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <div className="w-3 h-3 rounded-full bg-primary" />
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

      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-12">
            <h2 className="font-headline text-headline-lg md:text-headline-xl font-bold text-on-surface mb-4">
              Pertanyaan Umum
            </h2>
          </div>

          <div className="max-w-2xl mx-auto divide-y divide-outline-variant">
            {faqs.map((faq, index) => (
              <div key={index} className="py-4">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between gap-4 py-2 text-left"
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
                    openFaq === index ? 'max-h-48 pt-2' : 'max-h-0'
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
      <section className="py-16 md:py-24 bg-primary">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <h2 className="font-headline text-headline-lg md:text-headline-xl font-bold text-on-primary mb-4">
            Mulai Pencarian Sekarang
          </h2>
          <p className="text-body-md text-on-primary/80 mb-8 max-w-xl mx-auto">
            Bergabung dengan ribuan pengguna yang telah menemukan kost impian mereka.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/search"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-lg font-body text-body-sm font-semibold hover:bg-white/95 transition-colors"
            >
              <Search className="w-4 h-4" />
              Cari Kost Sekarang
            </Link>
            <Link
              to="/register?role=owner"
              className="inline-flex items-center justify-center gap-2 bg-transparent border border-white/40 text-white px-8 py-4 rounded-lg font-body text-body-sm font-medium hover:bg-white/10 transition-colors"
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
