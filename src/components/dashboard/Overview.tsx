import { Building2, Building, MapPin, Plus, Calendar, MoreHorizontal, Wallet, TrendingUp, Key, Star } from 'lucide-react';
import type { Property, Room } from '../../types';

interface OverviewProps {
  ownerProperties: Property[];
  rooms: Room[];
  totalRoomsCount: number;
  occupancyRate: number;
  occupiedCount: number;
  totalRevenue: number;
  renovationCount: number;
  formatPrice: (price: number) => string;
  onOpenAddProperty: () => void;
  onOpenEditProperty?: () => void;
  onNavigateToManage: (propertyId: string) => void;
}

export const Overview: React.FC<OverviewProps> = ({
  ownerProperties,
  rooms,
  totalRoomsCount: _totalRoomsCount,
  occupancyRate: _occupancyRate,
  occupiedCount: _occupiedCount,
  totalRevenue,
  renovationCount: _renovationCount,
  formatPrice,
  onOpenAddProperty,
  onNavigateToManage
}) => {
  const currentDate = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // Mock data for demo - in production, this would come from API
  const newInquiries = 12;
  const activeBookings = 24;
  const percentChange = 12;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header - Premium Style */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="font-headline text-[24px] md:text-[30px] font-semibold text-on-surface leading-tight tracking-tight">
            Dasbor Overview
          </h2>
          <p className="font-body text-[14px] md:text-[16px] text-on-surface-variant mt-1">
            Selamat datang. Berikut performa portofolio kost Anda hari ini.
          </p>
        </div>
        {/* Date Picker - Premium Style */}
        <div className="flex items-center gap-3 bg-surface-container-lowest px-4 py-2.5 rounded-xl shadow-level-1 border border-outline-variant">
          <Calendar className="w-5 h-5 text-outline" />
          <span className="font-label text-[14px] font-semibold text-on-surface">{currentDate}</span>
        </div>
      </div>

      {/* Bento Grid: Top Metrics - Premium Dwelling Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">

        {/* Metric 1: Total Revenue Hero Card */}
        <div className="md:col-span-1 bg-primary text-on-primary rounded-2xl p-6 shadow-level-2 flex flex-col justify-between relative overflow-hidden h-36 md:h-40 group">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-container/30 to-transparent" />

          <div className="relative z-10 flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <span className="font-label text-[12px] font-medium text-primary-fixed-dim uppercase tracking-wider">
                Total Pendapatan
              </span>
              <span className="font-headline text-[28px] md:text-[32px] font-bold tracking-tight">
                {formatPrice(totalRevenue)}
              </span>
            </div>
            <div className="bg-on-primary/10 p-2.5 rounded-xl backdrop-blur-sm">
              <Wallet className="w-6 h-6 text-on-primary fill" />
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-tertiary-fixed">
            <TrendingUp className="w-4 h-4" />
            <span className="font-label text-[12px] font-semibold">+{percentChange}% dari bulan lalu</span>
          </div>
        </div>

        {/* Secondary Metrics - Right Column Stack */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          {/* Active Bookings */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-level-1 flex flex-col justify-between h-32 border border-outline-variant/30 hover:shadow-level-2 transition-shadow">
            <div className="flex justify-between items-start">
              <span className="font-label text-[12px] md:text-[14px] font-semibold text-on-surface-variant">Pesanan Aktif</span>
              <Key className="w-5 h-5 text-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-headline text-[24px] font-bold text-on-surface">{activeBookings}</span>
              <span className="font-label text-[11px] md:text-[12px] text-on-surface-variant">3 datang hari ini</span>
            </div>
          </div>

          {/* New Inquiries */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-level-1 flex flex-col justify-between h-32 border border-outline-variant/30 hover:shadow-level-2 transition-shadow">
            <div className="flex justify-between items-start">
              <span className="font-label text-[12px] md:text-[14px] font-semibold text-on-surface-variant">Pertanyaan Baru</span>
              <div className="relative">
                <Building2 className="w-5 h-5 text-secondary" />
                <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-error rounded-full" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-headline text-[24px] font-bold text-on-surface">{newInquiries}</span>
              <span className="font-label text-[11px] md:text-[12px] text-secondary font-medium">Segera ditanggapi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

        {/* Left Column: Properties (2/3 width on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-headline text-[20px] md:text-[24px] font-semibold text-on-surface">Kost Saya</h3>
            <button
              onClick={onOpenAddProperty}
              className="font-label text-[14px] font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
            >
              Lihat Semua
            </button>
          </div>

          {/* Property Cards */}
          {ownerProperties.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-12 shadow-level-1 border border-outline-variant/30 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-6">
                <Building2 className="w-8 h-8 text-on-surface-variant" />
              </div>
              <h4 className="font-headline text-[18px] font-semibold text-on-surface mb-2">Belum Ada Kost</h4>
              <p className="font-body text-[14px] text-on-surface-variant mb-6 max-w-sm">
                Tambahkan kost pertama Anda untuk mulai mengelola portofolio dan melihat analytics.
              </p>
              <button
                onClick={onOpenAddProperty}
                className="flex items-center gap-2 bg-primary text-on-primary font-label text-[14px] font-semibold px-5 py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-level-1 cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                Tambah Kost
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {ownerProperties.slice(0, 3).map((property) => {
                const propRooms = rooms.filter((r) => r.property_id === property.id);
                const occupiedPropCount = propRooms.filter((r) => r.status === 'occupied').length;
                const startingPrice = propRooms.length ? Math.min(...propRooms.map(r => r.price_monthly)) : 0;

                return (
                  <div
                    key={property.id}
                    className="bg-surface-container-lowest rounded-2xl shadow-level-1 overflow-hidden flex flex-col md:flex-row border border-outline-variant/30 group hover:shadow-level-2 transition-all duration-300 cursor-pointer"
                    onClick={() => onNavigateToManage(property.id)}
                  >
                    {/* Image */}
                    <div className="h-48 md:h-auto md:w-2/5 relative overflow-hidden">
                      {property.media && property.media.length > 0 ? (
                        <img
                          src={property.media[0]?.url_thumbnail || property.media[0]?.url_original}
                          alt={property.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-surface-container flex items-center justify-center">
                          <Building className="w-12 h-12 text-on-surface-variant" />
                        </div>
                      )}

                      {/* Premium Badge */}
                      <div className="absolute top-4 left-4 bg-tertiary-fixed text-on-tertiary-fixed-variant px-3 py-1.5 rounded-full text-[12px] font-semibold shadow-level-1 backdrop-blur-md bg-opacity-90 flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 fill" />
                        Premium
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 md:w-3/5 flex flex-col justify-between flex-1 gap-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-headline text-[18px] font-semibold text-on-surface line-clamp-1">{property.name}</h4>
                          <button
                            className="text-outline hover:text-primary transition-colors p-1 -mr-1 cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-1 text-on-surface-variant font-body text-[14px]">
                          <MapPin className="w-4 h-4" />
                          <span>{property.location?.city || property.location?.address || '-'}</span>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <div className="bg-surface-container-low rounded-lg p-3 border border-outline-variant/30">
                            <p className="text-[11px] text-on-surface-variant font-label">Pendapatan Bulanan</p>
                            <p className="font-headline text-[14px] font-bold text-on-surface">
                              {startingPrice > 0 ? formatPrice(startingPrice) : '-'}
                            </p>
                          </div>
                          <div className="bg-surface-container-low rounded-lg p-3 border border-outline-variant/30">
                            <p className="text-[11px] text-on-surface-variant font-label">Tersewa</p>
                            <p className="font-headline text-[14px] font-bold text-secondary">
                              {occupiedPropCount} / {propRooms.length} Kamar
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <button
                          className="flex-1 bg-primary text-on-primary py-2.5 rounded-xl font-label text-[14px] font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateToManage(property.id);
                          }}
                        >
                          Kelola
                        </button>
                        <button
                          className="px-4 border border-outline-variant text-on-surface py-2.5 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Building2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Quick Stats & Actions */}
        <div className="space-y-6">
          <h3 className="font-headline text-[20px] md:text-[24px] font-semibold text-on-surface">Statistik</h3>

          {/* Stats Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-level-1 border border-outline-variant/30">
            <div className="flex justify-between items-center mb-5">
              <h4 className="font-label text-[14px] font-semibold text-on-surface">Okupansi Kost</h4>
              <MoreHorizontal className="w-5 h-5 text-outline cursor-pointer" />
            </div>

            {/* Mini Chart */}
            <div className="h-32 w-full relative mb-4">
              <div className="absolute inset-0 flex items-end justify-around gap-2 pb-4">
                {[40, 60, 85, 70, 90, 78, 92].map((height, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-t-sm transition-all duration-300 ${
                      i === 6 ? 'bg-primary shadow-[0_0_10px_rgba(0,53,148,0.2)]' : 'bg-surface-container-highest hover:bg-primary-fixed-dim'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Labels */}
            <div className="flex justify-around text-[10px] text-outline font-label mt-2">
              <span>Jul</span>
              <span>Agu</span>
              <span className="font-bold text-primary">Sep</span>
              <span>Okt</span>
              <span>Nov</span>
              <span>Des</span>
              <span>Jan</span>
            </div>
          </div>

          {/* Action Card - Premium Style */}
          <div className="bg-inverse-surface text-inverse-on-surface rounded-2xl p-5 shadow-level-2 relative overflow-hidden">
            {/* Decorative circle */}
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary rounded-full opacity-20 blur-xl" />

            <div className="flex items-start gap-4 relative z-10">
              <div className="bg-primary/20 p-2.5 rounded-xl text-inverse-primary shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-label text-[14px] font-semibold mb-1 text-white">Tambah Kost</h4>
                <p className="font-body text-[12px] opacity-80 mb-4 leading-relaxed">
                  Perluas portofolio untuk meningkatkan aliran pendapatan Anda.
                </p>
                <button
                  onClick={onOpenAddProperty}
                  className="text-[12px] font-semibold bg-surface text-on-surface px-4 py-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  + Tambah Kost
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
