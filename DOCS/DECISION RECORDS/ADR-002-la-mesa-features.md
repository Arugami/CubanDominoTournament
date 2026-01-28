# ADR-002: La Mesa Features — Master Decision Record

**Status:** Active
**Date Created:** 2026-01-23
**Last Updated:** 2026-01-28 (Comprehensive audit completed — see bottom of document)
**Owners:** Tobias van Schneider (Chief Product Designer) + Walt Disney (Chief Experience Architect)
**Related:** [ADR-001-mesa-ticker.md](./ADR-001-mesa-ticker.md)

---

## Context

This document consolidates ALL La Mesa features, ideas, and decisions from the full CDL Dream Team. It captures what was brainstormed, what was approved, what was rejected, and why—creating a single source of truth for La Mesa's evolution.

**Sessions Referenced:**
- Jan 12, 2026 — La Mesa Chat Redesign (Wifredo, George, Wes)
- Jan 19, 2026 — La Mesa Vision (Full Team + Personas)
- Jan 23, 2026 — La Mesa UX Audit (Tobias + Walt joint review)

---

## La Mesa's Mission

> "La Mesa isn't a chat widget. It's the digital back room of Mr. Garcia Cigars where the community gathers between games."

The chat feature is called "La Mesa" — *The Table*. It exists for registered players to connect, talk trash, build rivalries, and feel the competitive energy before tournaments begin.

---

## The Three Pillars of La Mesa

*Established Jan 19, 2026*

### Pillar 1: THE GATHERING PLACE
Where players check in daily. Where you see who's around. Where news and trash talk flow. The digital porch of the community.

### Pillar 2: THE BRIDGE TO THE GAME
When MyFicha launches, La Mesa becomes where tournament drama unfolds. Rankings visible. Challenges issued. Results celebrated. The competitive heartbeat of CDL.

### Pillar 3: THE RITUAL KEEPER
Daily prompts. Player spotlights. Heritage moments. Tournament countdowns. Victory celebrations. The heartbeat of the community.

---

## The Aesthetic Balance

| Percentage | Influence | Feel |
|------------|-----------|------|
| **40%** | Cuban Heritage | Cultural warmth, tradition, pride — without the heavy lounge |
| **35%** | ESPN/UFC Broadcast | Modern, sporty, competitive, LOUD when it matters |
| **25%** | Domino Ritual | The game, the slam, the bones |

---

## Full Team Brainstorm

*Each team member contributes ideas in their voice, organized by their area of expertise.*

---

### DANA WHITE (CEO) — Competition & Locker Room Energy

> "La Mesa is the LOCKER ROOM. Before UFC fights, the cameras follow fighters in the back. That tension, that energy—La Mesa should be where rivalries simmer."

**Dana's Ideas:**

| Feature | Description | Status |
|---------|-------------|--------|
| Locker room atmosphere | La Mesa should feel like the pre-fight space where tension builds | ✅ Approved (tonal direction) |
| Public rivalries | "I'll see you at the table tonight" moments | 🔜 Future (needs MyFicha) |
| LOUD victories | When someone wins big, the celebration should be a MOMENT, not a notification | 🔜 Future (needs MyFicha) |
| Player star potential | Identify and elevate players with "IT" factor | 🔜 Future (tournament integration) |

**Dana's Test:** *"Does this feel like the locker room before a fight?"*

---

### JAY-Z (Chief Brand Officer) — Status & Being Seen

> "La Mesa is the 40/40 Club for dominos. It's not just where you chat—it's where you're SEEN."

**Jay-Z's Ideas:**

| Feature | Description | Status |
|---------|-------------|--------|
| Status visibility | Player with 50 wins should feel different than someone with 5 | 🔜 Future (needs stats system) |
| Same table, earned seats | Everyone enters, but status is earned IN PUBLIC | ✅ Approved (tonal direction) |
| Who's online presence | Show who's in the room at all times | ✅ Approved |
| Exclusive energy, accessible entry | You're not special until you DO something | ✅ Approved (philosophy) |

**Jay-Z's Test:** *"Is there status to be earned? Can you be SEEN here?"*

---

### TOBIAS VAN SCHNEIDER (Chief Product Designer) — Room vs Hallway

> "Right now La Mesa is a hallway. We need to make it a ROOM. Make messages arrive like someone sitting down. Make the room breathe."

**Tobias's Ideas:**

| Feature | Description | Status |
|---------|-------------|--------|
| Room not hallway | Space you stay in, not pass through | ✅ Core philosophy |
| Ambient life | Who just won, who's looking for partner, what's happening in 10 minutes | 🔜 Phase 2 |
| Messages as arrivals | Staggered animation (0/50/100ms) | ✅ Implemented |
| Notification sounds | Should feel like domino placed, not a ding | 🔜 Future (audio design) |
| Presence pulse | Indicators should pulse like breathing, not blink like a router | 🔜 Polish |
| Domino button lift | 2-4px rise on hover, shadow spread | ❌ Not implemented |
| Domino button pulse | Heartbeat rhythm when idle | ❌ Not implemented (11 days overdue) |
| Send button slam | Scale(0.92) on press | ✅ Implemented |
| Physical digital feel | Buttons should feel pressed, not clicked | ✅ Partially implemented |

**Tobias's Tests:**
1. Does this make La Mesa feel more like a room or more like a hallway?
2. Would someone screenshot this moment?
3. Does the interaction have weight, or is it floating?
4. Does the room feel alive?
5. Does it speak the language of Cuban dominos?

---

### WALT DISNEY (Chief Experience Architect) — Earned Entry & The Weenie

> "At Disneyland, we learned that the queue IS the ride. What happens before the experience shapes how you feel during it."

**Walt's Ideas:**

| Feature | Description | Status |
|---------|-------------|--------|
| Earned entry | Domino button only appears after registration | ✅ Implemented |
| The weenie | Button should CALL you in, not just sit there | ❌ Needs pulse (11 days overdue) |
| Threshold moment | When panel opens, 5% background dim + darkness bloom | 🔜 P2 Polish |
| Competition is the show | ESPN/UFC energy first, exclusivity subtle | ✅ Tonal direction |
| Anticipatory design | Empty states should build excitement, not disappoint | 🔜 P1 |
| Queue magic | Scroll panels earn the registration | ✅ Implemented |
| Show who's at the table | Flags of seated players in identity screen | 🔜 P1 New |

**The Club 33 Principle (Subtle Undertone):**

While the ENERGY is competition-first, the STRUCTURE borrows from Club 33:

1. **You can't just walk in** — Registration is the queue
2. **The door is earned** — Domino button only appears after registration
3. **Inside is different** — La Mesa is a separate space, a room
4. **Members feel special** — You're part of something before the event
5. **Word of mouth** — "Have you joined La Mesa yet?"

> "This is NOT about mystery or mystique. It's about EARNING YOUR SPOT."

**Walt's Tests:**
1. Does this moment feel EARNED?
2. Is there a clear weenie to the next action?
3. Is the competitive/locker room energy present?
4. Would someone brag about being here?
5. Does it serve both returners AND discoverers?

---

### WIFREDO LAM (Artistic Director) — Cuban Soul & Ancestors

> "The ancestors are at La Mesa. Not literally—but the feeling. When someone enters, it should feel like joining a table that's been playing for 100 years."

**Wifredo's Ideas:**

| Feature | Description | Status |
|---------|-------------|--------|
| Sacred table feeling | The table remembers, ancestors watching | ✅ Tonal direction |
| Flag selection glow | Candle-light golden glow, like Ochún | ⚠️ Partial (glow yes, pulse no) |
| Threshold moments | Elegguá guards the crossroads, gentle fade-in entry | 🔜 P2 |
| Background texture | Aged paper, tobacco leaf patterns—subtle | ✅ Smoke texture implemented |
| Messages arrive like smoke | Entrance animation like entering a room | ✅ Staggered animation |
| Spiritual color palette | Gold/brass (Ochún), deep warmth | ✅ Implemented |
| "For those who know" subtlety | Orishas don't speak, but presence is felt | ✅ Philosophy |

**Wifredo's Test:** *"Would the ancestors recognize this table?"*

---

### GEORGE LOIS (Advertising Director) — LOUD Moments

> "PUT THE ACTION IN THEIR FACE. When someone wins, don't whisper—SCREAM. The dominos aren't quiet when they slam. Neither should La Mesa."

**George's Ideas:**

| Feature | Description | Status |
|---------|-------------|--------|
| LOUD victories | Visual explosion when big things happen | 🔜 Future (MyFicha) |
| Enter button text | "ENTER" → "DEAL ME IN" | ❌ Not implemented (11 days overdue) |
| Trash talk reactions | 🤫 "I see your hand", 💀 "You're done" | ❌ Rejected by personas |
| Entrance announcements | "X has entered the table" — make entrances MATTER | ❌ Not implemented (11 days overdue) |
| LA MESA pulse | Button should DEMAND attention | ❌ Not implemented (11 days overdue) |
| Send as SLAM | Quick scale-down, satisfying | ✅ Implemented |

**George's Volume Test:**

| Event Type | Volume Level | Example |
|------------|--------------|---------|
| Quiet | Someone joins | "X pulled up a chair" |
| Medium | Challenge issued | "X just called out Y" |
| LOUD | Game won | "X DESTROYED Y • POLLONA • 150-67" |
| CELEBRATION | Tournament win | Full animation, confetti, broadcast |

---

### WES ANDERSON (Visual Style Director) — Composition & Color

> "The composition matters. Right now La Mesa is functional but not *framed*. The chat window should feel like a scene from a film."

**Wes's Ideas:**

| Feature | Description | Status |
|---------|-------------|--------|
| Symmetrical framing | Where possible, center and balance | ✅ Partially applied |
| "Est. 2025" detail | Charming, keep it | ✅ Implemented |
| Panel animation easing | cubic-bezier(0.34, 1.56, 0.64, 1) — overshoot, settle | ✅ Implemented |
| Color hierarchy | Who is speaking visible through color alone | ✅ Brass tints for self |
| System message styling | Different from human messages | 🔜 P2 |
| Timestamps | Small caps, not uppercase | 🔜 Polish |
| Flag layout | Single centered row (desktop), scroll (mobile) | ✅ Implemented |
| Message stagger | 0/50/100ms entry rhythm | ✅ Implemented |

**Wes's Test:** *"Is every element placed with intention? Would this be a frame in a film?"*

---

### LIN-MANUEL MIRANDA (Lyricist) — Copy That Sounds Spoken

> "'X joined the table' is fine. 'X pulled up a chair' is better. Every piece of copy should feel like it was spoken at a real table."

**Lin-Manuel's Ideas:**

| Feature | Description | Status |
|---------|-------------|--------|
| "Habla..." placeholder | Changed from "Speak..." | ✅ Implemented |
| Rotating placeholder | "Habla...", "Tu turno...", "Dilo...", "Speak..." | ✅ Implemented |
| "DEAL ME IN" button | Instead of "Enter" — active, not passive | ❌ Not implemented (11 days overdue) |
| "X pulled up a chair" | Entrance announcement copy | ❌ Not implemented |
| Code-switching | Languages blend mid-sentence, like real tables | 🔜 Philosophy |
| Victory copy | "X won" → "X just sent Y home empty" | 🔜 Future (MyFicha) |
| Silence as tool | Build pauses into animation timing | ✅ Applied to panel sequences |

**Lin-Manuel's Test:** *"Does it sound right when you say it out loud?"*

---

### DAISY EXPÓSITO-ULLA (Head of Marketing) — The Abuela Test

> "La Mesa has to pass the abuela test. If Maria Elena's grandmother walked in, would she recognize it as HER table?"

**Daisy's Ideas:**

| Feature | Description | Status |
|---------|-------------|--------|
| Abuela-recognizable | Both generations should understand warmth | ✅ Tonal direction |
| Multi-generational | OGs and newcomers, same table | ✅ Philosophy |
| Language test | If you wouldn't say it at tía's house, don't put it in La Mesa | ✅ Copy guideline |
| Community over competition alone | The soul is in the community, not just the game | ✅ Three Pillars |
| North Jersey recognition | "Havana on the Hudson" deserves respect | ✅ Regional tags approved |

**Daisy's Abuela Test:**
- Would abuela recognize this as her table?
- Would she know how to participate?
- Does it feel warm, not cold?
- Does it pass the "tía's house" language test?

---

### STEVE LIPSCOMB (Broadcast Director) — La Mesa as Broadcast

> "La Mesa is a BROADCAST. Think of it like the World Poker Tour lounge camera. Who's talking, who's watching, who's about to play."

**Steve's Ideas:**

| Feature | Description | Status |
|---------|-------------|--------|
| Documentary energy | La Mesa is the documentary happening in real-time | ✅ Philosophy |
| Drama visibility | Challenges issued publicly, results announced | 🔜 Future (MyFicha) |
| Storylines emerge | The fighter walked in, the room reacts | 🔜 With entrance announcements |
| Spectator mode | Watch live games from La Mesa | 🔜 Phase 4 |
| Reactions capture | The best content is the FACES, the moments between hands | 🔜 Future concept |

**Steve's Test:** *"Is this moment broadcast-worthy? Would someone tune in for this?"*

---

### JOSÉ RAÚL CAPABLANCA (Commissioner) — Fair Play & Integrity

> "Integrity. I watch for collusion, for signals between partners who shouldn't be partnering. I ensure the game is pure."

**Capablanca's Ideas:**

| Feature | Description | Status |
|---------|-------------|--------|
| Competitive integrity | La Mesa should feel like a space where fair play matters | ✅ Philosophy |
| Class standard | Talk trash, but shake hands after | ✅ Terms acceptance |
| Moderation presence | Bad actors can be addressed | 🔜 Future (moderation tools) |
| Champion standards | CDL players carry themselves with class | ✅ Cultural expectation |

**Capablanca's Test:** *"Does this serve the purity of competition?"*

---

### BENNY BINION (Head of Tournament Ops) — Practical Tournament Features

> "The format's gotta have stakes. Not just money—pride. Elimination. You lose, you're out. You win, you're a legend."

**Benny's Ideas:**

| Feature | Description | Status |
|---------|-------------|--------|
| Tournament mode | Special UI during tournament days | 🔜 Phase 4 |
| Live bracket visibility | See where you stand in La Mesa | 🔜 Future (tournament integration) |
| Event countdown | Tournament countdowns build hype | 🔜 Phase 3 |
| Stakes visibility | What's on the line should be clear | 🔜 Future |
| Time pressure energy | The tension of competition | 🔜 With MyFicha |

**Benny's Test:** *"Does this make winning feel legendary and losing hurt?"*

---

## Persona Reality Check

*All 6 personas reviewed the ideas. Their feedback was decisive—especially on what got CUT.*

---

### LANDY (67, The OG) — Authenticity Filter

> "You read some documents and now you want to put '¡Pollona!' as an emoji button? When I yell 'Pollona!' at the table, it's because I just DESTROYED someone. It comes from HERE *[taps chest]*. It's not a button you press."

**Landy's Verdicts:**

| Item | Verdict | Quote |
|------|---------|-------|
| Lingo emoji reactions (🐔, 🎯) | ❌ REJECTED | "Corny. We're not a theme park." |
| Phrase of the day | ❌ REJECTED | "This isn't Spanish class." |
| Lingo tooltips | ❌ REJECTED | "If you don't know, learn by playing." |
| Regional tags | ✅ APPROVED | "I want to know where someone's from." |
| See who's at the table | ✅ APPROVED | "Show me the people, not the features." |
| Keep 🀱 domino reaction | ✅ APPROVED | "The slam is universal." |

---

### MARIA ELENA (41, The Keeper) — Family & Legacy Lens

> "La Mesa should feel like part of the chain—grandfather to father to me to my son. Not a break from it."

**Maria Elena's Verdicts:**

| Item | Verdict | Quote |
|------|---------|-------|
| Lingo reactions | ❌ REJECTED | "You can't bottle organic celebration." |
| Optional tooltips | ⚠️ CONDITIONAL | "For my son who's learning. But optional." |
| Entrance announcements | ✅ APPROVED | "Simple. Just the name." |
| Multi-generational feel | ✅ APPROVED | "OGs and newcomers, same table." |
| Focus on presence | ✅ APPROVED | "People, not features." |

---

### DANNY (28, The Competitor) — Competition Features

> "The locker room energy you keep talking about? That's not emojis and tooltips. That's presence. Tension. Knowing that the guy you're about to play is sitting RIGHT THERE in the chat."

**Danny's Verdicts:**

| Item | Verdict | Quote |
|------|---------|-------|
| Lingo reactions | ❌ REJECTED | "Feels like a video game quick chat. Cringe." |
| Tooltips | ❌ REJECTED | "I'll learn by playing, not reading definitions." |
| OG badges | ⚠️ CONDITIONAL | "Maybe? If it's earned, not just given." |
| Regional tags | ✅ APPROVED | "Hell yes. Jersey vs Miami. Let's go." |
| Stats/rankings | ✅ APPROVED | "When are those coming?" |
| Player presence | ✅ APPROVED | "Show me who's online. Show me my rivals." |

---

### CARMEN (52, The Connector) — Community Warmth

> "What I actually want is to feel the PEOPLE. When I open La Mesa, I want to see faces. Well, flags. Names. Who's talking. Who's laughing. The energy."

**Carmen's Verdicts:**

| Item | Verdict | Quote |
|------|---------|-------|
| Lingo reactions | ❌ REJECTED | "Ordering emotions from a menu isn't Cuban." |
| Discoverer onboarding | ⚠️ CONDITIONAL | "Be gentle. Don't make it feel like a tutorial." |
| Regional tags | ✅ APPROVED | "Where you're from matters." |
| People over features | ✅ APPROVED | "Fill the room with life, not buttons." |
| Entrance announcements | ✅ APPROVED | "I want to greet people when they come in." |

---

### ALEX (34, North Jersey) — Regional Pride

> "Jersey vs Miami. Real regional pride. When I log into La Mesa, I want to see a count. How many North Jersey players are online? How many Miami? Make it competitive. Make it VISIBLE."

**Alex's Verdicts:**

| Item | Verdict | Quote |
|------|---------|-------|
| Lingo reactions | ❌ REJECTED | "We don't need training wheels for trash talk." |
| Phrase of the day | ❌ REJECTED | "This isn't a museum." |
| Regional tags | ✅ APPROVED | "MAKE IT VISIBLE. Jersey vs Miami scoreboard." |
| Simple presence | ✅ APPROVED | "Names, flags, who's online. That's it." |
| Let users talk | ✅ APPROVED | "We'll handle the trash talk ourselves." |

---

### GABY (31, Miami Competitor) — Substance Over Style

> "What I want from La Mesa is simple: who's there, who's good, and when's the next game. That's it."

**Gaby's Verdicts:**

| Item | Verdict | Quote |
|------|---------|-------|
| Lingo reactions | ❌ REJECTED | "My abuelo would cringe." |
| Phrase of the day | ❌ REJECTED | "We're not here to learn vocabulary." |
| Tooltips | ⚠️ CONDITIONAL | "Only if VERY subtle. And optional." |
| Entrance announcements | ✅ APPROVED | "Keep it simple. No animations." |
| Regional tags | ✅ APPROVED | "Miami needs to be represented." |
| Focus on presence | ✅ APPROVED | "Get people in the room. Everything else follows." |

---

## Feature Categories

### Presence & Identity

| Feature | Description | Status | Priority |
|---------|-------------|--------|----------|
| Flag selector | 7 heritage flags | ✅ Implemented | — |
| Flag glow on select | Golden glow effect | ✅ Implemented | — |
| Flag pulse on select | Confirmation pulse | ⚠️ Partial | P1 |
| Name dropdown | Registered players list | ✅ Implemented | — |
| Live player count | "4 at the table" | ✅ Implemented | — |
| Seated player flags | Show WHO is at the table (not just count) | ❌ Not implemented | P1 |
| Regional tags | North Jersey, Miami, Tampa, etc. | ❌ Not implemented | P1 |
| Regional presence counts | "3 from Jersey, 5 from Miami online" | ❌ Not implemented | P2 |

---

### Entry & Exit

| Feature | Description | Status | Priority |
|---------|-------------|--------|----------|
| Earned entry | Domino button only after registration | ✅ Implemented | — |
| "DEAL ME IN" button | Active language, not passive "Enter" | ❌ Not implemented | **P0** |
| Entrance announcements | "X pulled up a chair" | ✅ IMPLEMENTED | — |
| Panel open animation | 0.35s overshoot easing | ✅ Implemented | — |
| Panel close animation | 0.25s ease-out | ✅ Implemented | — |
| Background dim on open | 5% dim when chat panel opens | ❌ Not implemented | P2 |
| Darkness bloom | 200ms threshold feeling on entry | ❌ Not implemented | P2 |
| Exit confirmation copy | "Walk away from the table?" | ❌ Not implemented | P3 |

---

### Messaging & Reactions

| Feature | Description | Status | Priority |
|---------|-------------|--------|----------|
| Brass tint for self messages | Gold avatar border, warm background | ✅ Implemented | — |
| Staggered message animation | 0/50/100ms entry rhythm | ✅ Implemented | — |
| Background texture | Tobacco smoke effect | ✅ Implemented | — |
| Reactions always visible | 0.4 opacity base | ✅ Implemented | — |
| Reaction set: 🔥😂👏💪🌴 | Base reactions | ✅ Implemented | — |
| Add 🀱 domino reaction | The SLAM | ❌ Not implemented | **P0** |
| ~~Add 🐔 Pollona reaction~~ | ~~Shutout celebration~~ | ❌ REJECTED | — |
| ~~Add 🎯 Capicúa reaction~~ | ~~Perfect ending~~ | ❌ REJECTED | — |
| Send button slam | Scale(0.92) on press | ✅ Implemented | — |
| Send button scale test | Try 0.88 for more weight | ❌ Not tested | P3 |
| Rotating placeholder | "Habla...", "Tu turno...", "Dilo...", "Speak..." | ✅ Implemented | — |
| Reactions (🔥😂👏💪🌴) | Message reactions | ❌ NOT IMPLEMENTED | **P0** |
| 🀱 Domino reaction | The SLAM reaction | ❌ NOT IMPLEMENTED | **P0** |

---

### Competition Features (MyFicha Integration)

| Feature | Description | Status | Priority |
|---------|-------------|--------|----------|
| Challenge button | Challenge someone to a game | 🔜 Planned | P0 (Phase 2) |
| Game result announcements | Auto-post results with style | 🔜 Planned | P0 (Phase 2) |
| Player cards | Tap name to see stats, wins, CDS | 🔜 Planned | P0 (Phase 3) |
| Rankings visibility | See who's top ranked | 🔜 Planned | P1 (Phase 3) |
| Match notifications | "Game starting in 5..." | 🔜 Planned | P1 (Phase 2) |
| Spectator mode | Watch live games from La Mesa | 🔜 Planned | P1 (Phase 4) |
| Shared Supabase auth | Same login for CDL + MyFicha | 🔜 Planned | P0 (Phase 2) |

---

### Community Rituals

| Feature | Description | Status | Priority |
|---------|-------------|--------|----------|
| ~~Daily prompt~~ | ~~Question of the day~~ | ❌ REJECTED | — |
| ~~Phrase of the day~~ | ~~Teach Cuban domino lingo~~ | ❌ REJECTED | — |
| ~~Lingo tooltips~~ | ~~Hover explanations~~ | ❌ REJECTED (default off) | P3 optional |
| Heritage corner | Rotating cultural content, OG stories | 🔜 Planned | P2 (Phase 3) |
| Pinned moments | Admin can pin legendary plays | 🔜 Planned | P2 (Phase 3) |
| Achievement badges | Tournament winner, streak king, pollona master | 🔜 Planned | P1 (Phase 3) |
| OG badges | Only if EARNED (games played, years active) | 🔜 Conditional | P3 |

---

### Tournament Mode

| Feature | Description | Status | Priority |
|---------|-------------|--------|----------|
| Event mode UI | Special tournament day experience | 🔜 Planned | P1 (Phase 4) |
| Live bracket | See standings in La Mesa | 🔜 Planned | P1 (Phase 4) |
| Tournament countdown | Build hype to event | 🔜 Planned | P1 (Phase 3) |
| Team channels | Private spaces for tournament partners | 🔜 Planned | P2 (Phase 4) |

---

### Future Vision

| Feature | Description | Status | Priority |
|---------|-------------|--------|----------|
| Voice rooms | Audio chat for trash talk | 🔜 Testing appetite | P2 (Phase 4) |
| Historical archive | Legendary games, hall of fame | 🔜 Planned | P3 (Phase 4) |
| Discoverer onboarding | Invisible unless requested, no tutorials | 🔜 Conditional | P3 |

---

## Implementation Status Tracker

### ✅ Recently Implemented (Jan 23-28, 2026)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | Change "Enter" → "TAKE YOUR SEAT" | ✅ Done | Updated from "DEAL ME IN" per UX review |
| 4 | Add LA MESA button pulse animation | ❌ NOT DONE | Still pending (was incorrectly marked done) |
| 5 | Complete flag selection pulse animation | ✅ Done | flagClaim animation on select |
| 7 | Change empty state to "The calm before the storm." | ✅ Done | Anticipation, not absence |
| 10 | Background dim effect on panel open | ❌ NOT DONE | Still pending |
| 11 | Entrance announcements | ✅ Done | "X pulled up a chair" implemented |
| 12 | Hub stack (Who's Here / The Board / Tonight) | ✅ Done | Three-module layout working |
| 13 | Tonight countdown human format | ✅ Done | No more `122:` hours display |
| 14 | Hub-to-chat cue | ✅ Done | Brass divider + CHAT label |
| 15 | LFG toggle UI | ✅ Done | Looking for partner button exists |

### ⚠️ P1: High Priority (This Week)

| # | Item | Notes |
|---|------|-------|
| 2 | Add entrance announcements ("X pulled up a chair") | ✅ Done (Jan 28) |
| 3 | Add 🀱 domino reaction | ❌ Still pending - CRITICAL |
| 4 | Add all reactions (🔥😂👏💪🌴🀱) | ❌ Still pending - CRITICAL |
| 5 | Connect The Board to Supabase | ❌ Still pending - CRITICAL |
| 6 | Show seated player flags in identity screen | Decided against (show count instead) |
| 7 | Add LA MESA button pulse animation | ❌ Still pending - 11 days overdue |
| 8 | Add regional pride tags (North Jersey, Miami, etc.) | Future - wait for bigger community |
| 9 | Enhance player presence display | ✅ Done - Who's Here module working |

### 🔜 P2: Polish (Next Sprint)

| # | Item | Notes |
|---|------|-------|
| 11 | Empty state smoke animation | Breathing room |
| 12 | Regional presence counts | "3 from Jersey, 5 from Miami" |
| 13 | System message styling distinct from user messages | Different color grade |

### 📋 P3: Fine-Tuning (Future)

| # | Item | Notes |
|---|------|-------|
| 14 | Test send button scale (0.92 → 0.88) | More slam weight |
| 15 | Update exit confirmation copy | "Walk away from the table?" |
| 16 | Optional tooltips (OFF by default) | For discoverers who request it |
| 17 | Earned OG badges | Based on real activity, if requested |

---

## What Got Cut (And Why)

*The personas taught us: you can't manufacture Cuban culture with emoji buttons.*

| Rejected Feature | Why It Was Cut | Who Killed It |
|------------------|----------------|---------------|
| 🐔 Pollona reaction button | "You can't bottle organic celebration" | Landy, Maria Elena, Danny |
| 🎯 Capicúa reaction button | "Pre-made reactions are cringe" | Danny, Alex |
| Phrase of the day | "We're not Duolingo" | Landy, Alex |
| Lingo tooltips (as default) | "Learn by playing, not reading" | Landy, Danny, Gaby |
| Competitive keyword highlights | Over-designed | Tobias + Walt |

### The Lesson

> **"Don't manufacture culture. Create space for it to happen."**

The personas agreed: presence over features. Show real people, real flags, real names. Let the trash talk happen organically. The OGs will teach the discoverers just by being there.

---

## Tobias + Walt Oversight Summary

### The Combined Test

Before any La Mesa feature ships, ask:

**Tobias's Questions:**
1. Does this make La Mesa feel more like a room or more like a hallway?
2. Would someone screenshot this moment?
3. Does the interaction have weight, or is it floating?
4. Does the room feel alive?
5. Does it speak the language of Cuban dominos?

**Walt's Questions:**
1. Does this moment feel EARNED?
2. Is there a clear weenie to the next action?
3. Is the competitive/locker room energy present?
4. Would someone brag about being here?
5. Does La Mesa feel like the place to be before the fight?
6. Does it serve both returners AND discoverers?

### The Unified Test

> **"When someone opens La Mesa, do they forget to check their phone—feel like they've walked into somewhere they earned—and hear the language of la mesa being spoken?"**

### The Humbling Lesson

> **Tobias:** "We almost shipped lingo emoji buttons. Landy called it 'corny.' He's right. We were designing a Cuban theme park, not a Cuban table."
>
> **Walt:** "Funny—I literally built theme parks. But even I know: Disneyland works because the guests bring the magic. We just built the castle. La Mesa should be the same. Build the room. The people will fill it with life."

### The Final Philosophy

> **"Create the room. Fill it with people. Get out of the way."**

Trust the users to make it their own. The personas taught us: you can't manufacture Cuban culture with emoji buttons. You create the space and let the people bring the life.

---

## Growth Demographic Note

*Who's falling in love with Cuban dominos?*

1. **Gen Z & Millennials seeking analog experiences** — Over-screened generation finding joy in physical, social games
2. **Second/third-gen Latinos discovering roots** — Didn't learn at abuela's table, discovering it now
3. **The anti-algorithm crowd** — Hungry for games without battle passes and loot boxes
4. **Content creators** — Cuban dominos is inherently performative; the drama makes great clips

**Design implication:** La Mesa must serve BOTH:
- **Returners** (Landy, Maria Elena) who know the lingo and want to feel at home
- **Discoverers** (24-year-old in Austin) who are learning the culture as they learn the game

The OGs are the Cast Members. They show the discoverers how it's done. The room teaches itself.

---

## Appendix: Approved Reactions Set

| Reaction | Meaning | Status |
|----------|---------|--------|
| 🔥 | Fuego / Fire / Heat | ❌ NOT IMPLEMENTED |
| 😂 | Jaja / Laughter | ❌ NOT IMPLEMENTED |
| 👏 | Respeto / Respect | ❌ NOT IMPLEMENTED |
| 💪 | Fuerza / Strength | ❌ NOT IMPLEMENTED |
| 🌴 | Cuba / Island pride | ❌ NOT IMPLEMENTED |
| 🀱 | La Ficha / The Slam | ❌ NOT IMPLEMENTED (P0) |

---

## Appendix: Copy Decisions

| Element | Before | After | Status |
|---------|--------|-------|--------|
| Input placeholder | "Speak..." | "Habla..." (rotating) | ✅ |
| Enter button | "ENTER" | "Enter" (used instead of "DEAL ME IN") | ✅ Acceptable |
| Entrance announcement | None | "X pulled up a chair" | ✅ IMPLEMENTED |
| Empty state | "The table is quiet." | "The calm before the storm." | ✅ IMPLEMENTED |
| Exit confirmation | "Are you sure?" | "Leave the Table?" (close enough) | ✅ Acceptable |

---

## Next Steps

### Immediate (Clear the Debt)
1. Implement the 4 P0 items that are 11 days overdue
2. Complete the P1 items from this session
3. Update ADR-001 ticker documentation if any ticker changes needed

### This Sprint
- Regional tags system design
- Player presence enhancement
- Empty state improvements

### Future Sessions Needed
- MyFicha integration planning (when game is ready)
- Tournament mode design (Phase 4)
- Voice room appetite testing

---

## Teams System (Implemented Jan 23, 2026)

> "Dominoes is about teams. La Mesa should support team formation as a BIG moment."

### Team Formation Flow

1. **Player A sends invite** to Player B (via player name click)
2. **Player B accepts** (toast notification) or declines
3. **Team creation modal** opens:
   - Enter team name
   - Choose archetype (8 options)
4. **Public announcement** in La Mesa

### Team Archetypes (8 Total - All Free)

| Archetype | Spanish | Description |
|-----------|---------|-------------|
| **Los Viejos** | The Wise Ones | Experienced, patient, strategic |
| **Los Venenos** | The Poisoners | Disruptive, tactical plays |
| **La Tranca** | The Blockers | Control the board, force passes |
| **La Carreta** | The Rollers | Momentum players, keep it rolling |
| **Los Capicúas** | The Precision | Elegant finishers, both ends |
| **Los Pesados** | The Heavy Hitters | Aggressive, high-tile play |
| **Los Amarradores** | The Trappers | Strategic trapping |
| **La Mula** | The Mules | Stubborn, doubles specialists |

### Database Schema

**Supabase tables created:**
- `teams` - Team identity (name, archetype, players)
- `team_invites` - Invite tracking (pending, accepted, declined)
- `messages` updated with `is_team_whisper` and `team_id` columns

### UI Components Added

1. **Team invite toast** - Slides from top with accept/decline
2. **Team creation modal** - Name input + archetype grid
3. **Team announcement message** - Special styled system message
4. **Team badge CSS** - Ready for display next to names
5. **Whisper styling** - For team-private messages

### Future: MyFicha Integration

- Same team in La Mesa = same team in MyFicha
- Team stats track across both platforms
- Challenge as a team from La Mesa → opens MyFicha game
- Game results post back to La Mesa with team context

---

## Audit Notes (January 28, 2026)

**Comprehensive audit conducted by:** Tobias van Schneider + Walt Disney  
**Full audit document:** `TEAM/SESSIONS/2026-01-28-la-mesa-audit-tobias-walt.md`

### Critical Findings

This document was found to have significant drift between "planned" and "implemented":

1. **Reactions were marked implemented—they are not.** The entire reactions system (🔥😂👏💪🌴🀱) needs to be built.

2. **The Board is static HTML.** It appears live but is hardcoded. This is misleading and must connect to Supabase.

3. **Button pulse was marked done—it's not.** The domino button idle animation is still missing (now 12+ days overdue).

### What Actually Works (Verified)

- ✅ Hub stack architecture (Who's Here / The Board / Tonight)
- ✅ Entry ritual (Claim Your Seat → flag → hub-first)
- ✅ Entrance announcements ("pulled up a chair")
- ✅ Ticker with live content
- ✅ Chat with stagger animation, brass tints for self
- ✅ Second-screen protection (Peek/Full modes)
- ✅ Team formation UI (modal, archetypes, toasts)
- ✅ Tonight countdown (human-readable format)
- ✅ Hub-to-chat cue (divider + CHAT label)

### What Must Ship Before Tournament I

| Priority | Feature | ETA |
|----------|---------|-----|
| P0 | Reactions system (all 6) | Jan 29 |
| P0 | The Board Supabase integration | Jan 29 |
| P1 | Domino button pulse | Jan 28 |
| P1 | La Oficina announcement publishing | Jan 29 |

### Tobias + Walt Summary

> **Tobias:** *"La Mesa is 85% there. But that last 15% is the difference between 'functional' and 'magical.' Reactions. The Board being live. The button breathing. These aren't features. They're the room's heartbeat."*

> **Walt:** *"The journey from scroll to entry to hub is working. But once they're inside, the room needs to stay alive. We promised a locker room before the fight—it needs to feel like there's a fight coming."*

> **Both:** *"Ship reactions. Ship The Board live. Make the button pulse. Then we've got something special."*

---

*Document Created: January 23, 2026*  
*Last Updated: January 28, 2026 (post-audit reality check)*

*"La mesa te espera. But the room needs a heartbeat."*
