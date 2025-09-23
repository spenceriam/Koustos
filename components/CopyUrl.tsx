"use client";
import { useState } from "react";

export function CopyUrl({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  async function onCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }
  return (
    <div className="flex items-center gap-2">
      <code className="font-mono bg-slate-900 text-slate-200 px-3 py-2 rounded text-sm">{url}</code>
      <button aria-live="polite" onClick={onCopy} className="px-2 py-1 text-sm rounded bg-[var(--fg)] text-white">
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}


