# Bug Documentation

This folder contains documentation for bugs that have been identified and fixed.

## Format
Each bug gets its own file with the naming convention:
- `NNN-short-description.md` (e.g., `001-email-crash-registration.md`)

## Current Bugs

| ID | Title | Status | Date |
|----|-------|--------|------|
| 001 | Email Failure Crashes Registration | FIXED | Jan 2025 |
| 002 | Resend API Key Permissions | FIXED | Jan 2025 |
| 003 | Gmail Fallback Removed | FIXED | Jan 11, 2025 |
| 004 | Supabase Script Not Loading | FIXED | Jan 11, 2026 |
| 005 | Astro CSS Scoped Selector Stripping | FIXED | Jan 13, 2026 |
| 006 | iOS Safari Ticker Appears Dimmed | FIXED | Jan 14, 2026 |
| 007 | Panel 3 Green/Red Color Flash | FIXED | Jan 19, 2026 |
| 008 | La Mesa Entry Transition Flicker | OPEN | Jan 26, 2026 |
| 009 | La Mesa Hub Not Visible After "Claim Your Seat" (Panel Scroll Jump) | FIXED | Jan 26, 2026 |
| 010 | Full-Page Screenshot Shows Repeated Ticker/La Mesa UI (Stitching Artifact) | NOT A BUG | Jan 26, 2026 |
| 011 | Loading Screen Never Dismisses (Inline Script SyntaxError) | FIXED | Jan 26, 2026 |
| 012 | Supabase Magic Link Redirects to Site Root (`/#...`) | FIXED | Jan 27, 2026 |
| 013 | Claim Seat Has No Clear Advance (Flag Picker + CTA) | FIXED | Jan 27, 2026 |
| 014 | Flag Ring Not Perfectly Centered (Claim Seat Selector) | FIXED | Jan 27, 2026 |

## Template
When documenting a new bug, include:
- **Status:** FIXED / OPEN / IN PROGRESS
- **Date Fixed:** When it was resolved
- **Severity:** Critical / High / Medium / Low
- **Symptoms:** What users/developers see
- **Root Cause:** Why it happened
- **The Fix:** What was changed
- **Files Changed:** Which files were modified
- **How to Verify:** Steps to confirm the fix works
