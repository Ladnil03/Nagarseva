import React, { useEffect } from 'react';
import { X, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'warning' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = 'success', onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgClasses = {
    success: 'bg-[#1F3A5F] border-emerald-500/30 text-white',
    warning: 'bg-amber-900/90 border-amber-500/30 text-white',
    info: 'bg-slate-900/95 border-slate-700 text-white',
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 max-w-sm w-full p-4 border rounded-lg shadow-xl flex items-center justify-between gap-3 animate-slide-in ${bgClasses[type]}`}>
      <div className="flex items-center gap-2">
        {type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#FFE66D]" />}
        {type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
        {type === 'info' && <Sparkles className="w-5 h-5 text-sky-400" />}
        <span className="text-xs font-medium font-sans">{message}</span>
      </div>
      <button onClick={onClose} className="text-white/70 hover:text-white shrink-0">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
