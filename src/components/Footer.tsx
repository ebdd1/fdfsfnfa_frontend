import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogoText } from './LogoText';
import { Globe, Mail, Phone, Link2 } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

export const Footer: React.FC = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();

  const handleSearchCity = (city: string) => {
    navigate(`/search?city=${city}`);
  };

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-900 py-20 px-6 sm:px-8 relative overflow-hidden flex-shrink-0">
      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          
          {/* Brand column */}
          <div className="col-span-2 space-y-4 text-left">
            <span className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              {settings.logo_url ? (
                <img src={settings.logo_url} alt={settings.site_name} className="w-8 h-8 object-contain rounded" />
              ) : (
                <LogoText />
              )}
            </span>
            <p className="text-slate-400 text-xs leading-relaxed max-w-xs font-semibold">
              {settings.footer_text || 'Platform pencarian dan pengelolaan kost real-time bergaransi verifikasi GPS lokasi pertama di Indonesia.'}
            </p>
            {settings.company_address && (
              <p className="text-slate-500 text-[11px] font-medium">{settings.company_address}</p>
            )}
          </div>

          {/* Sitemap Column 1 */}
          <div className="space-y-4 text-left">
            <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pencari Kost</h5>
            <ul className="space-y-2.5 text-xs text-slate-300 font-bold">
              <li><button onClick={() => handleSearchCity('Palopo')} className="hover:opacity-80 transition-opacity">Kost Palopo</button></li>
              <li><button onClick={() => handleSearchCity('Jakarta')} className="hover:opacity-80 transition-opacity">Kost Jakarta</button></li>
              <li><button onClick={() => handleSearchCity('Bandung')} className="hover:opacity-80 transition-opacity">Kost Bandung</button></li>
            </ul>
          </div>

          {/* Sitemap Column 2 */}
          <div className="space-y-4 text-left">
            <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pemilik Kost</h5>
            <ul className="space-y-2.5 text-xs text-slate-300 font-bold">
              <li><Link to="/register?role=owner" className="hover:opacity-80 transition-opacity">Pasang Iklan</Link></li>
              <li><Link to="/dashboard" className="hover:opacity-80 transition-opacity">Dasbor Owner</Link></li>
            </ul>
          </div>

          {/* Sitemap Column 3 */}
          <div className="space-y-4 text-left">
            <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Legal</h5>
            <ul className="space-y-2.5 text-xs text-slate-300 font-bold">
              {settings.privacy_url && (
                <li><a href={settings.privacy_url} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">Kebijakan Privasi</a></li>
              )}
              {settings.terms_url && (
                <li><a href={settings.terms_url} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">Syarat & Ketentuan</a></li>
              )}
              {settings.support_email && (
                <li><a href={`mailto:${settings.support_email}`} className="hover:opacity-80 transition-opacity">Hubungi Kami</a></li>
              )}
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <span>&copy; {new Date().getFullYear()} {settings.site_name}. Seluruh hak cipta dilindungi.</span>
          <div className="flex gap-4">
            {settings.social_instagram && (
              <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-all hover:-translate-y-0.5" title="Instagram">
              <Link2 className="w-4 h-4" />
            </a>
            )}
            {settings.social_twitter && (
              <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-all hover:-translate-y-0.5" title="Twitter / X">
              <Globe className="w-4 h-4" />
            </a>
            )}
            <a href={`mailto:${settings.support_email}`} className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-all hover:-translate-y-0.5" title="Email">
              <Mail className="w-4 h-4" />
            </a>
            {settings.support_phone && (
              <a href={`tel:${settings.support_phone}`} className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-all hover:-translate-y-0.5" title="Telepon">
                <Phone className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
