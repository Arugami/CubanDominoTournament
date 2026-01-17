# CDL Design System: The Bone Language

> *"The domino is not just a game—it is ritual."* — Wifredo Lam
> *"You made a beautiful domino and then hid it. Put the bone in their face."* — George Lois

---

## Philosophy

The Cuban Domino League isn't a tech startup. It's not a generic sports site. It's a **cultural institution** built around ritual, heritage, and the sacred geometry of the domino tile.

**The Vibe:** Cuban cigar lounge × ESPN UFC broadcast × domino ritual

Think: Smoke curling through amber light. The crack of bone on mahogany. Bold graphics that hit like a knockout. This is sports entertainment with soul.

Every design decision must answer one question:

**"Does this feel like it belongs on the table?"**

If it doesn't feel like dominoes clicking on mahogany, cafecito steam, cigar smoke curling in amber light—it doesn't belong.

---

## Visual DNA

### Three Pillars

| Pillar | Feeling | Reference |
|--------|---------|-----------|
| **Cuban Cigar Lounge** | Warm, rich, intimate, cultured | Leather, mahogany, brass fixtures, tobacco amber |
| **Domino Ritual** | Sacred, geometric, heritage | Bone tiles, pip patterns, the crack of the table |
| **ESPN UFC Energy** | Bold, dramatic, high-contrast | Sports graphics, knockout typography, broadcast urgency |

### The Balance
- **70% Lounge warmth** — the foundation, always present
- **20% Ritual reverence** — moments of ceremony and weight
- **10% Broadcast punch** — when we need to HIT (headlines, CTAs, scores)

---

## The Bone

The domino tile ("la ficha" / "the bone") is the foundational shape of all CDL UI.

### Core Shape Properties
```css
--radius-bone: 12px;     /* Primary radius for all components */
--radius-pip: 50%;       /* Circular pips/dots only */
```

### Why 12px?
- Substantial, not soft (pills feel like apps, bones feel like objects)
- Matches the natural radius of a domino tile
- Creates visual consistency across all UI
- Avoids "generic app" aesthetic

### The Aspect Ratio
Dominoes are roughly **1:2** (width:height when vertical) or **2:1** (when horizontal).

Use this ratio for:
- Buttons (horizontal bone)
- Cards (vertical bone)
- Floating UI elements

---

## Color Palette

### Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Brass** | `#d4a574` | Accents, text highlights, borders |
| **Copper** | `#b76a3b` | CTAs, buttons, emphasis |
| **Cream** | `#f8efe6` | Light backgrounds, bone surface |
| **Bone** | `#fff7ef` | Domino tile base, cards |

### Dark Atmosphere

| Name | Hex | Usage |
|------|-----|-------|
| **Ink** | `#1c130f` | Primary dark (like mahogany) |
| **Muted** | `#594a3f` | Secondary text, subtle elements |
| **Smoke** | `#0a0705` | Deep backgrounds, dramatic shadows |

### Accent Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Gold** | `#ffd700` | Champion moments, victory, premium |
| **Live Green** | `#4ade80` | Active/online indicators |
| **Error Red** | `#ef4444` | Errors, warnings |

### CSS Variables
```css
:root {
  color-scheme: dark;

  /* Core Palette */
  --ink: #1c130f;
  --muted: #594a3f;
  --copper: #b76a3b;
  --cream: #f8efe6;
  --bone: #fff7ef;
  --brass: #d4a574;
  --gold: #ffd700;

  /* Shadows */
  --shadow: 0 18px 45px rgba(20, 10, 6, 0.18);

  /* Shape */
  --radius-bone: 12px;
  --radius-pip: 50%;
}
```

---

## Typography

### Font Stack (Locked)

| Font | Role | Weights | Style |
|------|------|---------|-------|
| **Bodoni Moda** | Display, Headlines | 400, 700, 800, 900 | Regular + Italic |
| **IBM Plex Sans** | Body, UI | 400, 500, 600 | Regular + Italic |
| **IBM Plex Sans Condensed** | Labels, Stats | 600, 700 | Regular only |
| **IBM Plex Serif** | Pull quotes, Editorial | 400, 500 | Regular only |

### Google Fonts Import (Standard)

**Main site (index.astro):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,700;0,6..96,800;0,6..96,900;1,6..96,400;1,6..96,700&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Sans+Condensed:wght@600;700&family=IBM+Plex+Serif:wght@400;500&display=swap"
  rel="stylesheet"
/>
```

**Admin pages (without Serif):**
```html
<link
  href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,700;0,6..96,800;0,6..96,900;1,6..96,400;1,6..96,700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Sans+Condensed:wght@600;700&display=swap"
  rel="stylesheet"
/>
```

### Font Usage Guide

#### Bodoni Moda — The Ceremonial Voice
- **Use for:** Headlines, titles, CTAs, anything ceremonial
- **Character:** Elegant, timeless, like newspaper headlines from 1950s Havana
- **ESPN energy:** When you need IMPACT, go **800-900 weight**
- **Ritual moments:** Italic for *reverence* and *invitation*

```css
/* Hero knockout headline */
.headline-hero {
  font-family: "Bodoni Moda", serif;
  font-weight: 900;
  font-size: clamp(3rem, 12vw, 6rem);
  line-height: 0.9;
  letter-spacing: -0.02em;
}

/* Ceremonial italic */
.headline-ritual {
  font-family: "Bodoni Moda", serif;
  font-style: italic;
  font-weight: 400;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
}
```

#### IBM Plex Sans — The Working Voice
- **Use for:** Body text, UI labels, forms, navigation
- **Character:** Clean, modern, readable at any size
- **Weights:** 400 (body), 500 (emphasis), 600 (strong)

```css
body {
  font-family: "IBM Plex Sans", system-ui, sans-serif;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.6;
}
```

#### IBM Plex Sans Condensed — The Stats Voice
- **Use for:** Labels, stats, scores, compact UI
- **Character:** Dense information, sports graphics feel
- **ESPN energy:** Perfect for scoreboards, stats, live indicators

```css
.stat-label {
  font-family: "IBM Plex Sans Condensed", sans-serif;
  font-weight: 700;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
```

#### IBM Plex Serif — The Editorial Voice
- **Use for:** Pull quotes, editorial moments, special callouts
- **Character:** Literary, thoughtful, adds texture
- **Use sparingly** — for moments that need gravitas

```css
.pull-quote {
  font-family: "IBM Plex Serif", Georgia, serif;
  font-weight: 400;
  font-size: 1.25rem;
  font-style: italic;
}
```

### Typography Scale

```css
/* Headlines — Bodoni Moda */
.headline-hero { font-size: clamp(3rem, 12vw, 6rem); font-weight: 900; }
.headline-xl   { font-size: clamp(2.5rem, 10vw, 5rem); font-weight: 800; }
.headline-lg   { font-size: clamp(2rem, 6vw, 3rem); font-weight: 700; }
.headline-md   { font-size: 1.5rem; font-weight: 700; }
.headline-sm   { font-size: 1.25rem; font-weight: 600; }

/* Body — IBM Plex Sans */
.body-lg { font-size: 1.15rem; line-height: 1.7; }
.body-md { font-size: 1rem; line-height: 1.6; }
.body-sm { font-size: 0.875rem; line-height: 1.5; }

/* Labels — IBM Plex Sans Condensed */
.label {
  font-family: "IBM Plex Sans Condensed", sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.label-lg {
  font-family: "IBM Plex Sans Condensed", sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
```

### ⚠️ Font Loading Checklist

Before deploying, verify ALL pages load the correct fonts:

- [ ] **Bodoni Moda italic** is loaded (not faux italic)
- [ ] **IBM Plex Serif** is loaded if used
- [ ] **Weights 800, 900** are loaded for hero headlines
- [ ] DevTools → Network shows `.woff2` files loading
- [ ] DevTools → Computed shows correct `font-family` resolving

---

## Components

### Buttons

All buttons use `border-radius: 12px` (the bone radius) and `font-family: "IBM Plex Sans Condensed"` for that modern broadcast feel.

#### Button Gradient Strategy

We use **two distinct gradients** based on semantic context:

| Context | Gradient | Meaning |
|---------|----------|---------|
| **Public site CTAs** | Copper → dark (diagonal) | **ESPN punch** — action, urgency, "DO THIS NOW" |
| **La Oficina entry** | Gold → brass → copper (vertical) | **Ceremonial threshold** — precious, reverent, "entering the room" |

**Why intentionally different?** (Tobias principle: "inevitable design")

- The main site is **action**. "CLAIM YOUR SEAT" demands broadcast energy — the 10% punch.
- La Oficina is **ceremony**. You're crossing a threshold into the commissioner's private domain. The gold gradient signals "this space is sacred."

This isn't inconsistency — it's **semantic hierarchy**. Different contexts deserve different visual treatment.

---

**Primary Action — The CTA Punch (Public Site)**
```css
.btn-primary {
  background: linear-gradient(135deg, var(--copper), #8f3c22);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 18px 36px;
  font-family: "IBM Plex Sans Condensed", sans-serif;
  font-weight: 700;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
```

**Ceremonial Entry — The Threshold (La Oficina)**
```css
.btn-ceremonial {
  background: linear-gradient(
    180deg,
    var(--gold) 0%,
    var(--brass) 50%,
    var(--copper) 100%
  );
  color: var(--ink);
  border: none;
  border-radius: 0; /* Sharp edges for admin forms */
  padding: 16px 24px;
  font-family: "IBM Plex Sans Condensed", sans-serif;
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  box-shadow:
    0 4px 16px rgba(183, 106, 59, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}
```

**Secondary (Outlined) — The Elegant Option**
```css
.btn-secondary {
  background: transparent;
  color: var(--brass);
  border: 1px solid var(--brass);
  border-radius: 12px;
  padding: 16px 32px;
  font-family: "Bodoni Moda", serif;
  font-weight: 400;
  font-style: italic;
  letter-spacing: 0.15em;
}
```

### The La Mesa Domino Tile

The floating chat toggle is a **vertical domino tile**, not a pill button.

**Structure:**
```
┌─────────┐
│  ● ●    │
│    ●    │  ← 5 brass pips (30-40% opacity)
│  ● ●    │
├─────────┤  ← Horizontal divider line
│ LA MESA │  ← Text in lower half
└─────────┘
```

**Specifications:**
- Size: 56px × 90px (desktop), 60px × 96px (mobile)
- Background: Cream gradient (#f5f0e6 → #e8e0d0)
- Border-radius: 12px
- Pips: Copper color at 40% opacity
- Badge: Positioned top-right, circular (pip shape)

### Cards

```css
.card {
  background: rgba(28, 19, 15, 0.9);
  border-radius: 12px;
  border: 1px solid rgba(212, 165, 116, 0.15);
  padding: 24px;
}
```

### Form Inputs

```css
.input {
  background: transparent;
  border: 1px solid rgba(212, 165, 116, 0.2);
  border-radius: 12px;
  padding: 14px 20px;
  color: var(--cream);
  font-family: "IBM Plex Sans", sans-serif;
}

.input:focus {
  border-color: var(--brass);
  box-shadow: 0 0 0 2px rgba(212, 165, 116, 0.15);
}
```

### Indicators & Badges

**Live Indicator (pill with dot)**
```css
.live-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(212, 165, 116, 0.08);
  border: 1px solid rgba(212, 165, 116, 0.15);
  border-radius: 12px;  /* Bone radius, not pill */
}

.live-dot {
  width: 8px;
  height: 8px;
  background: var(--live);
  border-radius: 50%;  /* Pip radius - always circular */
  animation: pulse 2s ease-in-out infinite;
}
```

---

## ESPN/UFC Broadcast Energy

When you need to HIT—headlines, scores, championship moments—channel ESPN UFC graphics.

### High-Impact Typography

```css
/* The knockout headline */
.knockout {
  font-family: "Bodoni Moda", serif;
  font-weight: 900;
  font-size: clamp(4rem, 15vw, 8rem);
  line-height: 0.85;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  color: var(--bone);
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
}

/* Stats that pop */
.stat-big {
  font-family: "IBM Plex Sans Condensed", sans-serif;
  font-weight: 700;
  font-size: 3rem;
  letter-spacing: -0.02em;
  color: var(--gold);
}
```

### Broadcast Patterns

**Score Display:**
```css
.score-display {
  font-family: "IBM Plex Sans Condensed", sans-serif;
  font-weight: 700;
  font-size: 2.5rem;
  color: var(--bone);
  background: linear-gradient(135deg, var(--ink), #0a0705);
  border-left: 4px solid var(--copper);
  padding: 12px 24px;
}
```

**Live Badge:**
```css
.badge-live {
  font-family: "IBM Plex Sans Condensed", sans-serif;
  font-weight: 700;
  font-size: 0.625rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  background: #dc2626;
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  animation: pulse-glow 2s infinite;
}
```

**Championship Gold Moment:**
```css
.champion-moment {
  background: linear-gradient(135deg, #ffd700 0%, #b8860b 50%, #ffd700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}
```

---

## Shadows

### Standard Elevation
```css
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.5);
```

### Bone Shadow (for domino-like elements)
```css
--shadow-bone:
  0 6px 24px rgba(0, 0, 0, 0.5),
  0 0 0 1px rgba(212, 165, 116, 0.3),
  inset 0 1px 0 rgba(255, 255, 255, 0.5),
  inset 0 -2px 4px rgba(0, 0, 0, 0.1);
```

### Glow (for emphasis)
```css
--glow-brass: 0 0 30px rgba(212, 165, 116, 0.15);
--glow-gold: 0 0 40px rgba(255, 215, 0, 0.3);
```

---

## Animation Guidelines

### Philosophy
- **Subtle, not showy.** The bone speaks for itself.
- **Fast.** 150-300ms for most transitions.
- **Meaningful.** Animation should communicate state, not decorate.

### Timing Functions
```css
--ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94);   /* Standard */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);   /* Bouncy (use sparingly) */
--ease-smooth: cubic-bezier(0.16, 1, 0.3, 1);       /* Elegant sweep */
```

### Standard Transitions
```css
transition: all 0.25s var(--ease-out);  /* Default */
```

### Hover Effects
- **Lift:** `transform: translateY(-4px);`
- **Scale:** `transform: scale(1.02);` (subtle)
- **Glow:** Add `box-shadow` with brass glow

### Entry Animations
- Keep stagger delays short (60-80ms between elements)
- Total animation sequence should complete within 400ms
- Use `translateY(16px)` for upward reveal

---

## What NOT To Do

### Never Use
- **Pill shapes** (border-radius: 50px or 999px) — this is app UI, not CDL
- **Flat design** — everything needs depth, shadow, atmosphere
- **Pure white** — use cream/bone instead
- **Generic blue** — stay in the brass/copper family
- **Tech startup fonts** — no Inter, Roboto, or system fonts for display
- **Bouncy animations** — keep it dignified
- **Faux italic** — always load the real italic variant

### Avoid These Patterns
- Floating action buttons (except La Mesa tile)
- Modal dialogs (prefer inline expansion)
- Hamburger menus (the site is single-page)
- Skeuomorphic wood textures (too literal)
- Generic sports templates (we're not ESPN—we have soul)

---

## Visual References

### The Atmosphere
- Cigar lounge at dusk
- Mahogany table under amber light
- Smoke curling through warm air
- Old Havana photography (pre-1959)
- Cuban coffee shop in Union City

### Color Inspiration
- Aged ivory dominoes
- Polished brass fixtures
- Cigar bands and boxes
- Cuban tile floors
- Café con leche foam

### Broadcast Inspiration
- ESPN UFC fight cards
- HBO Boxing graphics
- Classic sports broadcast lower thirds
- Championship belt presentations
- Sports Illustrated covers

---

## Implementation Checklist

When building new UI, verify:

- [ ] All corners use `12px` radius (or `50%` for pips/dots)
- [ ] Typography uses the correct font family for context
- [ ] **Bodoni Moda italic** loads for italic styles (not faux)
- [ ] **All required weights** are in the Google Fonts URL
- [ ] Colors stay within the palette
- [ ] Shadows provide depth without harshness
- [ ] Animations are subtle and fast (< 300ms)
- [ ] Component feels like it belongs "on the table"
- [ ] High-impact moments use broadcast energy patterns

---

## Files

| File | Purpose |
|------|---------|
| `src/pages/index.astro` | Main site - all CSS inline |
| `src/pages/admin/*.astro` | Admin pages |
| `src/components/admin/AdminLayout.astro` | Shared admin layout |
| `DESIGN-SYSTEM.md` | This document |
| `TEAM/artistic-director-wifredo-lam.md` | Cuban soul, ritual, spiritual symbolism |
| `TEAM/advertising-director-george-lois.md` | Bold, provocative, "Put the bone in their face" |

---

## Revision History

| Date | Change |
|------|--------|
| Jan 16, 2026 | **Button Gradient Strategy & Admin Atmosphere** |
| | - Documented semantic button gradient hierarchy (action vs. ceremony) |
| | - Public CTAs use copper→dark diagonal (ESPN punch) |
| | - La Oficina uses gold→brass→copper vertical (ceremonial threshold) |
| | - Updated button font to IBM Plex Sans Condensed across all pages |
| | - Added atmospheric background system to AdminLayout |
| | - Added vignette, grain, and warm depth to admin pages |
| | - **Unified CDL 1 badge** across main site and admin pages |
| | - Badge now uses brass border, glow, and brass→copper text gradient everywhere |
| Jan 16, 2026 | **Font Audit & Lock-in** |
| | - Added IBM Plex Serif to main site |
| | - Added IBM Plex Sans italic variant |
| | - Fixed Bodoni Moda italic on all admin pages |
| | - Added full weight range (800, 900) to callback/layout |
| | - Documented complete Google Fonts URLs |
| | - Added ESPN/UFC broadcast energy section |
| Jan 13, 2026 | Initial Bone Language implementation |
| | - La Mesa button → domino tile |
| | - Unified 12px border-radius across all components |
| | - Faster animation timing (reduced stagger delays) |

---

*"La mesa te espera."*
