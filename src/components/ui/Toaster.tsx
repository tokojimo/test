import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { toast, ToastItem, useToastStore, ToastVariant } from './toast';
import '@/styles/toast.css';

interface ToasterProps {
  position?: {
    desktop: Position;
    mobile: Position;
  };
  max?: number;
}

type Position =
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center';

const POS: Record<Position, string> = {
  'top-right': 'top-4 right-4 items-end',
  'top-left': 'top-4 left-4 items-start',
  'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
  'bottom-right': 'bottom-4 right-4 items-end',
  'bottom-left': 'bottom-4 left-4 items-start',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
};

const variantRole: Record<ToastVariant, string> = {
  success: 'status',
  info: 'status',
  warning: 'status',
  error: 'alert',
};

function ToastView({ toast: t }: { toast: ToastItem }) {
  const { dismiss } = useToastStore.getState();
  const [open, setOpen] = useState(true);
  const reduced = useReducedMotion();
  const [shadow, setShadow] = useState('shadow-sm');
  const timer = useRef<NodeJS.Timeout>();
  const start = useRef<number>(Date.now());
  const remaining = useRef<number>(t.duration ?? 5000);
  const actionRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setShadow('shadow-md');
    const id = setTimeout(() => setShadow('shadow-sm'), 200);
    return () => clearTimeout(id);
  }, []);

  const clear = () => timer.current && clearTimeout(timer.current);
  const startTimer = () => {
    start.current = Date.now();
    timer.current = setTimeout(() => setOpen(false), remaining.current);
  };
  useEffect(startTimer, []);

  useEffect(() => {
    if (!open) dismiss(t.id);
  }, [open, t.id, dismiss]);

  const pause = () => {
    clear();
    remaining.current -= Date.now() - start.current;
  };
  const resume = () => {
    if (remaining.current > 0) startTimer();
  };

  useEffect(() => {
    if (t.action && actionRef.current) {
      actionRef.current.focus();
    }
  }, [t.action]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      setOpen(false);
    }
    if (e.key === 'Tab' && t.action) {
      const nodes = [actionRef.current, closeRef.current].filter(Boolean) as HTMLElement[];
      const index = nodes.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey) {
        if (index === 0) {
          e.preventDefault();
          nodes[nodes.length - 1].focus();
        }
      } else if (index === nodes.length - 1) {
        e.preventDefault();
        nodes[0].focus();
      }
    }
  };

  const classes = `pointer-events-auto w-full min-w-[280px] max-w-[400px] rounded-md px-4 py-3 ${shadow} toast-${
    t.variant ?? 'info'
  }`;

  return (
    <motion.div
      layout
      onMouseEnter={pause}
      onMouseLeave={resume}
      onKeyDown={handleKey}
      initial={reduced ? false : { opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.96, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
      transition={{
        opacity: { duration: 0.18, ease: [0.2, 0.7, 0.2, 1] },
        y: { duration: 0.18, ease: [0.2, 0.7, 0.2, 1] },
        scale: { duration: 0.18, ease: [0.2, 0.7, 0.2, 1] },
        height: { duration: 0.28, ease: [0.2, 0.7, 0.2, 1] },
      }}
      role={variantRole[t.variant ?? 'info'] as any}
      aria-live={t.variant === 'error' ? 'assertive' : 'polite'}
      data-reduced={reduced}
      className={classes}
    >
      {t.title && <div className="font-medium mb-1">{t.title}</div>}
      {t.message && <div className="text-sm">{t.message}</div>}
      {(t.action || true) && (
        <div className="mt-2 flex gap-2">
          {t.action && (
            <button
              ref={actionRef}
              onClick={() => {
                t.action?.onClick();
                setOpen(false);
              }}
              className="h-11 px-3 rounded-md bg-paper text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {t.action.label}
            </button>
          )}
          <button
            ref={closeRef}
            onClick={() => setOpen(false)}
            aria-label="Fermer"
            className="h-11 w-11 rounded-md flex items-center justify-center bg-transparent text-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </motion.div>
  );
}

export function Toaster({
  position = { desktop: 'top-right', mobile: 'bottom-center' },
  max = 3,
}: ToasterProps) {
  const { toasts, setMax } = useToastStore();
  useEffect(() => setMax(max), [max, setMax]);

  const posClass = `${POS[position.mobile]} md:${POS[position.desktop]}`;

  return createPortal(
    <div className={`fixed z-50 flex flex-col-reverse gap-2 pointer-events-none ${posClass}`} role="region">
      <AnimatePresence initial={false}>
        {toasts.map(t => (
          <ToastView key={t.id} toast={t} />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}

export { toast };
