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
            <div className="flex items-center">
              <img src="/assets/@logo_white.png" alt="Koustos" className="h-8 w-auto" />
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
        <footer className="border-t border-slate-300 bg-slate-900">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-2 px-4 py-4 text-center text-slate-300 text-xs">
            <span>
              <span aria-hidden="true">©</span> 2025 {" "}
              <a href="https://lionmystic.com" className="underline" target="_blank" rel="noreferrer">
                Lion Mystic
              </a>
            </span>
            <span aria-hidden="true" className="text-slate-500">
              •
            </span>
            <span>Built by Spencer Francisco</span>
            <span aria-hidden="true" className="text-slate-500">
              •
            </span>
            <a
              href="https://x.com/spencer_i_am"
              className="underline"
              target="_blank"
              rel="noreferrer"
            >
              Contact
            </a>
            <span aria-hidden="true" className="text-slate-500">
              •
            </span>
            <span>In the desire to solve my own needs</span>
          </div>
        </footer>
        </ToastProvider>
      </body>
    </html>
  );
}


