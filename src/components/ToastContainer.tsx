import React from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { Toast, ToastType } from '../types';

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
  error: <XCircle className="w-5 h-5 text-red-400" />,
  info: <Info className="w-5 h-5 text-brand-400" />,
};

const colors: Record<ToastType, string> = {
  success: 'border-emerald-500/30 bg-emerald-950/80',
  error: 'border-red-500/30 bg-red-950/80',
  info: 'border-brand-500/30 bg-brand-950/80',
};

function ToastItem({ toast, onRemove }: ToastItemProps) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl
        text-white text-sm font-medium animate-slide-in ${colors[toast.type]}`}
    >
      {icons[toast.type]}
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}
