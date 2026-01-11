# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev          # Astro dev server (API routes won't work)
npm run build        # Build to dist/
npm run preview      # Preview production build

# Full local testing (includes /api/register endpoint)
npm run build && wrangler pages dev dist
```

**Deployment**: Push to `main` branch triggers automatic Cloudflare Pages deploy.

## Architecture

Three-tier serverless registration system:

```
Browser Form → Cloudflare Pages Function → Google Apps Script → Google Sheets + Email
```

| Layer | File | Purpose |
|-------|------|---------|
| Frontend | `src/pages/index.astro` | Single-page site with inline CSS/JS, 5-panel scroll-snap layout |
| API Gateway | `functions/api/register.ts` | Validates form data, adds auth secret, forwards to Apps Script |
| Backend | `apps-script/Code.gs` | Writes to Google Sheets, sends confirmation emails |

**Static assets** are in `PUBLIC/` (not the default `public/`), configured in `astro.config.mjs`.

## Key Configuration

### Environment Variables (Cloudflare Pages)
- `APP_SCRIPT_URL` - Google Apps Script Web App URL
- `APP_SCRIPT_SECRET` - Shared secret for auth (must match Apps Script)
- `VENUE_URL` - Venue link included in emails

### Apps Script Properties
- `SHARED_SECRET` - Must match `APP_SCRIPT_SECRET`
- `HOST_EMAILS` - Comma-separated admin notification emails
- `RESEND_API_KEY` (optional) - Uses Resend API; falls back to GmailApp

### Registration Counter
Update `TEAMS_REGISTERED` and `TEAMS_GOAL` in `index.astro` frontmatter (lines 2-3) to change the progress display.

## Important Patterns

**Honeypot spam protection**: Hidden "company" field in form. Bots fill it; humans don't. Both `register.ts` and `Code.gs` check this field is empty.

**Multi-layer validation**: Form data validated at three levels:
1. Client-side HTML5 validation
2. Cloudflare function (`register.ts`) - checks required fields, email format
3. Apps Script (`Code.gs`) - re-validates before writing to sheet

**Secret-based auth**: `APP_SCRIPT_SECRET` in Cloudflare must match `SHARED_SECRET` in Apps Script properties.

## Testing Registration Flow

1. Build and run locally: `npm run build && wrangler pages dev dist`
2. Submit form on localhost
3. Verify: row appears in Google Sheet, emails sent to players and HOST_EMAILS
