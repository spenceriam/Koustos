import Link from "next/link";

export default function HomePage() {
  return (
    <main className="py-10">
      <section className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight">GitHub issues from shareable links</h1>
        <p className="mt-3 text-slate-600">
          Let anyone report bugs without a GitHub account. Koustos formats reports with AI and
          creates GitHub issues, then emails the maintainer and reporter.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/setup"
            className="rounded bg-[var(--fg)] px-4 py-2 font-medium text-white"
          >
            Generate Feedback URL
          </Link>
          <a
            href="https://dashboard.convex.dev"
            className="rounded border px-4 py-2 font-medium text-slate-700"
            target="_blank"
            rel="noreferrer"
          >
            Convex Dashboard
          </a>
        </div>
      </section>

      <section className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-3">
        <Feature title="Two follow-up questions">
          Deterministic AI flow collects environment and resolution criteria, then stops.
        </Feature>
        <Feature title="Secure by design">
          GitHub PATs are AES-256 encrypted in Convex; secrets never leave server runtime.
        </Feature>
        <Feature title="Fast setup">
          Create a shareable URL in under 30 seconds and accept up to 10 reports per hour.
        </Feature>
      </section>
    </main>
  );
}

function Feature({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded border p-4 bg-white">
      <div className="text-sm font-semibold mb-1">{title}</div>
      <p className="text-sm text-slate-600">{children}</p>
    </div>
  );
}


