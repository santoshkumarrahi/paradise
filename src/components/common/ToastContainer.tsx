import React from 'react';
import { useHostel } from '../../context/HostelContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useHostel();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl border shadow-xl flex items-start justify-between gap-3 text-xs animate-in slide-in-from-bottom-3 duration-200 ${
              isSuccess
                ? 'bg-slate-900 border-emerald-500 text-white'
                : isError
                ? 'bg-red-950 border-red-500 text-white'
                : isWarning
                ? 'bg-amber-950 border-amber-500 text-white'
                : 'bg-slate-900 border-slate-700 text-white'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
              {isError && <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />}
              <div>
                <p className="font-bold text-sm leading-tight">{toast.title}</p>
                <p className="text-slate-300 mt-1 leading-relaxed text-[11px]">{toast.message}</p>
                <span className="text-[10px] text-slate-400 mt-1 block">{toast.timestamp}</span>
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
