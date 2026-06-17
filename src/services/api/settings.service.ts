import api from './axios';

// Raw record as stored in the backend SiteConfig table
export interface SiteConfigRecord {
  key: string;
  value: string;
  type: string; // 'string' | 'boolean' | 'json'
  isPublic: boolean;
}

// Strongly-typed shape consumed across the app
export interface SiteSettings {
  site_name: string;
  tagline: string;
  hero_title: string;
  // Branding
  logo_url: string;
  favicon_url: string;
  primary_color: string;
  // Contact & social
  support_email: string;
  support_phone: string;
  social_instagram: string;
  social_twitter: string;
  // Content & legal
  footer_text: string;
  company_address: string;
  privacy_url: string;
  terms_url: string;
  seo_description: string;
  // Location
  cities: string[];
  // System & operations
  maintenance_mode: boolean;
  maintenance_message: string;
  allow_registration: boolean;
  max_upload_mb: number;
  max_photos_per_listing: number;
  auto_verify_listings: boolean; // private (admin-only)
  // Feature flags
  feature_smart_alerts: boolean;
  feature_estimator: boolean;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  site_name: 'KostFind',
  tagline: 'Platform Kos Digital Mahasiswa & Pekerja Muda',
  hero_title: 'Cari kost nyaman tanpa cemas foto menipu.',
  logo_url: '',
  favicon_url: '',
  primary_color: 'emerald',
  support_email: 'support@kostfind.com',
  support_phone: '+62812345678',
  social_instagram: '',
  social_twitter: '',
  footer_text: 'Platform pencari kost terverifikasi untuk mahasiswa & pekerja muda.',
  company_address: '',
  privacy_url: '',
  terms_url: '',
  seo_description: 'KostFind — cari kost terverifikasi dengan foto asli dan lokasi akurat.',
  cities: ['Palopo', 'Jakarta', 'Bandung', 'Surabaya'],
  maintenance_mode: false,
  maintenance_message: 'Website sedang dalam pemeliharaan. Silakan kembali beberapa saat lagi.',
  allow_registration: true,
  max_upload_mb: 5,
  max_photos_per_listing: 5,
  auto_verify_listings: false,
  feature_smart_alerts: true,
  feature_estimator: true,
};

// Convert raw key/value records into a typed SiteSettings object
export const recordsToSettings = (records: SiteConfigRecord[]): SiteSettings => {
  const map = new Map(records.map((r) => [r.key, r]));
  const str = (k: keyof SiteSettings, fb: string) => (map.get(k as string)?.value ?? fb);
  const bool = (k: keyof SiteSettings, fb: boolean) => {
    const v = map.get(k as string)?.value;
    return v === undefined ? fb : v === 'true';
  };
  const json = <T,>(k: keyof SiteSettings, fb: T): T => {
    const v = map.get(k as string)?.value;
    if (v === undefined) return fb;
    try {
      return JSON.parse(v) as T;
    } catch {
      return fb;
    }
  };
  const num = (k: keyof SiteSettings, fb: number) => {
    const v = map.get(k as string)?.value;
    if (v === undefined) return fb;
    const n = Number(v);
    return Number.isFinite(n) ? n : fb;
  };

  return {
    site_name: str('site_name', DEFAULT_SETTINGS.site_name),
    tagline: str('tagline', DEFAULT_SETTINGS.tagline),
    hero_title: str('hero_title', DEFAULT_SETTINGS.hero_title),
    logo_url: str('logo_url', DEFAULT_SETTINGS.logo_url),
    favicon_url: str('favicon_url', DEFAULT_SETTINGS.favicon_url),
    primary_color: str('primary_color', DEFAULT_SETTINGS.primary_color),
    support_email: str('support_email', DEFAULT_SETTINGS.support_email),
    support_phone: str('support_phone', DEFAULT_SETTINGS.support_phone),
    social_instagram: str('social_instagram', DEFAULT_SETTINGS.social_instagram),
    social_twitter: str('social_twitter', DEFAULT_SETTINGS.social_twitter),
    footer_text: str('footer_text', DEFAULT_SETTINGS.footer_text),
    company_address: str('company_address', DEFAULT_SETTINGS.company_address),
    privacy_url: str('privacy_url', DEFAULT_SETTINGS.privacy_url),
    terms_url: str('terms_url', DEFAULT_SETTINGS.terms_url),
    seo_description: str('seo_description', DEFAULT_SETTINGS.seo_description),
    cities: json<string[]>('cities', DEFAULT_SETTINGS.cities),
    maintenance_mode: bool('maintenance_mode', DEFAULT_SETTINGS.maintenance_mode),
    maintenance_message: str('maintenance_message', DEFAULT_SETTINGS.maintenance_message),
    allow_registration: bool('allow_registration', DEFAULT_SETTINGS.allow_registration),
    max_upload_mb: num('max_upload_mb', DEFAULT_SETTINGS.max_upload_mb),
    max_photos_per_listing: num('max_photos_per_listing', DEFAULT_SETTINGS.max_photos_per_listing),
    auto_verify_listings: bool('auto_verify_listings', DEFAULT_SETTINGS.auto_verify_listings),
    feature_smart_alerts: bool('feature_smart_alerts', DEFAULT_SETTINGS.feature_smart_alerts),
    feature_estimator: bool('feature_estimator', DEFAULT_SETTINGS.feature_estimator),
  };
};

// Convert a SiteSettings object back into records for the PUT payload
export const settingsToItems = (s: SiteSettings): SiteConfigRecord[] => [
  { key: 'site_name', value: s.site_name, type: 'string', isPublic: true },
  { key: 'tagline', value: s.tagline, type: 'string', isPublic: true },
  { key: 'hero_title', value: s.hero_title, type: 'string', isPublic: true },
  { key: 'logo_url', value: s.logo_url, type: 'string', isPublic: true },
  { key: 'favicon_url', value: s.favicon_url, type: 'string', isPublic: true },
  { key: 'primary_color', value: s.primary_color, type: 'string', isPublic: true },
  { key: 'support_email', value: s.support_email, type: 'string', isPublic: true },
  { key: 'support_phone', value: s.support_phone, type: 'string', isPublic: true },
  { key: 'social_instagram', value: s.social_instagram, type: 'string', isPublic: true },
  { key: 'social_twitter', value: s.social_twitter, type: 'string', isPublic: true },
  { key: 'footer_text', value: s.footer_text, type: 'string', isPublic: true },
  { key: 'company_address', value: s.company_address, type: 'string', isPublic: true },
  { key: 'privacy_url', value: s.privacy_url, type: 'string', isPublic: true },
  { key: 'terms_url', value: s.terms_url, type: 'string', isPublic: true },
  { key: 'seo_description', value: s.seo_description, type: 'string', isPublic: true },
  { key: 'cities', value: JSON.stringify(s.cities), type: 'json', isPublic: true },
  { key: 'maintenance_mode', value: String(s.maintenance_mode), type: 'boolean', isPublic: true },
  { key: 'maintenance_message', value: s.maintenance_message, type: 'string', isPublic: true },
  { key: 'allow_registration', value: String(s.allow_registration), type: 'boolean', isPublic: true },
  { key: 'max_upload_mb', value: String(s.max_upload_mb), type: 'string', isPublic: true },
  { key: 'max_photos_per_listing', value: String(s.max_photos_per_listing), type: 'string', isPublic: true },
  { key: 'auto_verify_listings', value: String(s.auto_verify_listings), type: 'boolean', isPublic: false },
  { key: 'feature_smart_alerts', value: String(s.feature_smart_alerts), type: 'boolean', isPublic: true },
  { key: 'feature_estimator', value: String(s.feature_estimator), type: 'boolean', isPublic: true },
];

export const settingsService = {
  getPublic: async (): Promise<SiteSettings> => {
    const res = await api.get('/settings');
    return recordsToSettings(res.data);
  },

  getAdminAll: async (): Promise<SiteSettings> => {
    const res = await api.get('/admin/settings');
    return recordsToSettings(res.data);
  },

  update: async (settings: SiteSettings): Promise<SiteSettings> => {
    const res = await api.put('/admin/settings', { items: settingsToItems(settings) });
    return recordsToSettings(res.data);
  },
};
