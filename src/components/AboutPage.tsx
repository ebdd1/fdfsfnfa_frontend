import { Link } from 'react-router-dom';
import { Footer } from './Footer';
import { Shield, MapPin, Star, Users, ArrowRight } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-headline text-headline-xl md:text-headline-2xl font-bold text-on-surface mb-6">
              Tentang KostFind
            </h1>
            <p className="text-body-lg text-on-surface-variant leading-relaxed">
              Platform pencarian kost premium yang membantu mahasiswa dan pekerja muda menemukan hunian ideal dengan verifikasi GPS lokasi real-time dan manajemen bookings digital.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-headline text-headline-lg font-bold text-on-surface mb-6">
                Misi Kami
              </h2>
              <p className="text-body-md text-on-surface-variant leading-relaxed mb-4">
                Kami percaya bahwa menemukan kost yang tepat tidak boleh menjadi pengalaman yang merepotkan. Dengan KostFind, kami menghubungkan pencari kost dengan pemilik kost secara efisien dan transparan.
              </p>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                Setiap listing di KostFind telah diverifikasi oleh tim kami untuk memastikan akurasi informasi, kualitas foto, dan kepastian ketersediaan.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-low rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <p className="text-body-sm text-on-surface-variant">Kost Terverifikasi</p>
              </div>
              <div className="bg-surface-container-low rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">50+</div>
                <p className="text-body-sm text-on-surface-variant">Kota Coverage</p>
              </div>
              <div className="bg-surface-container-low rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">10K+</div>
                <p className="text-body-sm text-on-surface-variant">Pengguna Aktif</p>
              </div>
              <div className="bg-surface-container-low rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">98%</div>
                <p className="text-body-sm text-on-surface-variant">Tingkat Kepuasan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-20 bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <h2 className="font-headline text-headline-lg font-bold text-on-surface text-center mb-12">
            Nilai-Nilai Kami
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-surface-container-lowest rounded-xl p-8 shadow-elevation-1">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-headline text-headline-md font-bold text-on-surface mb-3">
                Terverifikasi
              </h3>
              <p className="text-body-sm text-on-surface-variant leading-relaxed">
                Setiap kost melewati proses verifikasi ketat sebelum ditampilkan di platform kami untuk memastikan kualitas dan keakuratan informasi.
              </p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-8 shadow-elevation-1">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <MapPin className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-headline text-headline-md font-bold text-on-surface mb-3">
                Lokasi Presisi
              </h3>
              <p className="text-body-sm text-on-surface-variant leading-relaxed">
                Dengan teknologi GPS, Anda bisa melihat lokasi persis kost relative ke kampus, kantor, atau transportasi publik terdekat.
              </p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-8 shadow-elevation-1">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Star className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-headline text-headline-md font-bold text-on-surface mb-3">
                Review Asli
              </h3>
              <p className="text-body-sm text-on-surface-variant leading-relaxed">
                Review dari penghuni sebelumnya membantu Anda membuat keputusan yang tepat berdasarkan pengalaman nyata.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <h2 className="font-headline text-headline-lg font-bold text-on-surface text-center mb-12">
            Tim Kami
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-primary-fixed mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">FT</span>
              </div>
              <h3 className="font-headline text-headline-sm font-bold text-on-surface">Febryanus Tambing</h3>
              <p className="text-body-sm text-on-surface-variant">Founder & Developer</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-primary-fixed mx-auto mb-4 flex items-center justify-center">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-headline text-headline-sm font-bold text-on-surface">Tim KostFind</h3>
              <p className="text-body-sm text-on-surface-variant">Tim verifikasi & support</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-primary-fixed mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-headline text-headline-sm font-bold text-on-surface">Quality Assurance</h3>
              <p className="text-body-sm text-on-surface-variant">Tim quality control</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-primary">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <h2 className="font-headline text-headline-lg font-bold text-on-primary mb-4">
            Siap Menemukan Kost Ideal?
          </h2>
          <p className="text-body-md text-on-primary/80 mb-8 max-w-xl mx-auto">
            Bergabung dengan ribuan pengguna yang telah menemukan hunian terbaik mereka bersama KostFind.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/search"
              className="inline-flex items-center justify-center gap-2 bg-on-primary text-primary px-8 py-3 rounded-lg font-body text-body-sm font-semibold hover:bg-on-primary/90 transition-colors"
            >
              Jelajahi Kost
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register?role=owner"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-on-primary text-on-primary px-8 py-3 rounded-lg font-body text-body-sm font-semibold hover:bg-on-primary/10 transition-colors"
            >
              Pasang Iklan
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
