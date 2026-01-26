# Session: January 26, 2026
## La Oficina Audit — The Commissioner’s Control Room

**Session Lead:** Tobias van Schneider (Chief Product Designer) + Walt Disney (Chief Experience Architect)  
**Session Type:** Joint audit + translation alignment + ops planning  
**Core Constraint:** La Oficina must remain “inside is different” (Club 33 principle) while staying faster than the room it serves.

---

## Session Context (Why This Matters)

La Mesa is becoming the public hub (presence + board + tonight + chat). As La Mesa gets more “real,” the backstage must become more truthful and operational. If La Oficina lies—about venue, time, match state, standings, announcements—the entire league feels fake.

This session focuses on:
- What “La Oficina” means in CDL (translation + tone)
- Whether the admin experience matches the brand (Bone Language + broadcast clarity)
- Where truth is drifting across the project (and how to lock it)
- What admins need on “night-of” to run Tournament I

---

## Source Docs (Ground Truth)

- Admin UX audit (current state): `TEAM/SESSIONS/2026-01-18-admin-ux-audit.md`
- La Mesa hub plan (what admins must support): `DOCS/PLANS/la-mesa-plan.md`
- Design system (Bone Language + Club 33): `DESIGN-SYSTEM.md`
- Data model (admin + tournament): `supabase/migrations/20260117_admin_and_tournament.sql`
- RLS management: `supabase/migrations/20260119_admin_rls_update.sql`

---

## Translation: What “La Oficina” Signals

**Tobias (brand/craft):**
> “La Oficina can’t feel like ‘admin settings.’ It should feel like a carved brass room where the Commissioner makes calls.”

**Walt (journey/meaning):**
> “In a park, backstage is where the show stays true. Guests never see it, but they feel it when it’s wrong.”

**Decision (language system):**
- **Keep the name Spanish:** `La Oficina`
- **Keep actions plain English:** “Add Player”, “Enter Score”, “Publish”, “Lock Results”
- **Use Spanish for ritual nouns only:** La Mesa, La Ley, La Oficina, La Salida

**Page identity pattern (consistent across all admin pages):**
- **H1:** `La Oficina`
- **Subtitle:** `Commissioner Access` (or `Tournament Ops` when in live posture)

---

## Audit: What’s Working (Already Strong)

- The admin UI already matches the cigar-lounge atmosphere (grain, vignette, brass/copper warmth).
- Navigation is minimal and functional (Roster / Tournament / Ticker).
- Core ops capability exists end-to-end (players → teams → round robin → finals → announcements).
- Feedback loops exist (toasts, status cues, winner advancement feedback).

La Oficina is not “missing features.” It’s missing a single, unified truth system and an explicit “night-of posture.”

---

## Audit: What’s Broken (Truth Drift)

The project currently contains conflicting “canonical” event details.

Examples of drift:
- Public site venue/address vs La Mesa “Tonight” module venue string
- Admin dashboard hardcoded venue/date/time
- Root TODO vs TEAM TODO disagree on venue booking
- Older status docs still reference 2025 dates

**Tobias:** “Nothing kills craft faster than a lie.”  
**Walt:** “A broken detail breaks the whole show.”

**Decision:** we must create a single source of truth for event details and use it everywhere (public + La Mesa + admin).

---

## La Oficina ↔ La Mesa (Admins “Publish The Room”)

La Mesa is the public room; La Oficina is the control room that keeps it alive.

La Oficina owns (now or next):
- Ticker announcements (broadcast strip)
- Official beats (Board voice, distinct from chat tone)
- Match state + standings
- “Tonight / Next up” truth

Rule:
- If the crowd can see it, La Oficina must be able to **set it**, **verify it**, and **correct it** without code changes.

---

## Tobias Lens (Craft Gate)

- La Oficina can be denser than public pages, but must never look like “generic SaaS admin.”
- Use hierarchy, not chrome: big numbers, quiet labels, few primaries.
- Every destructive action must read like machined hardware: “this affects X things,” then commit.
- When in doubt: fewer components, more engraved plaques.

---

## Walt Lens (Journey Gate)

- Admins need a “weenie” on every page: what’s the next right action given the state.
- Make “night-of” a distinct mode: score → publish → verify → repeat.
- Empty states should read as readiness (“No announcements yet” should feel like “the channel is open”).

---

## P0 Before Tournament I (Jan 31, 2026)

1) **Event truth lock**
- One canonical event record used by public site, La Mesa modules, and admin dashboard.

2) **Night-of posture**
- From `/admin`, reach “enter next score” and “publish update” in ≤ 2 taps.

3) **Official voice separation**
- Ticker stays the broadcast strip; Board beats read official (lower-third tone), not chatty.

---

## Open Decisions (Need Answers)

1. What is the canonical venue + address + city/state for Tournament I on **2026-01-31**?
2. Who owns updating event details (role: `admin` vs `super_admin`)?
3. Do Board items become a new table, or a typed subset of `announcements`?

