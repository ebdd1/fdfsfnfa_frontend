import React from 'react';
import { useSettingsStore } from '../stores/settingsStore';

interface BrandNameProps {
  /** Tailwind text color class for the accented (second) part. Default emerald. */
  accentClassName?: string;
  className?: string;
}

/**
 * Renders the admin-configured site name with a two-tone look.
 * Splits at an interior uppercase letter ("KostFind" -> Kost + Find,
 * "KosKita" -> Kos + Kita). If no interior uppercase, renders the whole
 * name without an accent. Reads from the global settings store so a name
 * change in the admin panel reflects everywhere instantly.
 */
export const BrandName: React.FC<BrandNameProps> = ({
  accentClassName = 'text-emerald-500',
  className,
}) => {
  const siteName = useSettingsStore((s) => s.settings.site_name) || 'KostFind';

  const match = siteName.slice(1).search(/[A-Z]/);
  if (match === -1) {
    return <span className={className}>{siteName}</span>;
  }
  const splitAt = match + 1;
  const head = siteName.slice(0, splitAt);
  const tail = siteName.slice(splitAt);

  return (
    <span className={className}>
      {head}
      <span className={accentClassName}>{tail}</span>
    </span>
  );
};
