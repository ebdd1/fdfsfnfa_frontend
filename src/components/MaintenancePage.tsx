import React from 'react';
import { Wrench } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

export const MaintenancePage: React.FC = () => {
  const { settings } = useSettings();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 mb-6">
        <Wrench className="w-7 h-7" />
      </div>
      <h1 className="text-2xl font-black text-slate-800 tracking-tight">{settings.site_name} sedang dalam pemeliharaan</h1>
      <p className="mt-3 text-sm text-slate-500 max-w-md leading-relaxed">
        {settings.maintenance_message || 'Website sedang dalam pemeliharaan. Silakan kembali beberapa saat lagi.'}
      </p>
      {settings.support_email && (
        <p className="mt-6 text-xs text-slate-400">
          Butuh bantuan? Hubungi{' '}
          <a href={`mailto:${settings.support_email}`} className="font-bold text-emerald-600 hover:text-emerald-700">
            {settings.support_email}
          </a>
        </p>
      )}
    </div>
  );
};
