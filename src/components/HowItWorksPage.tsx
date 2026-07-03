import { Link } from 'react-router-dom';
import { Footer } from './Footer';
import { Search, MapPin, Calendar, MessageSquare, Key, ArrowRight, CheckCircle } from 'lucide-react';

export const HowItWorksPage = () => {
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center max-w-3xl mx-auto">
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
      <section className="py-16 md:py-20">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start">
                  {/* Step Number & Icon */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
                        <step.icon className="w-8 h-8 text-on-primary" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-surface-container-lowest border-2 border-primary flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{index + 1}</span>
                      </div>
                    </div>
                    {/* Connector Line (desktop only) */}
                    {index < steps.length - 1 && (
                      <div className="hidden md:block absolute left-8 top-20 w-0.5 h-24 bg-primary/20" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-headline text-headline-md font-bold text-on-surface mb-3">
                      {step.title}
                    </h3>
                    <p className="text-body-md text-on-surface-variant leading-relaxed mb-4">
                      {step.description}
                    </p>
                    <ul className="space-y-2">
                      {step.detail.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                          <span className="text-body-sm text-on-surface-variant">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-20 bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <h2 className="font-headline text-headline-lg font-bold text-on-surface text-center mb-12">
            Kenapa Pakai KostFind?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-surface-container-lowest rounded-xl p-6 shadow-elevation-1">
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
      <section className="py-16 md:py-20">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <h2 className="font-headline text-headline-lg font-bold text-on-surface text-center mb-12">
            Pertanyaan Umum
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
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
            ].map((faq, index) => (
              <div key={index} className="bg-surface-container-low rounded-xl p-6">
                <h3 className="font-headline text-body-md font-bold text-on-surface mb-2">
                  {faq.q}
                </h3>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-primary">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <h2 className="font-headline text-headline-lg font-bold text-on-primary mb-4">
            Mulai Pencarian Sekarang
          </h2>
          <p className="text-body-md text-on-primary/80 mb-8 max-w-xl mx-auto">
            Bergabung dengan ribuan pengguna yang telah menemukan kost impian mereka.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/search"
              className="inline-flex items-center justify-center gap-2 bg-on-primary text-primary px-8 py-3 rounded-lg font-body text-body-sm font-semibold hover:bg-on-primary/90 transition-colors"
            >
              Cari Kost Sekarang
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register?role=owner"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-on-primary text-on-primary px-8 py-3 rounded-lg font-body text-body-sm font-semibold hover:bg-on-primary/10 transition-colors"
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
