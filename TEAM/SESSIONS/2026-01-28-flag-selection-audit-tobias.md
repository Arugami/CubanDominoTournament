# Flag Selection Page Audit — Tobias van Schneider
**Date:** January 28, 2026  
**Scope:** Post-auth flag picking experience (formerly "Claim Your Seat")

---

## User Feedback & Changes Implemented

### Issue 1: "Claim Your Seat" Title
**Problem:** The title "Claim Your Seat" doesn't make sense contextually. The user just got an email saying "YOU'RE IN" and clicked through a "Verifying your seat" screen. The seat is already claimed.

**Solution:** Changed title to focus on the flag selection:
- **Before:** "Claim Your Seat" (SF Sports Night, uppercase, transactional)
- **After:** "Choose your flag" (Bodoni Moda, italic, sentence case, ceremonial)

**Tobias Rationale:**
> "The flag moment is the ceremony. Don't rush it. The copy should honor the choice, not treat it like a form field."

**Typography Change:**
```
Before: SF Sports Night, 1.8rem, uppercase, letter-spacing 0.06em
After:  Bodoni Moda, 1.4rem, sentence case, italic, letter-spacing 0.04em
```

---

### Issue 2: "Enter" Button Weight & Casing
**Problem:** Button said "Enter" but felt too light and was styled in all-caps like a broadcast graphic, not a threshold moment.

**Solution:** 
- Removed `text-transform: uppercase`
- Increased font size: 1rem → 1.15rem
- Reduced letter-spacing: 0.12em → 0.05em (tighter, more elegant)
- Kept Bodoni Moda Bold Italic for weight

**Tobias Rationale:**
> "The threshold moment needs elegance, not shouting. The button should feel like a declaration, not a command."

**Visual Hierarchy:**
- Button text now matches email CTA styling ("Enter" in Bodoni Bold Italic)
- Consistent with the refined, Club 33 aesthetic

---

### Issue 3: "0 at the table" — Tournament Stakes Instead

**Problem:** When 0 people are present, "0 at the table" feels sad and underwhelming. It doesn't build hype.

**Solution Chosen: Option 2 — Tournament Stakes**

Replaced live indicator with ESPN-style tournament stakes:
```
32 seats. 1 champion.
January 31st
```

**Why this works:**
- Always relevant regardless of current occupancy
- Builds stakes and anticipation (Walt's "weenie")
- ESPN broadcast energy matches the title
- Never feels "empty" — always exciting

**Tobias:** *"The promise of competition is the hook. Not who got there first."*

**Walt:** *"The castle is the tournament. The flag is how you enter it."*

**Visual Design:**
- Font: SF Sports Night (broadcast credential)
- Primary line: "32 seats. 1 champion." — 0.9rem, brass, 95% opacity
- Date line: "January 31st" — 0.75rem, cream, 70% opacity
- Staggered fade-in animation (600ms delay, after button)

**New Structure (Top to Bottom):**
1. "CHOOSE YOUR FLAG" (title — ESPN font, uppercase)
2. "Show them where you're from" (subtitle — Bodoni italic)
3. Flag selector (centerpiece)
4. Country display (above button)
5. "Enter" button (threshold moment)
6. "32 seats. 1 champion." (stakes, below button)

---

## Current Page Structure

```
┌─────────────────────────────┐
│                             │
│   CHOOSE YOUR FLAG          │ ← SF Sports Night (ESPN broadcast)
│   ────────                  │
│                             │
│   Show them where           │ ← Bodoni Moda italic
│   you're from.              │
│                             │
│   [Flag Selector]           │ ← Cuba → USA → Caribbean...
│      🇨🇺  🇺🇸  🇵🇷             │
│                             │
│   CUBA                      │ ← Country display
│   Tap to represent          │
│                             │
│   ┌──────────────┐          │
│   │    Enter     │          │ ← Bodoni Bold Italic, sentence case
│   └──────────────┘          │
│                             │
│   32 seats. 1 champion.     │ ← ESPN stakes (always exciting)
│   January 31st              │
│                             │
└─────────────────────────────┘
```

---

## Tobias Principles Applied

### 1. Rooms, Not Hallways
The flag selection is now a room you enter, not a form you complete. The title honors the ritual of choosing your representation.

### 2. Physical Digital
The flag selector has weight — the gold ring, the scroll-snap, the "slam" when selected. The button rises on hover (The Lift) and compresses on click (The Slam).

### 3. Breath Spacing
The page breathes:
- Title → subtitle → flag (space)
- Country display → button (space)
- Button → presence indicator (space)

### 4. Micro-Moments
- The gold ring appears when a flag is centered
- The country name fades in
- The button glows when ready

---

## Walt Disney Principles Applied

### 1. The Weenie
The flag selector is the visual draw. It animates (peek right on load) to show there's more to explore.

### 2. Earn Your Spot
The user has already earned their seat (email verified). Now they earn their identity by choosing a flag.

### 3. Queue Magic
The scroll through flags is part of the experience — "Which one represents me?"

### 4. Detail Obsession
- Flag images load eagerly for instant response
- Scroll-snap centers each flag precisely
- The gold ring is perfectly centered (fixed bug in previous iteration)

---

## Design System Alignment

| Element | Specification |
|---------|--------------|
| Title Font | SF Sports Night, 1.6rem, weight 400, uppercase |
| Title Color | var(--brass) #d4a574 |
| Subtitle Font | Bodoni Moda, italic |
| Button Font | Bodoni Moda, 1.15rem, weight 700, italic |
| Button Gradient | Copper: #c4784a → #b76a3b → #9a5a30 |
| Button Radius | 2px (machined, not pill) |
| Tournament Stakes | SF Sports Night, brass/cream, ESPN broadcast style |
| Animation | Staggered fade-up, 60-600ms delays |

---

## Open Questions for Tobias

1. **Flag selector scroll hint:** Should we add a subtle animation to hint that more flags exist beyond Cuba/USA?

2. **Country display transition:** When scrolling, the country name updates. Should this have a "slam" animation or a gentle crossfade?

3. **Button disabled state:** When no flag is selected, the button is disabled. Should we show helper copy or let the visual state speak for itself?

4. **Tournament stakes animation:** Currently fades in after button. Should it have a "broadcast graphic" slide-in effect instead?

---

## Files Modified

| File | Changes |
|------|---------|
| `src/pages/index.astro` | Title styling (line ~8336) |
| `src/pages/index.astro` | Button styling (line ~9193) |
| `src/pages/index.astro` | Title text: "Claim Your Seat" → "Choose your flag" |
| `src/pages/index.astro` | Moved live indicator below button |
| `src/pages/index.astro` | Reduced live indicator opacity/scale |

---

## Status

✅ Changes implemented  
⏳ Pending Tobias review  
⏳ Pending Walt journey review  

---

*"The flag is not a setting. It's a declaration."* — Tobias
