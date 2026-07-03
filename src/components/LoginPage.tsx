import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useSettingsStore } from '../stores/settingsStore';
import { authService } from '../services/api/auth.service';
import { useRateLimit } from '../hooks/useRateLimit';
import { securityLogger } from '../lib/securityLogger';
import { AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToastStore } from '../stores/toastStore';

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
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const siteName = useSettingsStore((s) => s.settings.site_name) || 'KostFind';

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
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1920&q=80')`
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-surface/80 via-surface/60 to-surface/90" />
      </div>

      {/* Minimal Header */}
      <header className="relative z-10 w-full bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/30">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
          <Link to="/" className="font-headline text-headline-md font-bold text-primary">
            {siteName}
          </Link>
          <a href="#" className="text-body-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
            Help
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-12 md:py-24">
        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[440px] bg-surface-container-lowest rounded-xl shadow-elevation-hover overflow-hidden flex flex-col p-8 md:p-10 border border-outline-variant/20"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-headline text-headline-lg font-bold text-on-surface mb-2">Welcome Back</h1>
            <p className="text-body-sm text-on-surface-variant">Please sign in to access your premium dwelling portal.</p>
          </div>

          {/* Social Logins */}
          <div className="flex flex-col gap-3 mb-6">
            <button
              onClick={() => comingSoon('Google')}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors group"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="font-body text-body-sm font-medium text-on-surface">Continue with Google</span>
            </button>

            <button
              onClick={() => comingSoon('Apple')}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors"
            >
              <svg className="w-5 h-5 text-on-surface" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.04-.48-1.99-.52-3.09-.4-.28.03-.65.06-1.19.06-.55 0-1.19-.03-1.85-.1-2.67-.24-4.66-1.3-5.12-4.12-.45-2.76.79-5.38 2.25-7.1 1.43-1.68 3.25-2.5 5.5-2.5.28 0 .67.02 1.17.06.49.04.99.08 1.45.08 1.2 0 2.26-.4 3.22-.9 1.02-.54 1.84-1.3 2.44-2.4.5-.9.85-2.07.85-3.16 0-.85-.22-1.7-.62-2.56-.5-1.07-1.35-2.04-2.42-2.75-.85-.55-1.88-.92-2.85-1.13-.48-.1-.98-.17-1.55-.17-.68 0-1.4.1-2.18.3-2.08.55-4.03 1.6-5.57 3.08-1.37 1.32-2.42 2.96-3.08 4.7-.62 1.63-.78 3.3-.44 4.98.38 1.83 1.25 3.47 2.6 4.82.9.9 2.03 1.6 3.4 2.08 1.3.44 2.67.65 4.2.65.5 0 1-.03 1.45-.1.42-.06.8-.13 1.17-.2 1.1-.2 2.16-.55 3.08-1.08.03-.02.05-.04.07-.06.95-.54 1.84-1.16 2.59-1.85.02-.02.04-.03.06-.05-.03-.01-.06-.03-.1-.03z"/>
              </svg>
              <span className="font-body text-body-sm font-medium text-on-surface">Continue with Apple</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center mb-6">
            <div className="flex-grow border-t border-outline-variant/50"></div>
            <span className="flex-shrink-0 px-4 text-xs font-medium text-outline">OR</span>
            <div className="flex-grow border-t border-outline-variant/50"></div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-4 bg-error-container border border-error/20 rounded-lg text-body-sm font-medium flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-error" />
              <p className="text-error">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {/* Email Input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-email" className="font-label text-label-md text-on-surface">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-transparent rounded-lg text-body-sm text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="login-password" className="font-label text-label-md text-on-surface">Password</label>
                <a href="#" className="text-xs font-medium text-primary hover:text-primary-container transition-colors">Forgot Password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-surface-container-low border border-transparent rounded-lg text-body-sm text-on-surface placeholder:text-outline-variant focus:bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center mt-1">
              <input
                type="checkbox"
                id="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary bg-surface-container-low cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-body-sm text-on-surface cursor-pointer">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || loginRateLimit.isLocked}
              className="w-full mt-2 bg-primary text-on-primary py-3 px-4 rounded-lg font-body text-body-sm font-semibold hover:bg-primary-container hover:scale-[1.01] active:scale-[0.99] transition-all shadow-elevation-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : loginRateLimit.isLocked ? (
                <span>Coba lagi dalam {loginRateLimit.remainingSeconds}s</span>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-body-sm text-on-surface-variant">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-semibold text-primary hover:text-primary-container transition-colors">
                Sign Up
              </Link>
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-surface-container py-12 px-10 border-t border-outline-variant/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-stack-md">
          <div className="font-headline text-headline-sm font-bold text-on-surface">{siteName}</div>
          <div className="flex gap-6 font-body text-body-sm">
            <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">Cookie Policy</a>
            <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">Contact Support</a>
          </div>
          <div className="font-body text-body-sm text-on-surface-variant">
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
