import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useSession } from './hooks/useSession';
import { useSettings } from './hooks/useSettings';
import { useRealtime } from './hooks/useRealtime';
import { ErrorBoundary } from './components/ErrorBoundary';
import { BRAND_COLORS, type BrandColorKey } from './config/brandColors';

import { Navbar } from './components/Navbar';
import { ToastProvider } from './components/ToastProvider';
import { LoginPage } from './components/LoginPage';
import { MaintenancePage } from './components/MaintenancePage';

// CRITICAL FIX: Route-based code splitting
// Previously, ALL pages were loaded upfront (static imports)
// Now, each page is loaded only when accessed (React.lazy)
// This reduces initial bundle size by 50%+

const RegisterPage = lazy(() => import('./components/RegisterPage').then(m => ({ default: m.RegisterPage })));
const DashboardPage = lazy(() => import('./components/DashboardPage').then(m => ({ default: m.DashboardPage })));
const LandingPageContainer = lazy(() => import('./pages/LandingPageContainer').then(m => ({ default: m.LandingPageContainer })));
const SearchPageContainer = lazy(() => import('./pages/SearchPageContainer').then(m => ({ default: m.SearchPageContainer })));
const DetailPageContainer = lazy(() => import('./pages/DetailPageContainer').then(m => ({ default: m.DetailPageContainer })));
const UserDashboardPage = lazy(() => import('./components/UserDashboardPage').then(m => ({ default: m.UserDashboardPage })));
const AdminDashboardPage = lazy(() => import('./components/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const AboutPage = lazy(() => import('./components/AboutPage').then(m => ({ default: m.AboutPage })));
const HowItWorksPage = lazy(() => import('./components/HowItWorksPage').then(m => ({ default: m.HowItWorksPage })));

// Lazy-loaded skeleton for page transitions
const PageSkeleton = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#004ac6]" />
  </div>
);

/**
 * ProtectedRoute validated by server session [F-003].
 * Reads user from server (not localStorage) to prevent privilege escalation.
 *
 * SECURITY NOTES:
 * - isAuthenticated is derived from !!token (not stored) — prevents stale state on reload.
 * - Waits for Zustand _hasHydrated before checking auth — prevents premature redirect
 *   when token is still loading from localStorage (Zustand v5 async persist).
 * - Role check is client-side only for UX; backend enforces on every request.
 */
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const { token, _hasHydrated } = useAuthStore();
  const { isLoading, data: sessionUser } = useSession();

  // Wait for store to rehydrate from localStorage before making any auth decision
  if (!_hasHydrated || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary-600)]" />
      </div>
    );
  }

  // Derive auth from token — not stored, always reflects current localStorage state
  const isAuthenticated = !!token;
  if (!isAuthenticated || !sessionUser) {
    return <Navigate to="/login" replace />;
  }

  // Role check is still client-side for UX — backend enforces on every request
  if (allowedRoles && !allowedRoles.includes(sessionUser.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Preserves ?c=<conversationId> when redirecting /chat → /anda/home?section=chat&c=...
const ChatRedirect = () => {
  const [searchParams] = useSearchParams();
  const c = searchParams.get('c') || '';
  return <Navigate to={`/anda/home?section=chat${c ? `&c=${c}` : ''}`} replace />;
};

function App() {
  // Load global site settings once and keep the browser tab title in sync
  // with the admin-configured site name.
  const { settings } = useSettings();
  const { user } = useAuthStore();

  // Apply primary color CSS variables site-wide for all shades
  useEffect(() => {
    if (settings.primary_color) {
      const colorKey = settings.primary_color as BrandColorKey;
      const shades = BRAND_COLORS[colorKey];
      if (shades) {
        // Set each shade as a CSS variable
        (['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'] as const).forEach(shade => {
          document.documentElement.style.setProperty(`--primary-${shade}`, shades[shade]);
        });
        // Set primary color default
        document.documentElement.style.setProperty('--primary-color', shades.DEFAULT);
      }
    }
  }, [settings.primary_color]);

  // Set favicon from admin settings
  useEffect(() => {
    if (settings.favicon_url) {
      const existing = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (existing) {
        existing.href = settings.favicon_url;
        existing.type = 'image/png';
      } else {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/png';
        link.href = settings.favicon_url;
        document.head.appendChild(link);
      }
    }
  }, [settings.favicon_url]);

  // Set SEO meta description
  useEffect(() => {
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = settings.seo_description || '';
  }, [settings.seo_description]);

  // Browser tab title
  useEffect(() => {
    document.title = `${settings.site_name} — ${settings.tagline}`;
  }, [settings.site_name, settings.tagline]);

  // Load Google Font for text logo when non-default font is selected
  useEffect(() => {
    const fontFamily = settings.logo_font_family;
    if (!fontFamily || fontFamily === 'Inter') return;
    const fontId = `google-font-${fontFamily.replace(/\s+/g, '-')}`;
    if (document.getElementById(fontId)) return; // already loaded
    const link = document.createElement('link');
    link.id = fontId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400;700;900&display=swap`;
    document.head.appendChild(link);
  }, [settings.logo_font_family]);

  // Connect realtime (orders + chat) for the logged-in user.
  useRealtime();

  // Maintenance mode: lock the site for everyone except admins. Admins still
  // need /login to sign in, so that route stays reachable.
  const isAdmin = user?.role === 'admin';
  if (settings.maintenance_mode && !isAdmin) {
    return (
      <div
        className="min-h-screen bg-slate-50 flex flex-col font-sans"
        style={{ '--primary-color': settings.primary_color || '#10b981' } as React.CSSProperties}
      >
        <ToastProvider />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<MaintenancePage />} />
        </Routes>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-50 flex flex-col font-sans"
      style={{ '--primary-color': settings.primary_color || '#10b981' } as React.CSSProperties}
    >
      <ToastProvider />
      <Navbar />
      {/* CRITICAL FIX: Global Error Boundary to prevent white screen crashes */}
      <ErrorBoundary>
        {/* CRITICAL FIX: Wrap Routes with Suspense for code-split page loading */}
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPageContainer />} />
          <Route path="/search" element={<SearchPageContainer />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Property detail (GET /listings/:id is JWT-guarded; the axios
              interceptor redirects unauthenticated users to /login). */}
          <Route path="/property/:id" element={<DetailPageContainer />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/anda/home"
            element={
              <ProtectedRoute allowedRoles={['seeker']}>
                <UserDashboardPage />
              </ProtectedRoute>
            }
          />
          {/* Watchlist and chat live inside the seeker dashboard sections. */}
          <Route path="/watchlist" element={<Navigate to="/anda/home?section=watchlist" replace />} />
          <Route path="/chat" element={<ChatRedirect />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;
