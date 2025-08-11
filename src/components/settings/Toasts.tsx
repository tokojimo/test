import React, { createContext, useContext, useState, ReactNode } from 'react';

type Toast = { id: number; message: string };

type ToastContextValue = {
  toasts: Toast[];
  add: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const add = (message: string) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2000);
  };
  return (
    <ToastContext.Provider value={{ toasts, add }}>
      {children}
      <div aria-live="polite" className="fixed bottom-2 right-2 space-y-2">
        {toasts.map((t) => (
          <div key={t.id} className="bg-black text-white px-3 py-2 rounded">
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToasts = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToasts must be used within ToastProvider');
  return ctx;
};
