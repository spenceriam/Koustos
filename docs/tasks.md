# Koustos MVP – Implementation Task List (Next.js + Convex)

This replaces prior Cloudflare/AWS items. Scope is aligned to AGENTS.md: Next.js 14 on Vercel, Convex for DB/functions, OpenAI + Resend integrations, no CI/CD, no AWS.

## 0. Repo & App Bootstrap
- [x] Next.js 14 App Router + TypeScript + ESLint/Prettier
- [x] TailwindCSS + PostCSS
- [x] `.env.example` and README quick start

## 1. Convex Foundations
- [x] Schema: `projects`, `reports`
- [x] Encryption (AES-256-GCM) utils
- [x] Rate limit helper (10/hour per slug)

## 2. Setup Flow
- [x] Mutation: `projects.createProject` (validate PAT/repo, encrypt PAT, generate slug)
- [x] Page `/setup` with form, validation, success state + copy URL

## 3. Reporter Flow & AI Conversation
- [x] Mutation: `report.start` (validate inputs, enforce rate limit)
- [x] Mutation: `ai.respond` (two follow-up questions, generate formatted markdown)
- [x] Page `/f/[slug]` with chat UI, preview, edit mode

## 4. Finalization
- [x] Mutation: `finalize.submit` (decrypt PAT, create GitHub issue)

## 5. Guardrails & UX
- [x] No-emoji sanitization for issue title/body
- [x] Token caps for OpenAI (≤ 250)
- [x] A11y pass (labels, aria states, role=alert)
- [x] Logging with secret scrubbing
- [x] Input length limits and friendly 429 message

## 6. Docs & Acceptance
- [x] Design doc aligned to Vercel + Convex
- [x] Acceptance checklist updated (requirements)
- [ ] Diagrams validated (Convex/Vercel) – update if architecture changes

Notes:
- No CI/CD or AWS infra in MVP. Manual deploys only when requested.
- Public GitHub repos; English-only; no dashboard in MVP.