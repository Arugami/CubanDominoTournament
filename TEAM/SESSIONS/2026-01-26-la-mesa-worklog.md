# Session: January 26, 2026
## La Mesa Experience Audit + Worklog Kickoff (Ticker Vibes Protected)

**Session Lead:** Tobias van Schneider (Chief Product Designer) + Walt Disney (Chief Experience Architect)  
**Session Type:** Audit + planning + worklog (implementation tracked explicitly below)  
**Core Constraint:** Keep La Mesa "ticker" vibes (broadcast energy + cigar-lounge depth) per `DESIGN-SYSTEM.md`

---

## Context (Source Docs)

- Vision: `TEAM/SESSIONS/2026-01-19-la-mesa-vision.md`
- Joint audit + action items: `TEAM/SESSIONS/2026-01-23-la-mesa-ux-audit-tobias-disney.md`
- Design system (Bone Language / broadcast energy / motion guardrails): `DESIGN-SYSTEM.md`
- Hub plan (this work): `DOCS/PLANS/la-mesa-plan.md`
- Decisions:
  - Ticker: `DOCS/DECISION RECORDS/ADR-001-mesa-ticker.md`
  - La Mesa master record: `DOCS/DECISION RECORDS/ADR-002-la-mesa-features.md`
- Current implementation reference: `src/pages/index.astro` (La Mesa ticker + panel + presence)

---

## Audit: Where La Mesa Is Right Now (Reality, Not Aspirations)

### What Feels Locked-In (Working Direction)

- **Ticker is the "always-on broadcast":** fixed bottom presence, scroll track, LIVE dot pulse, dimming behavior when chat is open.
- **Earned entry still holds:** La Mesa access stays tied to registration (Club 33 principle).
- **Second-screen mechanics exist:** dock/peek mode vs full "in the room" mode (La Mesa can live alongside matches).
- **"Room language" is showing up:** smoke/texture, weighty button states, calm-but-tense empty state copy ("The calm before the storm.").
- **In-room weenie points the right way:** "Who's here" + presence list + "Looking for partner" (human-first, not feature-first).

### What’s Out of Sync (Docs vs. Current UI)

- **Join CTA copy drift:**
  - Docs repeatedly call for **"DEAL ME IN"** (Jan 12/23).
  - Current UI uses **"CLAIM YOUR SEAT"** (`src/pages/index.astro`).
  - Keep **"CLAIM YOUR SEAT"** as the standard (aligns Panel 4 + hub plan); update older docs that still reference "DEAL ME IN".
- **Entrance announcement copy drift:**
  - Desired tone in docs: **"pulled up a chair"** (invitation + room acknowledgement).
  - Current announcement copy reads: **"[Name] has joined the table"**.
- **Ticker typography exception risk:**
  - Ticker badge uses a sports-style font fallback chain (includes a non-design-system font).
  - If we keep it, we should explicitly bless it as a *ticker-only exception* in the design system (so "ticker vibes" stay consistent and intentional).

### Top Open Problems (Experience, Not Features)

- **Payoff vs buildup:** the scroll/registration journey is cinematic; the first 5 seconds inside La Mesa must feel equally "earned."
- **Life when empty:** personas told us "don't add corny buttons, add people." We need honest signals when the room is quiet and clear hooks for the first message.
- **Truth in counts:** presence vs "active today" vs "in the room" must never contradict (trust is part of the ritual).

---

## Tobias Review (Room, Weight, Micro-Moments)

- The ticker is a strong broadcast layer; protect its pacing and typography hierarchy.
- The domino/chat button *mostly* reads like an artifact; keep tightening "lift" and "slam" until it feels picked up, not clicked.
- Copy matters as much as motion. "Take your seat" is good room language; "Deal me in" is better game language. We should pick one and commit everywhere.
- Entry should have a threshold beat (darkness bloom, hush) before showing the room; avoid anything bouncy or "app-y."
- The room should feel alive without noise: subtle breathing, restrained pulses, and presence that is readable at a glance.

---

## Walt Review (Journey, Earned Entry, Weenie, Second Screen)

- The queue is already part of the ride; the "castle" *inside* La Mesa must be presence (who's here) before anything else.
- Earned entry is working; do not dilute it by making La Mesa feel like a generic chat overlay.
- Second-screen is not a compromise; it is the feature. Peek mode must be clean, light, and readable during live play.
- Announcements should be dignified. The room can acknowledge arrivals without spectacle: name + flag + one line, then get out of the way.
- Empty state must build anticipation, not absence. "Calm before the storm" is the right direction; the UI should invite the first line of trash talk.

---

## Ticker Vibes Guardrails (Design System Alignment)

- **Keep:** broadcast lower-third energy, scannable event rhythm, calm pace ("breath spacing"), subtle pulses (no bouncy movement).
- **Avoid:** pill shapes, generic app fonts, loud confetti moments, and any UI that competes with the ticker when the room is open.
- **Rule:** ticker stays the broadcast; the panel is the room. They must never feel like two unrelated products.

---

## Decisions Needed (Pick One, Then Update ADR-002 + UI Copy Everywhere)

1. **Entrance announcement tone:** "pulled up a chair" vs "joined the table" (or a third option)
2. **Ticker font policy:** strict design-system fonts only vs explicit ticker-only exception

---

## Next Actions (Planning Only)

- Audit all La Mesa copy strings and choose one consistent "table dialect" (room-first, never corny).
- Define the "first 5 seconds in the room" as a single designed sequence (threshold -> presence -> prompt -> first message).
- Lock the three-state model (Ticker / Peek / Full) with explicit rules for what UI is allowed in each.
- Update `DOCS/DECISION RECORDS/ADR-002-la-mesa-features.md` to reflect current reality and the decisions above (after we choose).

---

## Worklog (Append-Only)

Add new entries as we go:

### 2026-01-26
- Audit kickoff; identified doc drift (join CTA, entrance copy, ticker font policy).
- Re-committed to "ticker vibes" + second-screen-first constraint.
- **Hub modules chosen for Full mode (in-room):** (1) Who's here + LFG, (2) The Board (announcements/system beats), (3) Tonight / Next up (countdown + call time).
- **Decision:** "Tonight / Next up" source of truth is **Tournament I** (date/time/venue/call time), not match scheduling yet.
- **Decision:** Entry/join CTA language standardizes to **"CLAIM YOUR SEAT"** (match Panel 4), not "Deal me in" or "Take your seat."
- **Discord reference review:** Adapt scannable sections + badges + collapsible groups; do not copy channel sprawl/roles. Keep hub minimal (presence, board, tonight) and second-screen fast.
- **UI direction:** Remove split-screen + Discord channel list. Replace with a horizontal seat strip and stacked hub modules. Strip emojis from navigation/quick talk.
- **Implementation pass:** Aligned La Mesa typography to design-system fonts (removed "SF Sports Night"), standardized ticker badge to **"LA MESA"**, updated entrance announcement to "**pulled up a chair**", and normalized key chat radii to the 12px bone radius.
- **Implementation pass:** Expanded 12px bone radius enforcement across La Mesa surfaces (domino toggle, presence sheet/rows, tooltips, modals, badges, and whisper toggle). Pips remain circular.
- **Decision:** Restored the ESPN-style "SF Sports Night" font for La Mesa badge + header + ritual countdown to reinforce the broadcast layer.
- **Experience fix:** Reset docked state storage so the hub opens in Full mode by default after the redesign (`cdl_mesa_docked_v2`).

### Hub Stack (Planning Spec - No Build Yet)

**Goal:** When La Mesa opens in Full mode, it should feel like a hub/lobby (not a minimizable chat).

**Hierarchy (top to bottom):**
- **Header:** "La Mesa" + status pill that opens **Who's here** (presence is the in-room weenie).
- **Module 1: Who's here (P0)**
  - Compact grid/list: flag + name + status (LFG badge).
  - Actions: tap a person -> prefill `@Name`; tap LFG -> toggle your own badge (peek-safe).
  - Empty copy: "Quiet right now. Pull up a chair."
- **Module 2: The Board (P0)**
  - A small, scannable feed of official beats: "Tournament update", "Rule reminder", "Doors open at 7".
  - Always feels broadcast/lower-third (not a Discord channel list).
  - Empty copy: "No announcements yet. The table's open."
- **Module 3: Tonight / Next up (P0)**
  - One clear time-based hook: countdown + venue + "first table call" (or "next match" later with MyFicha).
  - Empty copy: "Next table call soon. Stay close."

**State rules (protect second-screen):**
- **Ticker (closed):** broadcast-only; never becomes a hub.
- **Peek (docked):** chat-first + *one* compact hub affordance (presence count + LFG toggle); no big modules.
- **Full (in-room):** hub stack visible; chat transcript becomes the lower layer (still core, but not the headline).

**Ticker vibes guardrails:**
- Broadcast labels (IBM Plex Sans Condensed), bone corners (12px), warm depth, restrained pulses (no bouncy motion).
- Modules must feel like part of the ticker ecosystem (lower-third logic), not a separate product.

### Implementation Status (Observed in `src/pages/index.astro` as of 2026-01-26)

- **State model is implemented:** Ticker (closed), Peek (docked), Full (in-room). Peek hides the hub stack to protect second-screen use.
- **Full mode layout matches the hub plan:** header ("La Mesa" + Who's here), horizontal seats strip, hub stack modules (Who's Here / The Board / Tonight), then chat transcript + composer.
- **Known remaining drift:** entrance announcement copy still uses "**has joined the table**" (plan wants "**pulled up a chair**").
- **Font policy still needs a decision:** "SF Sports Night" is used in some La Mesa surfaces; either bless as ticker-only/La Mesa-only exception or replace with design-system fonts everywhere.

---
*Worklog finalized by Antigravity at 11:15 AM EST.*

---

## Worklog (Append-Only)

### 2026-01-26 (Later) - Claim Your Seat Review (Tobias + Walt)

- Reviewed the "Claim Your Seat" screen for design-system alignment (Bone radius, typography rules, motion guardrails) against `DESIGN-SYSTEM.md`.
- Logged plan updates in `DOCS/PLANS/la-mesa-plan.md` (added "Current Implementation Notes" + a concrete polish backlog for Claim Your Seat).
- Identified the key polish items to schedule next:
  - CTA semantics: either align to `.btn-primary` spec or document a La Mesa threshold CTA variant and use it consistently.
  - Motion: reduce identity stagger/sequence timing to match design-system guardrails (<400ms total; 60-80ms stagger steps).
  - Shape: normalize radii back to 12px on key controls; document any allowed inner-radius exception.
  - Typography: decide/record the "SF Sports Night" policy (ticker-only/La Mesa-only exception vs remove).
  - Dropdown craft: add visible keyboard focus styling; remove JS-driven hover styling; dedupe duplicate class definitions.

### 2026-01-26 (Later) - Claim Your Seat Consistency Pass (Docs + Code)

- Updated `DESIGN-SYSTEM.md` to document:
  - `--radius-carved: 8px` for inner carved/inlaid surfaces (inside a bone).
  - A scoped, explicit `SF Sports Night` exception (broadcast labels only, with IBM Plex fallbacks).
  - A `btn-threshold` semantic button spec for La Mesa earned entry (claim seat / threshold moments).
- Updated `src/pages/index.astro` (Claim Your Seat):
  - Tightened identity-screen animation timing + stagger (faster, consistent with guardrails).
  - Removed the custom dropdown's separate animation/opacity so it follows the same stagger system.
  - Added keyboard-visible focus styles and a `.is-focused` visual state for dropdown options.
  - Removed JS-driven hover styling for dropdown options (CSS-only to prevent drift).
  - Removed duplicate `.chat-identity__register-hint` style definition and normalized spacing.

### 2026-01-26 (Later) - Bug Fix: Hub Not Visible After Claim Seat

- Root cause: `#chatPanel` became the scroll container; a post-ritual focus/scroll jump pushed the **hub stack above the viewport**, making it look "missing".
- Fix in `src/pages/index.astro`:
  - CSS: prevented the panel from becoming a scroll container (`overflow: clip`) and fixed nested flex scrolling (`min-height: 0` on `.chat-main` / `.chat-body-container`).
  - JS: pinned scroll to the top during open/close/ritual (`chatPanel.scrollTop = 0`, `chatBodyContainer.scrollTop = 0`) and avoided auto-focus in Full mode (hub-first).
- Verification: repeated full flow (open -> pick name -> CLAIM YOUR SEAT) lands on hub modules immediately; Peek mode remains chat-first.
- Documentation: wrote regression + prevention notes in `DOCS/BUGS/009-la-mesa-hub-visibility-scroll-container.md`.

### 2026-01-26 (Later) - Tobias + Walt Review (Post-Fix, Next P0 Improvements)

- Tobias (craft): fix Tonight card truth (venue/day/time), fix countdown readability (no `122:..` hours), add subtle hub-to-chat cue, reduce "Invite" UI noise in Who's Here.
- Walt (journey): single source of truth across Hero / Registration / La Mesa; first 5 seconds in-room stays hub-first; treat focus/scroll changes as ride-safety regressions.
- Action plan captured in `DOCS/PLANS/la-mesa-plan.md` under "P0 Before Tournament I (Jan 31, 2026)" and added as tasks in `MASTERTODO.md`.

### 2026-01-26 (Later) - P0 Trust + Readability Pass Implemented (Tobias + Walt)

- Canonical event details centralized in `src/lib/event.ts` and wired through Hero / Success / La Mesa (venue, city/state, day-of-week, call time).
- Tonight countdown updated to a human format (no `122:..` hours) with a calmer update cadence in `src/pages/index.astro`.
- Added a subtle hub-to-chat cue between the hub stack and transcript (brass divider + "CHAT" label).
- Reduced "Invite" UI noise by turning it into a quieter icon action; row-tap remains the primary @mention behavior.
- Documented the full-page screenshot “repeating UI” as a stitching artifact (QA false-positive) in `DOCS/BUGS/010-full-page-screenshot-repeats-fixed-ui.md`.

### 2026-01-26 (Later) - Boot Safety Fix: Loader Stuck (SyntaxError)

- Fixed a boot-blocking inline script SyntaxError that prevented the loading screen from dismissing.
- Root cause: attempted to inject a server-side value into raw `<script>` text via `${...}`; Astro shipped it literally into `dist/index.html`.
- Fix: moved the value into `data-first-slam-at` on `#mesaHubCountdown` and read it at runtime.
- Documented as `DOCS/BUGS/011-loading-screen-stuck-inline-script-syntax-error.md`.

### 2026-01-26 (Later) - Identity Decision: Login Required (Player Verification)

- Decision: La Mesa becomes **login-required** (prevents impersonation; supports cross-device returns).
- Implementation (website):
  - Added player auth callback page at `src/pages/mesa/callback.astro` (magic link return → verifies player is registered/confirmed → routes back to the site).
  - Updated Claim Your Seat identity UI to gate entry by **email magic link** (name is pulled from the registered player record; no name-picking list).
  - Updated presence keying to avoid name collisions (presence uses auth user id when available).
- Implementation (registration pipeline):
  - `/api/register` now best-effort upserts the registering player into Supabase `players` (Sheets remains the primary source of truth).
- Security:
  - Added a migration to require authenticated + registered players for message inserts (and tightened team invite writes where applicable).

### 2026-01-27 - Table Key Redirect Fix + Claim Seat Flag Advance

- **Bug (Critical):** confirmation email “Claim Your Seat” magic link redirected to site root (`https://cubandominoleague.com/#...`) instead of `/mesa/callback`, causing failed seat entry and occasional `access_denied` on re-click.
  - Fix:
    - Hardened magic-link generation to always request `/mesa/callback` (canonical site URL + broader `redirect_to` compatibility across Supabase API variants).
    - Added a root safety net: if Supabase still lands on `/#access_token=...` (or `/?code=...`), auto-forward payload to `/mesa/callback` so the callback page can establish the session and verify the seat.
  - Docs: `DOCS/BUGS/012-supabase-magic-link-redirect-root.md`

- **Bug (High):** post-auth Claim Seat had no clear way to advance (CTA could be offscreen; flag carousel felt unselectable).
  - Fix:
    - Pinned the CTA to the bottom of the identity overlay (always visible).
    - Reserved extra bottom padding to prevent overlap.
    - Made “scroll settle” (centered flag) become the selection so choosing works via scrolling, not only tapping.
  - Docs: `DOCS/BUGS/013-claim-seat-no-advance-after-auth.md`
