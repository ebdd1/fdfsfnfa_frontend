import { create } from 'zustand';

export type ToastVariant = 'success' | 'info' | 'error';

export interface Toast {
  id: string;
  variant: ToastVariant;
  title: string;
  body?: string;
  /** Optional click handler (e.g. deep-link to the related order/chat). */
  onClick?: () => void;
}

interface ToastState {
  toasts: Toast[];
  push: (toast: Omit<Toast, 'id'>) => void;
  dismiss: (id: string) => void;
}

let counter = 0;
const nextId = () => `t${Date.now()}_${counter++}`;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (toast) =>
    set((state) => ({ toasts: [...state.toasts, { ...toast, id: nextId() }] })),
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
