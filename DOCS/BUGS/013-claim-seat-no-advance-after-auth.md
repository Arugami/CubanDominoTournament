# 013: Claim Seat Has No Clear Advance (Flag Picker + CTA)

- **Status:** FIXED
- **Date Fixed:** Jan 27, 2026
- **Severity:** High

## Symptoms

- After successful Table Key auth, the user lands on the Claim Seat identity screen and can scroll flags but:
  - It feels like flags can’t be “chosen”, and/or
  - There is no obvious way to advance into the La Mesa hub (CTA not visible).

## Root Cause

- The Claim Seat layout centers a cluster of elements (`justify-content: center`) inside an absolute overlay.
- The CTA lived in normal flow and could end up below the visible fold on smaller viewports.
- Flag selection relied primarily on tapping a flag (which can be hard to interpret inside a scroll-snap carousel).

## The Fix

- Pin the **CLAIM YOUR SEAT** CTA to the bottom of the identity overlay so it is always visible.
- Reserve extra bottom padding so content never sits underneath the CTA.
- Ensure the CTA sits **above the fixed ticker** (desktop: 46px, mobile: 40px) so it can’t be covered on small viewports.
- Treat “scroll settle” (the centered flag) as the selection so choosing works via scrolling, not only tapping.

## Files Changed

- `src/pages/index.astro`

## How to Verify

1) Sign in via Table Key (magic link)
2) Open La Mesa → Claim Seat screen
3) Expected:
   - CTA is visible at the bottom
   - CTA is not covered by the ticker on mobile/desktop
   - Scrolling the flag strip updates the selected flag
   - Tapping **CLAIM YOUR SEAT** runs the entry ritual and lands hub-first (Who’s Here / Board / Tonight)
