# 015: Claim Seat CTA Hidden (Opacity 0 From Staggered Animation)

- **Status:** FIXED
- **Date Fixed:** Jan 27, 2026
- **Severity:** High

## Symptoms

- Post-auth Claim Seat screen shows flag runway + “Representing” card, but the primary CTA button (**CLAIM YOUR SEAT**) appears missing.
- DevTools inspection shows the button exists and is `display: block`, but has `opacity: 0`.

## Root Cause

- The identity overlay uses a blanket stagger rule:
  - `.chat-identity > * { opacity: 0; animation: identityFadeUp ... forwards; }`
- The CTA is often revealed later via JS (after auth), so by the time it becomes visible, the animation timeline may already be over and the element can remain at `opacity: 0`.

## The Fix

- Override the CTA to be visible when shown:
  - `.chat-identity__btn { opacity: 1; animation: none; }`

## Files Changed

- `src/pages/index.astro`

## How to Verify

1) Sign in with a Table Key (magic link)
2) Open La Mesa → Claim Seat identity screen
3) Expected:
   - The CTA button is visible and looks like the primary “declaration moment”
   - Clicking it triggers the entry ritual and lands hub-first

