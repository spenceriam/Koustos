"use client";
import { useEffect, useRef, useState } from "react";

interface GithubReposResponse {
  repos?: { id: number }[];
}

export default function SetupPage() {
  const [pat, setPat] = useState("");
  const [repo, setRepo] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isValidatingPat, setIsValidatingPat] = useState(false);
  const [patValidated, setPatValidated] = useState(false);
  const [repoCount, setRepoCount] = useState<number | null>(null);
  const [showPatModal, setShowPatModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const patModalInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (showPatModal) {
      patModalInputRef.current?.focus();
    }
  }, [showPatModal]);

  function handlePatChange(value: string) {
    setPat(value);
    setPatValidated(false);
    setRepoCount(null);
    setResult(null);
  }

  async function validatePat() {
    if (!pat.trim()) {
      setError("Enter your GitHub token before validating.");
      return;
    }

    setIsValidatingPat(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/github/repos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pat }),
      });

      if (response.status === 401) {
        setModalMessage(
          "We could not validate that token. Re-enter it and ensure it has the public_repo scope."
        );
        setShowPatModal(true);
        setPat("");
        setPatValidated(false);
        setRepoCount(null);
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to validate token. Please try again.");
      }

      const data = (await response.json()) as GithubReposResponse;
      const count = Array.isArray(data.repos) ? data.repos.length : 0;
      setRepoCount(count);
      setPatValidated(true);
      setShowPatModal(false);
    } catch (err: any) {
      setError(err?.message || "Unable to validate token. Please try again.");
      setPatValidated(false);
      setRepoCount(null);
    } finally {
      setIsValidatingPat(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!patValidated) {
      setError("Validate your GitHub token before generating a feedback URL.");
      return;
    }

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
    <>
      {showPatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div
            className="w-full max-w-sm rounded bg-white p-6 shadow"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pat-modal-title"
          >
            <h2 className="text-lg font-semibold" id="pat-modal-title">
              Re-enter your GitHub token
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {modalMessage ||
                "Paste your token again and make sure it has the correct scopes."}
            </p>
            <div className="mt-4 space-y-3">
              <input
                ref={patModalInputRef}
                value={pat}
                onChange={(e) => handlePatChange(e.target.value)}
                type="password"
                className="w-full rounded border px-3 py-2"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                aria-label="GitHub personal access token"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded border px-3 py-2"
                  onClick={() => setShowPatModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded bg-[var(--fg)] px-3 py-2 font-medium text-white"
                  onClick={validatePat}
                  disabled={isValidatingPat}
                >
                  {isValidatingPat ? "Validating..." : "Validate token"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-xl">
        <h1 className="mb-2 text-2xl font-semibold">Get Your Feedback URL</h1>
        <p className="mb-6 text-sm text-slate-600">
          Let anyone report bugs without a GitHub account
        </p>
        <form onSubmit={onSubmit} className="space-y-4" aria-busy={loading}>
          <div>
            <label className="mb-1 block text-sm font-medium">
              GitHub Personal Access Token
            </label>
            <p className="mb-2 text-xs text-slate-500">
              Need one? Follow the {""}
              <a
                className="text-blue-700 underline"
                href="https://github.com/settings/tokens/new"
                target="_blank"
                rel="noreferrer"
              >
                GitHub guide
              </a>{" "}
              to create a PAT with public_repo access.
            </p>
            <input
              value={pat}
              onChange={(e) => handlePatChange(e.target.value)}
              type="password"
              className="w-full rounded border px-3 py-2"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              required
            />
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={validatePat}
                disabled={isValidatingPat}
                className="rounded border px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isValidatingPat ? "Validating..." : "Validate token"}
              </button>
              {patValidated && (
                <span className="text-xs font-medium text-green-700">
                  Token validated
                  {repoCount !== null
                    ? ` (${repoCount} repo${repoCount === 1 ? "" : "s"})`
                    : ""}.
                </span>
              )}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Repository</label>
            <input
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              className="w-full rounded border px-3 py-2"
              placeholder="owner/repo"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Your Email (for notifications)
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full rounded border px-3 py-2"
              placeholder="dev@example.com"
              required
            />
          </div>
          <button
            disabled={loading}
            className="w-full rounded bg-[var(--fg)] py-2 text-white"
            aria-disabled={loading}
          >
            {loading ? "Generating..." : "Generate Feedback URL"}
          </button>
        </form>
        {error && (
          <p className="mt-3 text-sm text-red-600" role="alert" aria-live="assertive">
            {error}
          </p>
        )}
        {result && (
          <div className="mt-6 rounded border p-4">
            <div className="mb-2 text-sm text-slate-600">Your URL</div>
            <div className="rounded bg-slate-900 px-3 py-2 font-mono text-sm text-slate-200">
              {result}
            </div>
          </div>
        )}
      </div>
    </>
  );
}


