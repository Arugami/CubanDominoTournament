# Loading Screen: The Room Breathes
## Hypnotic Enhancement Session
**Date:** January 17, 2026
**Lead:** Tobias van Schneider (Chief Product Designer)

---

## The Problem

The loading screen entrance is beautifully choreographed (0-2.7s), but then **the room dies**. From 2.7s to 4s, the viewer stares at a frozen image. The spell breaks.

We have all the right animations defined:
- `letterPulse` — letters breathe with glow
- `dividerPulse` — divider radiates
- `glowPulse` — radial glow expands/contracts
- `ambientBreath` — fog pulses subtly
- `tileFloat` — gentle 2-3px levitation
- `--heartbeat: 3.5s` — master rhythm variable

**None of them are used.** Every element "appears once, then stays static."

---

## The Solution: "The Room Breathes"

After the entrance sequence completes (~2.7s), the room enters a meditative breathing state:

### Phase 1: Entrance (0-2.7s)
*Current behavior — keep as-is*
- 0.0s: Fog fades in
- 0.8s: Tile container appears, glow crescendos
- 1.5s: Letter C emerges
- 1.9s: Letter D emerges
- 2.1s: Divider slams
- 2.3s: Letter L emerges
- ~2.7s: All entrance animations complete

### Phase 2: Breathing (2.7s-3.8s) — NEW
*Add `.is-breathing` class to loading screen*
- Letters pulse with synchronized glow heartbeat
- Divider pulses in harmony
- Glow behind tile expands/contracts
- Fog breathes (very subtle scale)
- Tile floats imperceptibly (2-3px)
- More embers fill the room (10-12 particles, varied sizes)

### Phase 3: Exit Anticipation (3.8s) — NEW
*Add `.is-exiting` class*
- Glow intensifies briefly (final breath)
- Embers accelerate upward
- Tile recedes gently

### Phase 4: Release (4.0s)
*Current behavior with "The Smoke Clears"*
- Everything drifts up and fades
- Hero panel reveals

---

## Implementation Details

### CSS Changes

1. **`.is-breathing` state** — activates all dormant pulse animations
2. **More embers** — 12 particles with varied sizes (2-4px)
3. **Tile float** — activate the existing `tileFloat` keyframe
4. **Glow breathing** — use `glowPulse` animation

### JS Changes

1. Add `is-breathing` class at ~2.7s (after entrance completes)
2. Add `is-exiting` class at ~3.8s (200ms before fade)
3. Add `is-hidden` class at ~4.0s (triggers fade)

### Timing Diagram

```
0s        1s        2s        3s        4s
|---------|---------|---------|---------|
[====ENTRANCE====]
                   [==BREATHING==]
                              [EXIT]
                                 [FADE]
```

---

## Design Principles Applied

From Tobias's philosophy:

> "Dark UI is about depth, not darkness. It's layers of smoke, not a black wall."

The breathing state adds **life** to those layers.

> "Micro-moments are where feeling lives. 80% of emotional impact comes from 20% of interactions."

The synchronized heartbeat IS the micro-moment. It's not flashy — it's felt.

> "The room should feel alive."

A room that breathes is alive. A room that freezes is a photograph.

---

## Success Criteria

1. **No visible "freeze" moment** — the transition from entrance to breathing should be seamless
2. **Hypnotic, not distracting** — the pulse should be felt, not watched
3. **The exit should feel like an exhale** — anticipation, then release
4. **Mobile performance** — animations must be GPU-accelerated (transform, opacity only)

---

## Files Modified

- `src/pages/index.astro`
  - CSS: `.is-breathing` state, `.is-anticipating` state, enhanced ember styles
  - HTML: 12 ember particles with varied sizes (lg, regular, sm)
  - JS: Complete timing sequence with breathing and anticipation

---

## Implementation Summary

### Timing Sequence (Final)

| Time | Class Added | What Happens |
|------|-------------|--------------|
| 0ms | — | Entrance begins (fog, tile, letters animate in) |
| 180ms | `is-passive` | Pointer events disabled |
| 2700ms | `is-breathing` | Letters pulse, divider glows, tile floats, fog breathes |
| 3500ms | `is-anticipating` | Glow intensifies, letters brighten (final breath) |
| 3800ms | `is-exiting` | Everything drifts up, embers accelerate |
| 4000ms | `is-hidden` | Opacity fades to black |
| 4300ms | `is-ready` | Hero panel animations begin |

### CSS Classes

- `.is-breathing` — Activates `letterPulse`, `dividerPulse`, `glowPulse`, `ambientBreath`, `tileFloat`
- `.is-anticipating` — Intensifies glow (scale 1.15, opacity 0.8), brightens letters
- `.is-exiting` — Upward drift, ember acceleration, tile recede

### Ember Enhancement

- 12 particles (was 6)
- Three sizes: `ember--lg` (4px), regular (3px), `ember--sm` (2px)
- 6s cycle (was 8s) for denser activity
- Staggered delays for organic flow

---

*Session by Tobias van Schneider*
*CDL Dream Team - Product Division*
