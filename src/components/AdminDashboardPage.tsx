import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useAdminUsers, useAdminListings, useAdminStats } from '../hooks/useAdmin';
import { useNotifications } from '../hooks/useNotifications';
import { AdminSettingsPanel } from './admin/AdminSettingsPanel';
import { AdminOrdersTab } from './admin/AdminOrdersTab';
import { AdminConversationsTab } from './admin/AdminConversationsTab';
import { ProfileEditor } from './ProfileEditor';
import { LogoText } from './LogoText';
import { KpiCard, Panel, PanelHeader, StatusBadge, Loading, ErrorState, EmptyState, Modal, ModalClose, ConfirmDialog } from './admin/adminUi';
import type { AdminUser } from '../services/api/admin.service';
import {
  LayoutDashboard,
  Shield,
  ShieldAlert,
  CheckCircle,
  XCircle,
  Search,
  Home,
  Users,
  TrendingUp,
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Settings as SettingsIcon,
  LogOut,
  MessageSquare,
  MapPin,
  RefreshCw,
  Menu,
  Bell,
  ChevronDown,
  Sparkles,
  User,
  ClipboardList,
  Building2,
  UserSearch,
  Crown,
  Eye,
  Mail,
  Phone,
  Calendar,
  BadgeCheck,
} from 'lucide-react';

type Section = 'overview' | 'verify' | 'users' | 'orders' | 'chat' | 'stats' | 'settings';

const formatIDR = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const SECTION_TITLE: Record<Section, string> = {
  overview: 'Ringkasan',
  verify: 'Verifikasi Kost',
  users: 'Manajemen Pengguna',
  orders: 'Order / Transaksi',
  chat: 'Percakapan',
  stats: 'Statistik Global',
  settings: 'Pengaturan Web',
};

const BOTTOM_NAV_LABELS: Record<Section, string> = {
  overview: 'Ringkasan',
  verify: 'Verifikasi',
  users: 'Pengguna',
  orders: 'Transaksi',
  chat: 'Pesan',
  stats: 'Statistik',
  settings: 'Pengaturan',
};

const BOTTOM_NAV_ICONS: Record<Section, React.ComponentType<{ className?: string }>> = {
  overview: LayoutDashboard,
  verify: Shield,
  users: Users,
  orders: ClipboardList,
  chat: MessageSquare,
  stats: TrendingUp,
  settings: SettingsIcon,
};

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { settings } = useSettingsStore();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const groups: { label: string; items: { key: Section; label: string; icon: React.ReactNode }[] }[] = [
    {
      label: 'Utama',
      items: [{ key: 'overview', label: 'Ringkasan', icon: <LayoutDashboard className="h-4 w-4 flex-shrink-0" /> }],
    },
    {
      label: 'Kontrol Sistem',
      items: [
        { key: 'verify', label: 'Verifikasi Kost', icon: <Shield className="h-4 w-4 flex-shrink-0" /> },
        { key: 'users', label: 'Manajemen Pengguna', icon: <Users className="h-4 w-4 flex-shrink-0" /> },
        { key: 'chat', label: 'Percakapan', icon: <MessageSquare className="h-4 w-4 flex-shrink-0" /> },
      ],
    },
    {
      label: 'Laporan & Konfigurasi',
      items: [
        { key: 'orders', label: 'Order / Transaksi', icon: <TrendingUp className="h-4 w-4 flex-shrink-0" /> },
        { key: 'stats', label: 'Statistik Global', icon: <TrendingUp className="h-4 w-4 flex-shrink-0" /> },
        { key: 'settings', label: 'Pengaturan Web', icon: <SettingsIcon className="h-4 w-4 flex-shrink-0" /> },
      ],
    },
  ];

  return (
    <div className="bg-background h-screen flex flex-col md:flex-row overflow-hidden font-body relative">

      {/* ===================== MOBILE DRAWER ===================== */}
      {/* MOBILE DRAWER - Premium Dwelling Style */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-inverse-surface/50 animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <aside className="relative flex flex-col w-[280px] max-w-[82%] h-full bg-surface-container-lowest shadow-elevation-hover animate-in slide-in-from-left duration-250">
            <div className="flex items-center justify-between px-margin-mobile h-14 border-b border-outline-variant shrink-0">
              <div className="flex items-center gap-2">
                {settings.logo_url ? (
                  <img src={settings.logo_url} alt={settings.site_name || 'Logo'} className="h-9 w-auto object-contain rounded-xl" />
                ) : (
                  <LogoText />
                )}
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded-lg transition-[background-color] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {groups.map((g) => (
                <div key={g.label} className="space-y-1">
                  <p className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-wider px-3 mb-2">{g.label}</p>
                  {g.items.map((item) => {
                    const active = activeSection === item.key;
                    return (
                      <button
                        key={item.key}
                        onClick={() => {
                          setActiveSection(item.key);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-body-sm font-medium transition-[background-color] cursor-pointer ${
                          active ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container'
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>

            {/* Footer */}
            <div className="px-3 py-3 border-t border-outline-variant space-y-1 shrink-0">
              <button
                onClick={() => { setMobileMenuOpen(false); navigate('/'); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-sm font-medium text-on-surface-variant hover:bg-surface-container transition-[background-color] cursor-pointer"
              >
                <ArrowLeft className="w-[18px] h-[18px] shrink-0" />
                <span>Kembali ke Beranda</span>
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-sm font-medium text-error hover:bg-error-container transition-[background-color] cursor-pointer"
              >
                <LogOut className="w-[18px] h-[18px] shrink-0" />
                <span>Keluar</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ===================== SIDEBAR ===================== */}
      <aside
        className={`hidden md:flex flex-col justify-between border-r border-outline-variant bg-surface-container-low transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className={`space-y-7 ${collapsed ? 'p-3' : 'p-4'}`}>
          {/* Brand */}
          <div className={`flex items-center ${collapsed ? 'flex-col gap-3 justify-center' : 'justify-between'} px-1`}>
            <div className="flex items-center gap-2.5">
              {settings.logo_url ? (
                <img
                  src={settings.logo_url}
                  alt={settings.site_name || 'Logo'}
                  className="h-9 w-auto object-contain rounded-xl flex-shrink-0"
                />
              ) : (
                <LogoText />
              )}
            </div>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="rounded-lg border border-slate-200/60 p-1.5 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
              title={collapsed ? "Tampilkan Sidebar" : "Sembunyikan Sidebar"}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          {/* Nav */}
          <nav className="space-y-5">
            {groups.map((g) => (
              <div key={g.label} className="space-y-1">
                {!collapsed && <p className="px-3 pb-1 font-mono text-[9px] font-black uppercase tracking-widest text-on-surface-variant">{g.label}</p>}
                {g.items.map((item) => {
                  const active = activeSection === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        setActiveSection(item.key);
                        if (collapsed) setCollapsed(false);
                      }}
                      title={item.label}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
                        collapsed ? 'justify-center px-0' : ''
                      } ${active
                        ? 'bg-[var(--primary-50)] text-[var(--primary-700)] shadow-sm border border-[var(--primary-100)]/30'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                      }`}
                    >
                      {item.icon}
                      {!collapsed && <span>{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className={`space-y-1 border-t border-outline-variant ${collapsed ? 'p-3' : 'p-4'}`}>
          <button
            onClick={() => {
              navigate('/');
              if (collapsed) setCollapsed(false);
            }}
            title="Kembali ke Beranda"
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-on-surface-variant transition-colors hover:bg-slate-100 hover:text-slate-900 cursor-pointer ${
              collapsed ? 'justify-center px-0' : ''
            }`}
          >
            <ArrowLeft className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>Kembali ke Beranda</span>}
          </button>
          <button
            onClick={() => {
              handleLogout();
              if (collapsed) setCollapsed(false);
            }}
            title="Keluar"
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-rose-500 transition-colors hover:bg-rose-50 cursor-pointer ${
              collapsed ? 'justify-center px-0' : ''
            }`}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>Keluar / Logout</span>}
          </button>
        </div>
      </aside>

      {/* ===================== MAIN ===================== */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar — Premium Dwelling Style */}
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-outline-variant bg-surface px-5 sm:px-8 relative z-30">
          {/* Left: hamburger (mobile) + breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant md:hidden cursor-pointer transition-colors duration-200"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 text-[12px] font-medium text-on-surface">
              <button
                onClick={() => navigate('/')}
                className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer font-bold"
              >
                {settings.logo_url ? (
                  <img src={settings.logo_url} alt={settings.site_name || 'Logo'} className="w-4 h-4 object-contain" />
                ) : (
                  <LogoText className="text-[12px] font-black" />
                )}
              </button>
              <ChevronRight className="w-3 h-3 text-on-surface-variant" />
              <span className="font-bold text-on-surface bg-surface-container px-2.5 py-1 rounded-lg capitalize">
                {SECTION_TITLE[activeSection]}
              </span>
            </div>
          </div>

          {/* Right: notifications + profile dropdowns */}
          <div className="flex items-center gap-3">
            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                }}
                className="relative p-2.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container border border-outline-variant rounded-xl transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
                )}
              </button>

              {isNotificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-3 w-80 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-elevation-hover py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 pb-2 border-b border-outline-variant flex justify-between items-center">
                      <span className="text-[11px] font-bold text-on-surface">Notifikasi</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => markAllRead()}
                          className="text-[11px] text-primary hover:underline font-semibold cursor-pointer"
                        >
                          Tandai semua baca
                        </button>
                      )}
                    </div>
                    <div className="max-h-60 overflow-y-auto mt-2">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-10 flex flex-col items-center text-center">
                          <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center mb-3 text-on-surface-variant">
                            <Bell className="w-5 h-5" />
                          </div>
                          <p className="text-[13px] font-semibold text-on-surface">Tidak ada notifikasi baru</p>
                        </div>
                      ) : (
                        notifications.slice(0, 5).map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => markRead(notif.id)}
                            className={`px-4 py-3 hover:bg-surface-container cursor-pointer border-b border-outline-variant/50 last:border-0 transition-colors ${!notif.isRead ? 'bg-primary/5' : ''}`}
                          >
                            <p className="text-[13px] font-bold text-on-surface line-clamp-1">{notif.title}</p>
                            {notif.body && <p className="text-[11px] text-on-surface-variant mt-0.5 line-clamp-2">{notif.body}</p>}
                            <p className="text-[10px] text-on-surface-variant mt-1">
                              {new Date(notif.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
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
                className="flex items-center gap-2 p-1.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant rounded-xl transition-all duration-200 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container overflow-hidden border border-outline-variant">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt={user?.name || 'Admin'} className="w-full h-full object-cover" />
                  ) : (
                    <Shield className="w-4 h-4" />
                  )}
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-on-surface-variant group-hover:text-on-surface transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                  <div className="absolute right-0 mt-3 w-64 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-elevation-hover py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3 border-b border-outline-variant">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Masuk Sebagai</p>
                      <p className="text-[13px] font-bold text-on-surface leading-tight mt-1 truncate">{user?.name || 'Administrator'}</p>
                      <p className="text-[11px] text-on-surface-variant font-medium truncate mt-0.5">{user?.email || 'admin@kostfind.com'}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          setShowProfileEditor(true);
                        }}
                        className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-on-surface hover:bg-surface-container flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <User className="w-4 h-4 text-on-surface-variant" />
                        <span>Edit Profil Saya</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate('/');
                        }}
                        className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-on-surface hover:bg-surface-container flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Home className="w-4 h-4 text-on-surface-variant" />
                        <span>Kembali ke Beranda</span>
                      </button>
                    </div>

                    <div className="border-t border-outline-variant pt-1 mt-1">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2.5 text-[13px] font-bold text-error hover:bg-error/10 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Keluar / Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 pb-28 sm:p-8 md:pb-8">
          {showProfileEditor && (
            <ProfileEditor onClose={() => setShowProfileEditor(false)} />
          )}
          {activeSection === 'overview' && <OverviewSection adminName={user?.name} onGo={setActiveSection} />}
          {activeSection === 'verify' && <VerifySection />}
          {activeSection === 'users' && <UsersSection />}
          {activeSection === 'orders' && <AdminOrdersTab />}
          {activeSection === 'chat' && <AdminConversationsTab />}
          {activeSection === 'stats' && <StatsSection />}
          {activeSection === 'settings' && <AdminSettingsPanel />}
        </main>
      </div>

      {/* Bottom Navigation - Premium Style */}
      <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden bg-surface-container-lowest/95 backdrop-blur-md border border-outline-variant rounded-2xl shadow-elevation-hover">
        <div className="flex h-[68px] items-center justify-around px-2">
          {Object.entries(BOTTOM_NAV_LABELS).map(([key, label]) => {
            const secKey = key as Section;
            const IconComponent = BOTTOM_NAV_ICONS[secKey];
            const active = activeSection === secKey;
            return (
              <button
                key={secKey}
                onClick={() => {
                  setActiveSection(secKey);
                  setMobileMenuOpen(false);
                }}
                className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all duration-200 active:scale-95 cursor-pointer ${active ? 'text-primary' : 'text-on-surface-variant'}`}
              >
                <div className={`flex flex-col items-center justify-center w-[58px] h-[48px] rounded-xl transition-all duration-300 ${active ? 'bg-primary/10 text-primary' : 'hover:text-on-surface'}`}>
                  <IconComponent className={`h-5 w-5 stroke-[2.2] transition-transform duration-300 ${active ? 'scale-110' : ''}`} />
                  <span className={`mt-0.5 text-[11px] tracking-tight transition-colors duration-300 ${active ? 'font-black' : 'font-semibold'}`}>
                    {label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ============================ OVERVIEW ============================ */
const OverviewSection: React.FC<{ adminName?: string; onGo: (s: Section) => void }> = ({ adminName, onGo }) => {
  const { user } = useAuthStore();
  const { stats, isLoading, isError } = useAdminStats();
  const { listings, updateListing, isUpdating } = useAdminListings();

  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const pending = listings.filter((p) => !p.isVerified).slice(0, 5);
  const maxCity = stats ? Math.max(1, ...Object.values(stats.cityBreakdown)) : 1;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Greeting banner with profile cover - Premium Style */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest shadow-elevation-1">
        {/* Banner background */}
        <div className="h-24 sm:h-28 w-full bg-gradient-to-br from-primary via-primary/90 to-secondary" />
        {/* Content */}
        <div className="relative px-6 pb-6 sm:px-8 sm:pb-7 -mt-12">
          {/* Avatar overlapping banner */}
          <div className="absolute -top-8 left-6 sm:left-8 h-16 w-16 rounded-2xl border-4 border-surface-container-lowest bg-primary-container shadow-elevation-hover overflow-hidden">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={adminName || 'Admin'} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[24px] font-black text-white">
                {(adminName || 'A')[0].toUpperCase()}
              </div>
            )}
          </div>
          <div className="mt-10 sm:mt-12">
            <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Panel Administrator</p>
            <h1 className="mt-1 text-[24px] sm:text-[28px] font-black tracking-tight text-on-surface">
              Halo, {adminName?.split(' ')[0] || 'Admin'}
              <Sparkles className="inline-block w-5 h-5 ml-1.5 text-amber-400 align-middle" />
            </h1>
            <p className="mt-1 text-[12px] font-medium text-on-surface-variant">{today}</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : isError || !stats ? (
        <ErrorState message="Gagal memuat ringkasan." />
      ) : (
        <>
          {/* KPI grid - Premium Style */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard label="Total Pengguna" value={stats.users.total} icon={<Users className="h-5 w-5" />} sub={`${stats.users.seekers} pencari · ${stats.users.owners} pemilik · ${stats.users.admins} admin`} />
            <KpiCard label="Kost Terverifikasi" value={`${stats.properties.verified}/${stats.properties.total}`} icon={<CheckCircle className="h-5 w-5" />} progress={stats.properties.total ? (stats.properties.verified / stats.properties.total) * 100 : 0} sub={`${Math.round(stats.properties.total ? (stats.properties.verified / stats.properties.total) * 100 : 0)}% listing tervalidasi`} />
            <KpiCard label="Menunggu Moderasi" value={stats.properties.pending} icon={<ShieldAlert className="h-5 w-5" />} sub={stats.properties.pending > 0 ? 'Perlu tindakan Anda' : 'Semua sudah ditinjau'} />
            <KpiCard label="Total Kamar" value={stats.totalRooms} icon={<Home className="h-5 w-5" />} sub={`${stats.totalConversations} percakapan aktif`} />
          </div>

          {/* Order KPI row - Premium Style */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard label="Total Order" value={stats.orders.total} icon={<ClipboardList className="h-5 w-5" />} sub={`${stats.orders.active} aktif · ${stats.orders.pending} menunggu`} />
            <KpiCard label="Order Aktif" value={stats.orders.active} icon={<CheckCircle className="h-5 w-5" />} sub="Sewa berjalan" />
            <KpiCard label="Order Menunggu" value={stats.orders.pending} icon={<ShieldAlert className="h-5 w-5" />} sub={stats.orders.pending > 0 ? 'Menunggu persetujuan pemilik' : 'Tidak ada antrian'} />
            <KpiCard label="Pendapatan Aktif" value={formatIDR(stats.orders.revenue)} icon={<TrendingUp className="h-5 w-5" />} sub="Total sewa aktif" />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Pending moderation */}
            <Panel className="lg:col-span-2">
              <PanelHeader
                title="Kost Menunggu Verifikasi"
                subtitle="Tinjau dan setujui listing terbaru"
                right={
                  <button onClick={() => onGo('verify')} className="inline-flex items-center gap-1 text-[12px] font-bold text-primary hover:underline transition-colors cursor-pointer">
                    Lihat semua <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                }
              />
              {pending.length === 0 ? (
                <EmptyState icon={<CheckCircle className="h-6 w-6" />} title="Tidak ada antrean moderasi" desc="Semua kost sudah terverifikasi." />
              ) : (
                <div>
                  {pending.map((p) => (
                    <div key={p.id} className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-surface-container/50 transition-colors border-b border-outline-variant/50 last:border-0">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-surface-container text-on-surface-variant">
                          <Home className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[14px] font-bold text-on-surface truncate">{p.name}</p>
                          <p className="flex items-center gap-1 text-[11px] font-medium text-on-surface-variant">
                            <MapPin className="h-3 w-3" /> {p.city} · {p.owner?.name || '-'}
                          </p>
                        </div>
                      </div>
                      <button
                        disabled={isUpdating}
                        onClick={() => updateListing({ id: p.id, data: { isVerified: true } })}
                        className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-xl bg-primary text-white px-3.5 py-2 text-[12px] font-bold transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 cursor-pointer"
                      >
                        <CheckCircle className="h-4 w-4" /> Setujui
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Panel>

            {/* Right column: city distribution + quick actions */}
            <div className="space-y-5">
              <Panel>
                <PanelHeader title="Sebaran Kota" subtitle="Distribusi kost" />
                <div className="space-y-3 p-5 pt-4">
                  {Object.keys(stats.cityBreakdown).length === 0 ? (
                    <p className="text-[12px] italic text-on-surface-variant">Belum ada data.</p>
                  ) : (
                    Object.entries(stats.cityBreakdown).map(([city, count]) => (
                      <div key={city} className="space-y-1.5">
                        <div className="flex items-center justify-between text-[12px] font-bold text-on-surface">
                          <span>{city}</span>
                          <span className="text-on-surface-variant">{count}</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container">
                          <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${(count / maxCity) * 100}%` }} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Panel>

              <Panel>
                <PanelHeader title="Aksi Cepat" />
                <div className="p-4">
                  <QuickAction icon={<Shield className="h-4 w-4" />} label="Verifikasi Kost" onClick={() => onGo('verify')} />
                  <QuickAction icon={<Users className="h-4 w-4" />} label="Kelola Pengguna" onClick={() => onGo('users')} />
                  <QuickAction icon={<SettingsIcon className="h-4 w-4" />} label="Pengaturan Web" onClick={() => onGo('settings')} />
                </div>
              </Panel>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const QuickAction: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="group flex w-full items-center justify-between rounded-xl border border-outline-variant px-4 py-3 text-left transition-all hover:border-primary/30 hover:bg-primary/5 cursor-pointer"
  >
    <span className="flex items-center gap-3 text-[14px] font-medium text-on-surface">
      <span className="text-on-surface-variant transition-colors group-hover:text-primary">{icon}</span>
      {label}
    </span>
    <ChevronRight className="h-4 w-4 text-on-surface-variant transition-transform group-hover:translate-x-1 group-hover:text-primary" />
  </button>
);

/* ============================ VERIFY ============================ */
const VerifySection: React.FC = () => {
  const { listings, isLoading, isError, refetch, updateListing, isUpdating } = useAdminListings();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'verified' | 'unverified'>('all');

  const verifiedCount = listings.filter((p) => p.isVerified).length;

  const filtered = listings.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' ? true : filter === 'verified' ? p.isVerified : !p.isVerified;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <SectionHeading title="Antrean Moderasi Kost" desc="Verifikasi keaslian dan kelola listing kost yang didaftarkan pemilik." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="Total Kost" value={listings.length} icon={<Home className="h-5 w-5" />} sub="Seluruh Indonesia" />
        <KpiCard label="Terverifikasi" value={verifiedCount} icon={<CheckCircle className="h-5 w-5" />} sub="Listing aktif" />
        <KpiCard label="Menunggu" value={listings.length - verifiedCount} icon={<ShieldAlert className="h-5 w-5" />} sub="Perlu review" />
      </div>

      <Panel>
        <div className="flex flex-col gap-3 border-b border-outline-variant px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-[14px] font-bold text-on-surface">Daftar Kost</h3>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                placeholder="Cari kost atau kota..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-outline-variant bg-surface-container px-4 py-2.5 pl-9 text-[12px] font-medium text-on-surface placeholder:text-on-surface-variant/50 outline-none transition-colors focus:border-primary sm:w-64"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="cursor-pointer rounded-xl border border-outline-variant bg-surface-container px-4 py-2.5 text-[12px] font-medium text-on-surface outline-none transition-colors focus:border-primary"
            >
              <option value="all">Semua Status</option>
              <option value="unverified">Menunggu Verifikasi</option>
              <option value="verified">Telah Diverifikasi</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <Loading />
        ) : isError ? (
          <ErrorState message="Gagal memuat data kost." onRetry={() => refetch()} />
        ) : filtered.length === 0 ? (
          <EmptyState icon={<Home className="h-6 w-6" />} title="Tidak ada kost" desc="Coba ubah filter atau kata kunci." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container/50 text-[11px] uppercase tracking-wider text-on-surface-variant">
                  <th className="px-5 py-3 font-bold">Kost</th>
                  <th className="px-5 py-3 font-bold">Lokasi</th>
                  <th className="px-5 py-3 font-bold">Pemilik</th>
                  <th className="px-5 py-3 text-center font-bold">Status</th>
                  <th className="px-5 py-3 text-right font-bold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50 text-[13px] font-medium text-on-surface">
                {filtered.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-surface-container/30">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-surface-container text-on-surface-variant">
                          <Home className="h-5 w-5" />
                        </div>
                        <span className="font-bold">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-bold">{p.city}</p>
                      <p className="mt-0.5 max-w-[200px] truncate text-[11px] font-medium text-on-surface-variant">{p.address}</p>
                    </td>
                    <td className="px-5 py-3.5 font-medium">{p.owner?.name || '-'}</td>
                    <td className="px-5 py-3.5 text-center">
                      <StatusBadge ok={p.isVerified} okLabel="Terverifikasi" noLabel="Menunggu" />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {p.isVerified ? (
                        <button
                          disabled={isUpdating}
                          onClick={() => updateListing({ id: p.id, data: { isVerified: false } })}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-error/30 bg-error/10 px-3 py-1.5 text-[12px] font-bold text-error transition-all hover:bg-error/20 active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                          <XCircle className="h-4 w-4" /> Batalkan
                        </button>
                      ) : (
                        <button
                          disabled={isUpdating}
                          onClick={() => updateListing({ id: p.id, data: { isVerified: true } })}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-primary text-white px-3 py-1.5 text-[12px] font-bold transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                          <CheckCircle className="h-4 w-4" /> Setujui
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
};

/* ============================ USERS ============================ */
const ROLE_LABEL: Record<string, string> = { admin: 'Admin', owner: 'Pemilik Kost', seeker: 'Pencari Kost' };

const roleBadgeClass = (role: string) =>
  role === 'admin'
    ? 'border-primary/20 bg-primary/10 text-primary'
    : role === 'owner'
      ? 'border-secondary/20 bg-secondary/10 text-secondary'
      : 'border-tertiary/20 bg-tertiary/10 text-tertiary';

const formatJoinDate = (iso?: string) => {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
};

type PendingAction = { user: AdminUser; field: 'isVerified' | 'isActive'; next: boolean };

const UsersSection: React.FC = () => {
  const { users, isLoading, isError, refetch, updateUser, isUpdating } = useAdminUsers();
  const [viewUser, setViewUser] = useState<AdminUser | null>(null);
  const [pending, setPending] = useState<PendingAction | null>(null);

  const runAction = () => {
    if (!pending) return;
    const data = pending.field === 'isVerified' ? { isVerified: pending.next } : { isActive: pending.next };
    updateUser({ id: pending.user.id, data });
    setPending(null);
    setViewUser(null);
  };

  // Human-readable confirmation copy + tone for the pending action.
  const confirmCopy = (() => {
    if (!pending) return { title: '', message: '', confirmLabel: '', tone: 'emerald' as const };
    const n = pending.user.name;
    if (pending.field === 'isVerified') {
      return pending.next
        ? { title: 'Verifikasi pengguna?', message: <>Tandai <b>{n}</b> sebagai akun terverifikasi.</>, confirmLabel: 'Ya, verifikasi', tone: 'emerald' as const }
        : { title: 'Cabut verifikasi?', message: <>Status terverifikasi <b>{n}</b> akan dicabut.</>, confirmLabel: 'Ya, cabut', tone: 'amber' as const };
    }
    return pending.next
      ? { title: 'Aktifkan akun?', message: <>Akun <b>{n}</b> akan bisa kembali masuk dan mengakses layanan.</>, confirmLabel: 'Ya, aktifkan', tone: 'emerald' as const }
      : { title: 'Nonaktifkan akun?', message: <>Akun <b>{n}</b> tidak akan bisa masuk hingga diaktifkan kembali.</>, confirmLabel: 'Ya, nonaktifkan', tone: 'rose' as const };
  })();

  const actionBtn =
    'inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[12px] font-bold transition-all hover:brightness-110 active:scale-95 disabled:opacity-40';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <SectionHeading title="Manajemen Pengguna" desc="Verifikasi status akun, aktif/nonaktifkan, dan pantau pengguna terdaftar." />

      <Panel>
        <PanelHeader title="Daftar Akun Pengguna" subtitle={`${users.length} total terdaftar`} right={<RefreshBtn onClick={() => refetch()} />} />
        {isLoading ? (
          <Loading />
        ) : isError ? (
          <ErrorState message="Gagal memuat data pengguna." onRetry={() => refetch()} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container/50 text-[11px] uppercase tracking-wider text-on-surface-variant">
                  <th className="px-5 py-3 font-bold">Pengguna</th>
                  <th className="px-5 py-3 font-bold">Kontak</th>
                  <th className="px-5 py-3 font-bold">Peran</th>
                  <th className="px-5 py-3 text-center font-bold">Verifikasi</th>
                  <th className="px-5 py-3 text-center font-bold">Status</th>
                  <th className="px-5 py-3 text-right font-bold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50 text-[13px] font-medium text-on-surface">
                {users.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => setViewUser(u)}
                    className="cursor-pointer transition-colors hover:bg-surface-container/30"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-outline-variant bg-surface-container text-on-surface-variant">
                          {u.avatar_url ? <img src={u.avatar_url} alt={u.name} className="h-full w-full object-cover" /> : <Users className="h-5 w-5" />}
                        </div>
                        <span className="font-bold">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p>{u.email}</p>
                      <p className="mt-0.5 text-[11px] font-medium text-on-surface-variant">{u.phone || '-'}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block rounded-lg border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${roleBadgeClass(u.role)}`}>{u.role}</span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <StatusBadge ok={u.isVerified} okLabel="Terverifikasi" noLabel="Pending" />
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
                          u.isActive ? 'border-primary/20 bg-primary/10 text-primary' : 'border-error/20 bg-error/10 text-error'
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full ${u.isActive ? 'bg-primary' : 'bg-error'}`} />
                        {u.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewUser(u)}
                          title="Lihat profil"
                          aria-label="Lihat profil"
                          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-outline-variant bg-surface-container text-on-surface-variant transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary active:scale-95"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          disabled={isUpdating || u.role === 'admin'}
                          onClick={() => setPending({ user: u, field: 'isVerified', next: !u.isVerified })}
                          className={`${actionBtn} ${u.isVerified ? 'border-error/30 bg-error/10 text-error hover:bg-error/20' : 'border-primary/30 bg-primary/10 text-primary hover:bg-primary/20'}`}
                        >
                          {u.isVerified ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                          {u.isVerified ? 'Cabut' : 'Verifikasi'}
                        </button>
                        <button
                          disabled={isUpdating || u.role === 'admin'}
                          onClick={() => setPending({ user: u, field: 'isActive', next: !u.isActive })}
                          className={`${actionBtn} ${u.isActive ? 'border-error/30 bg-error/10 text-error hover:bg-error/20' : 'border-outline-variant bg-surface-container text-on-surface hover:bg-surface-container-high'}`}
                        >
                          {u.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* User profile detail */}
      <Modal open={!!viewUser} onClose={() => setViewUser(null)}>
        {viewUser && (
          <>
            <ModalClose onClick={() => setViewUser(null)} />
            {/* Header with soft glow accent */}
            <div className="relative overflow-hidden px-6 pb-5 pt-7">
              <div className="pointer-events-none absolute -top-16 -right-10 h-44 w-44 rounded-full bg-[var(--primary-400)]/10 blur-3xl" />
              <div className="relative flex items-center gap-4">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 text-slate-400">
                  {viewUser.avatar_url ? <img src={viewUser.avatar_url} alt={viewUser.name} className="h-full w-full object-cover" /> : <User className="h-7 w-7" />}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-bold text-slate-800">{viewUser.name}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span className={`inline-block rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${roleBadgeClass(viewUser.role)}`}>
                      {ROLE_LABEL[viewUser.role] ?? viewUser.role}
                    </span>
                    {viewUser.isVerified ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-[var(--primary-50)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--primary-600)]">
                        <BadgeCheck className="h-3 w-3" /> Terverifikasi
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-600">
                        <ShieldAlert className="h-3 w-3" /> Pending
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-1 px-6 pb-5">
              <DetailRow icon={<Mail className="h-4 w-4" />} label="Email" value={viewUser.email} />
              <DetailRow icon={<Phone className="h-4 w-4" />} label="Telepon" value={viewUser.phone || '-'} />
              <DetailRow
                icon={<span className={`h-2 w-2 rounded-full ${viewUser.isActive ? 'bg-[var(--primary-500)]' : 'bg-rose-500'}`} />}
                label="Status Akun"
                value={viewUser.isActive ? 'Aktif' : 'Nonaktif'}
              />
              <DetailRow icon={<Calendar className="h-4 w-4" />} label="Bergabung" value={formatJoinDate(viewUser.createdAt)} />
            </div>

            {/* Actions */}
            {viewUser.role !== 'admin' && (
              <div className="flex items-center justify-end gap-2.5 border-t border-outline-variant bg-surface-container/60 px-6 py-4">
                <button
                  disabled={isUpdating}
                  onClick={() => setPending({ user: viewUser, field: 'isVerified', next: !viewUser.isVerified })}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-xl border px-3.5 py-2 text-[12px] font-bold transition-all active:scale-95 disabled:opacity-40 ${viewUser.isVerified ? 'border-amber-100 bg-amber-50 text-amber-600 hover:bg-amber-100' : 'border-[var(--primary-100)] bg-[var(--primary-50)] text-[var(--primary-600)] hover:bg-[var(--primary-100)]'}`}
                >
                  {viewUser.isVerified ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                  {viewUser.isVerified ? 'Cabut Verifikasi' : 'Verifikasi'}
                </button>
                <button
                  disabled={isUpdating}
                  onClick={() => setPending({ user: viewUser, field: 'isActive', next: !viewUser.isActive })}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-xl border px-3.5 py-2 text-[12px] font-bold transition-all active:scale-95 disabled:opacity-40 ${viewUser.isActive ? 'border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100' : 'border-slate-200 bg-surface-container text-slate-600 hover:bg-slate-100'}`}
                >
                  {viewUser.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                </button>
              </div>
            )}
          </>
        )}
      </Modal>

      <ConfirmDialog
        open={!!pending}
        title={confirmCopy.title}
        message={confirmCopy.message}
        confirmLabel={confirmCopy.confirmLabel}
        tone={confirmCopy.tone}
        loading={isUpdating}
        onConfirm={runAction}
        onClose={() => setPending(null)}
      />
    </div>
  );
};

const DetailRow: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-xl px-1 py-2">
    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-surface-container text-on-surface-variant">{icon}</span>
    <div className="min-w-0">
      <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">{label}</p>
      <p className="text-[14px] font-semibold text-on-surface">{value}</p>
    </div>
  </div>
);

/* ============================ STATS ============================ */
const StatsSection: React.FC = () => {
  const { stats, isLoading, isError } = useAdminStats();

  if (isLoading) return <Loading />;
  if (isError || !stats) return <ErrorState message="Gagal memuat statistik." />;

  const maxCity = Math.max(1, ...Object.values(stats.cityBreakdown));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <SectionHeading title="Statistik Global Platform" desc="Laporan metrik inventory dan sebaran kost secara menyeluruh." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Pengguna" value={stats.users.total} icon={<Users className="h-5 w-5" />} sub={`${stats.users.seekers} pencari · ${stats.users.owners} pemilik`} />
        <KpiCard label="Total Kost" value={stats.properties.total} icon={<Home className="h-5 w-5" />} sub={`${stats.properties.verified} terverifikasi · ${stats.properties.pending} pending`} />
        <KpiCard label="Total Kamar" value={stats.totalRooms} icon={<LayoutDashboard className="h-5 w-5" />} sub="Kapasitas hunian sistem" />
        <KpiCard label="Percakapan" value={stats.totalConversations} icon={<MessageSquare className="h-5 w-5" />} sub="Total chat aktif" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Order" value={stats.orders.total} icon={<ClipboardList className="h-5 w-5" />} sub={`${stats.orders.active} aktif · ${stats.orders.pending} menunggu`} />
        <KpiCard label="Order Aktif" value={stats.orders.active} icon={<CheckCircle className="h-5 w-5" />} sub="Sewa berjalan" />
        <KpiCard label="Order Menunggu" value={stats.orders.pending} icon={<ShieldAlert className="h-5 w-5" />} sub="Antrian persetujuan" />
        <KpiCard label="Pendapatan Aktif" value={formatIDR(stats.orders.revenue)} icon={<TrendingUp className="h-5 w-5" />} sub="Total sewa aktif" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="Sebaran Kost per Kota" />
          <div className="space-y-3.5 p-5 pt-4">
            {Object.keys(stats.cityBreakdown).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-container text-on-surface-variant">
                  <Building2 className="h-6 w-6" />
                </div>
                <p className="text-[13px] font-semibold text-on-surface-variant">Belum ada data kota.</p>
              </div>
            ) : (
              Object.entries(stats.cityBreakdown)
                .sort((a, b) => b[1] - a[1])
                .map(([city, count], i) => (
                  <div key={city} className="space-y-1.5">
                    <div className="flex items-center justify-between text-[13px] font-bold text-on-surface">
                      <span className="flex items-center gap-2">
                        <Building2 className={`h-4 w-4 ${i === 0 ? 'text-primary' : 'text-on-surface-variant'}`} />
                        {city}
                        {i === 0 && (
                          <span className="rounded-lg bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                            Terbanyak
                          </span>
                        )}
                      </span>
                      <span className="text-on-surface-variant">{count} Kost</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
                      <div
                        className={`h-full rounded-full ${i === 0 ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-primary/50'}`}
                        style={{ width: `${(count / maxCity) * 100}%` }}
                      />
                    </div>
                  </div>
                ))
            )}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Komposisi Pengguna" />
          <UserComposition
            seekers={stats.users.seekers}
            owners={stats.users.owners}
            admins={stats.users.admins}
            total={stats.users.total}
          />
        </Panel>
      </div>
    </div>
  );
};

/* Donut chart + legend for the user role composition. */
const UserComposition: React.FC<{ seekers: number; owners: number; admins: number; total: number }> = ({
  seekers,
  owners,
  admins,
  total,
}) => {
  const segments = [
    { key: 'seekers', label: 'Pencari Kost', value: seekers, color: '#10b981', icon: <UserSearch className="h-3.5 w-3.5" /> },
    { key: 'owners', label: 'Pemilik Kost', value: owners, color: '#6366f1', icon: <Home className="h-3.5 w-3.5" /> },
    { key: 'admins', label: 'Administrator', value: admins, color: '#f59e0b', icon: <Crown className="h-3.5 w-3.5" /> },
  ];

  // SVG donut geometry
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-6 p-6 pt-5 sm:flex-row sm:items-center sm:gap-8">
      {/* Donut */}
      <div className="relative h-36 w-36 shrink-0">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="12" />
          {total > 0 &&
            segments.map((s) => {
              const frac = s.value / total;
              const dash = frac * circumference;
              const seg = (
                <circle
                  key={s.key}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="12"
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="round"
                />
              );
              offset += dash;
              return seg;
            })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-slate-800 leading-none">{total}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total</span>
        </div>
      </div>

      {/* Legend */}
      <div className="w-full flex-1 space-y-3">
        {segments.map((s) => {
          const pct = total ? Math.round((s.value / total) * 100) : 0;
          return (
            <div key={s.key} className="flex items-center gap-3">
              <span
                className="flex h-7 w-7 items-center justify-center rounded-lg text-white shrink-0"
                style={{ backgroundColor: s.color }}
              >
                {s.icon}
              </span>
              <span className="text-xs font-bold text-slate-700">{s.label}</span>
              <span className="ml-auto text-xs font-bold text-slate-400">
                {s.value} <span className="text-on-surface-variant">({pct}%)</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ============================ SHARED ============================ */
const SectionHeading: React.FC<{ title: string; desc: string }> = ({ title, desc }) => (
  <div>
    <h1 className="text-[24px] font-black tracking-tight text-on-surface">{title}</h1>
    <p className="mt-1 text-[13px] font-medium text-on-surface-variant">{desc}</p>
  </div>
);

const RefreshBtn: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button onClick={onClick} title="Muat ulang" className="inline-flex items-center gap-1.5 rounded-xl border border-outline-variant bg-surface-container px-3.5 py-2 text-[12px] font-bold text-on-surface hover:bg-surface-container-high hover:border-primary/30 transition-colors cursor-pointer">
    <RefreshCw className="h-4 w-4" /> Muat ulang
  </button>
);
