"use client";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastMsg = { id: number; text: string };

const ToastCtx = createContext<{ notify: (text: string) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastMsg[]>([]);
  const notify = useCallback((text: string) => {
    const id = Date.now();
    setItems((arr) => [...arr, { id, text }]);
    setTimeout(() => setItems((arr) => arr.filter((i) => i.id !== id)), 2000);
  }, []);
  const value = useMemo(() => ({ notify }), [notify]);
  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2">
        {items.map((t) => (
          <div key={t.id} className="bg-slate-900 text-white px-3 py-2 rounded shadow">{t.text}</div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("ToastProvider missing");
  return ctx;
}


