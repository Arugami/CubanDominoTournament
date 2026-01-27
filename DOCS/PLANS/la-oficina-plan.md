# La Oficina Plan (Admin / Commissioner Console)

**Last Updated:** 2026-01-26  
**Owner(s):** Product: Tobias (craft) + Walt (journey)  
**Design System Anchor:** `DESIGN-SYSTEM.md` (Bone Language + Club 33 + broadcast clarity)  
**Audit Anchor:** `TEAM/SESSIONS/2026-01-18-admin-ux-audit.md` (current state + UX notes)  
**Audit Session (Tobias + Walt):** `TEAM/SESSIONS/2026-01-26-la-oficina-audit-tobias-disney.md` (translation + truth lock + ops posture)  
**La Mesa Anchor:** `DOCS/PLANS/la-mesa-plan.md` (what admins must publish/support)  
**Data Anchor:** `supabase/migrations/20260117_admin_and_tournament.sql` (admin + tournament schema)

---

## North Star

**La Oficina** should feel like the **Commissioner’s control room**:
- **Truth-first:** it must never lie about venue, time, match state, standings, or what’s live in La Mesa.
- **Fast under pressure:** optimized for “night-of” operations (phones out, loud room, quick taps).
- **Calm authority:** cigar-lounge atmosphere, but with broadcast-grade clarity (no “app UI clutter”).

La Oficina is not a “settings page.” It’s where the league becomes real.

---

## Translation & Meaning (What “La Oficina” Signals)

**Literal:** “The office.”  
**In CDL:** “The Commissioner’s office” / “the back room where decisions get made.”

**Admin-facing translation rule:**
- **Brand name stays Spanish:** `La Oficina`
- **Functional descriptor is plain English:** `Commissioner Access`, `Admin Console`, `Tournament Ops`

Suggested top-line pattern (already consistent with current pages):
- **H1:** `La Oficina`
- **Subtitle:** `Commissioner Access`

Copy tone for admins:
- Short, direct, operational.
- Spanish for **ritual nouns** (La Oficina, La Mesa, La Ley), English for **actions** (Add player, Seed teams, Publish).

---

## What Exists Today (Baseline)

Admin pages exist and are usable end-to-end:
- Auth: `/admin/login`, `/admin/setup`, `/admin/callback`
- Ops: `/admin` (dashboard), `/admin/registrations` (players), `/admin/teams`, `/admin/round-robin`, `/admin/bracket` (finals), `/admin/announcements` (ticker), `/admin/settings`

Primary data tables exist (Supabase):
- `admin_users`, `players`, `teams`, `matches`, `announcements` (+ RLS policies)

---

## Relationship To La Mesa (Admins “Publish The Room”)

La Mesa is the public hub; La Oficina is the backstage console that keeps it truthful and alive.

La Oficina owns:
- **Ticker messages** (`announcements`) — what the crowd sees in the broadcast strip.
- **Board voice** (planned) — “official beats” that must read like a lower-third, not a chat post.
- **Tonight / Next Up truth** (planned) — one canonical event record that feeds both public and admin surfaces.
- **Match state + standings** — what turns La Mesa from “room” into “sports night.”

---

## Locked Decisions (Design + Experience)

**Tobias (Craft) — invariants**
- Bone language: `--radius-bone: 12px`, carved surfaces at `8px`, no generic pills.
- “Let the content be the interface”: big numbers, quiet chrome, few primary actions.
- Micro-interactions must feel physical (lift/slam), never bouncy.

**Walt (Journey) — invariants**
- Admin flow must always present a “next clear action” (the weenie) based on tournament state.
- The queue is part of the experience: setup → roster → teams → schedule → live scoring → champion → postmortem.

---

## Admin Jobs-To-Be-Done (JTBD)

### Before the event (setup + trust)
- Add/verify players, resolve duplicates, capture notes.
- Form teams, assign players, set seeding.
- Build group stage (Group A/B) and seed finals.
- Prepare “Tonight” details and publish pre-event announcements.

### During the event (run the room)
- Mark matches in progress/completed, enter scores fast.
- Resolve disputes quickly (edit score, forfeit, swap player).
- Keep the room informed (ticker + board beats).

### After the event (closure + memory)
- Lock results, publish champion moment.
- Export roster + results, produce recap data for content/broadcast.
- Reset for next tournament without destroying history.

---

## P0 Before Tournament I (Jan 31, 2026)

These are “trust + operations” fixes. If La Oficina lies, the whole league looks fake.

### 0) Truth drift inventory (must resolve before any polish)

Current project state contains conflicting “canonical” event details:
- Public hero uses “Stefan’s Lounge” linked to `333 Bergenline Blvd, Fairview, NJ` (`src/pages/index.astro`).
- La Mesa “Tonight” module must match the same venue + correct day/time (`src/pages/index.astro`).
- Admin dashboard must pull event details from the same canonical source (`src/pages/admin/index.astro`, `src/lib/event.ts`).
- Env example must match the canonical venue map URL (`.env.example`).
- Root TODO and TEAM TODO must stay aligned on venue/logistics (`MASTERTODO.md`, `TEAM/MASTERTODO.md`).
- Status docs must stay aligned with the canonical Tournament I details (`STATUS.md`, `TEAM/STATUS.md`).

Decision required:
- Pick the canonical Tournament I details for **2026-01-31** (venue + address + city/state + call time) and centralize them.

### 1) Single source of truth for event details

Observed mismatch risk:
- Public site and admin dashboard currently hardcode event details in different places (and even the day-of-week can be wrong).

Plan:
- Create one canonical event record (file/config or database) and read it everywhere (public + admin + La Mesa modules).

Acceptance:
- Venue string, city/state, day-of-week, date, and time match across Hero / Registration / La Mesa / Admin dashboard.

### 2) “Night Of” mode (minimum viable ops posture)

Plan:
- Add an explicit “Live Night” posture: surface only what matters (matches, quick edits, publish).
- Keep the UI scannable at 3 feet away (phone held low, quick glances).

Acceptance:
- From dashboard, an admin can reach: (a) next match to score, (b) publish update, (c) view standings, in ≤ 2 taps.

### 3) Publish pipeline: Ticker + Board (official voice)

Plan:
- Keep `Ticker` as real-time broadcast strip.
- Add `Board` items as a distinct content type (official beats), even if it maps to the same underlying table at first.

Acceptance:
- Admin can publish an official beat that is visually distinct from regular chatter (lower-third tone).

### 4) Admin reliability guardrails

Plan:
- Clear destructive-action warnings (what changes, who is affected).
- Minimal audit trail for critical ops actions (score changes, team edits, announcements).

Acceptance:
- Any destructive action states impact before confirming (e.g., “This affects 3 matches”).

---

## Phased Plan (Spec → Workflow → Pulse → Hardening)

### Phase 0: Spec lock (1 doc pass)
- Define La Oficina state machine: `Setup`, `Pre-event`, `Live night`, `Post-event`.
- Define content ownership: who can publish what (admin vs super_admin).
- Define the “official voice” style guide for Board + Ticker.

**Deliverable:** this plan + a short “Ops State” addendum in `DOCS/PLANS/la-oficina-plan.md`.

### Phase 1: Workflow excellence (make it fast)
- Player dedupe + confirmation workflow.
- Team formation speed (quick assign; prevent invalid team states).
- Score entry speed (keyboard-first on desktop; thumb-first on mobile).

**Deliverable:** acceptance criteria per page (players/teams/group stage/finals).

### Phase 2: Pulse (real-time + broadcast)
- Live updates without refresh where it matters (counts, match status, standings).
- Tight integration points that feed La Mesa: standings snapshots, “match starting” beats, champion moment.

**Deliverable:** “What the crowd sees” mapping (La Oficina action → La Mesa surface).

### Phase 3: Hardening (security + audit + reset)
- Session timeout + re-auth patterns.
- Optional 2FA for super_admins.
- Event archive + reset path that preserves history.

**Deliverable:** operational checklist + rollback/restore notes.

---

## Tobias Audit Notes (What “Good” Feels Like)

- Admin should feel like **machined brass**: carved, restrained, inevitable.
- Density is allowed, clutter is not.
- Make the “next action” obvious with hierarchy, not more UI.
- Every modal needs one clean primary action; everything else is quiet.

---

## Walt Audit Notes (What “Good” Does)

- The admin experience should run like a show: **prepare → run → announce → celebrate → close**.
- Every page needs a weenie (what’s next, what matters right now).
- Empty states should read as anticipation, not absence (“No announcements yet” should feel like the room is open).

---

## Risks / Watchouts

- **Truth drift:** event details hardcoded in multiple places will diverge unless centralized.
- **Two “teams” concepts:** tournament teams vs La Mesa team formation must not collide at the schema/UX level.
- **Admin as an afterthought:** if La Oficina feels like generic back office, the brand breaks (Club 33 rule: “inside is different”).

---

## Open Questions (Need Decisions)

1. What is the canonical venue + address for Tournament I on **2026-01-31** (and who owns it)?
2. Should Board items be separate from ticker items, or a typed subset of `announcements`?
3. What is the minimum audit trail we need before we trust “night-of” ops?
4. Do we need a “Check-in” flow (arrived/not arrived) for players, or is that out of scope for Tournament I?
