"use client";
import { useState } from "react";

export function ReportForm({ onStart }: { onStart: (name: string, email: string, desc: string) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [desc, setDesc] = useState("");
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <input aria-label="Your Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" className="border rounded px-3 py-2" />
        <input aria-label="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your Email" className="border rounded px-3 py-2" />
      </div>
      <textarea aria-label="Describe the bug" value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full border rounded px-3 py-2 min-h-[120px]" placeholder="Describe the bug" />
      <div className="mt-3">
        <button onClick={() => onStart(name, email, desc)} className="bg-[var(--fg)] text-white px-3 py-2 rounded">Start</button>
      </div>
    </div>
  );
}


