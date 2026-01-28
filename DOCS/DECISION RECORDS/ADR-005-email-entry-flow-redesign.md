# ADR-005: Email and Entry Flow Redesign — Club 33 Induction Experience

**Date:** 2026-01-28  
**Status:** Approved  
**Deciders:** Tobias van Schneider (Chief Product Designer), Walt Disney (Chief Experience Architect)  
**Stakeholders:** CDL Product Team, Jordan Perez (Commissioner)

---

## Context

The post-registration experience felt transactional rather than ceremonial. Users received a utilitarian confirmation email, waited through a dull "Authenticating" screen, and then saw repetitive UI in the Claim Your Seat flow.

**Walt's Frame:** "This isn't registration. This is induction."

**Tobias's Vision:** "Every threshold should feel like doors opening, not forms submitting."

---

## Decision

Redesign the complete entry experience (Email → Authenticating → Claim Seat) to create a cohesive Club 33-style induction with ESPN broadcast energy.

---

## Design Philosophy

### The ESPN + Club 33 Balance

| Element | ESPN Broadcast | Club 33 Elegance |
|---------|---------------|------------------|
| **Headlines** | Impact/Arial Black — "YOU'RE IN" | — |
| **CTAs** | — | Bodoni Moda Bold Italic — "Enter" |
| **Credentials** | SF Sports Night — Country | — |
| **Names** | — | IBM Plex Sans — Human, approachable |
| **Sign-off** | — | Bodoni Moda Italic — "La mesa te espera." |

**Tobias:** "The ESPN font says 'You're in the league.' The Bodoni says 'You're in the club.'"

---

## Implementation Details

### 1. Confirmation Email

#### Subject Line
```
🌴 YOU'RE IN — CDL:1 La Mesa
```
**Why:** Palm tree emoji = visual distinction. "YOU'RE IN" = broadcast moment.

#### Structure
```
┌─────────────────────────────────────┐
│  ┌─────┐                            │
│  │ CDL │  ← Badge (Bodoni text)      │
│  │  1  │                            │
│  └─────┘                            │
│                                     │
│  CDL:1 La Mesa                      │
│  YOU'RE IN ← ESPN/Impact font       │
│                                     │
│  Welcome to La Mesa, [Name].        │
│  Your seat at the Cuban Domino      │
│  League's first tournament          │
│  is secured.                        │
│                                     │
│  Jan 31, 2026                       │
│  Stefan's Lounge · Fairview, NJ     │
│                                     │
│  ┌─────────────────────────┐        │
│  │    Enter La Mesa        │ ← Bodoni Bold Italic
│  └─────────────────────────┘        │
│                                     │
│  La mesa te espera.                 │ ← Bodoni Italic
└─────────────────────────────────────┘
```

#### Key Changes
- **Added CDL 1 Badge:** CSS-crafted domino tile (brass border, copper text)
- **"YOU'RE IN":** Impact/Arial Black for ESPN broadcast energy
- **Personal copy:** "Welcome to La Mesa, [Name]." + historical context
- **CTA:** Bodoni Moda Bold Italic (threshold elegance)
- **Sign-off:** Bodoni Moda Italic (brand voice)

---

### 2. Table Key Email (Returning Players)

#### Subject Line
```
🌴 THE TABLE IS OPEN — CDL:1 La Mesa
```

#### Headline
```
THE TABLE
IS OPEN
```
**Why:** For returning players, it's not the first induction—it's "welcome back to the club."

---

### 3. Authenticating Page (Callback)

#### Before
- "La Mesa" title (generic)
- "Verifying your seat…" (procedural)
- "Authenticating" (bank app vibes)
- Rounded corners, soft styling

#### After
| Element | Implementation |
|---------|---------------|
| **Badge** | CDL 1 domino tile (same as email) |
| **Title** | "WELCOME" — SF Sports Night/Impact |
| **Subtitle** | "The doors are opening…" — Walt's threshold magic |
| **Status** | "VERIFYING YOUR SEAT" — small caps |
| **Sign-off** | "La mesa te espera." — Bodoni Moda Italic |
| **Borders** | Sharper (2px buttons, 8px card) |
| **Animation** | Pulsing green dot |

**Walt:** "The waiting moment is still part of the ritual. Make it feel like anticipation, not processing."

---

### 4. Claim Your Seat Page

#### Font Changes

| Element | Before | After | Rationale |
|---------|--------|-------|-----------|
| **Player Name** | SF Sports Night | **IBM Plex Sans** | Tobias: "Human, not broadcast graphic" |
| **Label** | "Representing" (×2) | **"REPRESENTING"** (country) + **"Playing as"** (name) | No repetition |
| **Button** | "ENTER" (all caps) | **"Enter"** (Bodoni Bold Italic) | Elegance, not shouting |

**Tobias on the Name Change:**
> "The ESPN font for the country creates the broadcast credential. The player name in clean sans serif keeps them human. It's the difference between a player card and a broadcast graphic."

---

## Technical Implementation

### Files Modified

| File | Changes |
|------|---------|
| `apps-script/Code.gs` | Email templates (confirmation + Table Key), subject lines |
| `src/pages/mesa/callback.astro` | Authenticating page styling, fonts, badge |
| `src/pages/index.astro` | Claim Your Seat fonts, labels |
| `MASTERTODO.md` | Deployment tasks |
| `TEAM/SESSIONS/2026-01-26-la-mesa-worklog.md` | Documentation |

### Font Loading

**Google Fonts (Email):**
```html
<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
```

**System Fonts (Fallback):**
- Impact / Arial Black — ESPN broadcast
- -apple-system / Segoe UI — Body text

**Local Fonts (Website):**
- SF Sports Night — `/FONT/sf-sports-night/`

---

## Consequences

### Positive
- **Club 33 vibes:** Emails feel like exclusive invitations, not receipts
- **Broadcast energy:** ESPN font creates sports credential moment
- **Font hierarchy:** Clear distinction between credential (country), human (name), and threshold (button)
- **Brand consistency:** CDL badge unifies email and web experiences
- **Threshold magic:** Waiting moments feel anticipatory, not procedural

### Neutral
- **Email client variance:** Bodoni Moda loads via Google Fonts; fallback to Georgia/serif if blocked
- **Subject line emoji:** Palm tree may render differently across clients (acceptable degradation)

### Negative
- **None identified**

---

## Alternatives Considered

### Option A: Keep All Sans Serif
**Rejected:** Tobias insisted on the Bodoni/brass elegance for the threshold moment. "Shouting doesn't invite—it demands."

### Option B: All Caps Everywhere
**Rejected:** Walt: "The table whispers. All caps is a megaphone."

### Option C: Keep "Table Key" Terminology
**Rejected:** Confusing—users press a button, not use a key. Simplified to "Check your email" and "Enter La Mesa."

---

## References

- `TEAM/SESSIONS/2026-01-26-la-mesa-worklog.md` — Full worklog with Tobias + Walt quotes
- `TEAM/chief-product-designer-tobias-van-schneider.md` — Tobias design principles
- `TEAM/chief-experience-architect-walt-disney.md` — Walt journey principles
- `DESIGN-SYSTEM.md` — Font stack and color palette
- `DOCS/PLANS/la-mesa-plan.md` — Email design spec

---

## Decision Record

**Approved by:**
- Tobias van Schneider (Chief Product Designer)
- Walt Disney (Chief Experience Architect)

**Date:** 2026-01-28

**Status:** Ready for deployment
