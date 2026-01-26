# BUG-009: La Mesa Hub Not Visible After "Claim Your Seat" (Panel Scroll Jump)

**Date:** 2026-01-26  
**Status:** Fixed  
**Area:** La Mesa (hub stack + entry ritual)  
**Primary file:** `src/pages/index.astro`

---

## Summary

After completing the **"CLAIM YOUR SEAT"** flow, the La Mesa **hub modules** (Who's Here / The Board / Tonight) appeared to be "missing".

The hub stack was actually present in the DOM, but the **entire chat panel (`#chatPanel`) had been scrolled down**, pushing the header + hub out of view. This made it look like a CSS visibility/peek-mode issue.

---

## Symptoms

- User completes identity selection and taps **CLAIM YOUR SEAT**.
- Ritual runs, chat interface appears, but the user lands in the **chat transcript / input area** instead of the hub.
- Hub content seems "gone" even though the panel is in Full mode.
- Debugging can be misleading because `.chat-panel.is-open.is-peek .mesa-hub-stack { display: none; }` exists, and `is-peek` was suspected.

---

## Root Cause

1) `#chatPanel` unintentionally became a **scroll container** (nested flex + missing `min-height: 0` behavior).  
2) During/after the entry transition, focus/scroll behavior could cause the browser to scroll the nearest scroll container to reveal content (often the composer), resulting in a large `chatPanel.scrollTop` jump.  

Net effect: the hub modules were above the viewport inside the panel even though they were still rendered.

---

## Fix (What We Changed)

### CSS guardrails

- Prevent the panel from behaving like a scroll container:
  - `overflow: clip;` on `.chat-panel` (with `overflow: hidden` fallback).
- Ensure nested flex children can scroll properly (so the body scrolls, not the panel):
  - `min-height: 0;` on `.chat-main` and `.chat-body-container`.

### JS guardrails

- On open/close/ritual transitions, explicitly pin scroll:
  - `chatPanel.scrollTop = 0;`
  - `chatBodyContainer.scrollTop = 0;`
- Avoid auto-focusing the composer in Full mode (hub-first). Only auto-focus in Peek mode (chat-first).

---

## Regression Tests (Manual)

1) Clear identity and start fresh:
   - `localStorage.removeItem('cdl_chat_identity');`
2) Ensure registered (so La Mesa opens):
   - `localStorage.setItem('cdl_registered','true');`
3) Open La Mesa, pick a name, tap **CLAIM YOUR SEAT**.
4) After ritual completes:
   - Hub modules are visible immediately.
   - `document.getElementById('chatPanel').scrollTop === 0`
   - `document.getElementById('mesaHubStack')` has computed `display: grid` in Full mode.

Peek mode check:
1) Dock to Peek.
2) Hub is hidden (expected).
3) Composer focus is allowed (expected).

---

## Preventing Reintroduction

- Treat `#chatPanel` as a **shell**: it should never be the scroll container.
- Only `.chat-body-container` (and `.chat-messages`) should scroll.
- Do not auto-focus the composer on entry to Full mode; it can trigger scroll jumps and hide the hub.

