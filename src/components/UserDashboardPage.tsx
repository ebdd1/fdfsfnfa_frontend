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
  Settings,
  Verified,
  Star,
  CreditCard,
  Phone,
  Wifi,
  Receipt,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type SeekerSection = 'overview' | 'leases' | 'watchlist' | 'chat' | 'search' | 'settings';

// Bottom nav: 5 items for mobile (Indonesian labels)
const BOTTOM_NAV: { key: SeekerSection; label: string; icon: LucideIcon }[] = [
  { key: 'search', label: 'Cari', icon: Search },
  { key: 'watchlist', label: 'Simpan', icon: Heart },
  { key: 'leases', label: 'Sewa', icon: Receipt },
  { key: 'chat', label: 'Pesan', icon: Mail },
  { key: 'overview', label: 'Akun', icon: User },
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
    <div className="bg-background h-screen flex flex-col md:flex-row overflow-hidden font-body relative">

      {/* MOBILE TOP BAR - Premium Dwelling Style */}
      <header className="flex md:hidden items-center justify-between px-margin-mobile h-14 bg-surface shrink-0 z-30 border-b border-outline-variant">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Buka menu"
            className="p-2 rounded-full hover:bg-surface-container-low transition-colors active:scale-95 duration-200 cursor-pointer"
          >
            <Menu className="w-5 h-5 text-on-surface" />
          </button>
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate('/')}
          >
            {settings.logo_url ? (
              <img src={settings.logo_url} alt={settings.site_name} className="h-7 w-auto object-contain rounded-lg" />
            ) : (
              <span className="font-headline text-[20px] font-bold text-primary">KostFind</span>
            )}
          </div>
        </div>

        {/* Right: Notifications + Profile */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            aria-label="Notifikasi"
            className="relative p-2 rounded-full hover:bg-surface-container-low transition-colors active:scale-95 duration-200 cursor-pointer"
          >
            <Bell className="w-5 h-5 text-on-surface" />
            {notifUnread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-surface" />
            )}
          </button>

          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary-container shrink-0 cursor-pointer hover:ring-2 hover:ring-primary transition-all duration-200"
            aria-label="Menu Profil"
          >
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-primary-container flex items-center justify-center text-on-primary-container">
                <User className="w-4 h-4" />
              </div>
            )}
          </button>
        </div>
      </header>

      {/* MOBILE NOTIFICATIONS SHEET - Premium Style */}
      {isNotificationsOpen && (
        <div className="md:hidden fixed inset-0 z-50" onClick={() => setIsNotificationsOpen(false)}>
          <div className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm animate-in fade-in duration-200" />
          <div
            className="absolute top-14 right-3 left-3 bg-surface-container-lowest rounded-2xl shadow-elevation-hover overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-outline-variant flex items-center justify-between">
              <span className="font-headline text-[18px] font-semibold text-on-surface">Notifikasi</span>
              {notifUnread > 0 && (
                <button onClick={() => markAllRead()} className="text-label-sm font-semibold text-primary hover:text-primary/80 cursor-pointer">
                  Tandai dibaca
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="px-5 py-10 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center mb-3 text-on-surface-variant">
                  <Bell className="w-5 h-5" />
                </div>
                <p className="text-body-sm font-semibold text-on-surface">Tidak ada notifikasi</p>
                <p className="text-label-sm text-on-surface-variant mt-1">Update proses sewa kost akan muncul di sini.</p>
              </div>
            ) : (
              <div className="max-h-[60vh] overflow-y-auto py-1">
                {notifications.filter(Boolean).map((n) => (
                  <button
                    key={n.id}
                    onClick={() => openNotification(n)}
                    className={`w-full flex items-start gap-3 px-4 py-4 hover:bg-surface-container transition-colors text-left cursor-pointer ${n.isRead ? '' : 'bg-primary-fixed/20'}`}
                  >
                    <div className="relative w-11 h-11 rounded-xl bg-primary-fixed-dim flex items-center justify-center text-primary shrink-0">
                      <Home className="w-5 h-5" />
                      {!n.isRead && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-error border-2 border-surface-container-lowest" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-body-sm font-semibold text-on-surface truncate">{n.title}</p>
                        <span className="text-label-sm text-on-surface-variant shrink-0">{timeAgo(n.createdAt)}</span>
                      </div>
                      <p className="text-label-sm text-on-surface-variant leading-snug line-clamp-2 mt-1">{n.body}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PROFILE DROPDOWN - Desktop & Mobile */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50" onClick={() => setIsProfileOpen(false)}>
          <div className="absolute top-14 right-3 md:right-4 w-64 bg-surface-container-lowest rounded-2xl shadow-elevation-hover border border-outline-variant/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200" onClick={(e) => e.stopPropagation()}>
            {/* User Info Header */}
            <div className="px-4 py-4 border-b border-outline-variant/50">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container overflow-hidden shrink-0">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-body-sm font-semibold text-on-surface truncate">{user?.name || 'Pencari Kost'}</p>
                  <p className="text-label-sm text-on-surface-variant truncate">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  setActiveSection('settings');
                  if (window.innerWidth < 768) setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container transition-colors text-left cursor-pointer"
              >
                <Settings className="w-5 h-5 text-on-surface-variant" />
                <span className="text-body-sm text-on-surface">Pengaturan</span>
              </button>

              <button
                onClick={async () => {
                  setIsProfileOpen(false);
                  try {
                    await logout();
                    navigate('/login');
                  } catch {
                    navigate('/login');
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container transition-colors text-left cursor-pointer"
              >
                <LogOut className="w-5 h-5 text-error" />
                <span className="text-body-sm text-error">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE DRAWER - Premium Style */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-inverse-surface/50 animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Panel */}
          <aside className="relative flex flex-col w-[280px] max-w-[82%] h-full bg-surface-container-lowest shadow-elevation-hover animate-in slide-in-from-left duration-250">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-margin-mobile h-14 border-b border-outline-variant shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-headline text-[20px] font-bold text-primary">KostFind</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Tutup menu"
                className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile */}
            <div className="px-4 pt-4">
              <div className="flex items-center gap-3 p-4 bg-surface-container rounded-xl border border-outline-variant">
                <div className="w-11 h-11 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container overflow-hidden shrink-0">
                  {user?.avatar_url ? <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" /> : <User className="w-5 h-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-body-sm font-semibold text-on-surface truncate">{user?.name || 'Pencari Kost'}</p>
                  <span className="text-label-sm font-semibold text-primary">Pencari Kost</span>
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              <p className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-wider px-3 mb-2">Menu Utama</p>
              {([
                { key: 'overview', label: 'Ringkasan', icon: LayoutDashboard },
                { key: 'leases', label: 'Riwayat Sewa', icon: Home },
              ] as { key: SeekerSection; label: string; icon: LucideIcon }[]).map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => goToSection(key)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-body-sm font-medium transition-colors cursor-pointer ${
                    activeSection === key ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <Icon className="w-[18px] h-[18px] shrink-0" />
                  <span className="text-left">{label}</span>
                </button>
              ))}

              <p className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-wider px-3 mb-2 mt-4">Eksplorasi</p>
              {([
                { key: 'search', label: 'Cari Kost', icon: Search },
                { key: 'watchlist', label: 'Watchlist', icon: Heart },
                { key: 'chat', label: 'Pesan Masuk', icon: Mail },
              ] as { key: SeekerSection; label: string; icon: LucideIcon }[]).map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => goToSection(key)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-body-sm font-medium transition-colors cursor-pointer ${
                    activeSection === key ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <span className="relative shrink-0">
                    <Icon className="w-[18px] h-[18px]" />
                    {key === 'chat' && hasUnread && <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full" />}
                  </span>
                  <span className="flex-1 text-left">{label}</span>
                  {key === 'chat' && hasUnread && (
                    <span className="text-label-sm font-semibold bg-primary-container/20 text-primary px-2 py-0.5 rounded-full">Baru</span>
                  )}
                </button>
              ))}

              <p className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-wider px-3 mb-2 mt-4">Akun</p>
              <button
                onClick={() => goToSection('settings')}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-body-sm font-medium transition-colors cursor-pointer ${
                  activeSection === 'settings' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <Settings className="w-[18px] h-[18px] shrink-0" />
                <span className="text-left">Pengaturan</span>
              </button>
            </nav>

            {/* Footer */}
            <div className="px-3 py-3 border-t border-outline-variant space-y-1 shrink-0">
              <button
                onClick={() => { setIsMobileMenuOpen(false); navigate('/dashboard'); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
              >
                <Sparkles className="w-[18px] h-[18px] text-primary shrink-0" />
                <span>Mode Pemilik Kost</span>
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); navigate('/'); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-[18px] h-[18px] shrink-0" />
                <span>Kembali Beranda</span>
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); logout(); navigate('/'); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-sm font-medium text-error hover:bg-error-container transition-colors cursor-pointer"
              >
                <LogOut className="w-[18px] h-[18px] shrink-0" />
                <span>Keluar</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* DESKTOP SIDEBAR NAVIGATION - Premium Dwelling Style */}
      <aside
        className={`bg-surface hidden md:flex flex-col justify-between shrink-0 h-screen transition-all duration-300 border-r border-outline-variant ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className={`space-y-6 ${isSidebarCollapsed ? 'p-3' : 'p-5'}`}>
          {/* Brand */}
          <div className={`flex items-center ${isSidebarCollapsed ? 'flex-col gap-3 justify-center' : 'justify-between'} px-1`}>
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
              {settings.logo_url ? (
                <img src={settings.logo_url} alt={settings.site_name} className="h-9 w-auto object-contain rounded-xl" />
              ) : (
                <LogoText />
              )}
            </div>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="rounded-lg bg-surface-container hover:bg-surface-container-high p-1.5 text-on-surface-variant transition-colors cursor-pointer"
              title={isSidebarCollapsed ? "Tampilkan Sidebar" : "Sembunyikan Sidebar"}
            >
              {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          {/* User Profile Summary */}
          {!isSidebarCollapsed ? (
            <div className="flex items-center gap-3 px-3 py-3 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-level-1">
              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container shrink-0">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-sm font-bold text-on-surface leading-tight truncate">{user?.name || 'Pencari Kost'}</p>
                <span className="text-label-sm font-bold text-primary uppercase tracking-wide block mt-0.5">Pencari Kost</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container" title={user?.name || "Pencari Kost"}>
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>
            </div>
          )}

          {/* Menu Items */}
          <nav className="flex flex-col gap-1">
            {/* CATEGORY 1: AKUN SAYA */}
            <div className="space-y-1 w-full mb-4">
              {!isSidebarCollapsed && (
                <p className="text-label-sm font-bold text-on-surface-variant uppercase tracking-wider px-3 mb-2 text-left">Menu Utama</p>
              )}

              <button
                onClick={() => {
                  setActiveSection('overview');
                  if (isSidebarCollapsed) setIsSidebarCollapsed(false);
                }}
                className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                  isSidebarCollapsed ? 'justify-center w-10 h-10 mx-auto p-0' : ''
                } ${activeSection === 'overview'
                  ? 'bg-primary-container text-on-primary-container shadow-level-1'
                  : 'text-on-surface-variant hover:bg-surface-container'
                }`}
                title="Ringkasan"
              >
                <LayoutDashboard className={`w-5 h-5 shrink-0 transition-colors duration-200 ${activeSection === 'overview' ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`} />
                {!isSidebarCollapsed && <span className="text-body-sm font-medium">Ringkasan</span>}
              </button>

              <button
                onClick={() => {
                  setActiveSection('leases');
                  if (isSidebarCollapsed) setIsSidebarCollapsed(false);
                }}
                className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                  isSidebarCollapsed ? 'justify-center w-10 h-10 mx-auto p-0' : ''
                } ${activeSection === 'leases'
                  ? 'bg-primary-container text-on-primary-container shadow-level-1'
                  : 'text-on-surface-variant hover:bg-surface-container'
                }`}
                title="Riwayat Sewa"
              >
                <Home className={`w-5 h-5 shrink-0 transition-colors duration-200 ${activeSection === 'leases' ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`} />
                {!isSidebarCollapsed && <span className="text-body-sm font-medium">Riwayat Sewa</span>}
              </button>
            </div>

            {/* CATEGORY 2: EKSPLORASI */}
            <div className="space-y-1 w-full">
              {!isSidebarCollapsed && (
                <p className="text-label-sm font-bold text-on-surface-variant uppercase tracking-wider px-3 mb-2 text-left">Eksplorasi</p>
              )}

              <button
                onClick={() => {
                  setActiveSection('search');
                  if (isSidebarCollapsed) setIsSidebarCollapsed(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors cursor-pointer ${
                  isSidebarCollapsed ? 'justify-center rounded-xl w-10 h-10 mx-auto p-0' : 'rounded-xl text-body-sm font-medium'
                } ${activeSection === 'search'
                  ? 'bg-primary-container text-on-primary-container shadow-level-1'
                  : 'text-on-surface-variant hover:bg-surface-container'
                }`}
                title="Cari Kost"
              >
                <Search className="w-5 h-5 shrink-0" />
                {!isSidebarCollapsed && <span>Cari Kost</span>}
              </button>

              <button
                onClick={() => {
                  setActiveSection('watchlist');
                  if (isSidebarCollapsed) setIsSidebarCollapsed(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors cursor-pointer ${
                  isSidebarCollapsed ? 'justify-center rounded-xl w-10 h-10 mx-auto p-0' : 'rounded-xl text-body-sm font-medium'
                } ${activeSection === 'watchlist'
                  ? 'bg-primary-container text-on-primary-container shadow-level-1'
                  : 'text-on-surface-variant hover:bg-surface-container'
                }`}
                title="Watchlist"
              >
                <Heart className="w-5 h-5 shrink-0" />
                {!isSidebarCollapsed && <span>Watchlist</span>}
              </button>

              <button
                onClick={() => {
                  setActiveSection('chat');
                  if (isSidebarCollapsed) setIsSidebarCollapsed(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors cursor-pointer ${
                  isSidebarCollapsed ? 'justify-center rounded-xl w-10 h-10 mx-auto p-0' : 'rounded-xl text-body-sm font-medium'
                } ${activeSection === 'chat'
                  ? 'bg-primary-container text-on-primary-container shadow-level-1'
                  : 'text-on-surface-variant hover:bg-surface-container'
                }`}
                title="Pesan Masuk"
              >
                <Mail className="w-5 h-5 shrink-0" />
                {!isSidebarCollapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>Pesan Masuk</span>
                    {conversations.some(c => c.unread_count > 0) && (
                      <span className="bg-primary text-on-primary text-label-sm px-2 py-0.5 rounded-full font-bold">Baru</span>
                    )}
                  </div>
                )}
              </button>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer - Premium Style */}
        <div className={`border-t border-outline-variant hidden md:block ${isSidebarCollapsed ? 'p-3' : 'p-5 pt-4'}`}>
          <button
            onClick={() => {
              navigate('/');
              if (isSidebarCollapsed) setIsSidebarCollapsed(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-body-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer ${
              isSidebarCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Kembali Beranda"
          >
            <ArrowLeft className="w-5 h-5 shrink-0" />
            {!isSidebarCollapsed && <span>Kembali Beranda</span>}
          </button>
        </div>
      </aside>

      {/* RIGHT PANE WORKSPACE */}
      <div className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden">
        {/* Header - Premium Dwelling Style */}
        <header className="hidden md:flex h-16 border-b border-outline-variant bg-surface items-center justify-between px-8 shrink-0 relative z-30">

          {/* Breadcrumbs */}
          <div className="flex items-center gap-3 text-label-sm font-medium text-on-surface">
            <button
              onClick={() => navigate('/')}
              className="hover:text-primary transition-colors flex items-center gap-2 cursor-pointer"
            >
              {settings.logo_url ? (
                <img src={settings.logo_url} alt={settings.site_name} className="h-6 w-auto object-contain" />
              ) : (
                <span className="font-headline font-bold text-primary text-lg">KostFind</span>
              )}
            </button>
            <span className="text-on-surface-variant">/</span>
            <span className="font-headline font-bold text-on-surface bg-surface-container px-3 py-1.5 rounded-lg text-body-sm capitalize">
              {activeSection === 'overview'
                ? 'Ringkasan'
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
              <span className="ml-auto text-[11px] text-slate-400 font-mono border border-slate-200 bg-white px-1.5 py-0.5 rounded shadow-sm">/</span>
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
              <div className="space-y-6 animate-in fade-in duration-300">

                {/* ── Header Section - Premium Style ── */}
                <section>
                  <h1 className="font-headline text-[28px] md:text-[48px] font-bold tracking-tight text-on-surface">
                    {greeting}, {firstName}
                  </h1>
                  <p className="font-body text-[14px] text-on-surface-variant mt-1">
                    {activeLeases.length > 0
                      ? `Kamu punya ${activeLeases.length} sewa aktif${unreadCount > 0 ? ` · ${unreadCount} pesan belum dibaca` : ''}. Semoga betah di kost-mu!`
                      : 'Belum ada sewa aktif. Yuk cari kost impianmu sekarang.'}
                  </p>
                </section>

                {/* ── Stats Grid - Premium Style ── */}
                <section className="grid grid-cols-3 gap-2">
                  {/* Stat 1: Sewa Aktif */}
                  <div className="bg-surface-container-lowest rounded-lg p-3 shadow-elevation-1 flex flex-col items-center justify-center text-center">
                    <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center mb-2 text-on-primary-container">
                      <Home className="w-5 h-5" />
                    </div>
                    <span className="font-headline text-[18px] font-bold text-on-surface">{activeLeases.length}</span>
                    <span className="font-label text-[11px] text-on-surface-variant mt-0.5">Sewa Aktif</span>
                  </div>

                  {/* Stat 2: Tersimpan */}
                  <button
                    onClick={() => setActiveSection('watchlist')}
                    className="bg-surface-container-lowest rounded-lg p-3 shadow-elevation-1 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-surface-container transition-colors active:scale-95"
                  >
                    <div className="w-10 h-10 rounded-lg bg-tertiary-fixed-dim flex items-center justify-center mb-2 text-tertiary">
                      <Heart className="w-5 h-5" />
                    </div>
                    <span className="font-headline text-[18px] font-bold text-on-surface">{watchlistIds.length}</span>
                    <span className="font-label text-[11px] text-on-surface-variant mt-0.5">Tersimpan</span>
                  </button>

                  {/* Stat 3: Pesan Baru */}
                  <button
                    onClick={() => setActiveSection('chat')}
                    className="bg-surface-container-lowest rounded-lg p-3 shadow-elevation-1 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-surface-container transition-colors active:scale-95 relative"
                  >
                    {unreadCount > 0 && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error" />
                    )}
                    <div className="w-10 h-10 rounded-lg bg-secondary-fixed-dim flex items-center justify-center mb-2 text-secondary-container">
                      <Mail className="w-5 h-5" />
                    </div>
                    <span className="font-headline text-[18px] font-bold text-on-surface">{unreadCount}</span>
                    <span className="font-label text-[11px] text-on-surface-variant mt-0.5">Pesan Baru</span>
                  </button>
                </section>

                {/* ── Active Rent Card - Premium Hero Style ── */}
                <section>
                  <div className="flex justify-between items-end mb-2">
                    <h2 className="font-headline text-[20px] font-semibold text-on-surface">Sewa Aktif Kamu</h2>
                  </div>

                  {activeLeases.length === 0 ? (
                    <div className="bg-surface-container-lowest rounded-2xl shadow-elevation-1 overflow-hidden">
                      <div className="p-6 flex flex-col items-center justify-center text-center">
                        <div className="w-14 h-14 rounded-xl bg-primary-fixed-dim flex items-center justify-center mb-4 text-primary">
                          <Home className="w-6 h-6" />
                        </div>
                        <p className="font-headline text-[16px] font-semibold text-on-surface mb-2">Belum ada sewa aktif</p>
                        <p className="text-label-sm text-on-surface-variant mb-5 max-w-xs">Cari kost terverifikasi dan ajukan sewa untuk mulai menghuni.</p>
                        <button
                          onClick={() => navigate('/search')}
                          className="w-full bg-primary-container text-on-primary-container font-label text-[14px] py-3 rounded-lg hover:brightness-95 active:scale-[0.98] transition-all flex justify-center items-center gap-2 cursor-pointer"
                        >
                          <Search className="w-4 h-4" /> Cari Kost Sekarang
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-surface-container-lowest rounded-2xl shadow-elevation-1 overflow-hidden">
                      {/* Image Header - Using property image from API */}
                      <div className="h-44 w-full relative overflow-hidden">
                        {properties.find(p => p.id === activeLeases[0].propertyId)?.media?.[0]?.url_original ? (
                          <img
                            src={properties.find(p => p.id === activeLeases[0].propertyId)?.media[0].url_original}
                            alt={activeLeases[0].property?.name || 'Kost'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-surface-container flex items-center justify-center">
                            <Building2 className="w-12 h-12 text-on-surface-variant" />
                          </div>
                        )}
                        {/* Status Badge */}
                        <div className="absolute top-3 left-3 bg-tertiary-fixed-dim text-on-tertiary-fixed px-2.5 py-1 rounded-full font-label text-[12px] flex items-center gap-1 shadow-elevation-1">
                          <Verified className="w-[14px] h-[14px]" /> Aktif
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 flex flex-col gap-3">
                        <div>
                          <h3 className="font-headline text-[16px] font-semibold text-on-surface">{activeLeases[0].property?.name || 'Kost'}</h3>
                          <div className="flex items-center gap-1 text-on-surface-variant font-body text-[13px] mt-1">
                            <MapPin className="w-[14px] h-[14px]" />
                            <span>{activeLeases[0].property?.city || 'Lokasi'}</span>
                          </div>
                        </div>

                        {/* Tags - Using property facilities from full property data */}
                        <div className="flex flex-wrap gap-1.5">
                          <span className="bg-surface-container text-on-surface text-[11px] font-label px-2.5 py-1 rounded-full">
                            {activeLeases[0].room?.roomNumber ? `Kamar ${activeLeases[0].room.roomNumber}` : 'Kamar'}
                          </span>
                          {properties.find(p => p.id === activeLeases[0].propertyId)?.facilities?.includes('ac') && (
                            <span className="bg-surface-container text-on-surface text-[11px] font-label px-2.5 py-1 rounded-full flex items-center gap-1">
                              <span className="text-[12px]">❄️</span> AC
                            </span>
                          )}
                          {properties.find(p => p.id === activeLeases[0].propertyId)?.facilities?.includes('wifi') && (
                            <span className="bg-surface-container text-on-surface text-[11px] font-label px-2.5 py-1 rounded-full flex items-center gap-1">
                              <Wifi className="w-[12px] h-[12px]" /> WiFi
                            </span>
                          )}
                        </div>

                        {/* Payment Info */}
                        <div className="bg-surface-container-low rounded-lg p-3 flex justify-between items-center">
                          <div>
                            <p className="font-label text-[11px] text-on-surface-variant">Jatuh Tempo Berikutnya</p>
                            <p className="font-headline text-[14px] font-semibold text-on-surface mt-0.5">
                              {(() => {
                                const start = new Date(activeLeases[0].startDate);
                                const due = new Date(start);
                                due.setMonth(due.getMonth() + 1);
                                return due.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
                              })()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-headline text-[16px] font-bold text-primary">{fmtIDR(activeLeases[0].priceMonthly)}</p>
                            <p className="text-label-sm text-on-surface-variant">per bulan</p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-1">
                          <button className="flex-1 bg-primary-container text-on-primary-container font-label text-[13px] py-2.5 rounded-lg hover:brightness-95 active:scale-[0.98] transition-all flex justify-center items-center gap-2 cursor-pointer">
                            <CreditCard className="w-4 h-4" /> Bayar Tagihan
                          </button>
                          <button className="flex-1 border border-primary-container text-primary-container font-label text-[13px] py-2.5 rounded-lg hover:bg-surface-container-low active:scale-[0.98] transition-all flex justify-center items-center gap-2 cursor-pointer">
                            <Phone className="w-4 h-4" /> Hubungi Pemilik
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                {/* ── Recommendations Carousel - Premium Style ── */}
                {recommendations.length > 0 && (
                  <section>
                    <div className="flex justify-between items-end mb-3">
                      <h2 className="font-headline text-[20px] font-semibold text-on-surface">Rekomendasi Buat Kamu</h2>
                      <button
                        onClick={() => navigate('/search')}
                        className="text-primary font-label text-[13px] hover:underline cursor-pointer"
                      >
                        Lihat Semua
                      </button>
                    </div>

                    {/* Horizontal Scroll Container */}
                    <div className="flex overflow-x-auto gap-3 pb-4 -mx-margin-mobile px-margin-mobile snap-x snap-mandatory scrollbar-thin">
                      {recommendations.map((p) => {
                        const cover = p.media?.[0]?.url_medium || p.media?.[0]?.url_original || p.media?.[0]?.url_thumbnail;
                        const price = lowestPrice(p);
                        const rating = 4.5; // Default rating - can be enhanced with real data
                        return (
                          <button
                            key={p.id}
                            onClick={() => onSelectProperty(p.id)}
                            className="min-w-[260px] w-[260px] bg-surface-container-lowest rounded-2xl shadow-elevation-1 overflow-hidden shrink-0 snap-start flex flex-col cursor-pointer hover:shadow-elevation-hover transition-shadow"
                          >
                            {/* Image */}
                            <div className="h-36 w-full relative overflow-hidden">
                              {cover ? (
                                <img src={cover} alt={p.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-surface-container flex items-center justify-center">
                                  <Building2 className="w-10 h-10 text-on-surface-variant" />
                                </div>
                              )}
                              {/* Favorite Button */}
                              <button
                                className="absolute top-2 right-2 bg-surface-container-lowest/90 backdrop-blur-sm p-1.5 rounded-full shadow-elevation-1 cursor-pointer hover:bg-error-container transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleWatchlist(p.id);
                                }}
                              >
                                <Heart className="w-[18px] h-[18px] text-on-surface-variant hover:text-error transition-colors" />
                              </button>
                            </div>

                            {/* Content */}
                            <div className="p-3 flex flex-col flex-grow">
                              <div className="flex justify-between items-start mb-1">
                                <h3 className="font-headline text-[14px] font-semibold text-on-surface truncate flex-1">{p.name}</h3>
                                <div className="flex items-center gap-0.5 text-on-surface ml-2 shrink-0">
                                  <Star className="w-[12px] h-[12px] text-tertiary-container fill-current" />
                                  <span className="font-label text-[11px]">{rating.toFixed(1)}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 text-on-surface-variant font-body text-[11px] mb-2">
                                <MapPin className="w-[12px] h-[12px]" />
                                <span className="truncate">{p.location?.city || 'Lokasi'}</span>
                              </div>

                              <div className="mt-auto">
                                <p className="font-headline text-[14px] font-bold text-primary">
                                  {price > 0 ? fmtIDR(price) : '—'}
                                  <span className="font-body text-[11px] text-on-surface-variant font-normal ml-1">/ bulan</span>
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                )}
              </div>
            )}

            {activeSection === 'leases' && <SeekerOrdersSection />}

          </main>
        )}
      </div>

      {/* MOBILE BOTTOM NAVIGATION - Premium Style */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-30 flex justify-around items-center px-2 py-2 bg-surface shadow-[0_-4px_12px_rgba(0,0,0,0.05)] rounded-t-xl">
        {BOTTOM_NAV.map(({ key, label, icon: Icon }) => {
          const active = activeSection === key;
          return (
            <button
              key={key}
              onClick={() => goToSection(key)}
              className={`flex flex-col items-center justify-center px-3 py-1 cursor-pointer transition-all active:scale-90 ${
                active ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              {active ? (
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
                  <Icon className="w-[22px] h-[22px] text-on-secondary-container" />
                </div>
              ) : (
                <Icon className="w-[22px] h-[22px]" />
              )}
              <span className={`text-[10px] font-label mt-1 ${active ? 'font-semibold' : ''}`}>
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
