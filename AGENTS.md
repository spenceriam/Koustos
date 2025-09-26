# AGENTS.md

This file is for AI agents and automation to work effectively in the Koustos repo. Keep `README.md` human-focused; put agent-facing instructions, commands, guardrails, and examples here.

## Project Overview
Koustos lets non-GitHub users submit structured bug reports via a shareable URL. It formats reports with AI and creates GitHub issues, emailing both maintainer and reporter.

## Key Technical Decisions (MVP)
- Database: Convex (stores `projects` and `reports`; encrypted PAT at rest)
- Hosting: Vercel (Next.js 14)
- AI: OpenAI via official SDK; user-provided `OPENAI_API_KEY`
- Notifications: Resend (transactional email)
- GitHub Integration: REST API v3 for issue creation
- Rate limiting: 10 reports/hour per project (server-side in Convex)
- Absolute rule: NO EMOJIS anywhere (UI, emails, issue title/body, commits)

## Repository Map
Current:
- `docs/requirements.md` – Product requirements (EARS)
- `docs/design.md` – Technical design aligned to Vercel + Convex
- `docs/diagram-*.mermaid` – Architecture & flows
- `docs/koustos-spec.md` – MVP spec targeting Next.js + Convex + OpenAI
- `docs/koustos-wireframes.html` – Baseline UI/UX wireframes

Planned (create as implementation progresses):
- `/app` – Next.js App Router pages
- `/convex` – Convex schema and functions
- `/components` – Shared React components
- `/tests` – Jest unit tests; `/e2e` for Cypress

## Environment Variables
Define these in Vercel and Convex. Never commit secrets.

```bash
CONVEX_DEPLOYMENT=
OPENAI_API_KEY=
RESEND_API_KEY=
ENCRYPTION_KEY= # 32-byte hex key for AES-256
NEXT_PUBLIC_URL=https://koustos.dev
```

## Setup & Dev Commands
Prefer npm for consistency with docs.

```bash
# Install deps
npm install

# Run Convex locally (only if explicitly requested)
# npx convex dev

# Start Next.js dev server (only if explicitly requested)
# npm run dev

# Build / lint / test (ensure scripts exist in package.json)
# (Run only when explicitly requested)
# npm run build
# npm run lint
# npm test
```

Quick-start (from docs/spec; use when bootstrapping code):

```bash
npm create convex@latest koustos
npm install openai resend
npm install @types/node --save-dev
npx convex env set OPENAI_API_KEY <key>
npx convex env set RESEND_API_KEY <key>
npx convex env set ENCRYPTION_KEY <generate-32-byte-hex>
npm run dev
```

## Coding Standards
- Language: TypeScript (strict)
- Framework: Next.js 14 App Router; no client-side secrets
- Styling: TailwindCSS; mobile-first; no emoji fonts
- Accessibility: WCAG 2.1 AA targets for forms and interactive elements
- Naming: Descriptive, full words; avoid abbreviations; functions are verbs
- Control flow: Early returns, error-first handling, shallow nesting
- Comments: Brief, explain “why”, not “how”; avoid inline comments
- Formatting: Match existing style; avoid unrelated reformatting

## Security & Privacy
- PAT never leaves server runtime; encrypted with AES-256 inside Convex functions
- Do not log secrets or raw PATs; scrub sensitive values in logs
- Rate limit strictly in Convex: max 10 reports per hour per project slug
- Validate all external API responses (GitHub, OpenAI, Resend)
- Restrict PII to what’s necessary (reporter name, email)

## Tools & Integrations
- OpenAI SDK: model `gpt-5-nano-2025-08-07` preferred for cost; keep tokens low
- GitHub REST v3: `POST /repos/{owner}/{repo}/issues` for issue creation
- Resend: two emails (maintainer, reporter); professional tone, no emojis
- Convex: schema for `projects` and `reports`; server-side encryption/decryption

## Product Guardrails (from requirements)
- Setup ≤ 30 s to generate `koustos.dev/f/{slug}`
- End-to-end report → issue ≤ 2 min
- Cost target per report ≤ $0.001 (OpenAI+Resend typical inputs)
- Public GitHub repos; English-only; no dashboard in MVP

## Development Lifecycle Rules
1. CI/CD: Do not create, modify, or run any CI/CD pipelines. Do not add GitHub Actions or similar automation during development.
2. Task cadence: After completing each task, mark it done and immediately create a single, atomic git commit for just those changes.
3. Servers: Do not start any dev servers (Next.js, Convex) unless the user explicitly asks.
4. Tests: Do not scaffold, prepare, or run tests unless the user explicitly asks. The user will request tests when ready.
5. Deploys: No automated deploys. Perform manual or scripted deploy steps only if explicitly requested by the user.
6. Scope: Prefer small, isolated edits per task; avoid drive-by refactors.

Recommended commit commands (local only unless asked to push):
```bash
git add -A
git commit -m "[koustos] <short action>"
# Do not push unless requested
```

## Agent Operating Guidance
1. Align with `docs/koustos-wireframes.html` for baseline UI/UX.
2. Use Convex as the single source of truth for data and server logic.
3. Keep all secrets in env; never commit tokens; update docs when adding env vars.
4. When architecture changes, update `docs/design.md` and `docs/diagram-*.mermaid`.
5. Enforce the “two follow-up questions then stop” AI flow server-side.
6. Apply the no-emoji rule across UI, AI outputs, emails, and commit messages.

## Example Snippets
OpenAI completion (keep concise prompt, token limits):

```ts
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function formatReport(userInput: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-5-nano-2025-08-07",
    messages: [
      {
        role: "system",
        content:
          "Bug report assistant. NO EMOJIS. Ask exactly 2 concise questions then stop. English only.",
      },
      { role: "user", content: userInput },
    ],
    max_tokens: 250,
    temperature: 0.3,
  });
  return completion;
}
```

GitHub issue creation (server-side only; PAT decrypted in memory):

```ts
async function createIssue({ owner, repo, pat, title, body }: {
  owner: string; repo: string; pat: string; title: string; body: string;
}) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
    method: "POST",
    headers: {
      Authorization: `token ${pat}`,
      Accept: "application/vnd.github.v3+json",
    },
    body: JSON.stringify({ title, body, labels: ["bug", "via-koustos"] }),
  });
  if (!res.ok) throw new Error(`GitHub issue failed: ${res.status}`);
  return res.json();
}
```

## Testing Policy
- Testing is deferred until the user explicitly requests it.
- When requested, prefer Jest for Convex functions and Cypress for E2E; keep coverage pragmatic.
- Do not set up or invoke CI for tests unless requested.

## PR & Commit Guidelines
- Title: `[koustos] <short action>`
- Do not include emojis
- One atomic commit per completed task; avoid bundling unrelated changes
- Do not push or open PRs unless requested by the user
- Update `docs/*` and diagrams when architectures or flows change

## Assets
- Logo (white): `assets/@logo_white.png`.
- Logo (original transparent): `assets/logo_transparent.png`.
- Patterned wallpaper: `assets/tile_pattern.png`.

## Known Pitfalls
- Never expose PAT to the client, even transiently
- Keep AI prompts deterministic and under token budget
- Remember to enforce the two-question stop condition

## Open Questions (for humans)
- Do we need CAPTCHA in MVP, or post-MVP only?
- Should we support GitHub issue templates later?

---

This AGENTS.md follows the structure and intent of the agents.md standard: centralize context, commands, guardrails, and examples so AI agents can operate safely and efficiently.


