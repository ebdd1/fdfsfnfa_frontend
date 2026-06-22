import React from 'react';
import { useSettingsStore } from '../stores/settingsStore';
import { LogoText } from './LogoText';

/**
 * Renders the site logo.
 * Shows uploaded logo_url image if available, otherwise falls back to LogoText.
 * Use this instead of manually checking logo_url in every component.
 */
export const SiteLogo: React.FC<{
  className?: string;
  imgClassName?: string;
  style?: React.CSSProperties;
}> = ({ className, imgClassName, style }) => {
  const settings = useSettingsStore((s) => s.settings);

  if (settings.logo_url) {
    return (
      <img
        src={settings.logo_url}
        alt={settings.site_name || 'Logo'}
        className={imgClassName || className}
        style={style}
      />
    );
  }

  return <LogoText className={className} style={style} />;
};
