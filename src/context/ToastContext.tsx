// contexts/ToastContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast } from '@/components/ui/Toast';

interface ToastProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface ToastItem {
  id: string;
  product: ToastProduct;
}

interface ToastContextType {
  showToast: (product: ToastProduct) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((product: ToastProduct) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, product }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-3">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            product={toast.product}
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}