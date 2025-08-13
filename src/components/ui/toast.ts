import { create } from 'zustand';

export type ToastVariant = 'success' | 'info' | 'warning' | 'error';
export interface ToastAction {
  label: string;
  onClick: () => void;
}
export interface ToastItem {
  id: string;
  title?: string;
  message?: string;
  variant?: ToastVariant;
  action?: ToastAction;
  duration?: number;
}
interface ToastStore {
  toasts: ToastItem[];
  max: number;
  show: (toast: Omit<ToastItem, 'id'>) => string;
  dismiss: (id?: string) => void;
  update: (id: string, patch: Partial<Omit<ToastItem, 'id'>>) => void;
  setMax: (max: number) => void;
}

let idCount = 0;
const nextId = () => `${Date.now()}-${++idCount}`;

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  max: 3,
  show: toast => {
    const id = nextId();
    const max = get().max;
    set(state => ({ toasts: [{ id, ...toast }, ...state.toasts].slice(0, max) }));
    return id;
  },
  dismiss: id => {
    if (id) set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }));
    else set({ toasts: [] });
  },
  update: (id, patch) => {
    set(state => ({
      toasts: state.toasts.map(t => (t.id === id ? { ...t, ...patch } : t)),
    }));
  },
  setMax: max => set({ max }),
}));

export const toast = {
  show: (opts: Omit<ToastItem, 'id'>) => useToastStore.getState().show(opts),
  dismiss: (id?: string) => useToastStore.getState().dismiss(id),
  update: (id: string, patch: Partial<Omit<ToastItem, 'id'>>) =>
    useToastStore.getState().update(id, patch),
};

export const useToast = () => useToastStore;
