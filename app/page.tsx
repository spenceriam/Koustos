import Link from "next/link";

export default function HomePage() {
  return (
    <main className="py-10">
      {/* Hero */}
      <section className="mx-auto max-w-5xl rounded-lg bg-white/60 p-8 backdrop-blur">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight">
              Turn shareable links into GitHub issues
            </h1>
            <p className="mt-4 text-slate-700">
              Let anyone report bugs without a GitHub account. Koustos asks two follow-up
              questions and formats a clean issue for you.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href="/setup" className="rounded bg-[var(--fg)] px-4 py-2 font-medium text-white">
                Get your feedback URL
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="rounded border bg-white p-4 shadow-sm">
              <div className="text-xs font-semibold text-slate-600">Preview</div>
              <pre className="mt-2 whitespace-pre-wrap text-xs text-slate-700">
{`## Description\nButtons are unclickable on mobile after scrolling.\n\n## Environment\niPhone 14, iOS 17, Safari\n\n## Steps to Reproduce\n1. Open page\n2. Scroll down\n3. Try to tap button\n\n## Expected Behavior\nButtons respond to tap.\n\n## Resolution Criteria\nButtons are tappable on iOS Safari after scrolling.`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto mt-12 max-w-5xl">
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-semibold">How it works</h2>
          <p className="mt-1 text-slate-700">Three simple steps from link to issue.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Feature title="1) Create a link">
            Connect your repo and get a shareable URL for reporters.
          </Feature>
          <Feature title="2) Guided questions">
            Reporters answer two concise follow-ups to clarify the problem.
          </Feature>
          <Feature title="3) GitHub issue">
            A clean, structured issue is created automatically.
          </Feature>
        </div>
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


