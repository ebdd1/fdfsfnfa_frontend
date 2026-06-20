import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/api/auth.service';
import { useRateLimit } from '../hooks/useRateLimit';
import { securityLogger } from '../lib/securityLogger';
import { Sparkles, Mail, Lock, ArrowRight, AlertCircle, Loader2, Shield, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { Footer } from './Footer';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

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
      // Store user info in memory (token is in httpOnly cookie, not accessible to JS) [F-002]
      setUser(response.user);
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
    <div className="min-h-screen flex flex-col bg-indigo-50/20">
      {/* Split-Screen Login Container */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-100/25 rounded-full blur-3xl pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl bg-white/50 backdrop-blur-xl rounded-[32px] border border-white/60 p-4 sm:p-6 shadow-[0_32px_64px_-16px_rgba(15,23,42,0.06)] grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative z-10"
        >
          {/* Left Panel: Mesh Gradient & Feature Info */}
          <div className="lg:col-span-5 relative overflow-hidden rounded-[24px] bg-slate-50 border border-slate-200/50 p-8 sm:p-10 flex flex-col justify-between h-full min-h-[420px]">
            {/* Mesh Glow Effects */}
            <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] rounded-full bg-purple-300/30 blur-[60px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[90%] h-[90%] rounded-full bg-emerald-200/25 blur-[80px] pointer-events-none"></div>
            <div className="absolute top-[30%] left-[20%] w-[60%] h-[60%] rounded-full bg-blue-200/25 blur-[70px] pointer-events-none"></div>

            {/* Brand Logo */}
            <div className="relative z-10 flex items-center gap-2 text-left">
              <div className="bg-emerald-50 text-emerald-600 p-1.5 rounded-lg border border-emerald-100/30 flex items-center justify-center shadow-sm">
                <Sparkles className="w-4.5 h-4.5 fill-emerald-55" />
              </div>
              <span className="text-xs font-black text-slate-800 tracking-tight">CarimiKost'ta</span>
            </div>

            {/* Headline & Features */}
            <div className="relative z-10 space-y-8 my-auto text-left pt-8 pb-8">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-[1.15]">
                Cari Hunian Cepat.<br />
                Tanpa Ribet.
              </h1>
              
              <div className="space-y-6">
                {/* Feature 1 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center shrink-0 text-emerald-600">
                    <Sparkles className="w-5 h-5 fill-emerald-50" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-850 uppercase tracking-wider">Pencarian Real-Time</h4>
                    <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">Temukan kamar kost yang masih tersedia secara instan lengkap dengan koordinat GPS.</p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center shrink-0 text-indigo-600">
                    <Shield className="w-5 h-5 fill-indigo-50" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-855 uppercase tracking-wider">Listing Terverifikasi</h4>
                    <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">Semua listing dikelola oleh owner terverifikasi untuk menjamin keamanan transaksi Anda.</p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center shrink-0 text-blue-600">
                    <Mail className="w-5 h-5 fill-blue-50" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-855 uppercase tracking-wider">Komunikasi Langsung</h4>
                    <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">Hubungi pemilik kost langsung melalui obrolan terintegrasi secara aman.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Metadata */}
            <div className="relative z-10 pt-4 border-t border-slate-200/40 text-left">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">&copy; 2026 KostFind Platform</span>
            </div>
          </div>

          {/* Right Panel: Form Inputs */}
          <div className="lg:col-span-7 bg-white rounded-[24px] border border-slate-200/80 p-6 sm:p-10 shadow-sm flex flex-col justify-center text-left">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Masuk ke Akun Anda</h2>
              <p className="text-xs text-slate-400 mt-1.5 font-semibold">
                Belum punya akun?{' '}
                <Link to="/register" className="font-black text-emerald-600 hover:text-emerald-700 transition-colors">
                  Daftar di sini
                </Link>
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-650 rounded-2xl text-xs font-bold flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-4.5 h-4.5 flex-shrink-0 mt-0.5 text-red-500" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest ml-1">Alamat Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all outline-none font-bold text-slate-700 placeholder-slate-400/80"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest">Kata Sandi</label>
                  <a href="#" className="text-[10px] font-black uppercase tracking-wider text-emerald-600 hover:text-emerald-700 transition-colors">Lupa sandi?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-xs focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all outline-none font-bold text-slate-700 placeholder-slate-400/80"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-650 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || loginRateLimit.isLocked}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-extrabold text-xs transition-all mt-8 shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/20 hover:-translate-y-0.5 cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
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

            {/* Social Login Section */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200/80"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-wider">
                <span className="bg-white px-4 text-slate-400">atau masuk dengan</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => alert('Fitur Masuk dengan Google segera hadir!')}
                className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-xs font-bold text-slate-700 cursor-pointer active:scale-95 bg-white"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={() => alert('Fitur Masuk dengan GitHub segera hadir!')}
                className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-xs font-bold text-slate-700 cursor-pointer active:scale-95 bg-white"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                GitHub
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};
