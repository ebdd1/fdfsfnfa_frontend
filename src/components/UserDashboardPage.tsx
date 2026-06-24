import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useSettingsStore } from '../stores/settingsStore';
import { InboxPage } from './InboxPage';
import { WatchlistPage } from './WatchlistPage';
import { SeekerOrdersSection } from '../pages/SeekerOrdersSection';
import { SeekerSettings } from './dashboard/SeekerSettings';
import { LogoText } from './LogoText';
import { SearchPageContainer } from '../pages/SearchPageContainer';
import { useWatchlist } from '../hooks/useWatchlist';
import { useConversations } from '../hooks/useConversations';
import { useProperties } from '../hooks/useProperties';
import { useMyOrders } from '../hooks/useOrders';
import { useNotifications } from '../hooks/useNotifications';
import {
  LayoutDashboard,
  Home,
  Heart,
  Mail,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  User,
  X,
  Menu,
  Bell,
  Search,
  LogOut,
  Shield,
  MapPin,
  Building2,
  MessageSquare,
  Settings
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type SeekerSection = 'overview' | 'leases' | 'watchlist' | 'chat' | 'search' | 'settings';

// Bottom nav: 4 thumb-reachable items. Pesan Masuk diakses via sidebar/bottom-sheet.
// Keep it minimal — only the 4 most essential daily actions.
const BOTTOM_NAV: { key: SeekerSection; label: string; icon: LucideIcon }[] = [
  { key: 'overview', label: 'Beranda', icon: LayoutDashboard },
  { key: 'search', label: 'Cari Kost', icon: Search },
  { key: 'watchlist', label: 'Tersimpan', icon: Heart },
  { key: 'leases', label: 'Sewa Saya', icon: MessageSquare },
];

export const UserDashboardPage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { settings } = useSettingsStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Real data sources
  const { watchlistIds, toggleWatchlist } = useWatchlist();
  const {
    conversations,
    messages,
    selectedConversationId,
    selectConversation,
    sendMessage,
    typingUsers,
    onlineUsers,
    notifyTyping,
    queuedMessages,
    retryFailedMessage,
  } = useConversations();
  const { properties } = useProperties();
  const rooms = properties.flatMap((p) => p.rooms || []);

  // Active rentals from real order data (orders where I'm the seeker and status is active).
  const { orders: myOrders } = useMyOrders();
  const activeLeases = myOrders.filter((o) => o.seekerId === user?.id && o.status === 'active');

  // Smart alerts have a backend (/alerts) but no full UI flow yet; keep empty
  // until that feature is wired rather than fabricating saved alerts.
  const alerts: never[] = [];

  // Navigation helper mapping legacy tab names to real routes.
  const onNavigate = (tab: string) => {
    if (tab === 'landing') navigate('/');
    else if (tab === 'search') navigate('/search');
    else if (tab === 'dashboard') navigate('/dashboard');
    else if (tab === 'admin') navigate('/admin');
  };
  const onSelectProperty = (id: string) => navigate(`/property/${id}`);

  const sectionParam = searchParams.get('section');
  const defaultSection =
    sectionParam === 'watchlist' || sectionParam === 'chat' || sectionParam === 'leases' || sectionParam === 'search' || sectionParam === 'settings'
      ? (sectionParam as SeekerSection)
      : 'overview';

  // Sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Section state
  const [activeSection, setActiveSection] = useState<SeekerSection>(defaultSection);

  // Mobile menu drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const hasUnread = conversations.some((c) => c.unread_count > 0);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Switching section on mobile should always close the drawer.
  const goToSection = (key: SeekerSection) => {
    setActiveSection(key);
    setIsMobileMenuOpen(false);
  };

  // Sync sectionParam with activeSection state
  React.useEffect(() => {
    if (sectionParam === 'watchlist' || sectionParam === 'chat' || sectionParam === 'leases' || sectionParam === 'search' || sectionParam === 'settings') {
      setActiveSection(sectionParam as any);
    } else if (!sectionParam) {
      setActiveSection('overview');
    }
  }, [sectionParam]);

  // Auto-open thread from ?c= deep-link.
  React.useEffect(() => {
    const c = searchParams.get('c');
    if (c && conversations.length > 0) {
      const found = conversations.find((conv) => conv.id === c);
      if (found) selectConversation(c);
    }
  }, [searchParams.get('c'), conversations, selectConversation]);

  // Dropdown states
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Relative-time formatter for notification timestamps.
  const timeAgo = (iso?: string) => {
    if (!iso) return '';
    const diff = Date.now() - new Date(iso).getTime();
    if (Number.isNaN(diff)) return '';
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'baru saja';
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}j`;
    const d = Math.floor(h / 24);
    return `${d}h`;
  };

  // Real rental notifications from the backend (order lifecycle events).
  const { notifications, unreadCount: notifUnread, markRead, markAllRead } = useNotifications();

  // Open a notification: mark read, then deep-link to the related order section.
  const openNotification = (n: { id: string; isRead: boolean; orderId: string | null }) => {
    setIsNotificationsOpen(false);
    if (!n.isRead) markRead(n.id);
    // Rental notifications point to an order → show the rental history section.
    if (n.orderId) goToSection('leases');
  };

  // Derived, real metrics for the overview.
  const unreadCount = conversations.reduce((sum, c) => sum + (c.unread_count || 0), 0);
  const firstName = user?.name?.split(' ')[0] || 'Sahabat';
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 11) return 'Selamat pagi';
    if (h < 15) return 'Selamat siang';
    if (h < 19) return 'Selamat sore';
    return 'Selamat malam';
  })();

  const fmtIDR = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

  // Kost the seeker already rents (to exclude from recommendations).
  const rentedPropertyIds = new Set(activeLeases.map((l) => l.property?.id).filter(Boolean));

  // Recommendations: verified kost with at least one available room, freshest first,
  // excluding ones already rented. Real data only.
  const recommendations = properties
    .filter((p) => !rentedPropertyIds.has(p.id))
    .filter((p) => (p.rooms || []).some((r) => r.status === 'available'))
    .slice(0, 8);

  const lowestPrice = (p: (typeof properties)[number]) => {
    const prices = (p.rooms || []).filter((r) => r.status === 'available').map((r) => r.price_monthly);
    return prices.length ? Math.min(...prices) : 0;
  };

  return (
    <div className="bg-slate-50 h-screen flex flex-col md:flex-row overflow-hidden font-sans relative">

      {/* MOBILE TOP BAR */}
      <header className="flex md:hidden items-center justify-between px-3 h-14 bg-white shrink-0 z-30 border-b border-slate-100">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-1.5 min-w-0">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Buka menu"
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors active:scale-90 cursor-pointer shrink-0"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center cursor-pointer min-w-0" onClick={() => navigate('/')}>
            {settings.logo_url ? (
              <img src={settings.logo_url} alt={settings.site_name} className="h-7 w-auto object-contain rounded-lg" />
            ) : (
              <LogoText />
            )}
          </div>
        </div>

        {/* Right: Search + Chat + Notification */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={() => navigate('/search')}
            aria-label="Cari Kost"
            className="p-2.5 text-slate-600 hover:bg-[var(--primary-50)] hover:text-[var(--primary-600)] rounded-xl transition-colors active:scale-90 cursor-pointer"
          >
            <Search className="w-[22px] h-[22px]" />
          </button>

          <button
            onClick={() => setActiveSection('chat')}
            aria-label="Pesan Masuk"
            className="relative p-2.5 text-slate-600 hover:bg-sky-50 hover:text-sky-600 rounded-xl transition-colors active:scale-90 cursor-pointer"
          >
            <MessageSquare className="w-[22px] h-[22px]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-[16px] px-0.5 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            aria-label="Notifikasi"
            className="relative p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors active:scale-90 cursor-pointer"
          >
            <Bell className="w-[22px] h-[22px]" />
            {notifUnread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>
        </div>
      </header>

      {/* MOBILE NOTIFICATIONS SHEET */}
      {isNotificationsOpen && (
        <div className="md:hidden fixed inset-0 z-50" onClick={() => setIsNotificationsOpen(false)}>
          <div className="absolute inset-0 bg-slate-900/40 animate-in fade-in duration-200" />
          <div
            className="absolute top-14 right-3 left-3 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Notifikasi</span>
              {notifUnread > 0 && (
                <button onClick={() => markAllRead()} className="text-xs font-bold text-[var(--primary-600)] hover:text-[var(--primary-700)] cursor-pointer">
                  Tandai dibaca
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="px-5 py-10 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-3 text-slate-300">
                  <Bell className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold text-slate-600">Tidak ada notifikasi</p>
                <p className="text-xs text-slate-400 mt-0.5">Update proses sewa kost akan muncul di sini.</p>
              </div>
            ) : (
              <div className="max-h-[60vh] overflow-y-auto py-1">
                {notifications.filter(Boolean).map((n) => (
                  <button
                    key={n.id}
                    onClick={() => openNotification(n)}
                    className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left cursor-pointer ${n.isRead ? '' : 'bg-[var(--primary-50)]/40'}`}
                  >
                    <div className="relative w-10 h-10 rounded-xl bg-[var(--primary-50)] border border-[var(--primary-100)] flex items-center justify-center text-[var(--primary-600)] shrink-0">
                      <Home className="w-5 h-5" />
                      {!n.isRead && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-white" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-slate-800 truncate">{n.title}</p>
                        <span className="text-xs text-slate-400 shrink-0">{timeAgo(n.createdAt)}</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-snug line-clamp-2">{n.body}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/50 animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Panel */}
          <aside className="relative flex flex-col w-[280px] max-w-[82%] h-full bg-white shadow-2xl animate-in slide-in-from-left duration-250">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 h-14 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <LogoText />
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Tutup menu"
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile */}
            <div className="px-4 pt-4">
              <div className="flex items-center gap-3 p-3 bg-[var(--primary-50)]/60 rounded-2xl border border-[var(--primary-100)]/40">
                <div className="w-11 h-11 rounded-full bg-[var(--primary-100)] flex items-center justify-center text-[var(--primary-600)] overflow-hidden shrink-0">
                  {user?.avatar_url ? <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" /> : <User className="w-5 h-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-extrabold text-slate-900 truncate">{user?.name || 'Pencari Kost'}</p>
                  <span className="text-xs font-bold text-[var(--primary-700)] uppercase tracking-wide">Pencari Kost</span>
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 mb-1.5">Menu Utama</p>
              {([
                { key: 'overview', label: 'Ringkasan', icon: LayoutDashboard },
                { key: 'leases', label: 'Riwayat Sewa', icon: Home },
              ] as { key: SeekerSection; label: string; icon: LucideIcon }[]).map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => goToSection(key)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    activeSection === key ? 'bg-[var(--primary-50)] text-[var(--primary-700)]' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-[18px] h-[18px] shrink-0" />
                  <span className="text-left">{label}</span>
                </button>
              ))}

              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 mb-1.5 mt-4">Eksplorasi</p>
              {([
                { key: 'search', label: 'Cari Kost', icon: Search },
                { key: 'watchlist', label: 'Watchlist', icon: Heart },
                { key: 'chat', label: 'Pesan Masuk', icon: Mail },
              ] as { key: SeekerSection; label: string; icon: LucideIcon }[]).map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => goToSection(key)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    activeSection === key ? 'bg-[var(--primary-50)] text-[var(--primary-700)]' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="relative shrink-0">
                    <Icon className="w-[18px] h-[18px]" />
                    {key === 'chat' && hasUnread && <span className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--primary-500)] rounded-full" />}
                  </span>
                  <span className="flex-1 text-left">{label}</span>
                  {key === 'chat' && hasUnread && (
                    <span className="text-xs font-black bg-[var(--primary-100)] text-[var(--primary-700)] px-1.5 py-0.5 rounded-full">Baru</span>
                  )}
                </button>
              ))}

              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 mb-1.5 mt-4">Akun</p>
              <button
                onClick={() => goToSection('settings')}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  activeSection === 'settings' ? 'bg-[var(--primary-50)] text-[var(--primary-700)]' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Settings className="w-[18px] h-[18px] shrink-0" />
                <span className="text-left">Pengaturan</span>
              </button>
            </nav>

            {/* Footer */}
            <div className="px-3 py-3 border-t border-slate-100 space-y-1 shrink-0">
              <button
                onClick={() => { setIsMobileMenuOpen(false); navigate('/dashboard'); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Sparkles className="w-[18px] h-[18px] text-[var(--primary-500)] shrink-0" />
                <span>Mode Pemilik Kost</span>
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); navigate('/'); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-[18px] h-[18px] shrink-0" />
                <span>Kembali Beranda</span>
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); logout(); navigate('/'); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-[18px] h-[18px] shrink-0" />
                <span>Keluar</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* DESKTOP SIDEBAR NAVIGATION */}
      <aside
        className={`bg-white border-r border-slate-200 hidden md:flex flex-col justify-between shrink-0 h-screen transition-all duration-300 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className={`space-y-8 ${isSidebarCollapsed ? 'p-3' : 'p-5'}`}>
          {/* Brand */}
          <div className={`flex items-center ${isSidebarCollapsed ? 'flex-col gap-3 justify-center' : 'justify-between'} px-1`}>
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate?.('landing')}>
              {settings.logo_url ? (
                <img src={settings.logo_url} alt={settings.site_name} className="h-9 w-auto object-contain rounded-xl" />
              ) : (
                <LogoText />
              )}
            </div>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="rounded-lg border border-slate-200/60 p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
              title={isSidebarCollapsed ? "Tampilkan Sidebar" : "Sembunyikan Sidebar"}
            >
              {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          {/* User Profile Summary */}
          {!isSidebarCollapsed ? (
            <div className="flex items-center gap-3 px-3 py-3 bg-[var(--primary-50)]/50 rounded-xl border border-[var(--primary-100)]/30 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[var(--primary-100)] flex items-center justify-center text-[var(--primary-600)] border border-slate-200 shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-sm font-extrabold text-slate-900 leading-tight truncate">{user?.name || 'Pencari Kost'}</p>
                <span className="text-xs font-bold text-[var(--primary-700)] uppercase tracking-wide block mt-0.5">Pencari Kost</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-full bg-[var(--primary-100)]/50 flex items-center justify-center text-[var(--primary-600)] border border-[var(--primary-200)]" title={user?.name || "Pencari Kost"}>
                <User className="w-5 h-5" />
              </div>
            </div>
          )}

          {/* Menu Items */}
          <nav className="flex flex-col gap-1">
            {/* CATEGORY 1: AKUN SAYA */}
            <div className="space-y-1 w-full mb-4">
              {!isSidebarCollapsed && (
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 mb-2 font-mono text-left">Menu Utama</p>
              )}

              <button
                onClick={() => {
                  setActiveSection('overview');
                  if (isSidebarCollapsed) setIsSidebarCollapsed(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors cursor-pointer ${
                  isSidebarCollapsed ? 'justify-center rounded-xl w-10 h-10 mx-auto p-0' : 'rounded-xl text-sm font-medium animate-in fade-in duration-200'
                } ${activeSection === 'overview'
                  ? 'bg-[var(--primary-50)] text-[var(--primary-700)] border border-[var(--primary-100)]/30 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Ringkasan"
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span>Ringkasan</span>}
              </button>

              <button
                onClick={() => {
                  setActiveSection('leases');
                  if (isSidebarCollapsed) setIsSidebarCollapsed(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors cursor-pointer ${
                  isSidebarCollapsed ? 'justify-center rounded-xl w-10 h-10 mx-auto p-0' : 'rounded-xl text-sm font-medium animate-in fade-in duration-200'
                } ${activeSection === 'leases'
                  ? 'bg-[var(--primary-50)] text-[var(--primary-700)] border border-[var(--primary-100)]/30 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Riwayat Sewa"
              >
                <Home className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span>Riwayat Sewa</span>}
              </button>
            </div>

            {/* CATEGORY 2: EKSPLORASI */}
            <div className="space-y-1 w-full">
              {!isSidebarCollapsed && (
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 mb-2 font-mono text-left">Eksplorasi</p>
              )}

              <button
                onClick={() => {
                  setActiveSection('search');
                  if (isSidebarCollapsed) setIsSidebarCollapsed(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors cursor-pointer ${
                  isSidebarCollapsed ? 'justify-center rounded-xl w-10 h-10 mx-auto p-0' : 'rounded-xl text-sm font-medium animate-in fade-in duration-200'
                } ${activeSection === 'search'
                  ? 'bg-[var(--primary-50)] text-[var(--primary-700)] border border-[var(--primary-100)]/30 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Cari Kost"
              >
                <Search className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span>Cari Kost</span>}
              </button>

              <button
                onClick={() => {
                  setActiveSection('watchlist');
                  if (isSidebarCollapsed) setIsSidebarCollapsed(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors cursor-pointer ${
                  isSidebarCollapsed ? 'justify-center rounded-xl w-10 h-10 mx-auto p-0' : 'rounded-xl text-sm font-medium animate-in fade-in duration-200'
                } ${activeSection === 'watchlist'
                  ? 'bg-[var(--primary-50)] text-[var(--primary-700)] border border-[var(--primary-100)]/30 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Watchlist"
              >
                <Heart className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span>Watchlist</span>}
              </button>

              <button
                onClick={() => {
                  setActiveSection('chat');
                  if (isSidebarCollapsed) setIsSidebarCollapsed(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors cursor-pointer ${
                  isSidebarCollapsed ? 'justify-center rounded-xl w-10 h-10 mx-auto p-0' : 'rounded-xl text-sm font-medium animate-in fade-in duration-200'
                } ${activeSection === 'chat'
                  ? 'bg-[var(--primary-50)] text-[var(--primary-700)] border border-[var(--primary-100)]/30 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Pesan Masuk"
              >
                <Mail className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>Pesan Masuk</span>
                    {conversations.some(c => c.unread_count > 0) && (
                      <span className="bg-[var(--primary-600)] text-white text-xs px-2 py-0.5 rounded-full font-semibold">Baru</span>
                    )}
                  </div>
                )}
              </button>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className={`border-t border-slate-200 hidden md:block ${isSidebarCollapsed ? 'p-3' : 'p-5 pt-4'}`}>
          <button
            onClick={() => {
              onNavigate?.('landing');
              if (isSidebarCollapsed) setIsSidebarCollapsed(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-655 hover:text-slate-900 hover:bg-slate-150/50 transition-colors cursor-pointer ${
              isSidebarCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Kembali Beranda"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            {!isSidebarCollapsed && <span>Kembali Beranda</span>}
          </button>
        </div>
      </aside>

      {/* RIGHT PANE WORKSPACE */}
      <div className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="hidden md:flex h-16 border-b border-slate-200 bg-white items-center justify-between px-8 shrink-0 relative z-30">

          {/* Breadcrumbs */}
          <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-400">
            <button
              onClick={() => onNavigate?.('landing')}
              className="hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer font-bold"
            >
              {settings.logo_url ? (
                <img src={settings.logo_url} alt={settings.site_name} className="w-4 h-4 object-contain" />
              ) : (
                <LogoText className="text-xs font-black" />
              )}
            </button>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-slate-800 font-extrabold capitalize bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              {activeSection === 'overview'
                ? 'Profil Saya'
                : activeSection === 'leases'
                  ? 'Riwayat Sewa'
                  : activeSection === 'watchlist'
                    ? 'Watchlist'
                    : 'Pesan Masuk'}
            </span>
          </div>

          {/* Action / Controls on Right */}
          <div className="flex items-center gap-4">

            {/* Search CTA (Desktop) */}
            <button
              onClick={() => onNavigate?.('search')}
              className="hidden md:flex items-center gap-2.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 transition-all duration-200 w-52 text-left cursor-pointer group"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-500 transition-colors" />
              <span className="text-xs font-semibold text-slate-500">Cari Kost...</span>
              <span className="ml-auto text-[9px] text-slate-400 font-mono border border-slate-200 bg-white px-1.5 py-0.5 rounded shadow-sm">/</span>
            </button>

            {/* Search CTA (Mobile) */}
            <button
              onClick={() => onNavigate?.('search')}
              className="md:hidden p-2.5 text-slate-400 hover:text-slate-800 hover:bg-slate-50 border border-slate-200 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                }}
                className="relative p-2.5 text-slate-400 hover:text-slate-800 hover:bg-slate-50 border border-slate-200 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {notifUnread > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {isNotificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden">
                    <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                      <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Notifikasi</span>
                      {notifUnread > 0 && (
                        <button onClick={() => markAllRead()} className="text-xs font-bold text-[var(--primary-600)] hover:text-[var(--primary-700)] cursor-pointer">
                          Tandai dibaca
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto py-1">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-10 flex flex-col items-center text-center">
                          <div className="w-11 h-11 rounded-2xl bg-slate-50 flex items-center justify-center mb-2.5 text-slate-300">
                            <Bell className="w-5 h-5" />
                          </div>
                          <p className="text-sm font-bold text-slate-600">Tidak ada notifikasi</p>
                          <p className="text-xs text-slate-400 mt-0.5">Update proses sewa kost akan muncul di sini.</p>
                        </div>
                      ) : (
                        notifications.filter(Boolean).map((n) => (
                          <button
                            key={n.id}
                            onClick={() => openNotification(n)}
                            className={`w-full flex items-start gap-3 px-3 py-2.5 hover:bg-slate-50 transition-colors text-left cursor-pointer ${n.isRead ? '' : 'bg-[var(--primary-50)]/40'}`}
                          >
                            <div className="relative w-10 h-10 rounded-xl bg-[var(--primary-50)] border border-[var(--primary-100)] flex items-center justify-center text-[var(--primary-600)] shrink-0">
                              <Home className="w-5 h-5" />
                              {!n.isRead && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-white" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-bold text-slate-800 truncate">{n.title}</p>
                                <span className="text-xs text-slate-400 shrink-0">{timeAgo(n.createdAt)}</span>
                              </div>
                              <p className="text-xs text-slate-500 leading-snug line-clamp-2">{n.body}</p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationsOpen(false);
                }}
                className="flex items-center gap-2 p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all duration-200 cursor-pointer group"
              >
                {user?.avatar_url ? (
                  <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0">
                    <img src={user.avatar_url} alt={user.name || "Pencari Kost"} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-[var(--primary-100)] text-[var(--primary-700)] flex items-center justify-center font-black text-sm shrink-0">
                    {(user?.name || 'P')[0].toUpperCase()}
                  </div>
                )}
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Menu Panel */}
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">Masuk Sebagai</p>
                      <p className="text-sm font-black text-slate-800 leading-tight mt-0.5 truncate">{user?.name || 'Pencari Kost'}</p>
                      <p className="text-xs text-slate-400 font-semibold truncate mt-0.5">{user?.email || 'pencari@example.com'}</p>
                    </div>

                    <div className="py-1">
                      {user?.role === 'admin' && (
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          onNavigate?.('admin');
                        }}
                        className="w-full text-left px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Shield className="w-4 h-4 text-indigo-500" />
                        <span>Mode Admin</span>
                      </button>
                    )}

                      {user?.role !== 'owner' && (
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            onNavigate?.('dashboard');
                          }}
                          className="w-full text-left px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-[var(--primary-600)] flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-4 h-4 text-[var(--primary-500)]" />
                          <span>Mode Pemilik Kost</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          goToSection('settings');
                        }}
                        className="w-full text-left px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        <span>Pengaturan Akun</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-1 mt-1">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          logout();
                          onNavigate?.('landing');
                        }}
                        className="w-full text-left px-4 py-2 text-sm font-extrabold text-red-500 hover:bg-red-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>Keluar</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        </header>

        {/* WORKSPACE CONTENT */}
        {activeSection === 'search' ? (
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col pb-14 md:pb-0">
            <SearchPageContainer />
          </div>
        ) : activeSection === 'chat' ? (
          <div className="flex-1 min-h-0 overflow-hidden pb-14 md:pb-0">
            <InboxPage
              conversations={conversations}
              messages={messages}
              onSendMessage={sendMessage}
              onSelectConversation={selectConversation}
              selectedConversationId={selectedConversationId}
              typingUsers={typingUsers}
              onTyping={notifyTyping}
              onlineUsers={onlineUsers}
              queuedMessages={queuedMessages}
              onRetryMessage={retryFailedMessage}
            />
          </div>
        ) : activeSection === 'watchlist' ? (
          <div className="flex-1 min-h-0 overflow-hidden pb-14 md:pb-0">
            <WatchlistPage
              properties={properties}
              rooms={rooms}
              watchlist={watchlistIds}
              alerts={alerts}
              onToggleWatchlist={toggleWatchlist}
              onAddAlert={() => {}}
              onDeleteAlert={() => {}}
              onSelectProperty={onSelectProperty}
            />
          </div>
        ) : activeSection === 'settings' ? (
          <main className="flex-1 min-h-0 overflow-y-auto px-4 pt-4 pb-20 sm:px-6 md:p-8">
            <SeekerSettings user={user} onLogout={() => { logout(); navigate('/'); }} />
          </main>
        ) : (
          <main className="flex-1 min-h-0 overflow-y-auto space-y-6 px-4 pt-4 pb-20 sm:px-6 md:p-8 md:space-y-8">

            {activeSection === 'overview' && (
              <div className="space-y-5 md:space-y-6 animate-in fade-in duration-300">

                {/* ── Greeting + quick stats ── */}
                <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/70 p-5 sm:p-7 shadow-sm">
                  {/* Soft transparent green glows */}
                  <div className="absolute -top-16 -right-10 w-56 h-56 rounded-full bg-[var(--primary-400)]/15 blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-20 -left-12 w-56 h-56 rounded-full bg-teal-300/10 blur-3xl pointer-events-none" />

                  <div className="relative flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--primary-50)] ring-1 ring-[var(--primary-100)] overflow-hidden flex items-center justify-center shrink-0 text-[var(--primary-600)]">
                      {user?.avatar_url ? (
                        <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg font-black">{(user?.name || 'U')[0].toUpperCase()}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-400">{greeting},</p>
                      <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 truncate">
                        {firstName}
                        <Sparkles className="inline-block w-5 h-5 ml-1.5 text-amber-400 align-middle" />
                      </h1>
                    </div>
                  </div>

                  <p className="relative mt-3 text-sm text-slate-500 leading-relaxed max-w-md">
                    {activeLeases.length > 0
                      ? `Kamu punya ${activeLeases.length} sewa aktif${unreadCount > 0 ? ` · ${unreadCount} pesan belum dibaca` : ''}. Semoga betah di kost-mu!`
                      : 'Belum ada sewa aktif. Yuk cari kost impianmu sekarang.'}
                  </p>
                </div>

                {/* ── Real metric tiles ── */}
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                  {[
                    { key: 'leases' as const, label: 'Sewa Aktif', value: activeLeases.length, icon: Home, tint: 'bg-[var(--primary-50)] text-[var(--primary-600)]', accent: 'group-hover:border-[var(--primary-200)]', onClick: () => setActiveSection('leases') },
                    { key: 'watchlist' as const, label: 'Tersimpan', value: watchlistIds.length, icon: Heart, tint: 'bg-rose-50 text-rose-500', accent: 'group-hover:border-rose-200', onClick: () => setActiveSection('watchlist') },
                    { key: 'chat' as const, label: 'Pesan Baru', value: unreadCount, icon: MessageSquare, tint: 'bg-sky-50 text-sky-600', accent: 'group-hover:border-sky-200', onClick: () => setActiveSection('chat') },
                  ].map(({ key, label, value, icon: Icon, tint, accent, onClick }) => (
                    <button
                      key={key}
                      onClick={onClick}
                      className={`group flex flex-col bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-sm hover:shadow-md ${accent} active:scale-[0.98] transition-all text-left cursor-pointer`}
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${tint} group-hover:scale-110 transition-transform`}>
                          <Icon className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-none tabular-nums">{value}</p>
                      <p className="text-xs sm:text-xs font-semibold text-slate-500 mt-1.5">{label}</p>
                    </button>
                  ))}
                </div>

                {/* ── Active lease ── */}
                <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-4 bg-[var(--primary-500)] rounded-full" />
                      <h3 className="text-sm font-bold text-slate-800">Sewa Aktif Kamu</h3>
                    </div>
                    {activeLeases.length > 0 && (
                      <button
                        onClick={() => setActiveSection('leases')}
                        className="text-xs font-bold text-[var(--primary-600)] hover:text-[var(--primary-700)] flex items-center gap-1 cursor-pointer"
                      >
                        Semua <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {activeLeases.length === 0 ? (
                    <div className="px-5 py-10 flex flex-col items-center justify-center text-center">
                      <div className="w-14 h-14 bg-[var(--primary-50)] rounded-2xl flex items-center justify-center mb-4 text-[var(--primary-500)]">
                        <Home className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold text-slate-700 mb-1">Belum ada sewa aktif</p>
                      <p className="text-xs text-slate-400 mb-5 max-w-[15rem]">Cari kost terverifikasi dan ajukan sewa untuk mulai menghuni.</p>
                      <button
                        onClick={() => navigate('/search')}
                        className="inline-flex items-center gap-2 bg-[var(--primary-600)]] hover:bg-[var(--primary-700)]] text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm active:scale-95 transition-all cursor-pointer"
                      >
                        <Search className="w-4 h-4" /> Cari Kost Sekarang
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {activeLeases.map((lease) => {
                        const start = new Date(lease.startDate);
                        const end = new Date(start);
                        end.setMonth(end.getMonth() + lease.durationMonths);
                        const fmtDate = (d: Date) => d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
                        return (
                          <div key={lease.id} className="flex items-center gap-4 px-5 py-4">
                            <div className="w-12 h-12 rounded-xl bg-[var(--primary-50)] border border-[var(--primary-100)] flex items-center justify-center text-[var(--primary-600)] shrink-0">
                              <Home className="w-5 h-5" />
                            </div>
                            <div className="min-w-0 flex-1 text-left">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-bold text-slate-800 truncate">{lease.property?.name || 'Kost'}</p>
                                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary-50)] px-2 py-0.5 text-xs font-black uppercase tracking-wider text-[var(--primary-700)] shrink-0">
                                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary-500)]" /> Aktif
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5 truncate">
                                Kamar {lease.room?.roomNumber || '—'}{lease.property?.city ? ` · ${lease.property.city}` : ''}
                              </p>
                              <p className="text-xs text-slate-400 mt-0.5">{fmtDate(start)} — {fmtDate(end)} · {lease.durationMonths} bln</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-sm font-black text-slate-900">{fmtIDR(lease.priceMonthly)}</p>
                              <p className="text-xs text-slate-400">per bulan</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* ── Recommendations carousel ── */}
                {recommendations.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-1.5 h-4 bg-[var(--primary-500)] rounded-full" />
                        <h3 className="text-[15px] font-bold text-slate-800">Rekomendasi Buat Kamu</h3>
                      </div>
                      <button
                        onClick={() => navigate('/search')}
                        className="text-xs font-bold text-[var(--primary-600)] hover:text-[var(--primary-700)] flex items-center gap-1 cursor-pointer"
                      >
                        Lihat semua <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {recommendations.map((p) => {
                        const cover = p.media?.[0]?.url_medium || p.media?.[0]?.url_original || p.media?.[0]?.url_thumbnail;
                        const price = lowestPrice(p);
                        return (
                          <button
                            key={p.id}
                            onClick={() => onSelectProperty(p.id)}
                            className="group shrink-0 w-[240px] snap-start bg-white rounded-2xl border border-slate-200/70 shadow-sm hover:shadow-md hover:border-slate-300 transition-all overflow-hidden text-left cursor-pointer"
                          >
                            <div className="relative h-32 bg-slate-100 overflow-hidden">
                              {cover ? (
                                <img src={cover} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                  <Building2 className="w-8 h-8" />
                                </div>
                              )}
                              {p.is_verified && (
                                <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-xs font-black uppercase tracking-wider text-[var(--primary-700)] shadow-sm">
                                  <Shield className="w-2.5 h-2.5" /> Terverifikasi
                                </span>
                              )}
                            </div>
                            <div className="p-3.5">
                              <p className="text-sm font-bold text-slate-800 truncate">{p.name}</p>
                              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1 truncate">
                                <MapPin className="w-3 h-3 shrink-0" /> {p.location?.city || 'Lokasi tidak tersedia'}
                              </p>
                              <div className="mt-2.5 flex items-end justify-between">
                                <div>
                                  <p className="text-xs text-slate-400 leading-none">mulai</p>
                                  <p className="text-sm font-black text-[var(--primary-600)]">{price > 0 ? fmtIDR(price) : '—'}</p>
                                </div>
                                <span className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-150 px-2 py-1 rounded-lg">
                                  {(p.rooms || []).filter((r) => r.status === 'available').length} kamar
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── Quick shortcuts (desktop only — mobile uses header icons) ── */}
                <div className="hidden md:block space-y-3">
                  <h2 className="text-sm font-bold text-slate-700 px-1">Akses Cepat</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {/* Primary action — Cari Kost (marketplace core action) */}
                    <button
                      onClick={() => navigate('/search')}
                      className="group relative flex items-center gap-4 overflow-hidden bg-gradient-to-br from-[var(--primary-600)] to-teal-600 rounded-2xl p-5 shadow-md shadow-[var(--primary-600)]/20 hover:shadow-lg hover:shadow-[var(--primary-600)]/30 transition-all text-left cursor-pointer active:scale-[0.98]"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white/20 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Search className="w-6 h-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-bold text-white">Cari Kost Baru</p>
                        <p className="text-xs text-[var(--primary-50)]/90 mt-0.5">Temukan kost terdekat terverifikasi</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
                    </button>

                    {/* Secondary action — Pesan Masuk */}
                    <button
                      onClick={() => setActiveSection('chat')}
                      className="group flex items-center gap-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-[var(--primary-200)] transition-all text-left cursor-pointer active:scale-[0.98]"
                    >
                      <div className="relative w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Mail className="w-6 h-6" />
                        {unreadCount > 0 && <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 rounded-full bg-rose-500 text-white text-xs font-black flex items-center justify-center ring-2 ring-white">{unreadCount}</span>}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-bold text-slate-800">Pesan Masuk</p>
                        <p className="text-xs text-slate-500 mt-0.5">Tanya jawab dengan pemilik kost</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all shrink-0" />
                    </button>
                  </div>
                </div>

              </div>
            )}

            {activeSection === 'leases' && <SeekerOrdersSection />}

          </main>
        )}
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-slate-100 flex items-stretch pb-[env(safe-area-inset-bottom)] shadow-lg">
        {BOTTOM_NAV.map(({ key, label, icon: Icon }) => {
          const active = activeSection === key;
          return (
            <button
              key={key}
              onClick={() => goToSection(key)}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 cursor-pointer transition-colors active:scale-95"
            >
              <span className="relative">
                <Icon className={`w-[22px] h-[22px] transition-colors ${active ? 'text-[var(--primary-600)]' : 'text-slate-400'}`} />
                {key === 'chat' && hasUnread && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-[var(--primary-500)] rounded-full ring-2 ring-white" />
                )}
              </span>
              <span className={`text-xs font-semibold transition-colors ${active ? 'text-[var(--primary-600)]' : 'text-slate-500'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
