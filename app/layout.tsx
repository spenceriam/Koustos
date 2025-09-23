import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";

export const metadata: Metadata = {
  title: "Koustos",
  description: "Shareable bug report URLs that create GitHub issues.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
        <header className="border-b border-slate-300 bg-slate-900">
          <div className="mx-auto max-w-5xl px-4 py-3">
            <div className="text-slate-300 font-semibold text-sm">Koustos</div>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
        <footer className="border-t border-slate-300 bg-slate-900">
          <div className="mx-auto max-w-5xl px-4 py-4 text-slate-400 text-xs">
            © 2025 Koustos
          </div>
        </footer>
        </ToastProvider>
      </body>
    </html>
  );
}


