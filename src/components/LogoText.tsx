import React from 'react';
import { useSettingsStore } from '../stores/settingsStore';

/**
 * Renders the site name as a text logo.
 * Uses logo_font_family and logo_font_size from admin settings.
 * Used as fallback when no logo_url image is uploaded.
 *
 * Usage: Replace the Sparkles icon + BrandName fallback pattern in:
 *   Navbar, Footer, DashboardPage, UserDashboardPage, AdminDashboardPage
 */
export const LogoText: React.FC<{
  className?: string;
  style?: React.CSSProperties;
}> = ({ className, style }) => {
  const settings = useSettingsStore((s) => s.settings);
  const fontFamily = settings.logo_font_family || 'Inter';
  const fontSize = settings.logo_font_size || 16;

  return (
    <span
      style={{
        fontFamily: `'${fontFamily}', sans-serif`,
        fontSize: `${fontSize}px`,
        fontWeight: 900,
        letterSpacing: '-0.02em',
        lineHeight: 1.2,
        ...style,
      }}
      className={className}
    >
      {settings.site_name || 'KostFind'}
    </span>
  );
};
