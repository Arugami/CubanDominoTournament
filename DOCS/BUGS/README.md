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
