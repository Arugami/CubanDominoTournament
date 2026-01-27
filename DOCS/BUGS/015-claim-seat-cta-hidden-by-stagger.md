# 015: Claim Seat CTA Hidden (Opacity 0 From Staggered Animation)

- **Status:** FIXED
- **Date Fixed:** Jan 27, 2026
- **Severity:** High

## Symptoms

- Post-auth Claim Seat screen shows flag runway + “Representing” card, but the primary CTA button (**CLAIM YOUR SEAT**) appears missing.
- DevTools inspection shows the button exists and is `display: block`, but has `opacity: 0`.

## Root Cause

- The identity overlay used a blanket stagger rule:
  - `.chat-identity > * { opacity: 0; animation: identityFadeUp ... forwards; }`
- The primary CTA (`#chatJoinBtn`) is **revealed later via JS** (after auth) using `display: none → block`.
- In some browsers/timings, this meant the CTA was effectively “born invisible”:
  - It existed and had layout (`display: block` + valid bounding box), but stayed at `opacity: 0` because it was still subject to the stagger rule.
- Even when visible, the CTA could also be **covered by the fixed ticker** (ticker has very high z-index).

## The Fix

- Exclude the CTA from the stagger system so it can’t inherit `opacity: 0`:
  - `.chat-identity > :not(#chatJoinBtn) { ...stagger... }`
  - `.chat-identity > #chatJoinBtn { opacity: 1 !important; animation: none !important; }`
- Pin the CTA above the ticker with a dedicated z-index:
  - `position: fixed; bottom: (ticker height + safe-area + padding); z-index: 10006`
- Defensive JS: when switching to the authed state, explicitly set `display`, `opacity`, and `visibility` for the CTA.

## Files Changed

- `src/pages/index.astro`

## How to Verify

1) Sign in with a Table Key (magic link)
2) Open La Mesa → Claim Seat identity screen
3) Expected:
   - The CTA button is visible and looks like the primary “declaration moment”
   - Clicking it triggers the entry ritual and lands hub-first
