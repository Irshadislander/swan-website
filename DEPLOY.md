# Deployment Guide

## 1. Prerequisites
- Node.js 20+ installed locally.
- Vercel (recommended) or Netlify account with access to the SWAN repository.
- Environment variables available for GA/GTM IDs and base path adjustments.

## 2. Configure Environment Variables
Create the following variables in your hosting platform:

| Variable        | Description                                      | Example |
| --------------- | ------------------------------------------------ | ------- |
| `VITE_GA_ID`    | Google Analytics measurement ID (optional).      | `G-XXXXXX` |
| `VITE_GTM_ID`   | Google Tag Manager ID for advanced tracking.     | `GTM-XXXX` |
| `VITE_BASE_PATH`| Base path if deploying under a subdirectory.     | `/` |

For preview environments set `VITE_PREVIEW` to `true` so robots/meta tags disallow indexing.

## 3. Vercel Setup
1. Click **New Project** and import the repository.
2. Set build command to `npm run build`, output directory to `dist` (Vercel reads this from `vercel.json`).
3. Add the environment variables listed above.
4. Deploy. Every branch push generates a preview URL; main publishes to production. Preview builds automatically serve `robots.txt` with `Disallow: /` and inject a `<meta name="robots" content="noindex">` tag.

## 4. Netlify Alternative
1. Create a new site from git.
2. Use build command `npm run build`, publish directory `dist` (defined in `netlify.toml` if you choose that route instead of Vercel).
3. Add the environment variables in **Site Settings → Build & Deploy → Environment**.
4. Netlify preview deploys inherit the same meta/robots behaviour through the Vite plugin.

## 5. CI & Quality Gates
- GitHub Actions (`.github/workflows/ci.yml`) runs on every push/PR.
- Steps: `npm ci`, installs Playwright browsers, runs `npm run build`, executes `npm run test:e2e -- --reporter=line`, and uploads the `dist` artifact.
- Ensure Playwright dependencies are cached locally for faster runs (`npx playwright install --with-deps`).

## 6. Local Preview & Analysis
- `npm run preview` starts the built app on port 5173.
- `npm run analyze` runs Vite build with bundle visualiser to inspect chunk sizes (`dist/stats.html`).

## 7. Post-Deploy Checks
- Verify GA/GTM scripts receive events (if configured).
- Confirm preview URLs are `noindex` and production URLs are crawlable.
- Smoke-test Playwright flows (nav keyboard behaviour, donate flow, search) on the deployed preview.
