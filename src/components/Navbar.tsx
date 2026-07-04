import React, { useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useSettingsStore } from '../stores/settingsStore';
import { Shield, LayoutDashboard, LogOut, Plus, Menu } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const siteName = useSettingsStore((s) => s.settings.site_name) || 'KostFind';
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 150);
  };

  const handleLogout = () => {
    useAuthStore.getState().logout();
    navigate('/');
  };

  // Don't show navbar on dashboard pages as they have their own sidebars
  if (pathname.includes('/dashboard') || pathname.includes('/admin') || pathname.includes('/anda/home')) {
    return null;
  }

  return (
    <header className="w-full top-0 sticky bg-surface dark:bg-surface-dim z-40 transition-all duration-300 border-b border-surface-container">
      {/* Subtle top border for depth */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      {/* Full width navbar - no max-width constraint */}
      <div className="w-full px-margin-mobile md:px-margin-desktop py-stack-sm flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="nav-logo flex items-center gap-2 cursor-pointer">
          <span className="material-symbols-outlined text-primary font-bold text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            domain
          </span>
          <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tight">
            {siteName}
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-stack-lg">
          <Link
            to="/"
            className={`nav-link text-label-md font-label-md ${
              pathname === '/'
                ? 'text-primary active'
                : 'text-on-surface-variant'
            }`}
          >
            Beranda
          </Link>
          <Link
            to="/search"
            className={`nav-link text-label-md font-label-md ${
              pathname.startsWith('/search')
                ? 'text-primary active'
                : 'text-on-surface-variant'
            }`}
          >
            Terverifikasi
          </Link>
          <Link
            to="/search?filter=promo"
            className={`nav-link text-label-md font-label-md ${
              pathname === '/offers'
                ? 'text-primary active'
                : 'text-on-surface-variant'
            }`}
          >
            Penawaran
          </Link>
          <Link
            to="/about"
            className={`nav-link text-label-md font-label-md ${
              pathname === '/about'
                ? 'text-primary active'
                : 'text-on-surface-variant'
            }`}
          >
            Tentang Kami
          </Link>
          <Link
            to="/how-it-works"
            className={`nav-link text-label-md font-label-md ${
              pathname === '/how-it-works'
                ? 'text-primary active'
                : 'text-on-surface-variant'
            }`}
          >
            Cara Kerja
          </Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-stack-md">
          {/* Desktop Actions */}
          {isAuthenticated && user ? (
            <>
              {/* Notifications */}
              <Link
                to="/chat"
                aria-label="Notifikasi"
                className="nav-icon-btn hidden md:flex items-center justify-center w-10 h-10 rounded-full text-on-surface-variant relative"
              >
                <span className="material-symbols-outlined">notifications</span>
                {/* Notification badge */}
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
              </Link>

              {/* User Dropdown - Desktop only */}
              <div
                className="relative hidden md:block"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  aria-label="Menu profil pengguna"
                  aria-expanded={dropdownOpen}
                  className="nav-avatar w-10 h-10 rounded-full overflow-hidden border-2 border-surface-container cursor-pointer"
                >
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-surface-container flex items-center justify-center text-on-surface-variant font-semibold text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>

                {dropdownOpen && (
                  <div className="nav-dropdown absolute right-0 mt-3 w-64 bg-surface-container-lowest rounded-xl shadow-elevation-hover border border-surface-container overflow-hidden z-50">
                    {/* User Info Header */}
                    <div className="px-stack-md py-stack-md border-b border-surface-container-high flex items-center gap-3">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.name} className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-primary-fixed flex items-center justify-center text-primary font-bold text-lg">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-label-md text-label-md font-semibold text-on-surface truncate">{user.name}</p>
                        <p className="text-label-sm text-on-surface-variant capitalize">
                          {user.role === 'admin' ? 'Administrator' : user.role === 'owner' ? 'Pemilik Kost' : 'Pencari Kost'}
                        </p>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      {user.role === 'seeker' && (
                        <Link
                          to="/anda/home"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-stack-md py-2.5 text-body-sm text-on-surface hover:bg-surface-container-low transition-colors"
                        >
                          <LayoutDashboard className="w-5 h-5 text-on-surface-variant" />
                          <span>Dasbor Saya</span>
                        </Link>
                      )}

                      {user.role === 'owner' && (
                        <Link
                          to="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-stack-md py-2.5 text-body-sm text-on-surface hover:bg-surface-container-low transition-colors"
                        >
                          <LayoutDashboard className="w-5 h-5 text-on-surface-variant" />
                          <span>Dasbor Pemilik</span>
                        </Link>
                      )}

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-stack-md py-2.5 text-body-sm text-on-surface hover:bg-surface-container-low transition-colors"
                        >
                          <Shield className="w-5 h-5 text-on-surface-variant" />
                          <span>Mode Admin</span>
                        </Link>
                      )}

                      <Link
                        to="/watchlist"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-stack-md py-2.5 text-body-sm text-on-surface hover:bg-surface-container-low transition-colors"
                      >
                        <span className="material-symbols-outlined text-on-surface-variant">bookmark</span>
                        <span>Watchlist</span>
                      </Link>

                      <Link
                        to="/chat"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-stack-md py-2.5 text-body-sm text-on-surface hover:bg-surface-container-low transition-colors"
                      >
                        <span className="material-symbols-outlined text-on-surface-variant">chat</span>
                        <span>Pesan</span>
                      </Link>

                      {/* Logout */}
                      <hr className="my-2 border-surface-container-high" />
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center gap-3 px-stack-md py-2.5 text-body-sm text-error w-full hover:bg-error-container transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Keluar</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Desktop Auth Buttons */}
              <Link
                to="/login"
                className="hidden md:block text-label-md font-label-md text-on-surface-variant hover:text-primary transition-colors px-stack-sm py-2"
              >
                Masuk
              </Link>
              <Link
                to="/register?role=owner"
                className="nav-cta hidden md:flex items-center gap-2 px-stack-md py-2.5 bg-primary text-on-primary rounded-lg text-label-md font-label-md"
              >
                <Plus className="w-4 h-4" />
                Pasang Iklan
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={mobileMenuOpen}
            className="nav-menu-btn md:hidden flex items-center justify-center w-10 h-10 rounded-lg"
          >
            {mobileMenuOpen ? (
              <span className="material-symbols-outlined text-2xl">close</span>
            ) : (
              <Menu className="w-6 h-6 text-on-surface-variant" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Premium Style */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-surface border-t border-outline-variant shadow-elevation-hover z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="px-margin-mobile py-stack-md flex flex-col gap-1">
            {/* User Profile (when logged in) */}
            {isAuthenticated && user && (
              <div className="flex items-center gap-3 p-3 mb-2 bg-surface-container rounded-xl border border-outline-variant">
                <div className="w-11 h-11 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container overflow-hidden shrink-0">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-bold">{user.name?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-body-sm font-semibold text-on-surface truncate">{user.name}</p>
                  <p className="text-label-sm text-on-surface-variant capitalize">
                    {user.role === 'admin' ? 'Administrator' : user.role === 'owner' ? 'Pemilik Kost' : 'Pencari Kost'}
                  </p>
                </div>
              </div>
            )}

            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`mobile-nav-item px-4 py-3 rounded-lg text-body-md font-medium transition-colors ${
                pathname === '/' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              Beranda
            </Link>
            <Link
              to="/search"
              onClick={() => setMobileMenuOpen(false)}
              className={`mobile-nav-item px-4 py-3 rounded-lg text-body-md font-medium transition-colors ${
                pathname.startsWith('/search') ? 'bg-primary-container text-on-primary-container' : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              Terverifikasi
            </Link>
            <Link
              to="/search?filter=promo"
              onClick={() => setMobileMenuOpen(false)}
              className={`mobile-nav-item px-4 py-3 rounded-lg text-body-md font-medium transition-colors ${
                pathname === '/offers' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              Penawaran
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`mobile-nav-item px-4 py-3 rounded-lg text-body-md font-medium transition-colors ${
                pathname === '/about' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              Tentang Kami
            </Link>
            <Link
              to="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className={`mobile-nav-item px-4 py-3 rounded-lg text-body-md font-medium transition-colors ${
                pathname === '/how-it-works' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              Cara Kerja
            </Link>

            <hr className="border-outline-variant my-2" />

            {/* Quick Actions for authenticated users */}
            {isAuthenticated && user && (
              <>
                {user.role === 'seeker' && (
                  <Link
                    to="/anda/home"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mobile-nav-item px-4 py-3 rounded-lg text-body-md font-medium text-on-surface hover:bg-surface-container transition-colors"
                  >
                    Dasbor Saya
                  </Link>
                )}
                {user.role === 'owner' && (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mobile-nav-item px-4 py-3 rounded-lg text-body-md font-medium text-on-surface hover:bg-surface-container transition-colors"
                  >
                    Dasbor Pemilik
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mobile-nav-item px-4 py-3 rounded-lg text-body-md font-medium text-on-surface hover:bg-surface-container transition-colors"
                  >
                    Mode Admin
                  </Link>
                )}
                <Link
                  to="/chat"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mobile-nav-item px-4 py-3 rounded-lg text-body-md font-medium text-on-surface hover:bg-surface-container transition-colors"
                >
                  Pesan
                </Link>
                <Link
                  to="/watchlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mobile-nav-item px-4 py-3 rounded-lg text-body-md font-medium text-on-surface hover:bg-surface-container transition-colors"
                >
                  Watchlist
                </Link>

                <hr className="border-outline-variant my-2" />

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="mobile-nav-item px-4 py-3 rounded-lg text-body-md font-medium text-error hover:bg-error-container transition-colors text-left"
                >
                  Keluar
                </button>
              </>
            )}

            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mobile-nav-item px-4 py-3 rounded-lg text-body-md font-medium text-on-surface hover:bg-surface-container transition-colors text-center"
                >
                  Masuk
                </Link>
                <Link
                  to="/register?role=owner"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mobile-nav-item nav-cta px-4 py-3 rounded-lg bg-primary text-on-primary text-body-md font-medium text-center"
                >
                  Pasang Iklan
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
