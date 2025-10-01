"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

function getInitials(name?: string, email?: string): string {
  const source = (name || email || "U").trim();
  if (!source) return "U";
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] || "";
    const last = parts[parts.length - 1]?.[0] || "";
    return (first + last || first || "U").toUpperCase().slice(0, 2);
  }
  const local = (email || "U").split("@")[0] || "U";
  return local.slice(0, 2).toUpperCase();
}

export default function HeaderActions() {
  const [initials, setInitials] = useState<string>("SF");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const session = await authClient.session.get();
        if (!mounted) return;
        const init = getInitials(session?.user?.name as string, session?.user?.email as string);
        setInitials(init);
      } catch {
        if (mounted) setInitials("SF");
      }
    }
    load();
    const unsub = authClient.session?.subscribe?.((session: any) => {
      const init = getInitials(session?.user?.name as string, session?.user?.email as string);
      setInitials(init);
    });
    return () => {
      if (typeof unsub === "function") {
        try { unsub(); } catch {}
      }
      mounted = false;
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Link href="/" className="rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white">
        Home
      </Link>
      <Link href="/setup" className="rounded bg-[var(--fg)] px-3 py-1.5 text-xs font-medium text-white">
        Get URL
      </Link>
      <details className="relative">
        <summary className="list-none cursor-pointer select-none">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-white">
            {initials}
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
    </div>
  );
}


