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
          <div className="h-full md:-mx-2 md:rounded-2xl overflow-hidden md:border border-outline-variant bg-white">
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
    <div className="bg-[#F7F8FA] h-screen flex flex-col md:flex-row overflow-hidden font-sans text-on-surface relative">
      
      {/* MOBILE TOP BAR - iOS Glassmorphic Style */}
      <header className="flex md:hidden items-center justify-between px-margin-mobile h-14 bg-primary/80 backdrop-blur-xl border-b border-white/20 shrink-0 z-30">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Buka menu"
          className="p-2 -ml-2 text-white hover:bg-white/10 rounded-xl transition-colors active:scale-95 cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          {settings.logo_url ? (
            <img src={settings.logo_url} alt={settings.site_name || 'Logo'} className="h-8 w-8 object-contain rounded-xl" />
          ) : (
            <span className="font-headline text-lg font-bold text-white">KostFind</span>
          )}
        </div>

        <button
          onClick={() => {
            setIsNotificationsOpen(!isNotificationsOpen);
          }}
          aria-label="Notifikasi"
          className="relative p-2 -mr-2 text-white hover:bg-white/10 rounded-xl transition-colors active:scale-95 cursor-pointer"
        >
          <Bell className="w-5 h-5" />
          {notifUnread > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full ring-2 ring-white/30" />}
        </button>
      </header>

      {/* MOBILE NOTIFICATIONS SHEET - Premium Style */}
      {isNotificationsOpen && (
        <div className="md:hidden fixed inset-0 z-50" onClick={() => setIsNotificationsOpen(false)}>
          <div className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm animate-in fade-in duration-200 animate-out fade-out duration-150" />
          <div
            className="absolute top-14 right-3 left-3 bg-surface-container-lowest rounded-2xl shadow-elevation-hover border border-outline-variant/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 animate-out fade-out duration-150"
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
                <p className="text-label-sm text-on-surface-variant mt-1">Update permintaan & pembayaran sewa akan muncul di sini.</p>
              </div>
            ) : (
              <div className="max-h-[60vh] overflow-y-auto py-1">
                {notifications.filter(Boolean).map((n) => (
                  <button
                    key={n.id}
                    onClick={() => openNotification(n)}
                    className={`w-full flex items-start gap-3 px-4 py-4 hover:bg-surface-container transition-[background-color] text-left cursor-pointer ${n.isRead ? '' : 'bg-primary-fixed/20'}`}
                  >
                    <div className="relative w-11 h-11 rounded-xl bg-primary-fixed-dim flex items-center justify-center text-primary shrink-0">
                      <ClipboardList className="w-5 h-5" />
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

      {/* MOBILE DRAWER - iOS Glassmorphic Style */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Panel */}
          <aside className="relative flex flex-col w-[280px] max-w-[82%] h-full bg-primary/90 backdrop-blur-xl shadow-2xl animate-in slide-in-from-left duration-250">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-margin-mobile h-14 border-b border-white/20 shrink-0">
              <div className="flex items-center gap-2">
                {settings.logo_url ? (
                  <img src={settings.logo_url} alt={settings.site_name || 'Logo'} className="h-9 w-9 object-contain rounded-xl" />
                ) : (
                  <span className="font-headline text-lg font-bold text-white">KostFind</span>
                )}
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Tutup menu"
                className="p-1.5 text-white/80 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile */}
            <div className="px-4 pt-4">
              <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-white overflow-hidden shrink-0">
                  {user?.avatar_url ? <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" /> : <User className="w-5 h-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-body-sm font-semibold text-white truncate">{user?.name || 'Pemilik Kost'}</p>
                  <span className="text-label-sm font-semibold text-white/70">Pemilik Kost</span>
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              <p className="text-label-sm font-semibold text-white/50 uppercase tracking-wider px-3 mb-2">Menu Utama</p>
              {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => goToSection(key)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-body-sm font-medium transition-colors cursor-pointer ${
                    activeSection === key ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  <span className="relative shrink-0">
                    <Icon className="w-[18px] h-[18px]" />
                    {key === 'chat' && hasUnread && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full" />}
                  </span>
                  <span className="flex-1 text-left">{label}</span>
                  {key === 'properties' && properties.length > 0 && (
                    <span className="text-label-sm font-semibold text-primary bg-white/20 px-2 py-0.5 rounded-full">{properties.length}</span>
                  )}
                  {key === 'chat' && hasUnread && (
                    <span className="text-label-sm font-semibold bg-white/20 text-white px-2 py-0.5 rounded-full">Baru</span>
                  )}
                </button>
              ))}

              <p className="text-label-sm font-semibold text-white/50 uppercase tracking-wider px-3 mb-2 mt-4">Umum</p>
              <button
                onClick={() => goToSection('settings')}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-body-sm font-medium transition-colors cursor-pointer ${
                  activeSection === 'settings' ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <Settings className="w-[18px] h-[18px] shrink-0" />
                <span className="flex-1 text-left">Pengaturan</span>
              </button>
            </nav>

            {/* Footer */}
            <div className="px-3 py-3 border-t border-white/20 space-y-1 shrink-0">
              <button
                onClick={() => { setIsMobileMenuOpen(false); navigate('/'); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-body-sm font-medium text-white/80 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-[18px] h-[18px] shrink-0" />
                <span>Kembali Beranda</span>
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); logout(); navigate('/'); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-body-sm font-medium text-red-300 hover:bg-red-500/20 transition-colors cursor-pointer"
              >
                <LogOut className="w-[18px] h-[18px] shrink-0" />
                <span>Keluar</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* DESKTOP SIDEBAR - Premium Dwelling Style */}
      <aside
        className={`hidden md:flex flex-col justify-between shrink-0 h-screen transition-all duration-300 border-r border-outline-variant bg-surface-container-low ${
          isSidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        <div className={`space-y-5 ${isSidebarCollapsed ? 'p-3' : 'p-5'}`}>
          {/* Brand */}
          <div className={`flex items-center ${isSidebarCollapsed ? 'flex-col gap-3 justify-center' : 'justify-between'} px-1`}>
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
              {settings.logo_url ? (
                <img src={settings.logo_url} alt={settings.site_name || 'Logo'} className="h-10 w-auto object-contain rounded-xl" />
              ) : (
                <LogoText />
              )}
            </div>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="rounded-lg bg-surface-container-high hover:bg-surface-container-lowest p-2 text-on-surface-variant transition-colors cursor-pointer"
              title={isSidebarCollapsed ? 'Tampilkan Sidebar' : 'Sembunyikan Sidebar'}
            >
              {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          {/* Owner Profile Summary */}
          {!isSidebarCollapsed ? (
            <div className="flex items-center gap-3 px-3 py-3.5 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-level-1">
              <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container border border-outline-variant shrink-0 overflow-hidden">
                {user?.avatar_url ? <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" /> : <User className="w-6 h-6" />}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-sm font-bold text-on-surface leading-tight truncate">{user?.name || 'Pemilik Kost'}</p>
                <span className="text-label-sm font-semibold text-primary uppercase tracking-wide block mt-1">Pemilik Kost</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container cursor-pointer hover:scale-105 transition-transform" title={user?.name || 'Pemilik Kost'}>
                {user?.avatar_url ? <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover rounded-xl" /> : <User className="w-6 h-6" />}
              </div>
            </div>
          )}

          {/* Menu Items */}
          <nav className="flex flex-col gap-1">
            <div className="space-y-1 w-full">
              {!isSidebarCollapsed && (
                <p className="text-label-sm font-bold text-on-surface-variant uppercase tracking-wider px-3 mb-2 text-left">Menu Utama</p>
              )}

              <button
                onClick={() => setActiveSection('overview')}
                className={`group w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                  isSidebarCollapsed ? 'justify-center w-12 h-12 mx-auto p-0' : ''
                } ${activeSection === 'overview'
                  ? 'bg-primary-container text-on-primary-container shadow-level-1'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
                title="Dasbor"
              >
                <LayoutDashboard className={`w-5 h-5 shrink-0 transition-colors duration-200 ${activeSection === 'overview' ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`} />
                {!isSidebarCollapsed && <span className="text-body-sm font-medium">Dasbor</span>}
              </button>

              <button
                onClick={() => setActiveSection('properties')}
                className={`group w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                  isSidebarCollapsed ? 'justify-center w-12 h-12 mx-auto p-0' : ''
                } ${activeSection === 'properties'
                  ? 'bg-primary-container text-on-primary-container shadow-level-1'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
                title="Kost"
              >
                <Building2 className={`w-5 h-5 shrink-0 transition-colors duration-200 ${activeSection === 'properties' ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`} />
                {!isSidebarCollapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-body-sm font-medium">Kost</span>
                    {properties.length > 0 && <span className="text-label-sm font-semibold text-primary bg-primary-container/20 px-2 py-0.5 rounded-full">{properties.length}</span>}
                  </div>
                )}
              </button>

              <button
                onClick={() => setActiveSection('finance')}
                className={`group w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                  isSidebarCollapsed ? 'justify-center w-12 h-12 mx-auto p-0' : ''
                } ${activeSection === 'finance'
                  ? 'bg-primary-container text-on-primary-container shadow-level-1'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
                title="Keuangan"
              >
                <Wallet className={`w-5 h-5 shrink-0 transition-colors duration-200 ${activeSection === 'finance' ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`} />
                {!isSidebarCollapsed && <span className="text-body-sm font-medium">Keuangan</span>}
              </button>

              <button
                onClick={() => setActiveSection('orders')}
                className={`group w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                  isSidebarCollapsed ? 'justify-center w-12 h-12 mx-auto p-0' : ''
                } ${activeSection === 'orders'
                  ? 'bg-primary-container text-on-primary-container shadow-level-1'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
                title="Permintaan Sewa"
              >
                <ClipboardList className={`w-5 h-5 shrink-0 transition-colors duration-200 ${activeSection === 'orders' ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`} />
                {!isSidebarCollapsed && <span className="text-body-sm font-medium">Permintaan Sewa</span>}
              </button>

              <button
                onClick={() => setActiveSection('chat')}
                className={`group w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer relative ${
                  isSidebarCollapsed ? 'justify-center w-12 h-12 mx-auto p-0' : ''
                } ${activeSection === 'chat'
                  ? 'bg-primary-container text-on-primary-container shadow-level-1'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
                title="Pesan"
              >
                {conversations.some((c) => c.unread_count > 0) && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
                )}
                <MessageSquare className={`w-5 h-5 shrink-0 transition-colors duration-200 ${activeSection === 'chat' ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`} />
                {!isSidebarCollapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-body-sm font-medium">Pesan</span>
                    {conversations.some((c) => c.unread_count > 0) && (
                      <span className="text-label-sm font-semibold bg-primary-container/20 text-primary px-2 py-0.5 rounded-full">Baru</span>
                    )}
                  </div>
                )}
              </button>
            </div>

            <div className="space-y-1 w-full mt-4 pt-4 border-t border-outline-variant">
              {!isSidebarCollapsed && (
                <p className="text-label-sm font-bold text-on-surface-variant uppercase tracking-wider px-3 mb-2 text-left">Umum</p>
              )}

              <button
                onClick={() => setActiveSection('settings')}
                className={`group w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                  isSidebarCollapsed ? 'justify-center w-12 h-12 mx-auto p-0' : ''
                } ${activeSection === 'settings'
                  ? 'bg-primary-container text-on-primary-container shadow-level-1'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
                title="Pengaturan"
              >
                <Settings className={`w-5 h-5 shrink-0 transition-colors duration-200 ${activeSection === 'settings' ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`} />
                {!isSidebarCollapsed && <span className="text-body-sm font-medium">Pengaturan</span>}
              </button>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className={`border-t border-outline-variant hidden md:block ${isSidebarCollapsed ? 'p-3' : 'p-5 pt-4'}`}>
          <button
            onClick={() => navigate('/')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-body-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer ${
              isSidebarCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Kembali Beranda"
          >
            <ArrowLeft className="w-5 h-5 shrink-0" />
            {!isSidebarCollapsed && <span>Kembali Beranda</span>}
          </button>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-body-sm font-medium text-error hover:bg-error-container transition-colors cursor-pointer ${
              isSidebarCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Keluar"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isSidebarCollapsed && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      {/* RIGHT PANE WORKSPACE */}
      <div className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden">

        {/* TOP HEADER — Premium Dwelling Style */}
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
                className="relative p-2.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-xl transition-[background-color] active:scale-[0.96] cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {notifUnread > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full ring-2 ring-surface animate-pulse" />
                )}
              </button>

              {isNotificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-3 w-80 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-elevation-hover py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden">
                    <div className="px-4 py-2 border-b border-outline-variant flex justify-between items-center">
                      <span className="font-headline text-[18px] font-semibold text-on-surface">Notifikasi</span>
                      {notifUnread > 0 && (
                        <button onClick={() => markAllRead()} className="text-label-sm font-semibold text-primary hover:text-primary/80 cursor-pointer">
                          Tandai dibaca
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto py-1">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-10 flex flex-col items-center text-center">
                          <div className="w-11 h-11 rounded-2xl bg-surface-container flex items-center justify-center mb-2.5 text-on-surface-variant">
                            <Bell className="w-5 h-5" />
                          </div>
                          <p className="text-body-sm font-semibold text-on-surface">Tidak ada notifikasi</p>
                          <p className="text-label-sm text-on-surface-variant mt-0.5">Update permintaan & pembayaran sewa akan muncul di sini.</p>
                        </div>
                      ) : (
                        notifications.filter(Boolean).map((n) => (
                          <button
                            key={n.id}
                            onClick={() => openNotification(n)}
                            className={`w-full flex items-start gap-3 px-3 py-2.5 hover:bg-surface-container transition-[background-color] text-left cursor-pointer ${n.isRead ? '' : 'bg-primary-fixed/20'}`}
                          >
                            <div className="relative w-10 h-10 rounded-xl bg-primary-fixed-dim border border-primary-container flex items-center justify-center text-primary shrink-0">
                              <ClipboardList className="w-5 h-5" />
                              {!n.isRead && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-error border-2 border-surface-container-lowest" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-body-sm font-semibold text-on-surface truncate">{n.title}</p>
                                <span className="text-label-sm text-on-surface-variant shrink-0">{timeAgo(n.createdAt)}</span>
                              </div>
                              <p className="text-label-sm text-on-surface-variant leading-snug line-clamp-2 mt-1">{n.body}</p>
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
                className="flex items-center gap-2 p-1.5 bg-surface-container-low hover:bg-surface border border-outline-variant rounded-xl transition-all duration-200 cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-lg bg-[var(--primary-100)] overflow-hidden border border-outline-variant flex-shrink-0 flex items-center justify-center text-[var(--primary-600)] text-xs font-black">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt={user?.name || 'Pemilik Kost'} className="w-full h-full object-cover" />
                  ) : (
                    (user?.name || 'P')[0].toUpperCase()
                  )}
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-on-surface-variant group-hover:text-primary transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-outline-variant rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2.5 border-b border-outline">
                      <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest font-mono">Masuk Sebagai</p>
                      <p className="text-xs font-black text-on-surface leading-tight mt-0.5 truncate">{user?.name || 'Pemilik Kost'}</p>
                      <p className="text-[10px] text-on-surface-variant font-semibold truncate mt-0.5">{user?.email || ''}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          setShowProfileEditor(true);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container-low hover:text-primary flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <User className="w-4 h-4 text-on-surface-variant" />
                        <span>Edit Profil Saya</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate('/anda/home');
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container-low hover:text-primary flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-[var(--primary-500)]" />
                        <span>Beralih ke Dasbor Pencari</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate('/');
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container-low hover:text-primary flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4 text-on-surface-variant" />
                        <span>Kembali ke Beranda</span>
                      </button>
                    </div>

                    <div className="border-t border-outline pt-1 mt-1">
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

      {/* MOBILE BOTTOM NAVIGATION - Premium Style */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-30 flex justify-around items-center px-2 py-2 bg-surface shadow-[0_-4px_12px_rgba(0,0,0,0.05)] rounded-t-xl">
        {BOTTOM_NAV.map(({ key, label, icon: Icon }) => {
          const active = activeSection === key;
          return (
            <button
              key={key}
              onClick={() => goToSection(key)}
              className={`flex flex-col items-center justify-center px-3 py-1 cursor-pointer transition-all active:scale-[0.96] ${
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
