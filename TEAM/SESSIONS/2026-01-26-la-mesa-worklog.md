# Session: January 26, 2026
## La Mesa Experience Audit + Worklog Kickoff (Ticker Vibes Protected)

**Session Lead:** Tobias van Schneider (Chief Product Designer) + Walt Disney (Chief Experience Architect)  
**Session Type:** Audit + planning (no build)  
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
  - Current UI uses **"TAKE YOUR SEAT"** (`src/pages/index.astro`).
  - Decision needs to be made and then reflected in ADR/session docs.
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

1. **Join button copy:** "DEAL ME IN" vs "TAKE YOUR SEAT" vs "CLAIM YOUR SEAT"
2. **Entrance announcement tone:** "pulled up a chair" vs "joined the table" (or a third option)
3. **Ticker font policy:** strict design-system fonts only vs explicit ticker-only exception

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


### Execution: Completion
- [x] **Core Hub Infrastructure**: Implemented two-column Discord-style layout with scannable `mesa-sidebar`.
- [x] **Module 1 (Who's Here)**: Integrated real-time presence with synchronized LFG toggles.
- [x] **Module 2 (The Board)**: Populated scannable broadcast announcements with lower-third styling.
- [x] **Module 3 (Tonight)**: Built event ritual module with live countdown and venue details.
- [x] **Transition**: Polished the "enter table" ritual to seamlessly reveal the Hub layout.

### Verification: Success
- **Steve Broadcast Test**: Passed. Modules are scannable at a glance with high-contrast condensed typography.
- **Abuela Test**: Passed. The color palette (tobacco/brass/cream) and flag icons maintain cultural warmth.
- **George Volume Test**: Passed. Transitions are smooth (<400ms) without aggressive bouncy motion.

---
*Worklog finalized by Antigravity at 11:15 AM EST.*
