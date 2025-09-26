# Koustos - GitHub Issue Reporting Without Accounts

Build a nano-SaaS that lets non-GitHub users report bugs via unique URLs. Developers generate shareable links that collect feedback and auto-create GitHub issues using AI formatting.

## Core Features
- Developer gets unique URL (koustos.dev/f/abc123) tied to their GitHub repo
- Anyone reports bugs without GitHub account
- AI formats messy reports into proper GitHub issues
- Email notifications via Resend

## Tech Stack
- Next.js 14 + Tailwind CSS
- Hosted on Vercel
- Convex (database + encrypted PAT storage)
- OpenAI GPT-4o-mini (cheapest model at $0.15/1M tokens)
- GitHub REST API
- Resend (email notifications)

## Database Schema (Convex)
```javascript
projects: {
  slug: string, // 8-char random
  github_pat_encrypted: string,
  repo_owner: string,
  repo_name: string,
  maintainer_email: string,
  created_at: number
}

reports: {
  project_id: Id<"projects">,
  reporter_name: string,
  reporter_email: string,
  raw_input: string,
  formatted_issue: string,
  github_issue_number: number,
  created_at: number
}
```

## Page 1: Developer Setup (/setup)
Simple form with 3 fields:
1. GitHub PAT (password input with "Get PAT" help link)
2. Repository (format: owner/repo)
3. Email for notifications

On submit:
- Validate PAT has repo access via GitHub API
- Encrypt PAT using Convex env.ENCRYPTION_KEY
- Generate random 8-char slug
- Store encrypted project
- Show success with big copyable URL

```javascript
// Validate PAT
const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
  headers: { 'Authorization': `token ${pat}` }
});
if (!res.ok) throw "Invalid PAT or repo";

// Encrypt and store
const encrypted = encryptAES256(pat, process.env.ENCRYPTION_KEY);
const slug = generateSlug(); // "x7k9m2p4"
await ctx.db.insert("projects", { slug, github_pat_encrypted: encrypted, ... });
```

## Page 2: Bug Report (/f/[slug])
Clean form with conversational UI:
1. Name + Email inputs
2. Text area: "Describe the bug"
3. AI chat appears below after first submit

AI Flow (GPT-4o-mini):
```javascript
const completion = await openai.chat.completions.create({
  model: "gpt-5-nano-2025-08-07",
  messages: [{
    role: "system",
    content: "Bug report assistant. NO EMOJIS. Ask exactly 2 questions: 1) Device/browser and steps to reproduce 2) What would resolve this bug for you? Format: Description, Environment, Steps to Reproduce, Expected Behavior, Resolution Criteria. Professional tone. Under 150 words."
  }, {
    role: "user",
    content: userInput
  }],
  max_tokens: 250,
  temperature: 0.3
});
```

Example conversation:
- User: "chart broken mobile"
- AI: "I need two details: 1) What device/browser are you using and what steps lead to this issue? 2) What would need to be fixed for this to be resolved?"
- User: "iPhone Safari, bars missing when I rotate. Fixed when bars show in landscape"
- AI shows formatted issue with Resolution Criteria section
- User confirms → Create GitHub issue

## GitHub Issue Creation
```javascript
// Decrypt PAT server-side only
const pat = decryptAES256(project.github_pat_encrypted);

// Format issue body with resolution criteria
const issueBody = `
## Description
${description}

## Environment
${environment}

## Steps to Reproduce
${steps}

## Expected Behavior
${expected}

## Resolution Criteria
${resolutionCriteria}

---
*Reported via [Koustos](https://koustos.dev)*
`;

// Create issue (NO EMOJIS)
const response = await fetch(
  `https://api.github.com/repos/${owner}/${repo}/issues`,
  {
    method: 'POST',
    headers: {
      'Authorization': `token ${pat}`,
      'Accept': 'application/vnd.github.v3+json'
    },
    body: JSON.stringify({
      title: aiTitle, // No emojis in title
      body: issueBody,
      labels: ['bug', 'via-koustos']
    })
  }
);
```

## Email Notifications (Resend)
Two emails only (NO EMOJIS):

1. **To Developer** (immediate):
```javascript
await resend.emails.send({
  from: 'bugs@koustos.dev',
  to: maintainer_email,
  subject: `New bug report: ${issueTitle}`, // No emoji
  html: `
    <h2>New Issue Created</h2>
    <p><strong>Reporter:</strong> ${reporterName}</p>
    <p><strong>Preview:</strong> ${preview}...</p>
    <p><strong>Resolution Criteria:</strong> ${resolutionCriteria}</p>
    <a href="${githubUrl}">View Issue #${number} on GitHub</a>
  `
});
```

2. **To Reporter** (confirmation):
```javascript
await resend.emails.send({
  from: 'bugs@koustos.dev',
  to: reporter_email,
  subject: 'Bug report submitted successfully', // No emoji
  html: `
    <h2>Thank You</h2>
    <p>Your bug report has been submitted to the development team.</p>
    <p><strong>What you reported will be resolved when:</strong></p>
    <p>${resolutionCriteria}</p>
    <a href="${githubUrl}">Track Progress on GitHub</a>
  `
});
```

## UI Requirements
- Mobile-first responsive
- Dark mode friendly
- Loading states during AI/API calls
- Copy button for URL with "Copied!" toast
- Issue preview card before submission
- Success animation after creation

## Security
- PATs never sent to client
- All encryption/decryption in Convex functions
- Rate limit: 10 reports/hour per project
- Validate all GitHub API responses

## File Structure
```
/app
  /setup/page.tsx         # Developer onboarding
  /f/[slug]/page.tsx      # Bug reporting
  /api/ai/route.ts        # OpenAI endpoint
/convex
  schema.ts               # Database schema
  projects.ts             # CRUD operations
  encryption.ts           # PAT encrypt/decrypt
/components
  ReportForm.tsx          # Bug report UI
  IssuePreview.tsx        # Formatted preview
```

## MVP Constraints
- Public repos only (no auth complexity)
- English only
- No dashboard (just 2 pages)
- No deduplication (add post-hackathon)
- No issue tracking (just creation)
- NO EMOJIS anywhere (AI, emails, or UI)
- Always collect resolution criteria

## Demo Script (90 seconds)
0:00-0:15: "Developers lose bug reports because users won't create GitHub accounts"
0:15-0:30: Dev creates feedback URL in 20 seconds
0:30-0:50: Grandma reports "button no work" → AI asks for resolution criteria
0:50-0:70: Shows formatted issue with clear "Resolution Criteria" section
0:70-0:85: Split screen: messy input → professional GitHub issue
0:85-0:90: "Every bug captured. Resolution clear."

## Success Metrics
- Setup to URL: <30 seconds
- Report to issue: <2 minutes  
- Working demo with 3 real reports
- Total cost: <$1 for entire hackathon

## Environmental Variables
```
CONVEX_DEPLOYMENT=
OPENAI_API_KEY=
RESEND_API_KEY=
ENCRYPTION_KEY= # 32-byte hex key
NEXT_PUBLIC_URL=https://koustos.dev
```

## Quick Start Commands
```bash
npm create convex@latest koustos
npm install openai resend
npm install @types/node --save-dev
npx convex env set OPENAI_API_KEY <key>
npx convex env set RESEND_API_KEY <key>
npx convex env set ENCRYPTION_KEY <generate-32-byte-hex>
npm run dev
```

Focus on working demo over perfect code. Ship Wednesday!