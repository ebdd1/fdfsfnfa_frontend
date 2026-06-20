import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useAdminUsers, useAdminListings, useAdminStats } from '../hooks/useAdmin';
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
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      {/* ===================== MOBILE DRAWER ===================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <aside className="relative flex w-72 max-w-xs flex-col justify-between bg-white p-4 shadow-xl animate-in slide-in-from-left duration-300">
            <div className="space-y-6">
              <div className="flex h-11 items-center justify-between px-2">
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
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Nav */}
              <nav className="space-y-5">
                {groups.map((g) => (
                  <div key={g.label} className="space-y-1">
                    <p className="px-3 pb-1 font-mono text-[9px] font-black uppercase tracking-widest text-slate-300">{g.label}</p>
                    {g.items.map((item) => {
                      const active = activeSection === item.key;
                      return (
                        <button
                          key={item.key}
                          onClick={() => {
                            setActiveSection(item.key);
                            setMobileMenuOpen(false);
                          }}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all duration-200 ${active
                              ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100/30'
                              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
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
            </div>

            {/* Footer */}
            <div className="space-y-1 border-t border-slate-100 pt-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/');
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4 flex-shrink-0" />
                <span>Kembali ke Beranda</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-rose-500 transition-colors hover:bg-rose-50"
              >
                <LogOut className="h-4 w-4 flex-shrink-0" />
                <span>Keluar / Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ===================== SIDEBAR ===================== */}
      <aside
        className={`hidden md:flex flex-col justify-between border-r border-slate-200/80 bg-white transition-all duration-300 ${
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
              className="rounded-lg border border-slate-200/60 p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors"
              title={collapsed ? "Tampilkan Sidebar" : "Sembunyikan Sidebar"}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          {/* Nav */}
          <nav className="space-y-5">
            {groups.map((g) => (
              <div key={g.label} className="space-y-1">
                {!collapsed && <p className="px-3 pb-1 font-mono text-[9px] font-black uppercase tracking-widest text-slate-300">{g.label}</p>}
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
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all duration-200 ${
                        collapsed ? 'justify-center px-0' : ''
                      } ${active
                        ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100/30'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
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
        <div className={`space-y-1 border-t border-slate-100 ${collapsed ? 'p-3' : 'p-4'}`}>
          <button
            onClick={() => {
              navigate('/');
              if (collapsed) setCollapsed(false);
            }}
            title="Kembali ke Beranda"
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 ${
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
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-rose-500 transition-colors hover:bg-rose-50 ${
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
        {/* Topbar — styled to match the user dashboard header */}
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8 relative z-30">
          {/* Left: hamburger (mobile) + breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-400">
              <button
                onClick={() => navigate('/')}
                className="hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer font-bold"
              >
                {settings.logo_url ? (
                  <img src={settings.logo_url} alt={settings.site_name || 'Logo'} className="w-4 h-4 object-contain" />
                ) : (
                  <LogoText className="text-xs font-black" />
                )}
              </button>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="text-slate-800 font-extrabold capitalize bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                {SECTION_TITLE[activeSection]}
              </span>
            </div>
          </div>

          {/* Right: notifications + profile dropdowns */}
          <div className="flex items-center gap-4">
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
              </button>

              {isNotificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 pb-2 border-b border-slate-100 flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest font-mono">Notifikasi</span>
                    </div>
                    <div className="max-h-60 overflow-y-auto mt-2">
                      <div className="px-4 py-6 text-center text-xs text-slate-400 font-semibold">
                        Tidak ada notifikasi baru.
                      </div>
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
                <div className="w-7 h-7 rounded-lg bg-slate-200 overflow-hidden border border-slate-200 flex-shrink-0 flex items-center justify-center text-slate-500">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt={user?.name || 'Admin'} className="w-full h-full object-cover" />
                  ) : (
                    <Shield className="w-3.5 h-3.5" />
                  )}
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Masuk Sebagai</p>
                      <p className="text-xs font-black text-slate-800 leading-tight mt-0.5 truncate">{user?.name || 'Administrator'}</p>
                      <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">{user?.email || 'admin@kostfind.com'}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          setShowProfileEditor(true);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-emerald-600 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Edit Profil Saya</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate('/');
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-emerald-600 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Home className="w-4 h-4 text-slate-400" />
                        <span>Kembali ke Beranda</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-1 mt-1">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-extrabold text-red-500 hover:bg-red-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
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

      {/* ===================== BOTTOM NAVIGATION (MOBILE ONLY) ===================== */}
      <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden bg-white/85 backdrop-blur-lg border border-slate-200/50 rounded-[20px] px-2 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
        <div className="flex h-[68px] items-center justify-around">
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
                className="flex flex-col items-center justify-center flex-1 h-full py-1 transition-all duration-200 active:scale-95"
              >
                <div className={`flex flex-col items-center justify-center w-[58px] h-[48px] rounded-xl transition-all duration-300 ${active ? 'bg-emerald-50/90 text-emerald-600' : 'text-slate-400 hover:text-slate-600'
                  }`}>
                  <IconComponent className={`h-5 w-5 stroke-[2.2] transition-transform duration-300 ${active ? 'scale-105' : ''}`} />
                  <span className={`mt-0.5 text-[9px] tracking-tight transition-colors duration-300 ${active ? 'font-black' : 'font-semibold'}`}>
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
      {/* Greeting banner with profile cover */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/50 shadow-sm">
        {/* Banner background */}
        <div className="h-28 w-full bg-gradient-to-r from-emerald-500 to-teal-500">
          {user?.banner_url && <img src={user.banner_url} alt="Banner" className="h-full w-full object-cover" />}
        </div>
        {/* Content over white */}
        <div className="relative bg-white/80 backdrop-blur-md px-6 pb-6 pt-10 sm:px-8">
          {/* Avatar overlapping banner */}
          <div className="absolute -top-8 left-6 h-16 w-16 overflow-hidden rounded-2xl border-4 border-white bg-emerald-100 shadow-lg sm:left-8">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={adminName || 'Admin'} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xl font-black text-emerald-600">
                {(adminName || 'A')[0].toUpperCase()}
              </div>
            )}
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Panel Administrator</p>
          <h1 className="mt-1 text-2.5xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Halo, {adminName?.split(' ')[0] || 'Admin'}
          <Sparkles className="inline-block w-5 h-5 ml-1.5 text-amber-400 align-middle" />
          </h1>
          <p className="mt-1.5 text-xs font-semibold text-slate-400">{today}</p>
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : isError || !stats ? (
        <ErrorState message="Gagal memuat ringkasan." />
      ) : (
        <>
          {/* KPI grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard label="Total Pengguna" value={stats.users.total} icon={<Users className="h-5 w-5" />} accent="blue" sub={`${stats.users.seekers} pencari · ${stats.users.owners} pemilik · ${stats.users.admins} admin`} />
            <KpiCard label="Kost Terverifikasi" value={`${stats.properties.verified}/${stats.properties.total}`} icon={<CheckCircle className="h-5 w-5" />} accent="emerald" progress={stats.properties.total ? (stats.properties.verified / stats.properties.total) * 100 : 0} sub={`${Math.round(stats.properties.total ? (stats.properties.verified / stats.properties.total) * 100 : 0)}% listing tervalidasi`} />
            <KpiCard label="Menunggu Moderasi" value={stats.properties.pending} icon={<ShieldAlert className="h-5 w-5" />} accent="amber" sub={stats.properties.pending > 0 ? 'Perlu tindakan Anda' : 'Semua sudah ditinjau'} />
            <KpiCard label="Total Kamar" value={stats.totalRooms} icon={<Home className="h-5 w-5" />} accent="indigo" sub={`${stats.totalConversations} percakapan aktif`} />
          </div>

          {/* Order KPI row */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard label="Total Order" value={stats.orders.total} icon={<ClipboardList className="h-5 w-5" />} accent="indigo" sub={`${stats.orders.active} aktif · ${stats.orders.pending} menunggu`} />
            <KpiCard label="Order Aktif" value={stats.orders.active} icon={<CheckCircle className="h-5 w-5" />} accent="emerald" sub="Sewa berjalan" />
            <KpiCard label="Order Menunggu" value={stats.orders.pending} icon={<ShieldAlert className="h-5 w-5" />} accent="amber" sub={stats.orders.pending > 0 ? 'Menunggu persetujuan pemilik' : 'Tidak ada antrian'} />
            <KpiCard label="Pendapatan Aktif" value={formatIDR(stats.orders.revenue)} icon={<TrendingUp className="h-5 w-5" />} accent="blue" sub="Total sewa aktif" />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Pending moderation */}
            <Panel className="lg:col-span-2">
              <PanelHeader
                title="Kost Menunggu Verifikasi"
                subtitle="Tinjau dan setujui listing terbaru"
                right={
                  <button onClick={() => onGo('verify')} className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 transition-colors hover:text-emerald-700">
                    Lihat semua <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                }
              />
              {pending.length === 0 ? (
                <EmptyState icon={<CheckCircle className="h-6 w-6" />} title="Tidak ada antrean moderasi" desc="Semua kost sudah terverifikasi." />
              ) : (
                <div className="divide-y divide-slate-50">
                  {pending.map((p) => (
                    <div key={p.id} className="flex items-center justify-between gap-4 px-6 py-3.5 transition-colors hover:bg-slate-50/60">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                          <Home className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-800">{p.name}</p>
                          <p className="flex items-center gap-1 truncate text-[11px] font-medium text-slate-400">
                            <MapPin className="h-3 w-3" /> {p.city} · {p.owner?.name || '-'}
                          </p>
                        </div>
                      </div>
                      <button
                        disabled={isUpdating}
                        onClick={() => updateListing({ id: p.id, data: { isVerified: true } })}
                        className="inline-flex flex-shrink-0 items-center gap-1 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-600 transition-colors hover:bg-emerald-100 disabled:opacity-50"
                      >
                        <CheckCircle className="h-3.5 w-3.5" /> Setujui
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Panel>

            {/* Right column: city distribution + quick actions */}
            <div className="space-y-6">
              <Panel>
                <PanelHeader title="Sebaran Kota" subtitle="Distribusi kost" />
                <div className="space-y-3 p-6 pt-4">
                  {Object.keys(stats.cityBreakdown).length === 0 ? (
                    <p className="text-xs italic text-slate-400">Belum ada data.</p>
                  ) : (
                    Object.entries(stats.cityBreakdown).map(([city, count]) => (
                      <div key={city} className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                          <span>{city}</span>
                          <span className="text-slate-400">{count}</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400" style={{ width: `${(count / maxCity) * 100}%` }} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Panel>

              <Panel>
                <PanelHeader title="Aksi Cepat" />
                <div className="space-y-2 p-4">
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
    className="group flex w-full items-center justify-between rounded-xl border border-slate-100 px-4 py-3 text-left transition-all hover:border-slate-200 hover:bg-slate-50"
  >
    <span className="flex items-center gap-3 text-sm font-bold text-slate-700">
      <span className="text-slate-400 transition-colors group-hover:text-emerald-600">{icon}</span>
      {label}
    </span>
    <ChevronRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500" />
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

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <KpiCard label="Total Kost" value={listings.length} icon={<Home className="h-5 w-5" />} accent="blue" />
        <KpiCard label="Terverifikasi" value={verifiedCount} icon={<CheckCircle className="h-5 w-5" />} accent="emerald" />
        <KpiCard label="Menunggu" value={listings.length - verifiedCount} icon={<ShieldAlert className="h-5 w-5" />} accent="amber" />
      </div>

      <Panel>
        <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-sm font-bold text-slate-800">Daftar Kost</h3>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari kost atau kota..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs font-semibold outline-none transition-colors focus:border-emerald-500 sm:w-64"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 outline-none focus:border-emerald-500"
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
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-3 font-bold">Kost</th>
                  <th className="px-6 py-3 font-bold">Lokasi</th>
                  <th className="px-6 py-3 font-bold">Pemilik</th>
                  <th className="px-6 py-3 text-center font-bold">Status</th>
                  <th className="px-6 py-3 text-right font-bold">Aksi Moderasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-700">
                {filtered.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-slate-50/60">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                          <Home className="h-4 w-4" />
                        </div>
                        <span className="font-bold text-slate-800">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <p className="font-bold text-slate-800">{p.city}</p>
                      <p className="mt-0.5 max-w-[200px] truncate text-[10px] font-medium text-slate-400">{p.address}</p>
                    </td>
                    <td className="px-6 py-3.5 font-bold text-slate-600">{p.owner?.name || '-'}</td>
                    <td className="px-6 py-3.5 text-center">
                      <StatusBadge ok={p.isVerified} okLabel="Terverifikasi" noLabel="Menunggu" />
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      {p.isVerified ? (
                        <button
                          disabled={isUpdating}
                          onClick={() => updateListing({ id: p.id, data: { isVerified: false } })}
                          className="ml-auto inline-flex items-center gap-1 rounded-lg border border-rose-100 bg-rose-50 px-3 py-1.5 text-[10px] font-black text-rose-600 transition-colors hover:bg-rose-100 disabled:opacity-50"
                        >
                          <XCircle className="h-3.5 w-3.5" /> Batalkan
                        </button>
                      ) : (
                        <button
                          disabled={isUpdating}
                          onClick={() => updateListing({ id: p.id, data: { isVerified: true } })}
                          className="ml-auto inline-flex items-center gap-1 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-600 transition-colors hover:bg-emerald-100 disabled:opacity-50"
                        >
                          <CheckCircle className="h-3.5 w-3.5" /> Setujui
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
    ? 'border-indigo-100 bg-indigo-50 text-indigo-700'
    : role === 'owner'
      ? 'border-purple-100 bg-purple-50 text-purple-700'
      : 'border-blue-100 bg-blue-50 text-blue-700';

const formatJoinDate = (iso?: string) => {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
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
    'inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[10px] font-black transition-all duration-150 hover:-translate-y-px hover:shadow-sm active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none';

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
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-3 font-bold">Pengguna</th>
                  <th className="px-6 py-3 font-bold">Kontak</th>
                  <th className="px-6 py-3 font-bold">Peran</th>
                  <th className="px-6 py-3 text-center font-bold">Verifikasi</th>
                  <th className="px-6 py-3 text-center font-bold">Status</th>
                  <th className="px-6 py-3 text-right font-bold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-700">
                {users.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => setViewUser(u)}
                    className="cursor-pointer transition-colors hover:bg-slate-50/60"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-slate-400">
                          {u.avatar_url ? <img src={u.avatar_url} alt={u.name} className="h-full w-full object-cover" /> : <Users className="h-4 w-4" />}
                        </div>
                        <span className="font-bold text-slate-800">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <p className="text-slate-800">{u.email}</p>
                      <p className="mt-0.5 text-[10px] font-medium text-slate-400">{u.phone || '-'}</p>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-block rounded-md border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${roleBadgeClass(u.role)}`}>{u.role}</span>
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <StatusBadge ok={u.isVerified} okLabel="Terverifikasi" noLabel="Pending" />
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${u.isActive ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : 'border-rose-100 bg-rose-50 text-rose-700'
                          }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${u.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {u.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    {/* Stop row-click propagation so action buttons don't also open the profile. */}
                    <td className="px-6 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewUser(u)}
                          title="Lihat profil"
                          aria-label="Lihat profil"
                          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all duration-150 hover:-translate-y-px hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 hover:shadow-sm active:scale-95"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          disabled={isUpdating || u.role === 'admin'}
                          onClick={() => setPending({ user: u, field: 'isVerified', next: !u.isVerified })}
                          className={`${actionBtn} ${u.isVerified ? 'border-amber-100 bg-amber-50 text-amber-600 hover:bg-amber-100' : 'border-emerald-100 bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                        >
                          {u.isVerified ? <X className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
                          {u.isVerified ? 'Cabut' : 'Verifikasi'}
                        </button>
                        <button
                          disabled={isUpdating || u.role === 'admin'}
                          onClick={() => setPending({ user: u, field: 'isActive', next: !u.isActive })}
                          className={`${actionBtn} ${u.isActive ? 'border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
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
              <div className="pointer-events-none absolute -top-16 -right-10 h-44 w-44 rounded-full bg-emerald-400/10 blur-3xl" />
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
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-600">
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
                icon={<span className={`h-2 w-2 rounded-full ${viewUser.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />}
                label="Status Akun"
                value={viewUser.isActive ? 'Aktif' : 'Nonaktif'}
              />
              <DetailRow icon={<Calendar className="h-4 w-4" />} label="Bergabung" value={formatJoinDate(viewUser.createdAt)} />
            </div>

            {/* Actions */}
            {viewUser.role !== 'admin' && (
              <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
                <button
                  disabled={isUpdating}
                  onClick={() => setPending({ user: viewUser, field: 'isVerified', next: !viewUser.isVerified })}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-xl border px-3.5 py-2 text-[12px] font-bold transition-all active:scale-95 disabled:opacity-40 ${viewUser.isVerified ? 'border-amber-100 bg-amber-50 text-amber-600 hover:bg-amber-100' : 'border-emerald-100 bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                >
                  {viewUser.isVerified ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                  {viewUser.isVerified ? 'Cabut Verifikasi' : 'Verifikasi'}
                </button>
                <button
                  disabled={isUpdating}
                  onClick={() => setPending({ user: viewUser, field: 'isActive', next: !viewUser.isActive })}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-xl border px-3.5 py-2 text-[12px] font-bold transition-all active:scale-95 disabled:opacity-40 ${viewUser.isActive ? 'border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
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
    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">{icon}</span>
    <div className="min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="truncate text-[13px] font-semibold text-slate-700">{value}</p>
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

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Pengguna" value={stats.users.total} icon={<Users className="h-5 w-5" />} accent="blue" sub={`${stats.users.seekers} pencari · ${stats.users.owners} pemilik`} />
        <KpiCard label="Total Kost" value={stats.properties.total} icon={<Home className="h-5 w-5" />} accent="emerald" sub={`${stats.properties.verified} terverifikasi · ${stats.properties.pending} pending`} />
        <KpiCard label="Total Kamar" value={stats.totalRooms} icon={<LayoutDashboard className="h-5 w-5" />} accent="indigo" sub="Kapasitas hunian sistem" />
        <KpiCard label="Percakapan" value={stats.totalConversations} icon={<MessageSquare className="h-5 w-5" />} accent="amber" sub="Total chat aktif" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Order" value={stats.orders.total} icon={<ClipboardList className="h-5 w-5" />} accent="indigo" sub={`${stats.orders.active} aktif · ${stats.orders.pending} menunggu`} />
        <KpiCard label="Order Aktif" value={stats.orders.active} icon={<CheckCircle className="h-5 w-5" />} accent="emerald" sub="Sewa berjalan" />
        <KpiCard label="Order Menunggu" value={stats.orders.pending} icon={<ShieldAlert className="h-5 w-5" />} accent="amber" sub="Antrian persetujuan" />
        <KpiCard label="Pendapatan Aktif" value={formatIDR(stats.orders.revenue)} icon={<TrendingUp className="h-5 w-5" />} accent="blue" sub="Total sewa aktif" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="Sebaran Kost per Kota" />
          <div className="space-y-3.5 p-6 pt-4">
            {Object.keys(stats.cityBreakdown).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
                  <Building2 className="h-5 w-5" />
                </div>
                <p className="text-xs font-semibold text-slate-400">Belum ada data kota.</p>
              </div>
            ) : (
              Object.entries(stats.cityBreakdown)
                .sort((a, b) => b[1] - a[1])
                .map(([city, count], i) => (
                  <div key={city} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <Building2 className={`h-3.5 w-3.5 ${i === 0 ? 'text-emerald-500' : 'text-slate-300'}`} />
                        {city}
                        {i === 0 && (
                          <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-emerald-600">
                            Terbanyak
                          </span>
                        )}
                      </span>
                      <span className="text-slate-400">{count} Kost</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${i === 0 ? 'bg-emerald-500' : 'bg-emerald-400/70'}`}
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
                {s.value} <span className="text-slate-300">({pct}%)</span>
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
    <h1 className="text-2xl font-black tracking-tight text-slate-800">{title}</h1>
    <p className="mt-1 text-xs font-medium text-slate-400">{desc}</p>
  </div>
);

const RefreshBtn: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button onClick={onClick} title="Muat ulang" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700">
    <RefreshCw className="h-3.5 w-3.5" /> Muat ulang
  </button>
);
