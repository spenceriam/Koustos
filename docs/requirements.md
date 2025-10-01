# Koustos MVP – Requirements Document (EARS)

## 1. Purpose
Enable open-source maintainers to collect structured bug reports from non-GitHub users via a unique URL, automatically convert them into GitHub issues. Email notifications are out of scope for MVP.

## 2. User Stories
| # | As a … | I want to … | So that … |
|---|--------|-------------|-----------|
| 1 | Maintainer | create a project in <30 s | I can immediately share a bug-report URL |
| 2 | Maintainer | (removed) |  |
| 3 | Reporter | report a bug without a GitHub account | I can help improve the project |
| 4 | Reporter | (removed) |  |
| 5 | System | limit each project to 10 reports/hour | abuse is prevented |

## 3. Functional Requirements (EARS)

### 3.1 Setup Project
**WHEN** the maintainer submits a valid GitHub PAT and repo owner/name on `/setup`  
**IF** the PAT can read & create issues in the specified public repo  
**THEN** the system SHALL  
- encrypt the PAT with AES-256 server-side only  
- generate an 8-character random slug  
- store the project record  
- display the URL `koustos.dev/f/{slug}`  
- complete the operation in <5 s.

### 3.2 Unique URL
**WHERE** the URL `koustos.dev/f/{slug}` is accessed  
**WHILE** the project exists  
**THEN** the system SHALL render the bug-report form.

### 3.3 Bug Report Form
**WHEN** the reporter submits name and free-text description  
**IF** all fields are non-empty  
**THEN** the system SHALL initiate the AI conversation.

### 3.4 AI Conversation
**WHILE** the conversation is active  
**WHEN** the AI has asked exactly two follow-up questions  
**THEN** the system SHALL stop further AI messages and present the formatted issue preview.

### 3.5 Issue Preview & Edit
**WHEN** the preview is shown  
**IF** the reporter toggles “Edit”  
**THEN** the system SHALL allow inline editing of the formatted markdown.

### 3.6 Create GitHub Issue
**WHEN** the reporter clicks “Submit”  
**IF** the project has not exceeded 10 reports in the past hour  
**THEN** the system SHALL  
- decrypt the PAT server-side  
- create a GitHub issue with the structured markdown  
- store the issue number  
  
- complete the flow in <10 s.

### 3.7 Emails
Removed in MVP.

### 3.9 Rate Limiting
**WHILE** the number of reports for a project in the last hour ≥ 10  
**IF** another report is attempted  
**THEN** the system SHALL reject it with message “Too many reports. Try again later.”

## 4. Non-Functional Requirements
| ID | Requirement | Metric |
|----|-------------|--------|
| N1 | Setup latency | ≤ 30 s (90th percentile) |
| N2 | Report latency | ≤ 2 min end-to-end |
| N3 | Cost per report | ≤ $0.001 (OpenAI only) |
| N4 | Encryption | AES-256, keys never exposed to client |
| N5 | Rate limit | 10 reports/hour per project, enforced server-side |
| N6 | Language | English only |
| N7 | Repositories | Public GitHub repos only |

## 5. Acceptance Criteria Checklist
- [ ] Maintainer can complete setup in ≤ 30 s.  
- [ ] Unique URL is generated and reachable.  
- [ ] Reporter can complete the form and AI conversation in ≤ 2 min.  
- [ ] GitHub issue is created with correct markdown structure.  
- [ ] Both emails are sent within 10 s of issue creation.  
- [ ] PAT is never sent to the client.  
- [ ] Rate limit blocks the 11th report in an hour.  
- [ ] No emojis appear in any UI or email.  
- [ ] Accessibility: form inputs labeled, buttons announce state, errors use role="alert".

## 6. Platform Decisions
- Database: Convex (stores `projects` and `reports`, encrypted PAT at rest).  
- Hosting: Vercel (Next.js 14 app; server-side logic via Convex functions).  
- AI Provider: OpenAI API via the official SDK; maintainer supplies `OPENAI_API_KEY`.  
- Email: Resend (production key provided via environment variable).  
- Secrets & Encryption: PAT encrypted server-side (AES-256) in Convex functions; keys managed via environment variables (Vercel/Convex).  
- Rate Limiting: Enforced server-side in Convex per project slug (10 reports/hour).  
- Cost Target: N3 applies to OpenAI + Resend usage under typical inputs.