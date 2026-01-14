# BUG-006: iOS Safari Ticker Appears Dimmed (Compositing Bug)

**Status:** FIXED
**Date Fixed:** Jan 14, 2026
**Severity:** High
**Component:** La Mesa ticker / iOS Safari rendering

---

## Symptoms

On iPhone Safari, the bottom ticker (`.mesa-ticker`) intermittently appears semi-transparent on initial page load, even though the `.ticker-dimmed` class is not present.

Observed behavior:
1. Page loads → ticker looks dim (~50% opacity)
2. Scroll to another panel → ticker “snaps” to full opacity
3. After a short delay → ticker dims again and stays dimmed

Expected behavior:
- Ticker renders at `opacity: 1` by default
- Only dims when chat opens (JS adds `.ticker-dimmed`)

---

## Root Cause

iOS Safari sometimes mis-composites layers when combining:
- `position: fixed` elements (ticker/chat)
- animated `transform` (ticker scroll)
- `backdrop-filter` usage (chat/ticker dim mode)
- full-screen fixed overlays (`.vignette-overlay`, `.chromatic-aberration`)
- scroll containers using `-webkit-overflow-scrolling: touch` + scroll-snap

The result is a rendering-order/compositing glitch where an overlay layer is effectively painted “over” the ticker, making it look dim without any class or inline style changes on the ticker itself.

---

## The Fix

Add an iOS Safari-specific stabilization block that:
- forces the ticker into its own composited layer (`translate3d(0,0,0)` + `isolation: isolate`)
- increases z-index separation between overlays, chat backdrop, and the chat/ticker UI

---

## Files Changed

- `src/pages/index.astro` (CSS in the ticker section)

---

## How to Verify

1. On an iPhone, open the site in Safari and hard refresh.
2. Confirm the ticker is full opacity on initial load.
3. Open La Mesa chat → ticker dims (expected).
4. Close chat → ticker returns to full opacity and stays stable across scrolling.

