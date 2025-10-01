import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Suspense } from "react";
import "./globals.css";
import logoWhite from "@/assets/@logo_white.png";
import { ToastProvider } from "@/components/Toast";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Koustos",
  description: "Shareable bug report URLs that create GitHub issues.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f7f5f2] flex flex-col">
        <AuthProvider>
          <ToastProvider>
            <header className="border-b border-slate-300 bg-slate-900">
              <div className="mx-auto max-w-5xl px-4 py-3">
                <div className="flex items-center justify-between">
                  <Image
                    src={logoWhite}
                    alt="Koustos"
                    width={230}
                    height={58}
                    className="h-[3.5rem] w-auto"
                    priority
                  />
                  <Suspense>
                    <HeaderActions />
                  </Suspense>
                </div>
              </div>
            </header>
            <main className="mx-auto max-w-5xl px-4 py-6 flex-1">{children}</main>
            <footer className="mt-auto border-t border-slate-300 bg-slate-900">
              <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-2 px-4 py-4 text-center text-slate-300 text-xs">
                <span>
                  <span aria-hidden="true">©</span> 2025{" "}
                  <a href="https://lionmystic.com" className="underline" target="_blank" rel="noreferrer">
                    Lion Mystic
                  </a>
                </span>
                <span aria-hidden="true" className="text-slate-500">
                  •
                </span>
                <span className="inline-flex items-center gap-1">
                  <span>Built by</span>
                  <a
                    href="https://x.com/spencer_i_am"
                    className="underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Spencer Francisco
                  </a>
                  <svg
                    aria-hidden="true"
                    className="h-3 w-3 fill-current text-slate-300"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3.5 3h5.6l5.2 6.9L20 3h1.5l-6.3 8.5L22.5 21H17l-5.6-7.5L6 21H4.5l6.4-8.7L3.5 3Z" />
                  </svg>
                </span>
                <span aria-hidden="true" className="text-slate-500">
                  •
                </span>
                <span>In the desire to solve my own needs</span>
              </div>
            </footer>
            <dialog id="feedback-modal" className="rounded border p-0">
              <div className="w-[min(90vw,460px)] p-4">
                <h3 className="text-lg font-semibold">Feedback</h3>
                <p className="mt-2 text-sm text-slate-700">
                  Questions? Reach out to Spencer Francisco via <a className="underline" href="https://x.com/spencer_i_am" target="_blank" rel="noreferrer">X.com</a> or email via <a className="underline" href="https://lionmystic.com" target="_blank" rel="noreferrer">lionmystic.com</a>.
                </p>
                <div className="mt-4 text-right">
                  <button
                    className="rounded border px-3 py-1.5 text-sm"
                    onClick={() => (document.getElementById("feedback-modal") as HTMLDialogElement)?.close?.()}
                  >
                    Close
                  </button>
                </div>
              </div>
            </dialog>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

function HeaderActions() {
  // We can’t use hooks in this file server-side for auth; render simple links for MVP
  return (
    <div className="flex items-center gap-2">
      <Link href="/" className="rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white">
        Home
      </Link>
      <Link href="/setup" className="rounded bg-[var(--fg)] px-3 py-1.5 text-xs font-medium text-white">
        Get URL
      </Link>
      <ProfileMenu />
    </div>
  );
}

function ProfileMenu() {
  // MVP: show initials circle with a simple dropdown on focus/hover using details/summary
  return (
    <details className="relative">
      <summary className="list-none cursor-pointer select-none">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-white">
          SF
        </span>
      </summary>
      <div className="absolute right-0 z-50 mt-2 w-48 rounded border bg-white p-1 text-sm shadow">
        <Link href="/setup" className="block rounded px-3 py-2 hover:bg-slate-50">Generate new URL</Link>
        <button
          type="button"
          className="block w-full rounded px-3 py-2 text-left hover:bg-slate-50"
          onClick={() => {
            const modal = document.getElementById("feedback-modal");
            if (modal) (modal as HTMLDialogElement).showModal?.();
          }}
        >
          Feedback
        </button>
        <button
          type="button"
          className="block w-full rounded px-3 py-2 text-left hover:bg-slate-50"
          onClick={() => authClient.signOut()}
        >
          Sign out
        </button>
      </div>
    </details>
  );
}
