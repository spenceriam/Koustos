"use client";
import { useState } from "react";

export default function SetupPage() {
  const [pat, setPat] = useState("");
  const [repo, setRepo] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pat, repo, email }),
      });
      if (!res.ok) throw new Error(await res.text());
      const json = (await res.json()) as { url: string };
      setResult(json.url);
    } catch (err: any) {
      setError(err.message || "Failed to setup project");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2">Get Your Feedback URL</h1>
      <p className="text-slate-600 mb-6 text-sm">Let anyone report bugs without a GitHub account</p>
      <form onSubmit={onSubmit} className="space-y-4" aria-busy={loading}>
        <div>
          <label className="block text-sm font-medium mb-1">GitHub Personal Access Token</label>
          <input value={pat} onChange={(e) => setPat(e.target.value)} type="password" className="w-full border rounded px-3 py-2" placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Repository</label>
          <input value={repo} onChange={(e) => setRepo(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="owner/repo" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Your Email (for notifications)</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full border rounded px-3 py-2" placeholder="dev@example.com" required />
        </div>
        <button disabled={loading} className="w-full bg-[var(--fg)] text-white py-2 rounded" aria-disabled={loading}>{loading ? "Generating..." : "Generate Feedback URL"}</button>
      </form>
      {error && <p className="text-red-600 text-sm mt-3" role="alert" aria-live="assertive">{error}</p>}
      {result && (
        <div className="mt-6 border rounded p-4">
          <div className="text-sm text-slate-600 mb-2">Your URL</div>
          <div className="font-mono text-sm bg-slate-900 text-slate-200 px-3 py-2 rounded">{result}</div>
        </div>
      )}
    </div>
  );
}


