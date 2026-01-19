# BUG-007: Panel 3 Green/Red Color Flash (Desktop Chrome)

**Status:** FIXED
**Date Fixed:** Jan 19, 2026
**Severity:** Medium
**Component:** Panel 3 "Your abuelo sat here" text animation

---

## Symptoms

On desktop Chrome, a brief green/red color flash appears during the "Your abuelo sat here" text animation when scrolling to Panel 3. The flash occurs as a 1-frame RGB fringe artifact during the blur-to-sharp text reveal.

---

## Root Cause

Chrome compositor artifact caused by animating large, blurry `text-shadow` and `filter: blur()` simultaneously. This forces the glyphs onto temporary GPU surfaces each frame, and with other filtered/blended layers in the stack (film grain with `mix-blend-mode: overlay`, fog layers, etc.), Chrome briefly composites an intermediate buffer incorrectly.

**It's not the CSS colors "going neon"** - it's a transient raster/composite glitch during GPU layer recomposition.

### Layer Stack Contributing to Issue:
```
z-0:  .panel-bg (isolation: isolate)
z-0:  .chromatic-aberration (blend: normal, opacity: 0.18)
z-1:  .panel-bg::after [film grain] (blend: overlay, opacity: 0.4)
z-1:  .fog-layer (blur: 70px, opacity transition)
z-2:  .panel-overlay (gradients)
z-4:  .vignette-overlay (fixed)
z-10+: .build-word--primary (text with animated shadows + blur)
```

---

## What Didn't Work

| Attempted Fix | Result |
|--------------|--------|
| Changed chromatic blend `screen` → `normal` | Still flashing |
| Reduced chromatic opacity to 0.18 | Still flashing |
| Neutralized chromatic colors to gray | Still flashing |
| Changed smoke-layer blend `screen` → `normal` | Still flashing |
| Removed `isolation: isolate` from text container | Still flashing |
| GPU layer isolation (`will-change`, `translateZ(0)`, `backface-visibility: hidden`) | Still flashing |

---

## The Fix

Stop animating the heavy shadow/blur on the glyph run; instead **pre-render layers and animate only opacity/transform**.

### Implementation:
`.build-word--primary` now reveals via two pseudo-layers:
- `::before` = blurred "memory" fill (constant blur; fades out)
- `::after` = brass glow (constant shadow; opacity pulse)

### New Animations:
- `ancestorDescendStable` - main text opacity/transform only
- `ancestorBlurFade` - ::before blur layer fades out
- `ancestorGlowPulse` - ::after glow layer pulses

### Markup Change:
Added `data-text` attribute to the span for pseudo-element content.

---

## Files Changed

- `src/pages/index.astro`
  - Line ~2134: New CSS for `.build-word--primary` with pseudo-layers
  - Line ~8347: Added `data-text` attribute to markup
  - New keyframe animations: `ancestorDescendStable`, `ancestorBlurFade`, `ancestorGlowPulse`

---

## How to Verify

1. Open the site in desktop Chrome
2. Scroll to Panel 3 ("Your abuelo sat here")
3. Watch the text animation - should have no green/red flash
4. Scroll up and down to retrigger animation multiple times
5. Confirm brass glow and blur-to-sharp effect still work as intended

---

## Fallback (If Flash Returns)

If the flash reappears in edge cases, the next fix is moving the film grain from `mix-blend-mode` to a `background-blend-mode` background layer. This keeps the visual look but avoids blend-mode compositing interactions.

```css
/* Instead of ::after with mix-blend-mode: overlay */
.panel-bg {
  background-blend-mode: overlay;
  /* grain as background layer instead of pseudo-element */
}
```
