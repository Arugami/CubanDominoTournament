# BUG-011: Loading Screen Never Dismisses (Inline Script SyntaxError)

**Date:** 2026-01-26  
**Status:** Fixed  
**Severity:** High (blocks the entire site experience)  
**Area:** Boot / loading overlay + inline script compilation  
**Primary file:** `src/pages/index.astro`  

---

## Summary

On page load, the CDL loading screen remained visible and the Hero never appeared.

This was caused by a **JavaScript SyntaxError** early in the inline script, which prevented the rest of the initialization code from running (including the code that dismisses the loader).

---

## Symptoms

- Page shows the CDL loading screen indefinitely.
- DevTools console shows:
  - `Uncaught SyntaxError: missing ) after argument list`
- Everything that normally runs on boot (animations, scroll hints, ticker init, etc.) stops.

---

## Root Cause

We attempted to inject a server-side value into an inline `<script>` by writing:

- `new Date(${JSON.stringify(EVENT.firstSlamAt)})`

Astro **does not evaluate `${...}` placeholders inside raw `<script>` text**, so the literal characters `${...}` shipped into `dist/index.html`, producing invalid JavaScript and crashing the boot script.

---

## Fix

- Moved the server-side value into markup as a `data-*` attribute:
  - `data-first-slam-at={EVENT.firstSlamAt}` on `#mesaHubCountdown`
- Updated the countdown code to read the target ISO string from the DOM at runtime:
  - `hubCountdownEl.getAttribute('data-first-slam-at')`

---

## Files Changed

- `src/pages/index.astro`

---

## How to Verify

1) Run the site and reload the home page.
2) Confirm:
   - Loading screen dismisses and Hero renders.
   - Console has **no SyntaxError**.
3) Confirm the countdown still works:
   - `document.getElementById('mesaHubCountdown').getAttribute('data-first-slam-at')` returns an ISO timestamp.

---

## Prevention

- Do not try to inject server-side values using `${...}` inside raw `<script>` content.
- Prefer:
  - `data-*` attributes + runtime reads, or
  - Astro’s supported client injection patterns (e.g., `define:vars`).

