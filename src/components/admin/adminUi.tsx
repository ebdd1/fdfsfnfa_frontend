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
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white/70 backdrop-blur-md p-6 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-100/50">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{label}</p>
          <p className="mt-2 text-3.5xl font-black tracking-tight text-slate-900">{value}</p>
        </div>
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-slate-150 bg-white/60 text-slate-650 shadow-sm transition-all duration-300 group-hover:bg-[var(--primary-600)] group-hover:text-white group-hover:border-[var(--primary-600)]">
          {icon}
        </div>
      </div>
      {progress !== undefined && (
        <div className="mt-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100/80">
            <div className="h-full rounded-full bg-gradient-to-r from-[var(--primary-500)] to-teal-500 transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
          </div>
        </div>
      )}
      {sub && <p className="mt-3 text-[10px] font-semibold text-slate-400/90">{sub}</p>}
    </div>
  );
};

/** Section wrapper card. */
export const Panel: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`rounded-2xl border border-slate-200/70 bg-white shadow-sm ${className}`}>{children}</div>
);

export const PanelHeader: React.FC<{ title: string; subtitle?: string; right?: React.ReactNode }> = ({ title, subtitle, right }) => (
  <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-4">
    <div className="flex items-center gap-2.5">
      <span className="h-4 w-1.5 rounded-full bg-[var(--primary-500)]" />
      <div>
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
        {subtitle && <p className="text-[11px] font-medium text-slate-400">{subtitle}</p>}
      </div>
    </div>
    {right}
  </div>
);

export const StatusBadge: React.FC<{ ok: boolean; okLabel: string; noLabel: string }> = ({ ok, okLabel, noLabel }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${ok ? 'border-[var(--primary-100)] bg-[var(--primary-50)] text-[var(--primary-700)]' : 'border-amber-100 bg-amber-50 text-amber-700'
      }`}
  >
    <span className={`h-1.5 w-1.5 rounded-full ${ok ? 'bg-[var(--primary-500)]' : 'bg-amber-500'}`} />
    {ok ? okLabel : noLabel}
  </span>
);

export const Loading: React.FC = () => (
  <div className="flex items-center justify-center py-16 text-slate-300">
    <Loader2 className="h-6 w-6 animate-spin" />
  </div>
);

export const ErrorState: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
    <p className="text-sm font-semibold text-slate-500">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="rounded-full bg-[var(--primary-600)] px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-[var(--primary-700)] active:scale-95 shadow-sm">
        Coba Lagi
      </button>
    )}
  </div>
);

export const EmptyState: React.FC<{ icon: React.ReactNode; title: string; desc?: string }> = ({ icon, title, desc }) => (
  <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
    <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-slate-300">{icon}</div>
    <p className="text-sm font-bold text-slate-600">{title}</p>
    {desc && <p className="max-w-xs text-xs text-slate-400">{desc}</p>}
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
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-md overflow-hidden rounded-3xl border border-white/60 bg-white shadow-2xl shadow-slate-900/10 animate-in zoom-in-95 fade-in duration-200 ${className}`}
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
    className="absolute right-4 top-4 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
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
  const toneRing: Record<string, string> = {
    emerald: 'bg-[var(--primary-50)] text-[var(--primary-600)]',
    rose: 'bg-rose-50 text-rose-600',
    amber: 'bg-amber-50 text-amber-600',
  };
  const toneBtn: Record<string, string> = {
    emerald: 'bg-[var(--primary-600)] hover:bg-[var(--primary-700)]',
    rose: 'bg-rose-600 hover:bg-rose-700',
    amber: 'bg-amber-500 hover:bg-amber-600',
  };

  return (
    <Modal open={open} onClose={onClose} className="max-w-sm">
      <div className="p-6">
        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${toneRing[tone]}`}>
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">{title}</h3>
        <div className="mt-1.5 text-[13px] leading-relaxed text-slate-500">{message}</div>
        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            disabled={loading}
            className="cursor-pointer rounded-xl border border-slate-200 px-4 py-2.5 text-[13px] font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-all active:scale-95 disabled:opacity-50 ${toneBtn[tone]}`}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};
