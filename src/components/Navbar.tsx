import React, { useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Shield, User, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useSettingsStore } from '../stores/settingsStore';
import { BrandName } from './BrandName';

export const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, token, logout } = useAuthStore();
  const { settings } = useSettingsStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
    logout();
    navigate('/');
  };

  // Don't show navbar on dashboard pages as they have their own sidebars
  if (pathname.includes('/dashboard') || pathname.includes('/admin') || pathname.includes('/anda/home')) {
    return null;
  }

  return (
    <div className="w-full sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/50">
      <header className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 cursor-pointer group">
          {settings.logo_url ? (
            <img
              src={settings.logo_url}
              alt={settings.site_name || 'Logo'}
              className="h-9 w-auto object-contain rounded-xl"
            />
          ) : (
            <div className="bg-emerald-500/10 text-emerald-600 p-2 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-emerald-500/15">
              <Sparkles className="w-4 h-4 fill-emerald-600 transition-transform duration-500 group-hover:rotate-12" />
            </div>
          )}
          <BrandName className="text-base font-black tracking-tight text-slate-900" />
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`text-[13px] font-bold transition-all duration-200 cursor-pointer ${
              pathname === '/' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-950'
            }`}
          >
            Beranda
          </Link>
          <Link
            to="/search"
            className={`text-[13px] font-bold transition-all duration-200 cursor-pointer ${
              pathname.startsWith('/search') ? 'text-slate-900' : 'text-slate-400 hover:text-slate-950'
            }`}
          >
            Cari Kost
          </Link>
          <Link
            to={token ? "/watchlist" : "/login"}
            className={`text-[13px] font-bold transition-all duration-200 cursor-pointer ${
              pathname.startsWith('/watchlist') ? 'text-slate-900' : 'text-slate-400 hover:text-slate-950'
            }`}
          >
            Watchlist
          </Link>
          <Link
            to={token ? "/chat" : "/login"}
            className={`text-[13px] font-bold transition-all duration-200 cursor-pointer ${
              pathname.startsWith('/chat') ? 'text-slate-900' : 'text-slate-400 hover:text-slate-950'
            }`}
          >
            Pesan Masuk
          </Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-5">
          {token && user ? (
            <>
              <div 
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="w-9 h-9 rounded-xl bg-slate-200 overflow-hidden border border-slate-200 cursor-pointer flex-shrink-0 transition-transform active:scale-95 flex items-center justify-center text-slate-400">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-56 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">
                          {user.name?.charAt(0).toUpperCase()}
                      </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-800 truncate leading-none">{user.name}</p>
                        <p className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-wider leading-none">
                          {user.role === 'admin' ? 'Administrator' : user.role === 'owner' ? 'Pemilik Kost' : 'Pencari Kost'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-2 space-y-0.5">
                      {user.role === 'seeker' && (
                        <Link
                          to="/anda/home"
                          onClick={() => setDropdownOpen(false)}
                          className="group flex w-[calc(100%-16px)] mx-2 items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                          <span>Dasbor Saya</span>
                        </Link>
                      )}

                      {user.role === 'owner' && (
                        <Link
                          to="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="group flex w-[calc(100%-16px)] mx-2 items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                          <span>Dasbor Pemilik</span>
                        </Link>
                      )}

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="group flex w-[calc(100%-16px)] mx-2 items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        >
                          <Shield className="h-4 w-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
                          <span>Mode Admin</span>
                        </Link>
                      )}
                      
                      <hr className="border-slate-100 my-1 mx-2" />
                      
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleLogout();
                        }}
                        className="group flex w-[calc(100%-16px)] mx-2 items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-bold text-red-500 hover:bg-rose-50 hover:text-red-700 transition-colors"
                      >
                        <LogOut className="h-4 w-4 text-rose-400 group-hover:text-red-650 transition-colors" />
                        <span>Keluar</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/login"
                className="text-xs font-bold text-slate-500 hover:text-slate-950 px-2 py-2 transition-colors cursor-pointer"
              >
                Masuk
              </Link>
              <Link 
                to="/register"
                className="border border-slate-950 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-full hover:bg-slate-950 hover:text-white transition-all duration-200 active:scale-95 shadow-sm cursor-pointer"
              >
                Daftar
              </Link>
            </>
          )}
        </div>

      </header>
    </div>
  );
};
