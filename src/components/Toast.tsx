"use client";
import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, X, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastCtx {
  toast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastCtx>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const icons: Record<ToastType, typeof CheckCircle2> = {
  success: CheckCircle2, error: AlertCircle, info: Info,
};
const colors: Record<ToastType, string> = {
  success: "#22C55E", error: "#EF4444", info: "#3B82F6",
};
const bgColors: Record<ToastType, string> = {
  success: "rgba(34,197,94,0.1)", error: "rgba(239,68,68,0.1)", info: "rgba(59,130,246,0.1)",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [counter, setCounter] = useState(0);

  const toast = useCallback((type: ToastType, message: string) => {
    const id = counter;
    setCounter(c => c + 1);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, [counter]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => {
          const Icon = icons[t.type];
          return (
            <div
              key={t.id}
              className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border animate-slide-in-right"
              style={{ background: "#16161D", borderColor: `${colors[t.type]}30`, minWidth: 280 }}
            >
              <div className="p-1 rounded-lg" style={{ background: bgColors[t.type] }}>
                <Icon size={16} style={{ color: colors[t.type] }} />
              </div>
              <span className="text-sm text-[#FAFAFA] flex-1">{t.message}</span>
              <button
                onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
                className="text-[#71717A] hover:text-[#FAFAFA]"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
