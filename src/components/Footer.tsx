import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSettings } from '../hooks/useSettings';

export const Footer: React.FC = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();

  const handleSearchCity = (city: string) => {
    navigate(`/search?city=${city}`);
  };

  return (
    <footer className="bg-surface-container border-t border-outline-variant mt-auto safe-bottom">
      {/* Main Footer Content */}
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-stack-lg">

          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary font-bold text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                domain
              </span>
              <span className="font-headline-md text-headline-md font-bold text-primary">
                {settings.site_name || 'KostFind'}
              </span>
            </Link>
            <p className="text-body-sm text-on-surface-variant max-w-xs leading-relaxed">
              {settings.footer_text || 'Platform pencarian kost premium terverifikasi GPS lokasi.'}
            </p>
            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              {settings.social_instagram && (
                <a
                  href={settings.social_instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors"
                  aria-label="Instagram"
                >
                  <span className="material-symbols-outlined">camera</span>
                </a>
              )}
              {settings.social_twitter && (
                <a
                  href={settings.social_twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors"
                  aria-label="Twitter"
                >
                  <span className="material-symbols-outlined">tag</span>
                </a>
              )}
              {settings.support_email && (
                <a
                  href={`mailto:${settings.support_email}`}
                  className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors"
                  aria-label="Email"
                >
                  <span className="material-symbols-outlined">mail</span>
                </a>
              )}
            </div>
          </div>

          {/* Pencari Kost Column */}
          <div className="space-y-4">
            <h4 className="text-label-sm font-label-sm font-semibold text-primary uppercase tracking-wider">
              Pencari Kost
            </h4>
            <ul className="space-y-3">
              {[
                { city: 'Palopo', label: 'Kost Palopo' },
                { city: 'Makassar', label: 'Kost Makassar' },
                { city: 'Jakarta', label: 'Kost Jakarta' },
                { city: 'Bandung', label: 'Kost Bandung' },
              ].map(({ city, label }) => (
                <li key={city}>
                  <button
                    onClick={() => handleSearchCity(city)}
                    className="text-body-sm text-on-surface-variant hover:text-primary transition-colors block w-full text-left"
                  >
                    {label}
                  </button>
                </li>
              ))}
              <li>
                <Link
                  to="/search"
                  className="text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  Lihat Semua
                </Link>
              </li>
            </ul>
          </div>

          {/* Pemilik Kost Column */}
          <div className="space-y-4">
            <h4 className="text-label-sm font-label-sm font-semibold text-primary uppercase tracking-wider">
              Pemilik Kost
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/register?role=owner"
                  className="text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  Pasang Iklan
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  Dasbor Pemilik
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  Masuk
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="space-y-4">
            <h4 className="text-label-sm font-label-sm font-semibold text-primary uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-3">
              {settings.privacy_url && (
                <li>
                  <a
                    href={settings.privacy_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                  >
                    Kebijakan Privasi
                  </a>
                </li>
              )}
              {settings.terms_url && (
                <li>
                  <a
                    href={settings.terms_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-sm text-on-surface-variant hover:text-primary transition-colors"
                  >
                    Syarat & Ketentuan
                  </a>
                </li>
              )}
              {settings.support_email && (
                <li>
                  <a
                    href={`mailto:${settings.support_email}`}
                    className="text-body-sm text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">mail</span>
                    Hubungi Kami
                  </a>
                </li>
              )}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-outline-variant">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-md flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-label-sm text-on-surface-variant text-center md:text-left order-2 md:order-1">
            &copy; {new Date().getFullYear()} {settings.site_name}. Hak cipta dilindungi.
          </p>
          {settings.company_address && (
            <p className="text-label-sm text-outline text-center md:text-right order-1 md:order-2">
              {settings.company_address}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
};
