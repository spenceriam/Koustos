# Koustos MVP – Implementation Task List  
(Each task = one PR-able chunk, ≤ 2 dev-days.  Check boxes = deliverables that can be demoed.)

---

## 0. Repo & Infra Bootstrap
- [ ] 0.1 Create monorepo (`/frontend`, `/cloudflare-functions`, `/aws-lambda`, `/infra`, `/e2e`)  
- [ ] 0.2 Terraform workspace + remote state (S3 + DynamoDB lock)  
- [ ] 0.3 GitHub Actions workflows: `pr.yml` (lint/unit), `deploy-staging.yml`, `deploy-prod.yml`  
- [ ] 0.4 `README.md` with local quick-start, branch rules, emoji ban in commit messages  

---

## 1. Cloudflare Foundations
- [ ] 1.1 Pages project + env variables stub (`STAGE`, `AWS_APIGATEWAY_URL`, `JWT_PUBLIC_KEY`)  
- [ ] 1.2 Turnstile/ReCAPTCHA v3 site-key injected at build time  
- [ ] 1.3 CSP & HSTS headers via `_headers` file (no inline scripts except Tailwind)  
- [ ] 1.4 Durable Object class `RateLimiter` with `increment(slug): {count, reset}`  

---

## 2. AWS Foundations
- [ ] 2.1 KMS CMK `alias/koustos-pat` + yearly rotation enabled  
- [ ] 2.2 DynamoDB tables `projects` & `reports` (on-demand, GSIs, TTL)  
- [ ] 2.3 Parameter Store `/koustos/stage/resend_key` (SecureString)  
- [ ] 2.4 API Gateway REST API with `/setup`, `/report`, `/ai`, `/finalize` resources + IAM auth  
- [ ] 2.5 Lambda execution role `koustos-lambda-role` (least privilege policy attached)  

---

## 3. Setup Flow – Backend
- [ ] 3.1 Lambda `setup` (Node 20) – verify PAT scope via `GET /user` & `GET /repos/{owner}/{repo}`  
- [ ] 3.2 Envelope-encrypt PAT: `kms:GenerateDataKey` → encrypt → store `encryptedPAT` + `encryptedKey`  
- [ ] 3.3 Generate 8-char `slug` (base58, collision retry loop)  
- [ ] 3.4 Write `PROJECT#<slug>` item (condition `attribute_not_exists`)  
- [ ] 3.5 Return `201 {slug, url}` or `403` if PAT lacks `public_repo`  
- [ ] 3.6 Unit tests: PAT validator, encryption round-trip, slug uniqueness  

---

## 4. Setup Flow – Front-End
- [ ] 4.1 Page `/setup` – form fields: PAT (password), repo (`owner/repo`), email  
- [ ] 4.2 Client-side validation: repo regex, email regex, PAT format  
- [ ] 4.3 Call Cloudflare Function `/setup` (POST) – show spinner + disable button  
- [ ] 4.4 On success: display clickable `koustos.dev/f/{slug}` + copy button  
- [ ] 4.5 Track setup duration (`console.time`) – assert ≤ 30 s in Cypress  

---

## 5. Bug Report Form – Front-End
- [ ] 5.1 Dynamic route `/f/{slug}` – fetch form HTML pre-rendered by Function  
- [ ] 5.2 Form fields: name, email, description (textarea) + hidden Turnstile token  
- [ ] 5.3 Disable submit until Turnstile score ≥ 0.3  
- [ ] 5.4 POST to Cloudflare Function `/report/{slug}` – receive `{reportId, aiQuestion1}`  
- [ ] 5.5 Show conversational UI (chat bubble) with “Answer” input + send button  

---

## 6. AI Conversation – Backend
- [ ] 6.1 Lambda `ai-orchestrator` – DynamoDB `aiState` machine (`WAIT_DESC → … → READY`)  
- [ ] 6.2 System prompt: “Ask ≤2 concise clarifying questions, English only, no greetings”  
- [ ] 6.3 Stop after `Q2_SENT` – refuse further calls with `409 Conflict`  
- [ ] 6.4 Store `aiQ1`, `aiA1`, `aiQ2`, `aiA2`, `markdownBody` (generated from template)  
- [ ] 6.5 Unit test: prompt ≤ 300 tokens, state transitions, early stop  

---

## 7. Issue Preview & Edit – Front-End
- [ ] 7.1 After `READY` – render markdown preview (syntax highlighted)  
- [ ] 7.2 “Edit” toggle – switch to monaco-editor (lightweight) for inline edit  
- [ ] 7.3 Diff sent in `/finalize` body – backend rewrites `markdownBody`  
- [ ] 7.4 “Submit” button – disable while `POST /finalize` in flight  

---

## 8. GitHub Issue Creation – Backend
- [ ] 8.1 Lambda `github-proxy` – decrypt PAT (`kms:Decrypt`) → `Authorization: token`  
- [ ] 8.2 `POST /repos/{owner}/{repo}/issues` with `{title, body, labels: ["bug", "koustos"]}`  
- [ ] 8.3 Store `ghIssueNumber`, `ghIssueUrl` in `REPORT#<uuid>` item  
- [ ] 8.4 Return `201 {issueUrl}` or `429` if hourly counter ≥ 10  
- [ ] 8.5 Integration test: WireMock GitHub API, assert request headers & body  

---

## 9. Email Notifications – Backend
- [ ] 9.1 Lambda `mailer` – accept `{type: "maintainer" | "reporter", …}` via EventBridge  
- [ ] 9.2 Templates in `/aws-lambda/mailer/templates` (Handlebars, no emoji)  
  - Maintainer subject: `New bug: {title}` – contains reporter name, resolution criteria, issue link  
  - Reporter subject: `Bug report submitted` – contains resolution criteria, issue link  
- [ ] 9.3 Resend sandbox API key for staging, prod key via Parameter Store  
- [ ] 9.4 Unit test: snapshot HTML bodies, assert ≤ 1 MB, no emoji regex  

---

## 10. Rate Limiting – Edge & Core
- [ ] 10.1 Cloudflare Durable Object `RateLimiter` – persist counter & reset TTL = 1 h  
- [ ] 10.2 Function `/report/{slug}` – call `increment()` – reject if `count > 10` with `429`  
- [ ] 10.3 AWS WAF rule on API Gateway – 100 req/5 min per IP (default)  
- [ ] 10.4 E2E test: 11th report in same hour → “Too many reports. Try again later.”  

---

## 11. Security & Compliance
- [ ] 11.1 PAT never leaves Lambda runtime – audit `console.log` & network captures  
- [ ] 11.2 Content-Security-Policy blocks external scripts – `script-src 'self'`  
- [ ] 11.3 Encrypt env vars at rest (KMS) + rotate Resend key quarterly  
- [ ] 11.4 Pen-test scripts: OWASP ZAP baseline, no secrets in response bodies  

---

## 12. Testing & Quality Gates
- [ ] 12.1 Jest unit coverage ≥ 80% for `/aws-lambda`  
- [ ] 12.2 Cypress E2E – full reporter flow ≤ 2 min (CI timer assertion)  
- [ ] 12.3 k6 performance – 100 setups/min p90 ≤ 30 s  
- [ ] 12.4 Chaos test – kill Lambda AZ, still pass E2E within 3 retries  
- [ ] 12.5 No-emojis lint rule – fail build if `/[\u{1F600}-\u{1F9FF}]/u` found  

---

## 13. Observability & Alerts
- [ ] 13.1 CloudWatch EMF metrics: `SetupLatency`, `ReportLatency`, `CostPerReport`  
- [ ] 13.2 X-Ray tracing – annotate with `slug`, `reportId`  
- [ ] 13.3 Grafana dashboards (Terraform) – p50/p90/p99 latencies, rate-limit hits  
- [ ] 13.4 Slack alerts via AWS Chatbot – p90 setup > 30 s, 5xx > 1 %, cost > $0.001/report  

---

## 14. Docs & Handover
- [ ] 14.1 OpenAPI 3.1 spec published at `/docs` (Redoc)  
- [ ] 14.2 Runbook – decrypt & rotate PAT if leaked (KMS key rotation steps)  
- [ ] 14.3 Maintainer FAQ – how to revoke PAT, how to read metrics  
- [ ] 14.4 Beta invite email template – link to setup page + telemetry opt-in  

---

## 15. Final Acceptance Verification
- [ ] 15.1 Execute full manual regression: setup → 11th report blocked → emails received → no emoji  
- [ ] 15.2 Security sign-off – secrets scan pass, pen-test high issues = 0  
- [ ] 15.3 PM sign-off – all EARS stories demoed, metrics ≤ targets  
- [ ] 15.4 Tag `v1.0.0` and promote prod alias – enable auto-scaling  

---

**Definition of Done for each task:**  
- Code merged to `main` via PR with ≥ 1 approval, CI green, no emoji, no secrets.