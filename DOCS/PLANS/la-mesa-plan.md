# La Mesa Plan (Hub First)

**Last Updated:** 2026-01-26  
**Owner(s):** Product: Tobias (craft) + Walt (journey)  
**Design System Anchor:** `DESIGN-SYSTEM.md` (Bone Language + Club 33 + ticker/broadcast energy)
**Vision Anchor:** `TEAM/SESSIONS/2026-01-19-la-mesa-vision.md` (Three Pillars + Phase 1 “Community Pulse”)

---

## North Star

La Mesa should feel like a **hub/lobby** you arrive at (and linger in) — not “a chat you can minimize.”

---

## Locked Decisions

- **Hub modules for Full (in-room) mode:**
  1) **Who’s here + LFG**
  2) **The Board** (official announcements / system beats)
  3) **Tonight / Next up** (Tournament I source of truth for now)
- **Primary CTA language:** `CLAIM YOUR SEAT` (align with Panel 4)
- **Second-screen is first-class:** La Mesa must work while playing/watching (Peek mode must stay clean)

---

## Adopted From Vision (Jan 19)

- **La Mesa = Community hub, not just chat:** build “the back room,” not a widget.
- **Phase 1 framing (“Community Pulse”):** make it feel alive via presence + broadcast beats + simple prompts.
- **Presence is the hero:** show who’s around (flag + name; optional CDS/status later) before asking anyone to speak.
- **Broadcast DNA stays on:** ticker/activity language, scannable “lower-third” announcements, restrained urgency.
- **Ritual timing:** “Tonight / next up” is the simplest ritual keeper (countdown/call time beats).
- **Acceptance tests we keep using:**
  - Tobias Room Test: room > hallway; weight; alive; screenshot-worthy.
  - Daisy Abuela Test: recognizable warmth; not “too app.”
  - Steve Broadcast Test: “La Mesa is a broadcast” (clarity + scannability).
  - George Volume Test: quiet/medium/LOUD moments (no constant shouting).

---

## Design Reference: Discord (Adapt, Don’t Copy)

What we take:
- **Scannable sections:** clear “areas” without needing more screens (maps to our 3 hub modules).
- **Badges as ambient signals:** activity visibility without interrupting second-screen use (e.g., `LFG`).
- **Member count visibility:** “who’s here” is the in-room weenie.
- **Collapsible groups:** reduces cognitive load; keeps hub readable.
- **Dark theme as comfort:** supports long sessions and second-screen use.

What we do not take:
- Server list / channel sprawl / role bureaucracy (we are one room).
- “Gaming community” coldness (we are a back room with warmth + ritual).
- Tech UI typography (we keep broadcast + Bone Language).
- Split-screen layouts (hub should feel like one room, not panels).

---

## Product States (Hard Rules)

- **Ticker (Closed):** broadcast-only; activity + artifact button; never becomes the hub.
- **Peek (Docked):** chat-first; minimal hub affordances only (presence count + LFG toggle).
- **Full (In-Room):** hub stack visible; chat transcript is lower in hierarchy (still core, not the headline).

---

## Hub Information Architecture (Full Mode)

Top-to-bottom hierarchy:

1) **Header**
   - Title: “La Mesa”
   - Status pill: “Who’s here” (opens presence list; this is the in-room weenie)

2) **Module 1: Who’s here (P0)**
   - Compact list: flag + name + optional badges (`LFG`)
   - Actions: tap person -> prefill `@Name`; tap LFG -> toggle your own badge
   - Empty copy: “Quiet right now. Pull up a chair.”

3) **Module 2: The Board (P0)**
   - Scannable official beats (broadcast/lower-third tone; not a channel list)
   - Examples: “Tournament update”, “Rule reminder”, “Doors open at 7”
   - Empty copy: “No announcements yet. The table’s open.”

4) **Module 3: Tonight / Next up (P0)**
   - Single time-based hook (Tournament I): date + time + venue + call time
   - Empty copy fallback: “Next table call soon. Stay close.”

5) **Chat (Core, De-Emphasized)**
   - Transcript + composer remain, but the hub stack is what makes it feel like a place.

---

## Guardrails (Ticker Vibes)

- **Typography:** broadcast labels use IBM Plex Sans Condensed; no random “tech UI” fonts.
- **Shape:** bone radius (12px) everywhere; no pills.
- **Motion:** subtle, fast, meaningful; no bouncy animations; total sequences < 400ms.
- **Energy mix (40/35/25):** Cuban heritage warmth / broadcast punch / domino ritual weight (avoid “forced competition”).
- **Human-first:** presence + timing beats > gimmicks (no corny lingo buttons as the primary interaction).

---

## Persona Coverage (Keep It Simple)

We satisfy personas mostly via **ordering, copy, and restraint** (not new feature systems).

- **Landy (OG):** dignified presence-first hub; no gimmicks; empty state treats quiet as anticipation.
- **Maria Elena (Keeper):** Board voice feels like a family gathering; Tonight reads like a ritual, not a push notification.
- **Danny (Competitor):** Tonight is always visible; presence shows who’s serious (later: opt-in status).
- **Carmen (Connector):** warmth + “all levels welcome” undertone; never forces chat participation.
- **Alex / Gaby (Regional + excellence):** defer to opt-in tags/badges later; do not gate the room now.

---

## Phased Plan (No Build Yet)

### Phase 0: Spec Lock (1 doc pass)
- Define exact behaviors for the 3 states (Ticker/Peek/Full) and transitions.
- Write the “first 5 seconds in the room” sequence (threshold -> Who’s here -> Tonight -> prompt).
- Finalize copy system: entrances, empty states, CTAs, and Board tone.

**Deliverable:** this plan + a 1-page UX spec addendum (can live in `DOCS/PLANS/la-mesa-plan.md`).

### Phase 1: Hub UX Flows
- Presence interactions: open list, tap user, LFG toggle rules (peek-safe).
- Board interactions: read-only vs expand; what “official” means.
- Tonight interactions: what is tappable (map link? add-to-calendar later?).

**Deliverable:** flow notes + acceptance criteria per module.

### Phase 2: Content & Ownership
- Decide who publishes Board items (source + cadence).
- Define Tonight fields and where they come from (single source of truth).
- Decide what is “system generated” vs “human posted.”

**Deliverable:** content schema + publishing rules.

### Phase 3: QA + Success Criteria
- “Hub feel” test: presence visible immediately, Tonight scannable in < 2 seconds, Board reads official.
- “Second screen” test: Peek mode never blocks core tasks; Full mode feels earned.
- “Trust” test: counts never contradict (in-room vs active today vs ticker).
- “Vision tests” pass: Room Test + Abuela Test + Broadcast Test + Volume Test.

**Deliverable:** checklist + test scenarios.

---

## MVP Specs (So We Don’t Overcomplicate)

Module 1: Who’s here + LFG
- Show first ~10 people, then “+X more” (fast scan, not overwhelming).
- Tap a person -> prefill `@Name` in composer (one-step social action).
- LFG is a badge + optional subtle glow; no matchmaking, no notifications (yet).
- Presence preview lives in a **horizontal seat strip** (flags/avatars) instead of a left rail.

Module 2: The Board
- Launch with **admin-only** publishing; keep it quiet and official.
- Keep it small: **1 pinned item + up to 2 recent** (max 3 visible).
- Tone: broadcast lower-third, warm, non-corporate.

Module 3: Tonight / Next up
- Source of truth: **Tournament I** details (manual is fine).
- Countdown updates **per minute** (not seconds).
- Confirmation state: “You’re registered” (if applicable) is calm reassurance, not hype.

Performance rules (second-screen protection)
- No heavy animations inside the hub; collapses/expands must feel instant.
- Lists and counters never jank; prefer fewer items over more “features.”
- No emoji-driven UI (use bone/pip language + typography instead).

---

## Open Questions (Answer Before Building)

- What is Tournament I’s canonical “Tonight” data (final time/call time/venue address string)?
- Does the Board support multiple items or a single pinned item at launch?
- What is the official entrance announcement copy (simple + dignified)?
- Do we explicitly bless a ticker-only typography exception (if any), or enforce design-system fonts everywhere?

---

## Delights To Defer (Good Ideas, Not Phase 1)

These are promising, but they will complicate the hub if we do them now:

- “Regulars” recognition streaks
- “Tonight I bring…” prompt ritual
- Active-hours heat map
- Table memory / personal history dashboard
- Ambient “sound of the room”
- First-time welcome message (beyond minimal, non-spam acknowledgment)
- Public skill ratings (default off; opt-in later if ever)

---

## Docs To Update After We Decide + Build

- `DOCS/DECISION RECORDS/ADR-002-la-mesa-features.md` (reflect hub-first IA + CTA language)
- `TEAM/SESSIONS/2026-01-26-la-mesa-worklog.md` (append-only execution log)
