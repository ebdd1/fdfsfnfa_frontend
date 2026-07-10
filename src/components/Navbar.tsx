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
    <header className="w-full top-0 sticky z-40 transition-all duration-300" style={{ padding: '0 16px', marginTop: '12px' }}>
      {/* Modern Gradient Navbar Container */}
      <div className="relative w-full overflow-hidden rounded-2xl" style={{
        background: 'rgba(0, 74, 198, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 4px 24px rgba(0, 74, 198, 0.12), 0 0 1px rgba(0, 74, 198, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.25)',
      }}>
        {/* Subtle inner glow effect */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 50%)',
        }} />

        {/* Full width navbar content */}
        <div className="w-full px-margin-mobile md:px-margin-desktop py-stack-sm flex justify-between items-center relative">
          {/* Logo */}
          <Link to="/" className="nav-logo flex items-center gap-2 cursor-pointer group">
            <span className="material-symbols-outlined text-white font-bold text-2xl transition-transform duration-200 group-hover:scale-110" style={{ fontVariationSettings: "'FILL' 1" }}>
              domain
            </span>
            <h1 className="font-headline-md text-headline-md font-bold text-white tracking-tight">
              {siteName}
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-stack-lg">
            <Link to="/" className={`nav-link text-label-md font-label-md transition-colors duration-200 ${pathname === '/' ? 'text-white' : 'text-white/80 hover:text-white'}`}>
              Beranda
            </Link>
            <Link to="/search" className={`nav-link text-label-md font-label-md transition-colors duration-200 ${pathname.startsWith('/search') ? 'text-white' : 'text-white/80 hover:text-white'}`}>
              Terverifikasi
            </Link>
            <Link to="/search?filter=promo" className={`nav-link text-label-md font-label-md transition-colors duration-200 ${pathname === '/offers' ? 'text-white' : 'text-white/80 hover:text-white'}`}>
              Penawaran
            </Link>
            <Link to="/about" className={`nav-link text-label-md font-label-md transition-colors duration-200 ${pathname === '/about' ? 'text-white' : 'text-white/80 hover:text-white'}`}>
              Tentang Kami
            </Link>
            <Link to="/how-it-works" className={`nav-link text-label-md font-label-md transition-colors duration-200 ${pathname === '/how-it-works' ? 'text-white' : 'text-white/80 hover:text-white'}`}>
              Cara Kerja
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-stack-md">
            {isAuthenticated && user ? (
              <>
                {/* Notifications */}
                <Link to="/chat" aria-label="Notifikasi" className="hidden md:flex items-center justify-center w-10 h-10 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 relative">
                  <span className="material-symbols-outlined">notifications</span>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full" />
                </Link>

                {/* User Dropdown */}
                <div className="relative hidden md:block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                  <button aria-label="Menu profil pengguna" aria-expanded={dropdownOpen} className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 cursor-pointer hover:border-white/50 hover:scale-105 transition-all duration-200">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-white/20 flex items-center justify-center text-white font-semibold text-sm">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>

                  {dropdownOpen && (
                    <div className="nav-dropdown absolute right-0 mt-3 w-64 rounded-xl shadow-elevation-hover border border-white/20 overflow-hidden z-50" style={{ background: 'rgba(255,255,255,0.98)' }}>
                      <div className="px-stack-md py-stack-md border-b border-gray-200 flex items-center gap-3">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt={user.name} className="w-12 h-12 rounded-lg object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-primary-container flex items-center justify-center text-white font-bold text-lg">
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

                      <div className="py-2">
                        {user.role === 'seeker' && (
                          <Link to="/anda/home" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-stack-md py-2.5 text-body-sm text-on-surface hover:bg-surface-container-low transition-colors">
                            <LayoutDashboard className="w-5 h-5 text-on-surface-variant" />
                            <span>Dasbor Saya</span>
                          </Link>
                        )}
                        {user.role === 'owner' && (
                          <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-stack-md py-2.5 text-body-sm text-on-surface hover:bg-surface-container-low transition-colors">
                            <LayoutDashboard className="w-5 h-5 text-on-surface-variant" />
                            <span>Dasbor Pemilik</span>
                          </Link>
                        )}
                        {user.role === 'admin' && (
                          <Link to="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-stack-md py-2.5 text-body-sm text-on-surface hover:bg-surface-container-low transition-colors">
                            <Shield className="w-5 h-5 text-on-surface-variant" />
                            <span>Mode Admin</span>
                          </Link>
                        )}
                        <Link to="/watchlist" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-stack-md py-2.5 text-body-sm text-on-surface hover:bg-surface-container-low transition-colors">
                          <span className="material-symbols-outlined text-on-surface-variant">bookmark</span>
                          <span>Watchlist</span>
                        </Link>
                        <Link to="/chat" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-stack-md py-2.5 text-body-sm text-on-surface hover:bg-surface-container-low transition-colors">
                          <span className="material-symbols-outlined text-on-surface-variant">chat</span>
                          <span>Pesan</span>
                        </Link>
                        <hr className="my-2 border-surface-container-high" />
                        <button onClick={() => { setDropdownOpen(false); handleLogout(); }} className="flex items-center gap-3 px-stack-md py-2.5 text-body-sm text-error w-full hover:bg-error-container transition-colors">
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
                <Link to="/login" className="hidden md:block text-label-md font-label-md text-white/90 hover:text-white border border-white/30 hover:border-white/50 px-stack-sm py-2 rounded-lg transition-all duration-200 hover:bg-white/10">
                  Masuk
                </Link>
                <Link to="/register?role=owner" className="hidden md:flex items-center gap-2 px-stack-md py-2.5 bg-white text-primary rounded-lg text-label-md font-label-md font-semibold hover:bg-white/90 transition-all duration-200 hover:scale-105">
                  <Plus className="w-4 h-4" />
                  Pasang Iklan
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'} aria-expanded={mobileMenuOpen} className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-white hover:bg-white/10 transition-colors duration-200">
              {mobileMenuOpen ? (
                <span className="material-symbols-outlined text-2xl">close</span>
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Glass Effect */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/20" style={{
            background: 'rgba(0, 53, 148, 0.9)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}>
            <nav className="px-margin-mobile py-stack-md flex flex-col gap-1">
              {isAuthenticated && user && (
                <div className="flex items-center gap-3 p-3 mb-2 rounded-xl border border-white/20" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-white overflow-hidden shrink-0">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg font-bold">{user.name?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-body-sm font-semibold text-white truncate">{user.name}</p>
                    <p className="text-label-sm text-white/70 capitalize">
                      {user.role === 'admin' ? 'Administrator' : user.role === 'owner' ? 'Pemilik Kost' : 'Pencari Kost'}
                    </p>
                  </div>
                </div>
              )}

              <Link to="/" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-item px-4 py-3 rounded-lg text-body-md font-medium transition-colors ${pathname === '/' ? 'bg-white/20 text-white' : 'text-white/90 hover:bg-white/10'}`}>
                Beranda
              </Link>
              <Link to="/search" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-item px-4 py-3 rounded-lg text-body-md font-medium transition-colors ${pathname.startsWith('/search') ? 'bg-white/20 text-white' : 'text-white/90 hover:bg-white/10'}`}>
                Terverifikasi
              </Link>
              <Link to="/search?filter=promo" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-item px-4 py-3 rounded-lg text-body-md font-medium transition-colors ${pathname === '/offers' ? 'bg-white/20 text-white' : 'text-white/90 hover:bg-white/10'}`}>
                Penawaran
              </Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-item px-4 py-3 rounded-lg text-body-md font-medium transition-colors ${pathname === '/about' ? 'bg-white/20 text-white' : 'text-white/90 hover:bg-white/10'}`}>
                Tentang Kami
              </Link>
              <Link to="/how-it-works" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-item px-4 py-3 rounded-lg text-body-md font-medium transition-colors ${pathname === '/how-it-works' ? 'bg-white/20 text-white' : 'text-white/90 hover:bg-white/10'}`}>
                Cara Kerja
              </Link>

              <hr className="border-white/20 my-2" />

              {isAuthenticated && user && (
                <>
                  {user.role === 'seeker' && (
                    <Link to="/anda/home" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-item px-4 py-3 rounded-lg text-body-md font-medium text-white/90 hover:bg-white/10 transition-colors">
                      Dasbor Saya
                    </Link>
                  )}
                  {user.role === 'owner' && (
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-item px-4 py-3 rounded-lg text-body-md font-medium text-white/90 hover:bg-white/10 transition-colors">
                      Dasbor Pemilik
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-item px-4 py-3 rounded-lg text-body-md font-medium text-white/90 hover:bg-white/10 transition-colors">
                      Mode Admin
                    </Link>
                  )}
                  <Link to="/chat" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-item px-4 py-3 rounded-lg text-body-md font-medium text-white/90 hover:bg-white/10 transition-colors">
                    Pesan
                  </Link>
                  <Link to="/watchlist" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-item px-4 py-3 rounded-lg text-body-md font-medium text-white/90 hover:bg-white/10 transition-colors">
                    Watchlist
                  </Link>
                  <hr className="border-white/20 my-2" />
                  <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }} className="mobile-nav-item px-4 py-3 rounded-lg text-body-md font-medium text-red-300 hover:bg-red-500/20 transition-colors text-left">
                    Keluar
                  </button>
                </>
              )}

              {!isAuthenticated && (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-item px-4 py-3 rounded-lg text-body-md font-medium text-white/90 hover:bg-white/10 transition-colors text-center border border-white/30">
                    Masuk
                  </Link>
                  <Link to="/register?role=owner" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-item px-4 py-3 rounded-lg bg-white text-primary text-body-md font-semibold text-center hover:bg-white/90 transition-colors">
                    Pasang Iklan
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
