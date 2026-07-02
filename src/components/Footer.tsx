import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogoText } from './LogoText';
import { Globe, Mail, Phone, Link2, MessageCircle } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { motion } from 'framer-motion';

export const Footer: React.FC = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const phone = (settings.support_phone || '').replace(/\D/g, '');
  const waHref = phone ? `https://wa.me/${phone}` : '#';

  const handleSearchCity = (city: string) => {
    navigate(`/search?city=${city}`);
  };

  return (
    <footer className="bg-[#09090b] text-white border-t border-[#18181b] py-16 md:py-20 px-6 sm:px-8 relative overflow-hidden flex-shrink-0">
      {/* WhatsApp CTA Banner */}
      <div className="max-w-[1200px] mx-auto mb-12">
        <motion.a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#25D366]/20 to-[#25D366]/5 border border-[#25D366]/30 hover:border-[#25D366]/50 transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#25D366] flex items-center justify-center shadow-lg shadow-[#25D366]/25 flex-shrink-0">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.326.156 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.336 11.89-11.867a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Hubungi Kami via WhatsApp</h3>
              <p className="text-sm text-slate-400">Respons cepat untuk pertanyaan & pendaftaran kost</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[#25D366]">{settings.support_phone || 'WhatsApp'}</span>
            <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
          </div>
        </motion.a>
      </div>

      <div className="max-w-[1200px] mx-auto space-y-12 relative z-10">

        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">

          {/* Brand column */}
          <div className="col-span-2 space-y-4 text-left">
            <span className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              {settings.logo_url ? (
                <img src={settings.logo_url} alt={settings.site_name} className="w-8 h-8 object-contain rounded-lg" />
              ) : (
                <LogoText />
              )}
            </span>
            <p className="text-[#71717a] text-xs leading-relaxed max-w-xs font-medium">
              {settings.footer_text || 'Platform pencarian dan pengelolaan kost real-time bergaransi verifikasi GPS lokasi pertama di Indonesia.'}
            </p>
            {settings.company_address && (
              <p className="text-[#52525b] text-[11px] font-medium">{settings.company_address}</p>
            )}
          </div>

          {/* Sitemap Column 1 */}
          <div className="space-y-4 text-left">
            <h5 className="text-[10px] font-medium text-[#71717a] uppercase tracking-widest">Pencari Kost</h5>
            <ul className="space-y-2.5 text-xs text-[#a1a1aa] font-medium">
              <li><button onClick={() => handleSearchCity('Palopo')} className="hover:text-white transition-colors">Kost Palopo</button></li>
              <li><button onClick={() => handleSearchCity('Jakarta')} className="hover:text-white transition-colors">Kost Jakarta</button></li>
              <li><button onClick={() => handleSearchCity('Bandung')} className="hover:text-white transition-colors">Kost Bandung</button></li>
            </ul>
          </div>

          {/* Sitemap Column 2 */}
          <div className="space-y-4 text-left">
            <h5 className="text-[10px] font-medium text-[#71717a] uppercase tracking-widest">Pemilik Kost</h5>
            <ul className="space-y-2.5 text-xs text-[#a1a1aa] font-medium">
              <li><Link to="/register?role=owner" className="hover:text-white transition-colors">Pasang Iklan</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Dasbor Owner</Link></li>
            </ul>
          </div>

          {/* Sitemap Column 3 */}
          <div className="space-y-4 text-left">
            <h5 className="text-[10px] font-medium text-[#71717a] uppercase tracking-widest">Legal</h5>
            <ul className="space-y-2.5 text-xs text-[#a1a1aa] font-medium">
              {settings.privacy_url && (
                <li><a href={settings.privacy_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Kebijakan Privasi</a></li>
              )}
              {settings.terms_url && (
                <li><a href={settings.terms_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
              )}
              {settings.support_email && (
                <li><a href={`mailto:${settings.support_email}`} className="hover:text-white transition-colors">Hubungi Kami</a></li>
              )}
            </ul>
          </div>

        </div>

        <div className="border-t border-[#18181b] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#52525b]">
          <span>&copy; {new Date().getFullYear()} {settings.site_name}. Seluruh hak cipta dilindungi.</span>
          <div className="flex gap-3">
            {settings.social_instagram && (
              <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-[12px] bg-[#18181b] border border-[#3f3f46] flex items-center justify-center text-[#71717a] hover:text-white hover:border-[#71717a] transition-all hover:-translate-y-0.5" title="Instagram">
              <Link2 className="w-4 h-4" />
            </a>
            )}
            {settings.social_twitter && (
              <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-[12px] bg-[#18181b] border border-[#3f3f46] flex items-center justify-center text-[#71717a] hover:text-white hover:border-[#71717a] transition-all hover:-translate-y-0.5" title="Twitter / X">
              <Globe className="w-4 h-4" />
            </a>
            )}
            <a href={`mailto:${settings.support_email}`} className="w-9 h-9 rounded-[12px] bg-[#18181b] border border-[#3f3f46] flex items-center justify-center text-[#71717a] hover:text-white hover:border-[#71717a] transition-all hover:-translate-y-0.5" title="Email">
              <Mail className="w-4 h-4" />
            </a>
            {settings.support_phone && (
              <a href={`tel:${settings.support_phone}`} className="w-9 h-9 rounded-[12px] bg-[#18181b] border border-[#3f3f46] flex items-center justify-center text-[#71717a] hover:text-white hover:border-[#71717a] transition-all hover:-translate-y-0.5" title="Telepon">
                <Phone className="w-4 h-4" />
              </a>
            )}
            {phone && (
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-[12px] bg-[#25D366] border border-[#25D366] flex items-center justify-center text-white hover:bg-[#20BD5A] transition-all hover:-translate-y-0.5" title="WhatsApp">
                <MessageCircle className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
