# Convex Better Auth Environment Setup

Set these secrets in Convex:

```
npx convex env set BETTER_AUTH_SECRET $(openssl rand -base64 32)
npx convex env set SITE_URL http://localhost:3000
npx convex env set RESEND_API_KEY <Resend_Key>
npx convex env set OPENAI_API_KEY <OpenAI_Key>
npx convex env set ENCRYPTION_KEY <64-char-hex>
npx convex env set GOOGLE_CLIENT_ID <Google_ID>
npx convex env set GOOGLE_CLIENT_SECRET <Google_Secret>
npx convex env set GITHUB_CLIENT_ID <GitHub_ID>
npx convex env set GITHUB_CLIENT_SECRET <GitHub_Secret>
```
