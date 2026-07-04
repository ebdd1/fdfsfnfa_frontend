import React, { useEffect } from 'react';
import { Loader2, X, AlertTriangle } from 'lucide-react';

/** Shared accent palette (static classes so Tailwind JIT keeps them). */
export const ACCENTS: Record<string, { chip: string; bar: string; soft: string; text: string }> = {
  emerald: { chip: 'bg-[var(--primary-500)]/10 text-[var(--primary-600)]', bar: 'bg-[var(--primary-500)]', soft: 'bg-[var(--primary-50)]', text: 'text-[var(--primary-600)]' },
  indigo: { chip: 'bg-indigo-500/10 text-indigo-600', bar: 'bg-indigo-500', soft: 'bg-indigo-50', text: 'text-indigo-600' },
  amber: { chip: 'bg-amber-500/10 text-amber-600', bar: 'bg-amber-500', soft: 'bg-amber-50', text: 'text-amber-600' },
  blue: { chip: 'bg-blue-500/10 text-blue-600', bar: 'bg-blue-500', soft: 'bg-blue-50', text: 'text-blue-600' },
  rose: { chip: 'bg-rose-500/10 text-rose-600', bar: 'bg-rose-500', soft: 'bg-rose-50', text: 'text-rose-600' },
};

/** A polished KPI card with icon chip, big value, context line and optional progress. */
export const KpiCard: React.FC<{
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  icon: React.ReactNode;
  accent?: keyof typeof ACCENTS;
  progress?: number; // 0..100
}> = ({ label, value, sub, icon, progress }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-surface-container-lowest shadow-elevation-1 p-5 hover:shadow-elevation-hover transition-all duration-300">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">{label}</p>
          <p className="mt-1.5 text-[28px] font-black tracking-tight text-on-surface leading-none tabular-nums">{value}</p>
        </div>
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary-container text-on-primary-container shadow-level-1 transition-all duration-300 group-hover:bg-primary group-hover:text-white">
          {icon}
        </div>
      </div>
      {progress !== undefined && (
        <div className="mt-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
          </div>
        </div>
      )}
      {sub && <p className="mt-3 text-[11px] font-semibold text-on-surface-variant">{sub}</p>}
    </div>
  );
};

/** Section wrapper card. */
export const Panel: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`rounded-2xl bg-surface-container-lowest shadow-elevation-1 overflow-hidden ${className}`}>{children}</div>
);

export const PanelHeader: React.FC<{ title: string; subtitle?: string; right?: React.ReactNode }> = ({ title, subtitle, right }) => (
  <div className="flex items-center justify-between gap-4 border-b border-outline-variant px-5 py-4">
    <div className="flex items-center gap-3">
      <div className="h-5 w-0.5 rounded-full bg-primary" />
      <div>
        <h3 className="text-[14px] font-bold text-on-surface">{title}</h3>
        {subtitle && <p className="text-[11px] font-medium text-on-surface-variant">{subtitle}</p>}
      </div>
    </div>
    {right}
  </div>
);

export const StatusBadge: React.FC<{ ok: boolean; okLabel: string; noLabel: string }> = ({ ok, okLabel, noLabel }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
      ok ? 'border-primary/20 bg-primary/10 text-primary' : 'border-amber-200 bg-amber-50 text-amber-600'
    }`}
  >
    <span className={`h-1.5 w-1.5 rounded-full ${ok ? 'bg-primary' : 'bg-amber-500'}`} />
    {ok ? okLabel : noLabel}
  </span>
);

export const Loading: React.FC = () => (
  <div className="flex items-center justify-center py-16 text-on-surface-variant">
    <Loader2 className="h-6 w-6 animate-spin" />
  </div>
);

export const ErrorState: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
    <div className="w-14 h-14 rounded-2xl bg-error/10 flex items-center justify-center mb-2">
      <AlertTriangle className="w-6 h-6 text-error" />
    </div>
    <p className="text-[14px] font-semibold text-on-surface">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-2 px-5 py-2.5 bg-primary text-white text-[12px] font-bold rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-level-1 cursor-pointer"
      >
        Coba Lagi
      </button>
    )}
  </div>
);

export const EmptyState: React.FC<{ icon: React.ReactNode; title: string; desc?: string }> = ({ icon, title, desc }) => (
  <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
    <div className="mb-3 w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center text-on-surface-variant">{icon}</div>
    <p className="text-[14px] font-bold text-on-surface">{title}</p>
    {desc && <p className="max-w-xs text-[12px] text-on-surface-variant">{desc}</p>}
  </div>
);

/** Centered modal with blurred backdrop. Closes on ESC and backdrop click. */
export const Modal: React.FC<{ open: boolean; onClose: () => void; children: React.ReactNode; className?: string }> = ({
  open,
  onClose,
  children,
  className = '',
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-md overflow-hidden rounded-3xl bg-surface-container-lowest shadow-elevation-hover border border-outline-variant animate-in zoom-in-95 fade-in duration-200 ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

/** Close button for the top-right of a modal. */
export const ModalClose: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-4 top-4 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container transition-colors duration-200"
    aria-label="Tutup"
  >
    <X className="h-4 w-4" />
  </button>
);

/** Confirmation dialog with a tone-aware accent. */
export const ConfirmDialog: React.FC<{
  open: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'emerald' | 'rose' | 'amber';
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}> = ({ open, title, message, confirmLabel = 'Ya, lanjutkan', cancelLabel = 'Batal', tone = 'emerald', loading, onConfirm, onClose }) => {
  const toneAccent: Record<string, { bg: string; text: string; border: string }> = {
    emerald: { bg: 'bg-primary', text: 'text-white', border: 'border-primary' },
    rose: { bg: 'bg-error', text: 'text-white', border: 'border-error' },
    amber: { bg: 'bg-amber-500', text: 'text-white', border: 'border-amber-500' },
  };
  const t = toneAccent[tone];

  return (
    <Modal open={open} onClose={onClose} className="max-w-sm">
      <div className="p-6">
        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${t.bg}/10`}>
          <AlertTriangle className={`h-6 w-6 ${t.text}`} />
        </div>
        <h3 className="text-[16px] font-bold text-on-surface">{title}</h3>
        <div className="mt-2 text-[13px] leading-relaxed text-on-surface-variant">{message}</div>
        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            disabled={loading}
            className="cursor-pointer rounded-xl border border-outline-variant bg-surface-container px-4 py-2.5 text-[13px] font-semibold text-on-surface transition-colors hover:bg-surface-container-high disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex cursor-pointer items-center gap-2 rounded-xl border ${t.border} ${t.bg} px-4 py-2.5 text-[13px] font-semibold text-white shadow-level-1 transition-all active:scale-95 disabled:opacity-50`}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};
