"use client";
import { useEffect, useMemo, useRef, useState } from "react";

interface GithubRepoSummary {
  id: number;
  fullName: string;
  private: boolean;
  owner: string;
  name: string;
}

interface GithubReposResponse {
  repos?: GithubRepoSummary[];
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
  const [repos, setRepos] = useState<GithubRepoSummary[]>([]);
  const [repoSearch, setRepoSearch] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

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
    setRepos([]);
    setRepoSearch("");
  }

  function validateEmailFormat(value: string) {
    const trimmed = value.trim();
    if (!trimmed) {
      return false;
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(trimmed);
  }

  function handleEmailChange(value: string) {
    setEmail(value);
    if (!value) {
      setEmailError(null);
      return;
    }
    setEmailError(validateEmailFormat(value) ? null : "Enter a valid email address like name@example.com.");
  }

  async function validatePat() {
    if (!pat.trim()) {
      setError("Enter your GitHub token before validating.");
      return;
    }

    setIsValidatingPat(true);
    setError(null);
    setResult(null);
    setRepos([]);
    setRepoSearch("");

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
      const list = Array.isArray(data.repos) ? data.repos : [];
      const count = list.length;
      setRepos(list);
      setRepoCount(count);
      setPatValidated(true);
      setShowPatModal(false);
    } catch (err: any) {
      setError(err?.message || "Unable to validate token. Please try again.");
      setPatValidated(false);
      setRepoCount(null);
      setRepos([]);
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

    if (!validateEmailFormat(email)) {
      setEmailError("Enter a valid email address like name@example.com.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setRepos([]);
    setRepoSearch("");

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

  const filteredRepos = useMemo(() => {
    if (!repoSearch.trim()) return repos;
    const query = repoSearch.trim().toLowerCase();
    return repos.filter((repo) => repo.fullName.toLowerCase().includes(query));
  }, [repoSearch, repos]);

  function handleRepoSelect(repoItem: GithubRepoSummary) {
    setRepo(`${repoItem.owner}/${repoItem.name}`);
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
            {patValidated && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-600" htmlFor="repo-search">
                    Search your repositories
                  </label>
                  {repoCount !== null && (
                    <span className="text-xs text-slate-500">{repoCount} available</span>
                  )}
                </div>
                <input
                  id="repo-search"
                  type="search"
                  value={repoSearch}
                  onChange={(e) => setRepoSearch(e.target.value)}
                  className="w-full rounded border px-3 py-2 text-sm"
                  placeholder="Filter by name"
                />
                <div className="max-h-52 overflow-y-auto rounded border bg-white">
                  {filteredRepos.length === 0 && (
                    <div className="px-3 py-4 text-sm text-slate-500">No repositories found.</div>
                  )}
                  {filteredRepos.map((repoItem) => (
                    <button
                      type="button"
                      key={repoItem.id}
                      onClick={() => handleRepoSelect(repoItem)}
                      className="flex w-full items-center justify-between border-b px-3 py-2 text-left text-sm hover:bg-slate-50 last:border-b-0"
                    >
                      <span className="font-medium text-slate-700">{repoItem.fullName}</span>
                      <span
                        className={`rounded px-2 py-1 text-xs font-semibold ${
                          repoItem.private ? "bg-slate-200 text-slate-700" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {repoItem.private ? "Private" : "Public"}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-500">
                  Selecting fills the repository field above. Archived repos are hidden automatically.
                </p>
              </div>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Your Email (for notifications)
            </label>
            <input
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              type="email"
              className="w-full rounded border px-3 py-2"
              placeholder="dev@example.com"
              aria-invalid={!!emailError}
              aria-describedby={emailError ? "email-error" : undefined}
              required
            />
            {emailError && (
              <p id="email-error" className="mt-1 text-xs text-red-600">
                {emailError}
              </p>
            )}
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


