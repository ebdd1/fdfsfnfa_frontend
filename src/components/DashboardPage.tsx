import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { useProperties } from '../hooks/useProperties';
import { useMyOrders } from '../hooks/useOrders';
import { Overview } from './dashboard/Overview';
import { AddPropertyModal } from './dashboard/AddPropertyModal';
import { PropertiesList } from './dashboard/PropertiesList';
import { FinanceOverview } from './dashboard/FinanceOverview';
import { OwnerSettings } from './dashboard/OwnerSettings';
import { OwnerOrdersSection } from '../pages/OwnerOrdersSection';
import { ProfileEditor } from './ProfileEditor';
import { InboxPage } from './InboxPage';
import { useConversations } from '../hooks/useConversations';
import { useNotifications } from '../hooks/useNotifications';
import { Sparkles, LayoutDashboard, Building2, Wallet, Settings, Menu, X, LogOut, ChevronLeft, ChevronRight, ArrowLeft, User, ClipboardList, Bell, ChevronDown, MessageSquare } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { LogoText } from './LogoText';
import { useSettingsStore } from '../stores/settingsStore';

type SectionKey = 'overview' | 'properties' | 'finance' | 'orders' | 'chat' | 'settings';

const sectionLabel: Record<SectionKey, string> = {
  overview: 'Dasbor',
  properties: 'Kost',
  finance: 'Keuangan',
  orders: 'Permintaan Sewa',
  chat: 'Pesan',
  settings: 'Pengaturan',
};

const NAV_ITEMS: { key: SectionKey; label: string; icon: LucideIcon }[] = [
  { key: 'overview', label: 'Dasbor', icon: LayoutDashboard },
  { key: 'properties', label: 'Kost', icon: Building2 },
  { key: 'finance', label: 'Keuangan', icon: Wallet },
  { key: 'orders', label: 'Permintaan Sewa', icon: ClipboardList },
  { key: 'chat', label: 'Pesan', icon: MessageSquare },
];

// Sections surfaced in the mobile bottom navigation bar (thumb-reachable).
const BOTTOM_NAV: { key: SectionKey; label: string; icon: LucideIcon }[] = [
  { key: 'overview', label: 'Dasbor', icon: LayoutDashboard },
  { key: 'properties', label: 'Kost', icon: Building2 },
  { key: 'orders', label: 'Sewa', icon: ClipboardList },
  { key: 'chat', label: 'Pesan', icon: MessageSquare },
];

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { settings } = useSettingsStore();
  const queryClient = useQueryClient();
  // Fetch the logged-in owner's real listings from the API.
  const { properties } = useProperties({ ownerId: user?.id, take: 100 });
  // Rental orders where the logged-in user is involved (seeker or owner).
  const { orders } = useMyOrders();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionKey>('overview');
  const { conversations, messages, selectedConversationId, selectConversation, sendMessage } = useConversations();
  const { notifications, unreadCount: notifUnread, markRead, markAllRead } = useNotifications();

  const hasUnread = conversations.some((c) => c.unread_count > 0);

  const timeAgo = (iso?: string) => {
    if (!iso) return '';
    const diff = Date.now() - new Date(iso).getTime();
    if (Number.isNaN(diff)) return '';
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'baru saja';
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}j`;
    return `${Math.floor(h / 24)}h`;
  };

  const openNotification = (n: { id: string; isRead: boolean; orderId: string | null }) => {
    setIsNotificationsOpen(false);
    if (!n.isRead) markRead(n.id);
    if (n.orderId) setActiveSection('orders');
  };

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Switching section on mobile should always close the drawer.
  const goToSection = (key: SectionKey) => {
    setActiveSection(key);
    setIsMobileMenuOpen(false);
  };

  const rooms = properties.flatMap(p => p.rooms || []);
  const totalRoomsCount = rooms.length;
  const occupiedCount = rooms.filter(r => r.status === 'occupied').length;
  const occupancyRate = totalRoomsCount > 0 ? (occupiedCount / totalRoomsCount) * 100 : 0;
  
  // Active monthly revenue is derived from REAL active rental orders (status 'active')
  // where the logged-in user is the owner — not merely from room status. This keeps the
  // Overview and Finance cards honest and consistent with the "sewa aktif" claim.
  const activeOwnerOrders = orders.filter(o => o.ownerId === user?.id && o.status === 'active');
  const totalRevenue = activeOwnerOrders.reduce((sum, o) => sum + (o.priceMonthly || 0), 0);

  const renovationCount = rooms.filter(r => r.status === 'renovation').length;

  const formatIDR = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handlePropertyUploaded = () => {
    // Refetch the owner's listings so the newly created property appears.
    queryClient.invalidateQueries({ queryKey: ['properties'] });
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <Overview 
            ownerProperties={properties}
            rooms={rooms}
            totalRoomsCount={totalRoomsCount}
            occupancyRate={occupancyRate}
            occupiedCount={occupiedCount}
            totalRevenue={totalRevenue}
            renovationCount={renovationCount}
            formatPrice={formatIDR}
            onOpenAddProperty={() => setIsModalOpen(true)}
            onOpenEditProperty={() => {}}
            onNavigateToManage={() => setActiveSection('properties')}
          />
        );
      case 'properties':
        return (
          <PropertiesList 
            properties={properties} 
            onAddProperty={() => setIsModalOpen(true)} 
            formatPrice={formatIDR} 
          />
        );
      case 'finance':
        return (
          <FinanceOverview
            properties={properties}
            formatPrice={formatIDR}
          />
        );
      case 'settings':
        return (
          <OwnerSettings
            user={user}
            onLogout={() => {
              logout();
              navigate('/');
            }}
          />
        );
      case 'orders':
        return <OwnerOrdersSection />;
      case 'chat':
        return (
          <div className="h-full md:-mx-2 md:rounded-2xl overflow-hidden md:border border-slate-200 bg-white">
            <InboxPage
              conversations={conversations}
              messages={messages}
              onSendMessage={sendMessage}
              onSelectConversation={selectConversation}
              selectedConversationId={selectedConversationId}
            />
          </div>
        );
      default:
        return null;
    }
  };


  return (
    <div className="bg-[#F7F8FA] h-screen flex flex-col md:flex-row overflow-hidden font-sans text-slate-800 relative">
      
      {/* MOBILE TOP BAR */}
      <header className="flex md:hidden items-center justify-between px-4 h-14 bg-white shrink-0 z-30 border-b border-slate-100">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Buka menu"
          className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors active:scale-90 cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--primary-50)]] border border-[var(--primary-100)]]/40 text-[var(--primary-600)]]">
            <Sparkles className="w-4 h-4" />
          </div>
          {settings.logo_url ? (
            <img src={settings.logo_url} alt={settings.site_name || 'Logo'} className="h-8 w-8 object-contain rounded-xl" />
          ) : (
            <LogoText />
          )}
        </div>

        <button
          onClick={() => {
            setIsNotificationsOpen(!isNotificationsOpen);
          }}
          aria-label="Notifikasi"
          className="relative p-2 -mr-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors active:scale-90 cursor-pointer"
        >
          <Bell className="w-5 h-5" />
          {notifUnread > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />}
        </button>
      </header>

      {/* MOBILE NOTIFICATIONS SHEET */}
      {isNotificationsOpen && (
        <div className="md:hidden fixed inset-0 z-50" onClick={() => setIsNotificationsOpen(false)}>
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] animate-in fade-in duration-200" />
          <div
            className="absolute top-14 right-3 left-3 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Notifikasi</span>
              {notifUnread > 0 && (
                <button onClick={() => markAllRead()} className="text-[10px] font-bold text-[var(--primary-600)]] hover:text-[var(--primary-700)]] cursor-pointer">
                  Tandai dibaca
                </button>
              )}
            </div>
            {notifications.length === 0 ? (
              <div className="px-5 py-10 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-3 text-slate-300">
                  <Bell className="w-5 h-5" />
                </div>
                <p className="text-[13px] font-bold text-slate-600">Tidak ada notifikasi</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Update permintaan & pembayaran sewa akan muncul di sini.</p>
              </div>
            ) : (
              <div className="max-h-[60vh] overflow-y-auto py-1">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => openNotification(n)}
                    className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left cursor-pointer ${n.isRead ? '' : 'bg-[var(--primary-50)]]/40'}`}
                  >
                    <div className="relative w-10 h-10 rounded-xl bg-[var(--primary-50)]] border border-[var(--primary-100)]] flex items-center justify-center text-[var(--primary-600)]] shrink-0">
                      <ClipboardList className="w-5 h-5" />
                      {!n.isRead && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-white" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-slate-800 truncate">{n.title}</p>
                        <span className="text-[10px] text-slate-400 shrink-0">{timeAgo(n.createdAt)}</span>
                      </div>
                      <p className="text-[12px] text-slate-500 leading-snug line-clamp-2">{n.body}</p>
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
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Panel */}
          <aside className="relative flex flex-col w-[280px] max-w-[82%] h-full bg-white shadow-2xl animate-in slide-in-from-left duration-250">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 h-14 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                  {settings.logo_url ? (
                    <img src={settings.logo_url} alt={settings.site_name || 'Logo'} className="h-9 w-9 object-contain rounded-xl" />
                  ) : (
                    <LogoText />
                  )}
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
              <div className="flex items-center gap-3 p-3 bg-[var(--primary-50)]]/60 rounded-2xl border border-[var(--primary-100)]]/40">
                <div className="w-11 h-11 rounded-full bg-[var(--primary-100)]] flex items-center justify-center text-[var(--primary-600)]] overflow-hidden shrink-0">
                  {user?.avatar_url ? <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" /> : <User className="w-5 h-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-extrabold text-slate-900 truncate">{user?.name || 'Pemilik Kost'}</p>
                  <span className="text-[10px] font-bold text-[var(--primary-700)]] uppercase tracking-wide">Pemilik Kost</span>
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-1.5">Menu Utama</p>
              {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => goToSection(key)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    activeSection === key ? 'bg-[var(--primary-50)]] text-[var(--primary-700)]]' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="relative shrink-0">
                    <Icon className="w-[18px] h-[18px]" />
                    {key === 'chat' && hasUnread && <span className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--primary-500)]] rounded-full" />}
                  </span>
                  <span className="flex-1 text-left">{label}</span>
                  {key === 'properties' && properties.length > 0 && (
                    <span className="text-[10px] font-bold text-slate-400">{properties.length}</span>
                  )}
                </button>
              ))}

              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-1.5 mt-4">Umum</p>
              <button
                onClick={() => goToSection('settings')}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  activeSection === 'settings' ? 'bg-[var(--primary-50)]] text-[var(--primary-700)]]' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Settings className="w-[18px] h-[18px] shrink-0" />
                <span className="flex-1 text-left">Pengaturan</span>
              </button>
            </nav>

            {/* Footer */}
            <div className="px-3 py-3 border-t border-slate-100 space-y-1 shrink-0">
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-[18px] h-[18px] shrink-0" />
                <span>Kembali Beranda</span>
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-[18px] h-[18px] shrink-0" />
                <span>Keluar</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* SIDEBAR NAVIGATION (DESKTOP) — styled to match the user dashboard */}
      <aside
        className={`bg-white border-r border-slate-200 hidden md:flex flex-col justify-between shrink-0 h-screen transition-all duration-300 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className={`space-y-8 ${isSidebarCollapsed ? 'p-3' : 'p-5'}`}>
          {/* Brand */}
          <div className={`flex items-center ${isSidebarCollapsed ? 'flex-col gap-3 justify-center' : 'justify-between'} px-1`}>
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
              {settings.logo_url ? (
                <img src={settings.logo_url} alt={settings.site_name || 'Logo'} className="h-9 w-9 object-contain rounded-xl" />
              ) : (
                <LogoText />
              )}
            </div>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="rounded-lg border border-slate-200/60 p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
              title={isSidebarCollapsed ? 'Tampilkan Sidebar' : 'Sembunyikan Sidebar'}
            >
              {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          {/* Owner Profile Summary */}
          {!isSidebarCollapsed ? (
            <div className="flex items-center gap-3 px-3 py-3 bg-[var(--primary-50)]]/50 rounded-xl border border-[var(--primary-100)]]/30 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[var(--primary-100)]] flex items-center justify-center text-[var(--primary-600)]] border border-[var(--primary-200)]] shrink-0 overflow-hidden">
                {user?.avatar_url ? <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" /> : <User className="w-5 h-5" />}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-sm font-extrabold text-slate-900 leading-tight truncate">{user?.name || 'Pemilik Kost'}</p>
                <span className="text-[10px] font-bold text-[var(--primary-700)]] uppercase tracking-wide block mt-0.5">Pemilik Kost</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-full bg-[var(--primary-100)]]/50 flex items-center justify-center text-[var(--primary-600)]] border border-[var(--primary-200)]] overflow-hidden" title={user?.name || 'Pemilik Kost'}>
                {user?.avatar_url ? <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" /> : <User className="w-5 h-5" />}
              </div>
            </div>
          )}

          {/* Menu Items */}
          <nav className="flex flex-col gap-1">
            {/* CATEGORY 1: MENU UTAMA */}
            <div className="space-y-1 w-full mb-4">
              {!isSidebarCollapsed && (
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2 font-mono text-left">Menu Utama</p>
              )}

              <button
                onClick={() => setActiveSection('overview')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors cursor-pointer ${
                  isSidebarCollapsed ? 'justify-center rounded-xl w-10 h-10 mx-auto p-0' : 'rounded-xl text-sm font-medium animate-in fade-in duration-200'
                } ${activeSection === 'overview' ? 'bg-[var(--primary-50)]] text-[var(--primary-700)]] border border-[var(--primary-100)]]/30 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
                title="Dasbor"
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span>Dasbor</span>}
              </button>

              <button
                onClick={() => setActiveSection('properties')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors cursor-pointer ${
                  isSidebarCollapsed ? 'justify-center rounded-xl w-10 h-10 mx-auto p-0' : 'rounded-xl text-sm font-medium animate-in fade-in duration-200'
                } ${activeSection === 'properties' ? 'bg-[var(--primary-50)]] text-[var(--primary-700)]] border border-[var(--primary-100)]]/30 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
                title="Kost"
              >
                <Building2 className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>Kost</span>
                    {properties.length > 0 && <span className="text-[10px] font-bold text-slate-400">{properties.length}</span>}
                  </div>
                )}
              </button>

              <button
                onClick={() => setActiveSection('finance')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors cursor-pointer ${
                  isSidebarCollapsed ? 'justify-center rounded-xl w-10 h-10 mx-auto p-0' : 'rounded-xl text-sm font-medium animate-in fade-in duration-200'
                } ${activeSection === 'finance' ? 'bg-[var(--primary-50)]] text-[var(--primary-700)]] border border-[var(--primary-100)]]/30 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
                title="Keuangan"
              >
                <Wallet className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span>Keuangan</span>}
              </button>

              <button
                onClick={() => setActiveSection('orders')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors cursor-pointer ${
                  isSidebarCollapsed ? 'justify-center rounded-xl w-10 h-10 mx-auto p-0' : 'rounded-xl text-sm font-medium animate-in fade-in duration-200'
                } ${activeSection === 'orders' ? 'bg-[var(--primary-50)]] text-[var(--primary-700)]] border border-[var(--primary-100)]]/30 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
                title="Permintaan Sewa"
              >
                <ClipboardList className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span>Permintaan Sewa</span>}
              </button>

              <button
                onClick={() => setActiveSection('chat')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors cursor-pointer ${
                  isSidebarCollapsed ? 'justify-center rounded-xl w-10 h-10 mx-auto p-0' : 'rounded-xl text-sm font-medium animate-in fade-in duration-200'
                } ${activeSection === 'chat' ? 'bg-[var(--primary-50)]] text-[var(--primary-700)]] border border-[var(--primary-100)]]/30 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
                title="Pesan"
              >
                <div className="relative shrink-0">
                  <MessageSquare className="w-4 h-4" />
                  {conversations.some((c) => c.unread_count > 0) && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--primary-500)]] rounded-full ring-2 ring-white" />
                  )}
                </div>
                {!isSidebarCollapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>Pesan</span>
                    {conversations.some((c) => c.unread_count > 0) && (
                      <span className="text-[9px] font-black bg-[var(--primary-100)]] text-[var(--primary-700)]] px-1.5 py-0.5 rounded-full">Baru</span>
                    )}
                  </div>
                )}
              </button>
            </div>

            {/* CATEGORY 2: UMUM */}
            <div className="space-y-1 w-full">
              {!isSidebarCollapsed && (
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2 font-mono text-left">Umum</p>
              )}

              <button
                onClick={() => setActiveSection('settings')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors cursor-pointer ${
                  isSidebarCollapsed ? 'justify-center rounded-xl w-10 h-10 mx-auto p-0' : 'rounded-xl text-sm font-medium animate-in fade-in duration-200'
                } ${activeSection === 'settings' ? 'bg-[var(--primary-50)]] text-[var(--primary-700)]] border border-[var(--primary-100)]]/30 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
                title="Pengaturan"
              >
                <Settings className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span>Pengaturan</span>}
              </button>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className={`border-t border-slate-200 hidden md:block ${isSidebarCollapsed ? 'p-3' : 'p-5 pt-4'}`}>
          <button
            onClick={() => navigate('/')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer ${
              isSidebarCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Kembali Beranda"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            {!isSidebarCollapsed && <span>Kembali Beranda</span>}
          </button>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer ${
              isSidebarCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Keluar"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isSidebarCollapsed && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      {/* RIGHT PANE WORKSPACE */}
      <div className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden">
        
        {/* TOP HEADER — styled to match the user dashboard */}
        <header className="hidden md:flex h-16 border-b border-slate-200 bg-white items-center justify-between px-8 shrink-0 relative z-30">

          {/* Breadcrumbs */}
          <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-400">
            <button
              onClick={() => navigate('/')}
              className="hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer font-bold"
            >
              {settings.logo_url ? (
                <img src={settings.logo_url} alt={settings.site_name} className="w-5 h-5 object-contain" />
              ) : (
                <LogoText className="text-xs font-black" />
              )}
            </button>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-slate-800 font-extrabold capitalize bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              {sectionLabel[activeSection]}
            </span>
          </div>

          {/* Action / Controls on Right */}
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
                {notifUnread > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
                )}
              </button>

              {isNotificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden">
                    <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                      <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Notifikasi</span>
                      {notifUnread > 0 && (
                        <button onClick={() => markAllRead()} className="text-[10px] font-bold text-[var(--primary-600)]] hover:text-[var(--primary-700)]] cursor-pointer">
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
                          <p className="text-[13px] font-bold text-slate-600">Tidak ada notifikasi</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Update permintaan & pembayaran sewa akan muncul di sini.</p>
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <button
                            key={n.id}
                            onClick={() => openNotification(n)}
                            className={`w-full flex items-start gap-3 px-3 py-2.5 hover:bg-slate-50 transition-colors text-left cursor-pointer ${n.isRead ? '' : 'bg-[var(--primary-50)]]/40'}`}
                          >
                            <div className="relative w-10 h-10 rounded-xl bg-[var(--primary-50)]] border border-[var(--primary-100)]] flex items-center justify-center text-[var(--primary-600)]] shrink-0">
                              <ClipboardList className="w-5 h-5" />
                              {!n.isRead && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-white" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-[13px] font-bold text-slate-800 truncate">{n.title}</p>
                                <span className="text-[10px] text-slate-400 shrink-0">{timeAgo(n.createdAt)}</span>
                              </div>
                              <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">{n.body}</p>
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
                <div className="w-7 h-7 rounded-lg bg-[var(--primary-100)]] overflow-hidden border border-slate-200 flex-shrink-0 flex items-center justify-center text-[var(--primary-600)]] text-xs font-black">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt={user?.name || 'Pemilik Kost'} className="w-full h-full object-cover" />
                  ) : (
                    (user?.name || 'P')[0].toUpperCase()
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
                      <p className="text-xs font-black text-slate-800 leading-tight mt-0.5 truncate">{user?.name || 'Pemilik Kost'}</p>
                      <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">{user?.email || ''}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          setShowProfileEditor(true);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-[var(--primary-600)]] flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Edit Profil Saya</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate('/anda/home');
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-[var(--primary-600)]] flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-[var(--primary-500)]]" />
                        <span>Beralih ke Dasbor Pencari</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate('/');
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-[var(--primary-600)]] flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4 text-slate-400" />
                        <span>Kembali ke Beranda</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-1 mt-1">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          logout();
                          navigate('/');
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

        {/* MAIN CONTENT AREA */}
        <main
          className={`flex-1 min-h-0 ${
            activeSection === 'chat'
              ? 'overflow-hidden pb-16 md:pb-0'
              : 'overflow-y-auto px-4 pt-4 pb-20 sm:px-6 md:px-8 md:pt-6 md:pb-8'
          }`}
        >
          <div className={`relative h-full ${activeSection === 'chat' ? '' : 'max-w-7xl mx-auto'}`}>

            {renderActiveSection()}

            <AddPropertyModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSuccess={handlePropertyUploaded}
            />

            {showProfileEditor && (
              <ProfileEditor onClose={() => setShowProfileEditor(false)} />
            )}
          </div>
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-t border-slate-100 flex items-stretch pb-[env(safe-area-inset-bottom)]">
        {BOTTOM_NAV.map(({ key, label, icon: Icon }) => {
          const active = activeSection === key;
          return (
            <button
              key={key}
              onClick={() => goToSection(key)}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 cursor-pointer transition-colors active:scale-95"
            >
              <span className="relative">
                <Icon className={`w-[22px] h-[22px] transition-colors ${active ? 'text-[var(--primary-600)]]' : 'text-slate-400'}`} />
                {key === 'chat' && hasUnread && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-[var(--primary-500)]] rounded-full ring-2 ring-white" />
                )}
              </span>
              <span className={`text-[10px] font-bold transition-colors ${active ? 'text-[var(--primary-600)]]' : 'text-slate-400'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
