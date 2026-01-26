# BUG-010: Full-Page Screenshot Shows Repeated Ticker/La Mesa UI (Stitching Artifact)

**Date:** 2026-01-26  
**Status:** Not a bug (expected screenshot behavior)  
**Area:** Visual QA / screenshots (iOS + Chrome/DevTools “full page capture”)  

---

## Summary

When taking a **full-page** screenshot, the bottom ticker and/or La Mesa panel can appear **repeated** multiple times down the image (as if the UI duplicated).

This is almost always a **screenshot stitching artifact**: the capture tool scrolls the page and stitches multiple viewports together, and **fixed-position elements** (like the ticker) can get captured in every slice.

---

## Symptoms

- Full-page capture shows the ticker repeated over and over.
- Sometimes the La Mesa panel/presence sheet also appears repeated in the stitched image.
- Looks like duplicated DOM or repeated rendering, but the live page behaves normally.

---

## Root Cause

Full-page screenshot tools typically:

1) Scroll the document in increments and capture multiple viewport images  
2) Stitch them into a single image  

Fixed elements (`position: fixed`) stay on-screen during each capture step, so they can appear **multiple times** in the stitched result.

---

## Not Actually Happening (Common Misread)

- The ticker is not being rendered multiple times in the DOM.
- La Mesa hub modules are not duplicating.
- This does not indicate a layout loop.

---

## How to Verify (Quick)

1) In DevTools, check the DOM count:
   - One `#mesaTicker`
   - One `#chatPanel`
   - One `#mesaHubStack`

2) Take a normal viewport screenshot (not “full page”).
   - The repetition disappears.

3) If you need a clean full-page capture:
   - Temporarily disable the ticker (e.g., hide it with CSS) before capturing, or
   - Use a capture tool that supports “hide fixed elements” during stitching.

---

## Prevention (Team QA Guidance)

- Treat “repeating fixed UI in full-page screenshots” as a **QA false positive** unless verified in the DOM.
- Prefer:
  - viewport screenshots, or
  - recorded screen capture for behavior issues.

