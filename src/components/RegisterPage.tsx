import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/api/auth.service';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { validatePassword } from '../lib/passwordPolicy';
import { Mail, Lock, User as UserIcon, Phone, ArrowRight, AlertCircle, Loader2, Shield, Eye, EyeOff, CheckCircle, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettings } from '../hooks/useSettings';
import { Footer } from './Footer';
import { useToastStore } from '../stores/toastStore';
import { SiteLogo } from './SiteLogo';

const comingSoon = (provider: string) =>
  useToastStore.getState().push({
    variant: 'info',
    title: 'Segera Hadir',
    body: `Daftar dengan ${provider} akan tersedia dalam waktu dekat.`,
  });

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'seeker' | 'owner'>('seeker');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { settings } = useSettings();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Enforce password policy before submit [F-011]
    const pwdError = validatePassword(password);
    if (pwdError) {
      setError(pwdError);
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.register({ name, email, password, phone, role });
      // Store token in localStorage + user in memory for subsequent requests [Bearer auth cross-origin]
      setAuth(response.access_token, response.user);

      if (response.user.role === 'owner') navigate('/dashboard');
      else navigate('/anda/home');
    } catch (err: any) {
      if (err.response) {
        // Backend returned an error response
        if (err.response.status === 409) {
          setError('Email atau nomor telepon sudah terdaftar.');
        } else if (err.response.status === 400) {
          const msg = err.response.data?.message;
          setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Format data tidak valid.');
        } else {
          setError(err.response.data?.message || 'Terjadi kesalahan pada server. Silakan coba lagi.');
        }
      } else if (err.request) {
        // Request was made but no response received
        setError('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
      } else {
        setError('Gagal memproses pendaftaran.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Admin can disable new sign-ups platform-wide.
  if (!settings.allow_registration) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <div className="flex-1 flex items-center justify-center px-6 text-center">
          <div className="max-w-md">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-6">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Pendaftaran Sedang Ditutup</h1>
            <p className="mt-3 text-sm text-slate-500 leading-relaxed">
              Maaf, registrasi akun baru untuk sementara tidak tersedia. Silakan coba lagi nanti atau hubungi {settings.support_email || 'admin'}.
            </p>
            <Link to="/login" className="mt-6 inline-flex items-center justify-center gap-2 bg-[var(--primary-600)] hover:bg-[var(--primary-700)] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-[var(--primary-600)]/20">
              Sudah punya akun? Masuk
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Single Column Centered Layout */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-3 mb-2">
              <div className="bg-[var(--primary-600)] text-white p-2 rounded-xl shadow-lg shadow-[var(--primary-600)]/20">
                <Shield className="w-5 h-5" />
              </div>
              <SiteLogo className="text-xl text-slate-900" />
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Buat Akun Baru</h1>
              <p className="text-sm text-slate-500 mt-2">
                Sudah punya akun?{' '}
                <Link to="/login" className="font-semibold text-[var(--primary-600)] hover:text-[var(--primary-700)] transition-colors">
                  Masuk di sini
                </Link>
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
                <p>{error}</p>
              </div>
            )}

            {/* Register Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Role Selection (Segmented Control) */}
              <div className="bg-slate-100 p-1.5 rounded-xl flex gap-1 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setRole('seeker')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    role === 'seeker'
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Pencari Kost
                </button>
                <button
                  type="button"
                  onClick={() => setRole('owner')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    role === 'owner'
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Pemilik Kost
                </button>
              </div>

              {/* Name Input */}
              <div className="space-y-2">
                <label htmlFor="register-name" className="text-sm font-semibold text-slate-700 ml-1">Nama Lengkap</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="register-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[var(--primary-600)] focus:ring-2 focus:ring-[var(--primary-600)]/10 transition-all cursor-text"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="register-email" className="text-sm font-semibold text-slate-700 ml-1">Alamat Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="register-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[var(--primary-600)] focus:ring-2 focus:ring-[var(--primary-600)]/10 transition-all cursor-text"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              {/* Phone/WhatsApp Input */}
              <div className="space-y-2">
                <label htmlFor="register-phone" className="text-sm font-semibold text-slate-700 ml-1">No. WhatsApp</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="register-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[var(--primary-600)] focus:ring-2 focus:ring-[var(--primary-600)]/10 transition-all cursor-text"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="register-password" className="text-sm font-semibold text-slate-700 ml-1">Kata Sandi</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-11 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[var(--primary-600)] focus:ring-2 focus:ring-[var(--primary-600)]/10 transition-all cursor-text"
                    placeholder="Min. 8 karakter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <PasswordStrengthMeter password={password} />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-[var(--primary-600)] hover:bg-[var(--primary-700)] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold text-sm transition-all mt-6 shadow-lg shadow-[var(--primary-600)]/20 hover:shadow-[var(--primary-600)]/30 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--primary-600)] focus:ring-offset-2"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Daftar Sekarang
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Social Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-4 text-slate-400 font-medium">atau daftar dengan</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => comingSoon('Google')}
                className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-sm font-medium text-slate-700 cursor-pointer active:scale-[0.98] bg-white"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={() => comingSoon('GitHub')}
                className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-sm font-medium text-slate-700 cursor-pointer active:scale-[0.98] bg-white"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                GitHub
              </button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-slate-500">
              <Shield className="w-4 h-4 text-[#006c49]" />
              <span className="text-xs font-medium">Data Terenkripsi</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <Wifi className="w-4 h-4 text-[#006c49]" />
              <span className="text-xs font-medium">SSL Secure</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <CheckCircle className="w-4 h-4 text-[#006c49]" />
              <span className="text-xs font-medium">Terverifikasi</span>
            </div>
          </div>

          {/* Copyright */}
          <p className="mt-6 text-center text-xs text-slate-400 font-medium">
            &copy; 2026 KostFind Platform
          </p>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};
