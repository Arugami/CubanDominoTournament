# BUG-008: La Mesa Entry Transition Flicker

## Status: Open
## Priority: Medium
## Date Reported: 2026-01-26
## Reporter: Development Team

---

## Summary

When transitioning from the "Claim Your Seat" identity screen to the La Mesa hub after clicking "CLAIM YOUR SEAT", there is a visible flicker/glitch before the hub content renders properly.

## Steps to Reproduce

1. Open La Mesa (click the domino tile or LA MESA badge in ticker)
2. On the identity screen, select your flag and name
3. Click "CLAIM YOUR SEAT"
4. **Observe:** A brief flicker/glitch appears before the hub loads

## Expected Behavior

- Smooth cinematic transition with the entry ritual animation (flag slam, "Pulling up a chair" text)
- No visual glitches or layout jumps
- Seamless handoff from identity screen to hub view

## Actual Behavior

- Page flickers briefly during transition
- Layout appears to jump or reorganize
- Entry ritual animation may not play correctly

## Technical Context

### Current Hypothesis (Unconfirmed)

This appears to be a transition timing / layout stability issue during the handoff between:

- `enterLaMesaRitual()` (overlay + state changes)
- `showChatInterface()` (panel mode + visibility toggles)

Likely contributors:
- competing opacity/transform transitions on large containers
- scroll-lock release + layout reflow at the moment the hub/transcript become visible
- font load / paint timing when switching into the room UI

### Remaining Work

1. **Entry Ritual Animation:** The `enterLaMesaRitual()` function needs review to ensure:
   - `mesa-entry` overlay shows correctly
   - Flag and text animations play in sequence
   - Smooth fade between identity screen and hub

2. **CSS Transition Timing:** Review the breath spacing animations:
   ```css
   .chat-panel .chat-identity,
   .chat-panel .chat-body-container {
     opacity: 0;
     transform: translateY(8px);
     transition: opacity 0.3s ease, transform 0.3s ease;
   }
   ```

3. **State Management:** Ensure `showChatInterface()` and `enterLaMesaRitual()` coordinate properly

## Files Involved

- `src/pages/index.astro` (lines ~16400-16500 for `enterLaMesaRitual`)
- CSS for `.mesa-entry`, `.chat-panel.is-entering`
- JavaScript state management for chat identity flow

## Related Issues

- Hub visibility after Claim Seat was fixed separately in BUG-009 (`DOCS/BUGS/009-la-mesa-hub-visibility-scroll-container.md`).

## Notes

The transition should feel like "entering a room" per Tobias's design philosophy - not a jarring page change. The entry ritual animation was designed to create a moment of arrival, like being announced at a poker table.
