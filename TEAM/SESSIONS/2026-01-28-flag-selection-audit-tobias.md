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

### Issue 3: "0 active today" Placement
**Problem:** The live player count appeared before the flag selector, breaking the ceremonial flow. It felt like FOMO pressure before the identity moment.

**Solution:** 
- Moved live indicator to below the Enter button
- Reduced opacity: 0.6 (was 1.0)
- Added subtle scale: 0.92 (makes it recede)
- Changed text: "active today" → "at the table" (more contextual)

**Tobias Rationale:**
> "The flag comes first. Everything else is atmosphere. If you want to show presence, make it a whisper, not an announcement."

**New Structure (Top to Bottom):**
1. "Choose your flag" (title)
2. "Show them where you're from" (subtitle)
3. Flag selector (centerpiece)
4. Country display (above button)
5. "Enter" button (threshold moment)
6. "0 at the table" (subtle presence, below button)

---

## Current Page Structure

```
┌─────────────────────────────┐
│                             │
│   Choose your flag          │ ← Bodoni Moda italic, elegant
│   ────────                  │
│                             │
│   Show them where           │
│   you're from.              │
│                             │
│   [Flag Selector]           │ ← Cuba → USA → Caribbean...
│                             │
│   CUBA                      │ ← Country display
│   Tap to represent          │
│                             │
│   ┌──────────────┐          │
│   │    Enter     │          │ ← Bodoni Bold Italic, sentence case
│   └──────────────┘          │
│                             │
│   ● 0 at the table          │ ← Subtle, below button
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
| Title Font | Bodoni Moda, 1.4rem, weight 400, italic |
| Title Color | var(--brass) #d4a574 |
| Button Font | Bodoni Moda, 1.15rem, weight 700, italic |
| Button Gradient | Copper: #c4784a → #b76a3b → #9a5a30 |
| Button Radius | 2px (machined, not pill) |
| Presence Indicator | 60% opacity, 92% scale, below button |
| Animation | Staggered fade-up, 60-180ms delays |

---

## Open Questions for Tobias

1. **Flag selector scroll hint:** Should we add a subtle animation to hint that more flags exist beyond Cuba/USA?

2. **Country display transition:** When scrolling, the country name updates. Should this have a "slam" animation or a gentle crossfade?

3. **Empty state copy:** If no one is at the table, should we say something more evocative than "0 at the table"? Perhaps "The table is quiet" or "Be the first to arrive"?

4. **Button disabled state:** When no flag is selected, the button is disabled. Should we show helper copy or let the visual state speak for itself?

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
