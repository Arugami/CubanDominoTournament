# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical Context: Mobile-First Design

**99% of users access this site on mobile devices.** Every decision must prioritize the mobile experience.

### Design Principles
- **Feel like a native app** - Not a website squeezed onto a phone. Smooth, responsive, instant feedback.
- **Touch-first interactions** - Buttons need generous tap targets (44px+), haptic feedback where supported
- **Respect iOS Safari quirks** - 100dvh for true viewport, touch-action: manipulation to avoid delays
- **Performance over polish** - Disable heavy effects (parallax, blend modes) on mobile

### Scroll Architecture (5-Panel Scroll-Snap)
The site uses a cinematic scroll-snap layout with 5 panels:
1. **Hero** - Event branding, date/venue
2. **Whisper** - "You've sat here before" (ancestry/recognition)
3. **Build** - "We didn't build La Mesa" (heritage narrative)
4. **Slam** - "Te toca" (the challenge)
5. **Form** - Registration (the conversion)

Each panel snaps to viewport on scroll. **Known friction point**: The form panel content can exceed viewport height on mobile, making it feel "stuck". Consider this when making changes.

### La Mesa (Chat Widget)
- Fixed ticker at bottom with live activity feed
- Domino button opens chat panel
- Only visible after registration (localStorage flag: `cdl_registered`)

---

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
- `PUBLIC_SUPABASE_URL` (optional) - Enables realtime chat widget
- `PUBLIC_SUPABASE_ANON_KEY` (optional) - Enables realtime chat widget

### Apps Script Properties
- `SHARED_SECRET` - Must match `APP_SCRIPT_SECRET`
- `HOST_EMAILS` - Comma-separated admin notification emails
- `RESEND_API_KEY` (optional) - If set, uses Resend API; otherwise GmailApp is used

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
