import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useSettingsStore } from '../stores/settingsStore';
import { LogoText } from './LogoText';
import {
  Shield,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Home,
  MapPin,
  Plus,
  Heart,
  MessageCircle,
  ChevronDown,
} from 'lucide-react';

const NAV_LINKS = [
  { to: '/', label: 'Beranda', icon: Home },
  { to: '/search', label: 'Cari Kost', icon: MapPin },
  { to: '/watchlist', label: 'Watchlist', icon: Heart, auth: true },
  { to: '/chat', label: 'Pesan', icon: MessageCircle, auth: true },
];

export const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { settings } = useSettingsStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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

  const isActive = (to: string) => {
    if (to === '/') return pathname === '/';
    return pathname.startsWith(to);
  };

  // Don't show navbar on dashboard pages
  if (pathname.includes('/dashboard') || pathname.includes('/admin') || pathname.includes('/anda/home')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50">
      {/* Backdrop for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <nav className="bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 cursor-pointer group flex-shrink-0">
              {settings.logo_url ? (
                <img
                  src={settings.logo_url}
                  alt={settings.site_name || 'KostFind'}
                  className="h-9 w-auto object-contain rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-200"
                />
              ) : (
                <LogoText />
              )}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                // Skip auth-required links if not logged in
                if (link.auth && !isAuthenticated) return null;
                const Icon = link.icon;
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.auth && !isAuthenticated ? '/login' : link.to}
                    className={`
                      group relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer
                      ${active
                        ? 'text-[#004ac6] bg-[#004ac6]/5'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }
                    `}
                  >
                    <Icon className={`w-4 h-4 transition-transform duration-200 ${active ? '' : 'group-hover:scale-110'}`} />
                    {link.label}
                    {active && (
                      <span className="absolute -bottom-[25px] left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#004ac6] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated && user ? (
                <div
                  ref={dropdownRef}
                  className="relative"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <button className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-slate-100 transition-colors duration-200 cursor-pointer">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#004ac6] to-[#003a9e] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        user.name?.charAt(0).toUpperCase() || 'U'
                      )}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white/98 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-200/50 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#004ac6] to-[#003a9e] flex items-center justify-center text-white font-bold text-base shadow-sm">
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            user.name?.charAt(0).toUpperCase() || 'U'
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-slate-800 truncate leading-tight">{user.name}</p>
                          <p className="text-xs font-medium text-slate-400 mt-0.5 leading-tight">
                            {user.role === 'admin' ? 'Administrator' : user.role === 'owner' ? 'Pemilik Kost' : 'Pencari Kost'}
                          </p>
                        </div>
                      </div>

                      {/* Dashboard Links */}
                      <div className="mt-2 px-2">
                        {user.role === 'seeker' && (
                          <Link
                            to="/anda/home"
                            onClick={() => setDropdownOpen(false)}
                            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-[#004ac6]/5 hover:text-[#004ac6] transition-colors duration-150"
                          >
                            <LayoutDashboard className="w-5 h-5 text-slate-400 group-hover:text-[#004ac6] transition-colors" />
                            Dasbor Saya
                          </Link>
                        )}
                        {user.role === 'owner' && (
                          <Link
                            to="/dashboard"
                            onClick={() => setDropdownOpen(false)}
                            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-[#004ac6]/5 hover:text-[#004ac6] transition-colors duration-150"
                          >
                            <LayoutDashboard className="w-5 h-5 text-slate-400 group-hover:text-[#004ac6] transition-colors" />
                            Dasbor Pemilik
                          </Link>
                        )}
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setDropdownOpen(false)}
                            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-[#004ac6]/5 hover:text-[#004ac6] transition-colors duration-150"
                          >
                            <Shield className="w-5 h-5 text-slate-400 group-hover:text-[#004ac6] transition-colors" />
                            Mode Admin
                          </Link>
                        )}
                      </div>

                      <hr className="border-slate-100 my-2" />

                      {/* Logout */}
                      <div className="px-2">
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            handleLogout();
                          }}
                          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-150 w-full"
                        >
                          <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-500 transition-colors" />
                          Keluar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors duration-200 cursor-pointer"
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2.5 text-sm font-bold text-white bg-[#004ac6] hover:bg-[#003a9e] rounded-xl shadow-sm shadow-[#004ac6]/25 hover:shadow-md hover:shadow-[#004ac6]/30 transition-all duration-200 cursor-pointer flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Daftar
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-slate-700" />
              ) : (
                <Menu className="w-6 h-6 text-slate-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-4 py-4 space-y-1 border-t border-slate-100 bg-white">
            {NAV_LINKS.map((link) => {
              if (link.auth && !isAuthenticated) return null;
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.auth && !isAuthenticated ? '/login' : link.to}
                  className={`
                    group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer
                    ${active
                      ? 'text-[#004ac6] bg-[#004ac6]/5'
                      : 'text-slate-600 hover:bg-slate-100'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}

            {!isAuthenticated && (
              <div className="pt-3 border-t border-slate-100 mt-3 space-y-2">
                <Link
                  to="/login"
                  className="block w-full px-4 py-3 text-sm font-semibold text-center text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="block w-full px-4 py-3 text-sm font-bold text-center text-white bg-[#004ac6] rounded-xl hover:bg-[#003a9e] transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
