"use client";
import { useState } from "react";

export default function ReportPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [desc, setDesc] = useState("");
  const [q, setQ] = useState<string | null>(null);
  const [a1, setA1] = useState("");
  const [a2, setA2] = useState("");
  const [draft, setDraft] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onStart() {
    setLoading(true);
    setError(null);
    try {
      // Placeholder for Convex call
      setQ("What device and browser are you using, and what steps lead to the issue?");
    } catch (e: any) {
      setError(e.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function onAnswer1() {
    setQ("What would need to be fixed for you to consider this bug resolved?");
  }

  async function onAnswer2() {
    setDraft(`## Description\n${desc}\n\n## Environment\n${a1}\n\n## Resolution Criteria\n${a2}`);
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="border rounded p-4">
        <h2 className="font-semibold mb-2">Report a Bug</h2>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" className="border rounded px-3 py-2" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your Email" className="border rounded px-3 py-2" />
        </div>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full border rounded px-3 py-2 min-h-[120px]" placeholder="Describe the bug" />
        <div className="mt-3">
          <button onClick={onStart} disabled={loading} className="bg-[var(--fg)] text-white px-3 py-2 rounded" aria-disabled={loading} aria-busy={loading}>
            {loading ? "Loading" : "Start"}
          </button>
        </div>
        {q && (
          <div className="mt-4 space-y-3">
            <div className="text-sm text-slate-600">AI asks:</div>
            <div className="border rounded p-3 bg-slate-50">{q}</div>
            {!a1 && (
              <div className="space-y-2">
                <textarea value={a1} onChange={(e) => setA1(e.target.value)} className="w-full border rounded px-3 py-2 min-h-[80px]" placeholder="Your answer" aria-label="Answer 1" />
                <button onClick={onAnswer1} className="bg-[var(--fg)] text-white px-3 py-2 rounded">Send</button>
              </div>
            )}
            {a1 && !a2 && (
              <div className="space-y-2">
                <textarea value={a2} onChange={(e) => setA2(e.target.value)} className="w-full border rounded px-3 py-2 min-h-[80px]" placeholder="Your answer" aria-label="Answer 2" />
                <button onClick={onAnswer2} className="bg-[var(--fg)] text-white px-3 py-2 rounded">Finish</button>
              </div>
            )}
          </div>
        )}
        {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
      </div>
      <div className="border rounded p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">Issue Preview</h2>
          <button className="text-sm border px-2 py-1 rounded" onClick={() => setEditMode((v) => !v)}>
            {editMode ? "Preview Mode" : "Edit Mode"}
          </button>
        </div>
        {!editMode && (
          <pre className="whitespace-pre-wrap text-sm bg-slate-50 p-3 rounded min-h-[200px]" aria-live="polite">{draft || ""}</pre>
        )}
        {editMode && (
          <textarea className="w-full min-h-[300px] font-mono text-sm border rounded p-3" value={draft || ""} onChange={(e) => setDraft(e.target.value)} aria-label="Issue Body Markdown" />
        )}
        <div className="mt-3 flex gap-2">
          <button className="bg-green-700 text-white px-3 py-2 rounded">Create Issue on GitHub</button>
          <button className="border px-3 py-2 rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
}


