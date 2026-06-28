import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/api/auth.service';
import { useRateLimit } from '../hooks/useRateLimit';
import { securityLogger } from '../lib/securityLogger';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2, Shield, Eye, EyeOff, CheckCircle, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';
import { Footer } from './Footer';
import { useToastStore } from '../stores/toastStore';
import { SiteLogo } from './SiteLogo';

const comingSoon = (provider: string) =>
  useToastStore.getState().push({
    variant: 'info',
    title: 'Segera Hadir',
    body: `Masuk dengan ${provider} akan tersedia dalam waktu dekat.`,
  });

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  // Account lockout after 5 failed attempts in 1 min, locked for 5 min [F-005, F-017]
  const loginRateLimit = useRateLimit({
    maxAttempts: 5,
    windowMs: 60 * 1000,
    lockoutMs: 5 * 60 * 1000,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Rate limit check BEFORE hitting the API [F-005, F-017]
    if (!loginRateLimit.checkAndIncrement()) {
      securityLogger.rateLimitHit('login');
      setError(`Terlalu banyak percobaan. Coba lagi dalam ${loginRateLimit.remainingSeconds} detik.`);
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      // Store token in localStorage + user in memory for subsequent requests [Bearer auth cross-origin]
      setAuth(response.access_token, response.user);
      securityLogger.loginSuccess(email);

      // Redirect based on role
      if (response.user.role === 'owner') navigate('/dashboard');
      else if (response.user.role === 'admin') navigate('/admin');
      else navigate('/anda/home');
    } catch (err: any) {
      securityLogger.loginFailure(email, 'invalid_credentials');
      if (loginRateLimit.attempts >= 3) {
        setError(`${5 - loginRateLimit.attempts} percobaan tersisa sebelum akun dikunci sementara.`);
      } else {
        setError(err.response?.data?.message || 'Gagal masuk. Periksa kembali email dan kata sandi Anda.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f5]">
      {/* Single Column Centered Layout */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[420px]"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-3 mb-2">
              <div className="bg-[#09090b] text-white p-2.5 rounded-[12px] shadow-[var(--cta-shadow)]">
                <Shield className="w-5 h-5" />
              </div>
              <SiteLogo className="text-xl text-[#18181b] font-bold" />
            </div>
          </div>

          {/* Main Card - Awesomic Style */}
          <div className="bg-white rounded-[36px] border border-[#e8e8ea] shadow-[var(--shadow-card-elevated)] p-7 sm:p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-[28px] font-semibold text-[#18181b] tracking-tight leading-tight">Masuk ke Akun Anda</h1>
              <p className="text-sm text-[#71717a] mt-3">
                Belum punya akun?{' '}
                <Link to="/register" className="font-medium text-[#18181b] hover:underline transition-colors">
                  Daftar di sini
                </Link>
              </p>
            </div>

            {/* Error Alert - Awesomic Style */}
            {error && (
              <div className="mb-6 p-4 bg-white border border-[#ba1a1a]/20 rounded-[14px] text-sm font-medium flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#ba1a1a]" />
                <p className="text-[#ba1a1a]">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Input - Awesomic Style */}
              <div className="space-y-2">
                <label htmlFor="login-email" className="text-sm font-medium text-[#52525b] ml-1">Alamat Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[#a1a1aa]" />
                  </div>
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-white border border-[#e8e8ea] rounded-[14px] text-sm font-medium text-[#18181b] placeholder-[#a1a1aa] focus:outline-none focus:border-[#09090b] focus:ring-2 focus:ring-[#09090b]/10 transition-all cursor-text"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              {/* Password Input - Awesomic Style */}
              <div className="space-y-2">
                <label htmlFor="login-password" className="text-sm font-medium text-[#52525b] ml-1">Kata Sandi</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[#a1a1aa]" />
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-11 py-3.5 bg-white border border-[#e8e8ea] rounded-[14px] text-sm font-medium text-[#18181b] placeholder-[#a1a1aa] focus:outline-none focus:border-[#09090b] focus:ring-2 focus:ring-[#09090b]/10 transition-all cursor-text"
                    placeholder="Masukkan kata sandi"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#a1a1aa] hover:text-[#52525b] transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button - Dark Pill Awesomic Style */}
              <button
                type="submit"
                disabled={isLoading || loginRateLimit.isLocked}
                className="w-full flex items-center justify-center gap-2 bg-[#09090b] hover:bg-[#18181b] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-[36px] font-medium text-sm transition-all mt-6 shadow-[var(--cta-shadow)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#09090b] focus:ring-offset-2"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : loginRateLimit.isLocked ? (
                  <>Coba lagi dalam {loginRateLimit.remainingSeconds}s</>
                ) : (
                  <>
                    Masuk Sekarang
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Social Divider - Awesomic Style */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e8e8ea]"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-4 text-[#71717a] font-medium">atau masuk dengan</span>
              </div>
            </div>

            {/* Social Login Buttons - Awesomic Style */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => comingSoon('Google')}
                className="flex items-center justify-center gap-2 py-3 border border-[#e8e8ea] rounded-[14px] hover:bg-[#f4f4f5] hover:border-[#d4d4d8] transition-all text-sm font-medium text-[#52525b] cursor-pointer active:scale-[0.98] bg-white"
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
                className="flex items-center justify-center gap-2 py-3 border border-[#e8e8ea] rounded-[14px] hover:bg-[#f4f4f5] hover:border-[#d4d4d8] transition-all text-sm font-medium text-[#52525b] cursor-pointer active:scale-[0.98] bg-white"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                GitHub
              </button>
            </div>
          </div>

          {/* Trust Indicators - Awesomic Style */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-[#71717a]">
              <Shield className="w-4 h-4 text-[#006c49]" />
              <span className="text-xs font-medium">Data Terenkripsi</span>
            </div>
            <div className="flex items-center gap-2 text-[#71717a]">
              <Wifi className="w-4 h-4 text-[#006c49]" />
              <span className="text-xs font-medium">SSL Secure</span>
            </div>
            <div className="flex items-center gap-2 text-[#71717a]">
              <CheckCircle className="w-4 h-4 text-[#006c49]" />
              <span className="text-xs font-medium">Terverifikasi</span>
            </div>
          </div>

          {/* Copyright */}
          <p className="mt-6 text-center text-xs text-[#71717a] font-medium">
            &copy; 2026 KostFind Platform
          </p>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};