import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useSettings } from './hooks/useSettings';
import { useRealtime } from './hooks/useRealtime';

import { Navbar } from './components/Navbar';
import { ToastProvider } from './components/ToastProvider';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { DashboardPage } from './components/DashboardPage';
import { LandingPageContainer } from './pages/LandingPageContainer';
import { SearchPageContainer } from './pages/SearchPageContainer';
import { DetailPageContainer } from './pages/DetailPageContainer';
import { UserDashboardPage } from './components/UserDashboardPage';
import { AdminDashboardPage } from './components/AdminDashboardPage';
import { MaintenancePage } from './components/MaintenancePage';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user, token } = useAuthStore();
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
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
  useEffect(() => {
    document.title = `${settings.site_name} — ${settings.tagline}`;
  }, [settings.site_name, settings.tagline]);

  // Connect realtime (orders + chat) for the logged-in user.
  useRealtime();

  // Maintenance mode: lock the site for everyone except admins. Admins still
  // need /login to sign in, so that route stays reachable.
  const isAdmin = user?.role === 'admin';
  if (settings.maintenance_mode && !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <ToastProvider />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<MaintenancePage />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <ToastProvider />
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPageContainer />} />
        <Route path="/search" element={<SearchPageContainer />} />
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
    </div>
  );
}

export default App;
