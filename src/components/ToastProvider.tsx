import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, XCircle, X } from 'lucide-react';
import { useToastStore, type Toast, type ToastVariant } from '../stores/toastStore';

const VARIANT: Record<ToastVariant, { icon: React.ReactNode; ring: string; iconWrap: string }> = {
  success: {
    icon: <CheckCircle2 className="w-5 h-5" />,
    ring: 'border-[var(--primary-100)]',
    iconWrap: 'bg-[var(--primary-50)] text-[var(--primary-600)]',
  },
  info: {
    icon: <Info className="w-5 h-5" />,
    ring: 'border-sky-100',
    iconWrap: 'bg-sky-50 text-sky-600',
  },
  error: {
    icon: <XCircle className="w-5 h-5" />,
    ring: 'border-rose-100',
    iconWrap: 'bg-rose-50 text-rose-600',
  },
};

const ToastCard: React.FC<{ toast: Toast }> = ({ toast }) => {
  const dismiss = useToastStore((s) => s.dismiss);
  const v = VARIANT[toast.variant];

  // Auto-dismiss after 5s.
  useEffect(() => {
    const t = setTimeout(() => dismiss(toast.id), 5000);
    return () => clearTimeout(t);
  }, [toast.id, dismiss]);

  const clickable = !!toast.onClick;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      onClick={() => {
        if (toast.onClick) {
          toast.onClick();
          dismiss(toast.id);
        }
      }}
      className={`pointer-events-auto w-[calc(100vw-2rem)] sm:w-80 bg-white rounded-2xl border ${v.ring} shadow-lg shadow-slate-900/5 p-3.5 flex items-start gap-3 ${
        clickable ? 'cursor-pointer hover:shadow-xl transition-shadow' : ''
      }`}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${v.iconWrap}`}>{v.icon}</div>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-[13px] font-bold text-slate-800 leading-tight">{toast.title}</p>
        {toast.body && <p className="text-[12px] text-slate-500 mt-0.5 leading-snug line-clamp-2">{toast.body}</p>}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          dismiss(toast.id);
        }}
        aria-label="Tutup"
        className="p-1 -m-1 text-slate-300 hover:text-slate-500 transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export const ToastProvider: React.FC = () => {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col items-end gap-2.5 pointer-events-none">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} />
        ))}
      </AnimatePresence>
    </div>
  );
};
