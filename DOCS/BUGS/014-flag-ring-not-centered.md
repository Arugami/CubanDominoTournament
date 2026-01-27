# 014: Flag Ring Not Perfectly Centered (Claim Seat Selector)

- **Status:** FIXED
- **Date Fixed:** Jan 27, 2026
- **Severity:** Medium

## Symptoms

- On the Claim Seat (post-auth) screen, the “gold selector ring” around the centered flag appears slightly off-center relative to the flag circle.
- The misalignment can vary by browser/device and looks worse during scroll/settle animations.

## Root Cause

- The ring and the flag were not sharing the same centering reference:
  - The ring was centered using the container geometry.
  - The flag image could be offset inside the container due to padding/alignment (`padding-top` + `justify-content: flex-start`) and transforms.
- Earlier versions also attempted to place pseudo-elements on an `<img>` which is unreliable across browsers.

## The Fix

- Make each flag option a true square container and center its contents:
  - `.avatar-option { width: 48px; height: 48px; justify-content: center; padding-top: 0; }`
- Attach the ring to the option container (not the `<img>`) and center it at `50%/50%`.
- Ensure the flag image is layered above the ring with a `z-index`.

## Files Changed

- `src/pages/index.astro`

## How to Verify

1) Sign in with a Table Key (magic link)
2) Open La Mesa → Claim Seat identity screen
3) Scroll the flag runway and stop on multiple flags
4) Expected:
   - The gold ring is perfectly centered around the visible flag circle
   - No “drift” between ring and flag as the centered flag changes

