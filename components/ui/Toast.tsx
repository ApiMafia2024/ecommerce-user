'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Alert, AlertVariant } from './Alert';
import { useTranslations } from 'next-intl';

// ============================================
// Types
// ============================================

export interface Toast {
  id: string;
  message: string;
  variant: AlertVariant;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, variant?: AlertVariant, duration?: number) => void;
  removeToast: (id: string) => void;
}

// ============================================
// Context
// ============================================

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// ============================================
// Provider Component
// ============================================

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((
    message: string,
    variant: AlertVariant = 'info',
    duration: number = 5000
  ) => {
    const id = Math.random().toString(36).substring(7);
    const newToast: Toast = { id, message, variant, duration };
    
    setToasts((prev) => [...prev, newToast]);

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

// ============================================
// Hook
// ============================================

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

// ============================================
// Toast Container Component
// ============================================

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  const t = useTranslations('Toast');
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none"
      role="region"
      aria-live="polite"
      aria-label={t('notifications')}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto animate-slide-in-right"
        >
          <Alert
            variant={toast.variant}
            message={toast.message}
            onClose={() => onRemove(toast.id)}
            autoDismiss={false}
            className="shadow-2xl"
          />
        </div>
      ))}
    </div>
  );
}

export default ToastProvider;
