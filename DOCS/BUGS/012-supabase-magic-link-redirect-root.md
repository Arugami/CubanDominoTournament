# 012: Supabase Magic Link Redirects to Site Root (`/#...`)

- **Status:** FIXED
- **Date Fixed:** Jan 27, 2026
- **Severity:** Critical

## Symptoms

- Clicking the confirmation email CTA (**Claim Your Seat**) lands on:
  - `https://cubandominoleague.com/#access_token=...` (root with auth hash), or
  - `https://cubandominoleague.com/#error=access_denied...`
- User never reaches `https://cubandominoleague.com/mesa/callback`, so the session isn’t established and La Mesa can’t verify the seat.

## Root Cause

- Supabase magic links were being generated with `redirect_to` falling back to the **Site URL** (`https://cubandominoleague.com`) instead of the intended callback path (`/mesa/callback`).
- The site root (`/`) did not handle Supabase auth hash payloads, so even when a session token arrived in `/#...`, nothing consumed it.

## The Fix

1) **Force canonical redirect target**
- Use a canonical site URL for link generation (prefers `SITE_URL`, falls back to forwarded headers).
- Send `redirect_to` in multiple places to match Supabase API expectations:
  - top-level `redirect_to`
  - `options.redirect_to`
  - `options.redirectTo`

2) **Add a root safety net**
- If Supabase still falls back to `/#access_token=...` (or `/?code=...`), immediately forward the auth payload to `/mesa/callback` so the callback page can establish the session and verify the seat.

## Files Changed

- `functions/lib/site-url.ts`
- `functions/api/register.ts`
- `functions/api/mesa/table-key.ts`
- `src/pages/index.astro`

## How to Verify

1) Register a fresh email on `https://cubandominoleague.com`
2) Open the confirmation email and click **Claim Your Seat**
3) Expected:
   - You briefly hit `/mesa/callback` (or land at `/` then auto-forward to `/mesa/callback`)
   - You end up at `/?mesa=1` with the Claim Seat ritual ready

