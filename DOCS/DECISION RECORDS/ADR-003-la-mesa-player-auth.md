# ADR-003: La Mesa Player Authentication (Login Required)

**Status:** Accepted  
**Date:** 2026-01-26  
**Owner(s):** Product: Tobias (craft) + Walt (journey)  
**Related:** `DOCS/DECISION RECORDS/ADR-002-la-mesa-features.md`, `DESIGN-SYSTEM.md` (Club 33 principle)

---

## Context

CDL registrations currently flow into Google Sheets via Apps Script. Players then return to the site and enter **La Mesa**.

Without authentication, the product cannot reliably answer: **“How do we know it’s them?”**

- Names can collide (multiple “Carlos”).
- Anyone could choose someone else’s name (impersonation).
- Cross-device return is impossible (new phone / cleared storage).
- League integrity requirements are coming (stats, rankings, rivalries, “being seen”).

La Mesa is not a throwaway tournament widget. It is a foundational surface for the league.

---

## Decision

**La Mesa becomes login-required.**

Authentication method: **email magic link (passwordless)** using Supabase Auth.

Verification rule: a logged-in user may enter La Mesa only if their auth email exists in Supabase `players` with status `registered` or `confirmed`.

---

## Why This Approach (User Experience + CDL Tone)

We already collect email at registration, and we already send a confirmation email.

Passwordless magic link is:

- **Low-friction** (no passwords, no “create account” mental load)
- **Cross-device** by design
- **Anti-impersonation** (your email is your seat)
- **Club 33 aligned** (you “earn the door”, then you get a key)

**Primary entry path:** confirmation email contains a single CTA (“Enter La Mesa”) that signs them in and returns them to the room.  
**Secondary path:** La Mesa has a “Send link” field for re-entry (new device / cleared session).

---

## Alternatives Considered

1) **Pick your name from a list**
   - Rejected: easiest to impersonate; breaks “league” credibility; doesn’t scale.

2) **Email + password**
   - Rejected: higher support burden (resets) and higher friction; feels “app-y”.

3) **SMS-only**
   - Deferred: great UX but adds cost + deliverability variability; revisit later (optional).

4) **Social login**
   - Deferred: not culturally aligned as the primary “seat” identity; revisit as optional.

---

## Implementation Notes (Current)

- Auth callback: `src/pages/mesa/callback.astro`
- Registration sync: `/api/register` best-effort upserts into Supabase `players`
- La Mesa gate: `src/pages/index.astro` requires verified auth session before “Claim Your Seat” can complete
- RLS hardening: `supabase/migrations/20260126_mesa_player_auth.sql` restricts chat/team writes to registered players

---

## Consequences

**Pros**
- Clean identity key for league growth
- Stops impersonation
- Works across devices
- Matches “earned seat” ritual language

**Cons**
- Adds one extra step if the user tries to enter La Mesa immediately after registering (they must open email)
- Requires ops setup (Supabase Auth redirect allowlist + env vars + migration)

---

## Follow-ups (P0 UX)

1) Ensure the registration confirmation email includes the actual La Mesa door key link (one-email flow).
2) Keep the in-room gate copy ceremonial: “Your seat’s waiting. Open your door key.”
3) Move all presence/messaging identity over time from `playerName` to a stable `player_id` (auth-bound) for integrity.

