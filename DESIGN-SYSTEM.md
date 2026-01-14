# CDL Design System: The Bone Language

> *"The domino is not just a game—it is ritual."* — Wifredo Lam
> *"You made a beautiful domino and then hid it. Put the bone in their face."* — George Lois

---

## Philosophy

The Cuban Domino League isn't a tech startup. It's not a generic sports site. It's a **cultural institution** built around ritual, heritage, and the sacred geometry of the domino tile.

Every design decision must answer one question:

**"Does this feel like it belongs on the table?"**

If it doesn't feel like dominoes clicking on mahogany, cafecito steam, cigar smoke curling in amber light—it doesn't belong.

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
| **Cream** | `#f5f0e6` | Light backgrounds, bone surface |
| **Bone** | `#e8e0d0` | Domino tile base, cards |

### Dark Atmosphere

| Name | Hex | Usage |
|------|-----|-------|
| **Table** | `#1c130f` | Primary background (like mahogany) |
| **Smoke** | `#0d0906` | Deep shadows, text on light |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Live Green** | `#4ade80` | Active/online indicators |
| **Error Red** | `#ef4444` | Errors, warnings |

### CSS Variables
```css
:root {
  /* Core */
  --brass: #d4a574;
  --copper: #b76a3b;
  --cream: #f5f0e6;
  --bone: #e8e0d0;

  /* Atmosphere */
  --table: #1c130f;
  --smoke: #0d0906;

  /* Functional */
  --live: #4ade80;
  --error: #ef4444;

  /* Shape */
  --radius-bone: 12px;
  --radius-pip: 50%;
}
```

---

## Typography

### Display Font: Bodoni Moda
- **Use for:** Headlines, titles, CTAs, anything ceremonial
- **Weight:** 600-700
- **Feel:** Elegant, timeless, like newspaper headlines from 1950s Havana

### Body Font: IBM Plex Sans
- **Use for:** Body text, UI labels, forms
- **Weight:** 400-600
- **Feel:** Clean, modern, readable

### Typography Scale
```css
/* Headlines */
.headline-xl { font-size: clamp(3rem, 10vw, 5rem); }  /* Hero titles */
.headline-lg { font-size: clamp(2rem, 6vw, 3rem); }   /* Section titles */
.headline-md { font-size: 1.5rem; }                    /* Card titles */

/* Body */
.body-lg { font-size: 1.15rem; }
.body-md { font-size: 1rem; }
.body-sm { font-size: 0.85rem; }

/* UI */
.label {
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
```

---

## Components

### Buttons

All buttons use `border-radius: 12px` (the bone radius).

**Primary (Filled)**
```css
.btn-primary {
  background: linear-gradient(135deg, var(--copper), #8f3c22);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 18px 36px;
  font-family: "IBM Plex Sans", sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
```

**Secondary (Outlined)**
```css
.btn-secondary {
  background: transparent;
  color: var(--brass);
  border: 1px solid var(--brass);
  border-radius: 12px;
  padding: 16px 32px;
  font-family: "Bodoni Moda", serif;
  text-transform: uppercase;
  letter-spacing: 0.2em;
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

### Avoid These Patterns
- Floating action buttons (except La Mesa tile)
- Modal dialogs (prefer inline expansion)
- Hamburger menus (the site is single-page)
- Skeuomorphic wood textures (too literal)

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

---

## Implementation Checklist

When building new UI, verify:

- [ ] All corners use `12px` radius (or `50%` for pips/dots)
- [ ] Typography uses Bodoni Moda (display) or IBM Plex Sans (body)
- [ ] Colors stay within the palette
- [ ] Shadows provide depth without harshness
- [ ] Animations are subtle and fast (< 300ms)
- [ ] Component feels like it belongs "on the table"

---

## Files

| File | Purpose |
|------|---------|
| `src/pages/index.astro` | All CSS is inline in this file |
| `DESIGN-SYSTEM.md` | This document |
| `TEAM/artistic-director-wifredo-lam.md` | Cuban soul, ritual, spiritual symbolism |
| `TEAM/advertising-director-george-lois.md` | Bold, provocative, "Put the bone in their face" |

---

## Revision History

| Date | Change |
|------|--------|
| Jan 13, 2026 | Initial Bone Language implementation |
| | - La Mesa button → domino tile |
| | - Unified 12px border-radius across all components |
| | - Faster animation timing (reduced stagger delays) |

---

*"La mesa te espera."*
