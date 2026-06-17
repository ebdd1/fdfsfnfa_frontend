import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Globe, Mail, Phone } from 'lucide-react';
import { BrandName } from './BrandName';
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
              <Sparkles className="w-6 h-6 text-emerald-500 animate-spin-slow" />
              <BrandName />
            </span>
            <p className="text-slate-400 text-xs leading-relaxed max-w-xs font-semibold">
              Platform pencarian dan pengelolaan kost real-time bergaransi verifikasi GPS lokasi pertama di Indonesia.
            </p>
          </div>

          {/* Sitemap Column 1 */}
          <div className="space-y-4 text-left">
            <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pencari Kost</h5>
            <ul className="space-y-2.5 text-xs text-slate-300 font-bold">
              <li><button onClick={() => handleSearchCity('Palopo')} className="hover:text-emerald-400 transition-colors">Kost Palopo</button></li>
              <li><button onClick={() => handleSearchCity('Jakarta')} className="hover:text-emerald-400 transition-colors">Kost Jakarta</button></li>
              <li><button onClick={() => handleSearchCity('Bandung')} className="hover:text-emerald-400 transition-colors">Kost Bandung</button></li>
            </ul>
          </div>

          {/* Sitemap Column 2 */}
          <div className="space-y-4 text-left">
            <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pemilik Kost</h5>
            <ul className="space-y-2.5 text-xs text-slate-300 font-bold">
              <li><Link to="/register?role=owner" className="hover:text-emerald-400 transition-colors">Pasang Iklan</Link></li>
              <li><Link to="/dashboard" className="hover:text-emerald-400 transition-colors">Dasbor Owner</Link></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Panduan Sewa</a></li>
            </ul>
          </div>

          {/* Sitemap Column 3 */}
          <div className="space-y-4 text-left">
            <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Dukungan</h5>
            <ul className="space-y-2.5 text-xs text-slate-300 font-bold">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Pusat Bantuan</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Privasi & Syarat</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Hubungi Kami</a></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <span>&copy; {new Date().getFullYear()} {settings.site_name}. Seluruh hak cipta dilindungi.</span>
          <div className="flex gap-4">
            <a href="#" className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-all hover:-translate-y-0.5" title="Website">
              <Globe className="w-4 h-4" />
            </a>
            <a href={`mailto:${settings.support_email}`} className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-all hover:-translate-y-0.5" title="Email">
              <Mail className="w-4 h-4" />
            </a>
            <a href={`tel:${settings.support_phone}`} className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-all hover:-translate-y-0.5" title="Telepon">
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
