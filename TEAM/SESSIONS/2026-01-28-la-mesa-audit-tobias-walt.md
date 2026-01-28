# La Mesa Comprehensive Audit
## Tobias van Schneider (Chief Product Designer) + Walt Disney (Chief Experience Architect)
**Date:** January 28, 2026  
**Scope:** Full La Mesa Hub Analysis — What's Built, What's Missing, What Must Ship

---

## Executive Summary

La Mesa has evolved from a chat widget into a true **community hub**. The foundation is strong—the ticker broadcasts, the hub modules create hierarchy, and the entry ritual feels earned. But there are gaps between what we envisioned (ADR-002) and what's implemented. Most critically: **reactions are missing**, **The Board is hardcoded**, and **some P0 items from January 23 are still outstanding**.

**Tobias's Verdict:** *"The room is real. But it's missing the micro-moments that make people screenshot. We need reactions. We need The Board to feel alive, not static."*

**Walt's Verdict:** *"The journey works—queue to entry to hub. But the 'locker room' energy is quiet. We need the domino button to pulse. We need people to feel the anticipation."*

---

## The Good (What's Working)

### 1. The Hub Architecture ✅
The three-module stack creates clear hierarchy:
- **Who's Here:** Presence is the heartbeat. The horizontal seat strip works.
- **The Board:** Positioned correctly as broadcast/official channel.
- **Tonight:** Ritual keeper with countdown. Human-readable format (no `122:` hours).

### 2. Entry Ritual ✅
The Claim Your Seat flow now feels ceremonial:
- Flag runway with scroll-to-select
- CTA pinned and visible
- Hub-first landing (Who's Here / Tonight visible immediately)
- Entrance announcement: "Jordan pulled up a chair"

### 3. Ticker Vibes ✅
- Broadcast energy is strong
- Live count + spots remaining creates urgency
- Seamless scroll animation
- Default content shows immediately (no empty state)

### 4. Second-Screen Protection ✅
- Peek mode stays chat-first
- Full mode stays hub-first
- No forced focus that scroll-jumps

### 5. Team Formation UI ✅
- Modal with 8 archetypes implemented
- Toast notifications for invites
- Archetype selection has weight (hover states, selected state)

---

## The Gaps (What's Missing)

### 🔴 CRITICAL (P0) — Tournament I Blockers

| Feature | Status | Impact | Notes |
|---------|--------|--------|-------|
| **Reactions System** | ❌ NOT IMPLEMENTED | HIGH | 🔥😂👏💪🌴🀱 should be available on every message. Currently: nothing. |
| **The Board (Dynamic)** | ⚠️ HARDCODED | HIGH | Content is static HTML. Needs Supabase connection for real announcements. |
| **Domino Button Pulse** | ❌ NOT IMPLEMENTED | MEDIUM | Idle pulse was P0 on Jan 23. Still missing. Button feels "dead" when static. |
| "DEAL ME IN" CTA | ❌ "Enter" | LOW | ADR-002 called for "DEAL ME IN". We have "Enter". Acceptable but not ideal. |

**Tobias:** *"Reactions are non-negotiable. They're how the room breathes without words."*

**Walt:** *"The Board being static is like a newspaper from last week. It needs to feel alive."*

---

### 🟡 IMPORTANT (P1) — Polish Before Tournament

| Feature | Status | Impact | Notes |
|---------|--------|--------|-------|
| **Regional Tags** | ❌ NOT IMPLEMENTED | MEDIUM | "North Jersey", "Miami" badges. Personas (Alex) requested this. |
| **Exit Confirmation Copy** | ⚠️ PARTIAL | LOW | "Leave the Table?" vs "Walk away from the table?" Current is acceptable. |
| **Background Dim on Open** | ❌ NOT IMPLEMENTED | LOW | 5% dim was planned. Not critical but adds depth. |
| **LFG Toggle Integration** | ⚠️ UI ONLY | MEDIUM | Button exists but unclear if it broadcasts/status updates. |

---

### 🟢 PHASE 2+ (Future)

| Feature | Status | Phase | Notes |
|---------|--------|-------|-------|
| Challenge Button | ❌ NOT IMPLEMENTED | Phase 2 | Needs MyFicha integration |
| Game Result Announcements | ❌ NOT IMPLEMENTED | Phase 2 | Auto-post from MyFicha |
| Player Cards / Stats | ❌ NOT IMPLEMENTED | Phase 3 | Tap name to see record |
| Spectator Mode | ❌ NOT IMPLEMENTED | Phase 4 | Watch live games |
| Voice Rooms | ❌ NOT IMPLEMENTED | Phase 4 | Audio chat appetite test first |

---

## Detailed Analysis by Area

### 1. The Board (Critical Issue)

**Current State:**
```html
<div class="mesa-board-item mesa-board-item--priority">
  <div class="mesa-board-item__kicker">Tournament Update</div>
  <div class="mesa-board-item__title">REGISTRATION 75% COMPLETE</div>
  ...
</div>
```

**Problem:** This is hardcoded HTML. It's not 75% complete. It's misleading.

**Tobias:** *"Static content in a broadcast module is worse than empty. It's a lie."*

**Walt:** *"The Board should feel like a living announcement system. Right now it's a prop."*

**Fix Required:**
- Connect to Supabase `announcements` table
- Admin publishes via La Oficina
- Real-time updates via Supabase subscriptions
- Fallback to "No announcements yet. The table's open." when empty

---

### 2. Reactions System (Critical Issue)

**Current State:** No reactions. Users can only type messages.

**ADR-002 Approved Set:**
| Reaction | Meaning | Status |
|----------|---------|--------|
| 🔥 | Fuego / Fire | ❌ Missing |
| 😂 | Jaja / Laughter | ❌ Missing |
| 👏 | Respeto / Respect | ❌ Missing |
| 💪 | Fuerza / Strength | ❌ Missing |
| 🌴 | Cuba / Island pride | ❌ Missing |
| 🀱 | La Ficha / The Slam | ❌ Missing (P0) |

**Tobias:** *"The personas rejected lingo buttons (Pollona, Capicúa) but approved simple reactions. These are ambient, not performative. They let the room breathe."*

**Implementation Notes:**
- Add reaction bar below each message
- Store reactions in `message_reactions` table
- Optimistic UI update
- Limit to one reaction per user per message
- 🀱 is the "signature" reaction—domino tile emoji

---

### 3. Domino Button Pulse (Overdue)

**ADR-002 Status:** P0, marked "11 days overdue"

**Current State:** Button is static. No idle animation.

**Tobias's Spec:**
- Subtle heartbeat pulse when idle (2s rhythm)
- NOT a demand for attention—more like breathing
- Pause when chat is open
- CSS-only if possible (performance)

**CSS Approach:**
```css
.mesa-ticker__chat-btn:not(.is-pressed):not(:hover) {
  animation: dominoPulse 2s ease-in-out infinite;
}

@keyframes dominoPulse {
  0%, 100% { transform: scale(1); box-shadow: 0 2px 8px rgba(0,0,0,0.3); }
  50% { transform: scale(1.02); box-shadow: 0 4px 12px rgba(183,106,59,0.2); }
}
```

---

### 4. Tonight Module ✅ (Working Well)

**Status:** Implemented correctly.

**What's Working:**
- Canonical data from `src/lib/event.ts`
- Human-readable countdown (no `122:` bug)
- Venue + call time accurate
- Countdown updates per minute (calm, not frantic)

**Walt:** *"This is the ritual keeper. It anchors the room to real time."*

---

### 5. Who's Here + LFG ✅ (Working Well)

**Status:** Implemented.

**What's Working:**
- Horizontal seat strip (flags)
- Presence list sheet (tap status to open)
- LFG toggle UI exists
- "+X more" when many players

**Question:** Does LFG toggle actually broadcast status to other players? Needs verification.

---

### 6. Chat Experience ✅ (Working Well)

**Status:** Solid implementation.

**What's Working:**
- Message stagger animation (0/50/100ms)
- Self-messages have brass tint
- Pinned messages section ("HONORED")
- "THE SLAM" on send (scale 0.92 + haptic)
- Rotating placeholder ("Habla...", "Tu turno...")
- Entrance announcements ("pulled up a chair")

**Tobias:** *"The message weight is there. The stagger makes voices feel distinct."*

---

## Copy Audit

### What's Right
- "Habla..." placeholder (Lin-Manuel approved)
- "pulled up a chair" (entrance announcement)
- "The calm before the storm." (empty state)
- "Who's Here" (not "Online Users")
- "The Board" (not "Announcements")
- "Tonight" (not "Event Details")

### What Needs Attention
| Current | ADR-002 Target | Status |
|---------|----------------|--------|
| "Enter" | "DEAL ME IN" | Acceptable |
| "Leave the Table?" | "Walk away from the table?" | Acceptable |
| "LAMESA" (ticker badge) | "LA MESA" (spaced) | Fixed |

---

## Design System Compliance

### ✅ Following the Bone Language
- 12px bone radius on major surfaces
- 8px carved radius on inner elements
- Copper → brass → gold gradient hierarchy
- IBM Plex Sans (body), Bodoni Moda (display), SF Sports Night (broadcast)

### ⚠️ Exceptions to Document
| Exception | Location | Rationale |
|-----------|----------|-----------|
| SF Sports Night font | La Mesa badge, ticker, headers | Broadcast energy (blessed exception) |
| 2px button radius (not 12px) | CTA buttons | Match form buttons for consistency |

---

## The Tests (Do We Pass?)

### Tobias's Room Test
1. **Room vs hallway?** ✅ It's a room. Hub-first layout creates "place."
2. **Screenshot-worthy?** ⚠️ Close. Reactions would push it over.
3. **Weight or floating?** ✅ Buttons have slam. Messages have stagger.
4. **Room feel alive?** ⚠️ Ticker helps. Reactions + live Board would complete.

### Walt's Journey Test
1. **Feel earned?** ✅ Registration → Claim Seat → Enter. Clear gates.
2. **Clear weenie?** ✅ Ticker chat button pulses (should pulse more).
3. **Locker room energy?** ⚠️ The Board being static hurts this.
4. **Would someone brag?** ✅ "I'm in La Mesa" has status.
5. **Serve returners + discoverers?** ✅ Entry ritual works for both.

### Daisy's Abuela Test
1. **Recognize as her table?** ✅ Warmth, flags, no "tech UI."
2. **Know how to participate?** ⚠️ Reactions would help (simpler than typing).
3. **Feel warm?** ✅ Colors, language, presence-first.
4. **Pass tía's house test?** ✅ No corny lingo buttons.

### Steve's Broadcast Test
1. **Broadcast-worthy?** ⚠️ The Board should be the "lower third." Needs to be live.
2. **Ticker energy?** ✅ Strong. ESPN vibe is there.

---

## Recommendations (Prioritized)

### Before Tournament I (Must Ship)

1. **Implement Reactions System** (2-3 days)
   - Database schema: `message_reactions` table
   - UI: Reaction bar below each message
   - Optimistic updates
   - 🀱 domino reaction is the signature moment

2. **Connect The Board to Supabase** (1-2 days)
   - Read from `announcements` table
   - Real-time subscription
   - Admin publishing via La Oficina
   - Empty state: "No announcements yet. The table's open."

3. **Add Domino Button Pulse** (2 hours)
   - CSS idle animation
   - Pause when chat open
   - Subtle—not demanding

4. **Verify LFG Toggle Functionality** (1 day)
   - Does it broadcast to other players?
   - Should show LFG badge in presence list

### Post-Tournament I (Polish)

5. **Regional Tags** (P1)
   - "North Jersey", "Miami" badges
   - Personas requested this

6. **Background Dim on Open** (P2)
   - 5% brightness filter on `.story`
   - Creates depth

7. **Exit Confirmation Copy** (P3)
   - "Walk away from the table?" if time permits

---

## ADR-002 Update Required

The decision record needs significant updates to reflect reality:

### Status Corrections Needed

| Feature | ADR-002 Status | Actual Status |
|---------|----------------|---------------|
| Reactions (🔥😂👏💪🌴) | "✅ Implemented" | ❌ NOT IMPLEMENTED |
| 🀱 Domino reaction | "❌ NOT YET (P0)" | ❌ NOT IMPLEMENTED |
| "DEAL ME IN" button | "❌ P0" | ❌ "Enter" used instead |
| Entrance announcements | "❌ P0" | ✅ IMPLEMENTED |
| Domino button pulse | "❌ Not implemented (11 days overdue)" | Still overdue |
| Background dim | "❌ Not implemented" | ❌ Still not implemented |
| Regional tags | "❌ Not implemented" | ❌ Still not implemented |

**Tobias:** *"We need to be honest about what's shipped. ADR-002 should be the source of truth, not aspirational."*

---

## Final Thoughts

**Tobias:**
> "La Mesa is 85% there. The foundation is solid—the room exists, the hierarchy works, the entry ritual feels earned. But that last 15% is the difference between 'functional' and 'magical.' Reactions. The Board being live. The button breathing. These aren't features. They're the room's heartbeat."

**Walt:**
> "The journey from scroll to entry to hub is working. People feel like they've arrived somewhere. But once they're inside, the room needs to stay alive. The Board can't be a prop. The button can't be static. We promised a locker room before the fight—it needs to feel like there's a fight coming."

**Both:**
> "Ship reactions. Ship The Board live. Make the button pulse. Then we've got something special."

---

## Action Items

| # | Task | Owner | ETA |
|---|------|-------|-----|
| 1 | Reactions system implementation | Engineering | Jan 29 |
| 2 | The Board Supabase integration | Engineering | Jan 29 |
| 3 | La Oficina announcement publishing | Engineering | Jan 29 |
| 4 | Domino button pulse animation | Engineering | Jan 28 |
| 5 | Update ADR-002 with actual status | Product | Jan 28 |
| 6 | LFG toggle functionality verification | QA | Jan 29 |
| 7 | Full flow regression test | QA | Jan 30 |

---

*"La mesa te espera. But the room needs a heartbeat."*
