// CMP-015
'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { CheckCircle, Info, X, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastVariant = 'success' | 'error' | 'info';

type ToastItem = {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
};

type ToastContextType = {
  showToast: (opts: Omit<ToastItem, 'id'>) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

const DEFAULT_DURATION: Record<ToastVariant, number> = {
  success: 4000,
  error: 6000,
  info: 4000,
};

const variantStyles: Record<
  ToastVariant,
  { container: string; icon: string; Icon: typeof CheckCircle }
> = {
  success: {
    container: 'bg-success-light border-success/30',
    icon: 'text-success',
    Icon: CheckCircle,
  },
  error: {
    container: 'bg-danger-light border-danger/30',
    icon: 'text-danger',
    Icon: XCircle,
  },
  info: {
    container: 'bg-info-light border-info/30',
    icon: 'text-info',
    Icon: Info,
  },
};

function ToastEntry({
  toast,
  onRemove,
}: {
  toast: ToastItem;
  onRemove: (id: string) => void;
}) {
  const [visible, setVisible] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const duration = toast.duration ?? DEFAULT_DURATION[toast.variant];
  const style = variantStyles[toast.variant];
  const Icon = style.Icon;

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(toast.id), 200);
    }, duration);
    return () => clearTimeout(timeoutRef.current);
  }, [toast.id, duration, onRemove]);

  function handleClose() {
    clearTimeout(timeoutRef.current);
    setVisible(false);
    setTimeout(() => onRemove(toast.id), 200);
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'flex min-w-[280px] max-w-sm items-start gap-3 rounded-[10px] border p-4 shadow-md',
        'transition-all duration-300 ease-out',
        style.container,
        visible
          ? 'translate-x-0 opacity-100'
          : 'translate-x-4 opacity-0 duration-200 ease-in',
      )}
    >
      <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', style.icon)} aria-hidden="true" />
      <p className="flex-1 text-sm text-gray-900">{toast.message}</p>
      <button
        onClick={handleClose}
        aria-label="Schließen"
        className="shrink-0 text-gray-500 transition-colors hover:text-gray-800"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((opts: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => {
      const next = [{ ...opts, id }, ...prev];
      return next.slice(0, 3);
    });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-label="Benachrichtigungen"
        className="fixed right-4 top-4 z-50 flex flex-col gap-2"
      >
        {toasts.map((toast) => (
          <ToastEntry key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast muss innerhalb von ToastProvider genutzt werden.');
  return ctx;
}

export type { ToastItem, ToastVariant };
