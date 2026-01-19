# Cuban Domino Tournament Website Audit

**Last Updated:** January 2026
**Status:** 23 improvements identified, 0 completed

---

## Summary

| Priority | Count | Status |
|----------|-------|--------|
| Critical | 4 | 0/4 |
| High | 4 | 0/4 |
| Medium | 8 | 0/8 |
| Low | 7 | 0/7 |

---

## Critical Issues

### 1. XSS Vulnerability in Email Templates
- [ ] **Not Started**
- **File:** `apps-script/Code.gs` (Lines 337-341, 352, 366, 380-382)
- **Problem:** User input directly interpolated into HTML emails without sanitization
- **Risk:** HTML/JS injection in emails sent to hosts
- **Fix:** Add `escapeHtml()` function and sanitize all user inputs before email templating
```javascript
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
```

### 2. No `prefers-reduced-motion` Support
- [ ] **Not Started**
- **File:** `src/pages/index.astro` (entire CSS section)
- **Problem:** Zero instances of reduced motion media query - WCAG 2.1 violation
- **Risk:** Users with vestibular disorders, epilepsy cannot use site safely
- **Fix:** Add global reduced-motion styles:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 3. Viewport Zoom Restriction
- [ ] **Not Started**
- **File:** `src/pages/index.astro` (Line 14)
- **Problem:** `maximum-scale=1` prevents user zoom
- **Risk:** Accessibility violation - visually impaired users cannot zoom
- **Fix:** Change to `maximum-scale=5` or remove restriction entirely

### 4. 8.3MB PNG Image
- [ ] **Not Started**
- **File:** `PUBLIC/FRAMES/rules-nyc-test.png`
- **Problem:** Unoptimized 8.3MB PNG (1536x2752)
- **Risk:** Blocks page load on slow connections, massive data usage
- **Fix:** Convert to WebP (~500KB-1MB), add responsive variants with `srcset`

---

## High Priority Issues

### 5. Form Label Accessibility
- [ ] **Not Started**
- **File:** `src/pages/index.astro` (Lines 9124-9145)
- **Problem:** `<label>` elements missing `for` attributes
- **Risk:** Screen readers won't associate labels with inputs
- **Fix:** Add `for="fieldId"` to all labels, add matching `id` to inputs

### 6. No Duplicate Registration Prevention
- [ ] **Not Started**
- **Files:** `functions/api/register.ts`, `apps-script/Code.gs`
- **Problem:** Same email can register multiple times
- **Fix:** Add email uniqueness check in Apps Script before insert:
```javascript
function emailExists(email) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Registrations');
  const emails = sheet.getRange('C:C').getValues().flat();
  return emails.includes(email.toLowerCase());
}
```

### 7. Focus States Missing
- [ ] **Not Started**
- **File:** `src/pages/index.astro` (Lines 4559, 5054, 5767, 5855, 5885, 6930)
- **Problem:** `outline: none` without visible fallback focus indicator
- **Risk:** Keyboard users lose track of focus position
- **Fix:** Add `:focus-visible` styles with visible indicator:
```css
:focus-visible {
  outline: 2px solid #D4AF37;
  outline-offset: 2px;
}
```

### 8. Low Contrast Text
- [ ] **Not Started**
- **File:** `src/pages/index.astro` (Lines 2943-2944)
- **Problem:** `.whisper-greeting { color: rgba(255,255,255,0.3) }` - fails WCAG AA
- **Fix:** Increase opacity to at least 0.6 for decorative-but-readable text

---

## Medium Priority Issues

### 9. No Rate Limiting
- [ ] **Not Started**
- **File:** `functions/api/register.ts`
- **Problem:** Anyone can spam registration submissions
- **Fix:** Add IP-based rate limiting using Cloudflare KV (5 requests/hour per IP)

### 10. Phone Validation Missing
- [ ] **Not Started**
- **Files:** `functions/api/register.ts`, `apps-script/Code.gs`
- **Problem:** No format validation for phone numbers
- **Fix:** Add US phone format validation (10 digits minimum)

### 11. Monolithic 368KB HTML File
- [ ] **Not Started**
- **File:** `src/pages/index.astro` (11,671 lines)
- **Problem:** All CSS/JS/HTML in one file hurts caching, parsing performance
- **Fix:** Extract into Astro components, separate CSS modules

### 12. Heavy Animation Performance
- [ ] **Not Started**
- **File:** `src/pages/index.astro` (55+ keyframes)
- **Problem:** 12 ember particles, 6-layer text-shadows cause jank on low-end phones
- **Fix:** Reduce particles on mobile, simplify text-shadow layers

### 13. Missing SEO/Meta Tags
- [ ] **Not Started**
- **File:** `src/pages/index.astro`
- **Problem:** No Open Graph image, no JSON-LD Event schema, no canonical URL
- **Fix:** Add og:image, Event schema markup, canonical link

### 14. Debug Console Code in Production
- [ ] **Not Started**
- **File:** `src/pages/index.astro` (Lines 10770-10776, 11341-11360, 11646-11668)
- **Problem:** 23 console statements including elaborate debug UI
- **Fix:** Remove all debug logging before production

### 15. Form Panel Overflow Feedback
- [ ] **Not Started**
- **File:** `src/pages/index.astro` (Lines 8199-8206)
- **Problem:** Users don't know form content scrolls within panel
- **Fix:** Add scroll indicator when content exceeds viewport

### 16. Supabase Error Handling
- [ ] **Not Started**
- **File:** `src/pages/index.astro` (Lines 10166-10172, 11399)
- **Problem:** Broadcast/presence errors fail silently, no unsubscribe on leave
- **Fix:** Add `.catch()` handlers, unsubscribe on `beforeunload`

---

## Low Priority Issues

### 17. Email Validation Regex
- [ ] **Not Started**
- **File:** `functions/api/register.ts` (Line 28)
- **Problem:** Basic regex too permissive
- **Fix:** Use RFC 5322 compliant pattern with length check (max 254 chars)

### 18. Loading Screen Persists
- [ ] **Not Started**
- **File:** `src/pages/index.astro` (Lines 88-96)
- **Problem:** Loading screen animations continue after `.is-passive`
- **Fix:** Add `display: none` or stop animations after passive class applied

### 19. Chat Panel Missing ARIA Role
- [ ] **Not Started**
- **File:** `src/pages/index.astro` (Line 9347)
- **Problem:** No ARIA role on chat panel
- **Fix:** Add `role="dialog"` and proper focus trap

### 20. SVG Icons Missing Descriptions
- [ ] **Not Started**
- **File:** `src/pages/index.astro` (Lines 9338, 9454, 9489)
- **Problem:** SVG icons have no alt text or aria-label
- **Fix:** Add `aria-label` or `aria-hidden="true"` for decorative icons

### 21. Font Loading Strategy
- [ ] **Not Started**
- **File:** `src/pages/index.astro` (Line 23)
- **Problem:** No `font-display` on Google Fonts import
- **Fix:** Add `&display=swap` to font URL

### 22. Email Send Retry
- [ ] **Not Started**
- **File:** `apps-script/Code.gs` (Lines 235-246)
- **Problem:** Failed emails not retried
- **Fix:** Add `emailSentAt` column, implement retry mechanism for nulls

### 23. Weak Secret Handling
- [ ] **Not Started**
- **File:** `functions/api/register.ts` (Lines 57-59)
- **Problem:** Secret passed in JSON body instead of header
- **Fix:** Move to `X-App-Secret` HTTP header for better security

---

## Implementation Phases

### Phase 1: Security & Accessibility (2-3 hours)
Items: #1, #2, #3, #5, #7, #8

**Quick wins in this phase:**
- Add `prefers-reduced-motion` CSS block (5 min)
- Remove `maximum-scale=1` from viewport (1 min)
- Add `escapeHtml()` to Apps Script (10 min)
- Add `for` attributes to form labels (5 min)

### Phase 2: Performance (3-4 hours)
Items: #4, #11, #12, #18, #21

**Key task:** Convert 8.3MB PNG to WebP and create responsive variants

### Phase 3: Backend Hardening (2-3 hours)
Items: #6, #9, #10, #16, #17

**Key tasks:** Duplicate prevention, rate limiting, validation improvements

### Phase 4: Polish (2-3 hours)
Items: #13, #14, #15, #19, #20, #22, #23

**Quick win:** Remove debug console statements (10 min)

---

## Files Affected

| File | Issues |
|------|--------|
| `src/pages/index.astro` | #2, #3, #5, #7, #8, #11, #12, #13, #14, #15, #16, #18, #19, #20, #21 |
| `functions/api/register.ts` | #6, #9, #10, #17, #23 |
| `apps-script/Code.gs` | #1, #6, #10, #22 |
| `PUBLIC/FRAMES/rules-nyc-test.png` | #4 |

---

## Verification Checklist

### Accessibility
- [ ] Run axe DevTools - zero errors
- [ ] Verify zoom works to 200%
- [ ] Test with VoiceOver on iOS
- [ ] Check reduced motion with system preference

### Performance
- [ ] Lighthouse mobile score > 90
- [ ] Test on iPhone SE (low-end device)
- [ ] Total page weight < 2MB
- [ ] LCP < 2.5s on 3G

### Security
- [ ] Test XSS payloads in registration form
- [ ] Verify HTML escaping in email preview
- [ ] Confirm rate limiting blocks spam

### Backend
- [ ] Test duplicate email submission (should fail)
- [ ] Test rate limiting (6th request should fail)
- [ ] Verify email retry for failures

---

## Notes

- Line numbers reference the current codebase and may shift as changes are made
- All fixes should be tested on mobile Safari (primary user base)
- See `CLAUDE.md` for deployment instructions
