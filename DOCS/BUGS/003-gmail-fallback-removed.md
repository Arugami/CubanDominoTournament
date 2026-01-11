# BUG-003: Gmail Fallback Removed

**Status:** FIXED
**Date Fixed:** January 11, 2025
**Severity:** Medium (security/professionalism concern)

---

## Problem
The `sendEmail()` function in `Code.gs` had a Gmail fallback - if Resend wasn't configured, it would send emails using `GmailApp.sendEmail()`. This sends from your personal Gmail address, which:

1. Looks unprofessional (emails come from `yourname@gmail.com` instead of `no-reply@cubandominoleague.com`)
2. Exposes personal email to all registrants
3. Could hit Gmail daily sending limits
4. Might go to spam

## Old Code
```javascript
function sendEmail(to, subject, html) {
  const resendApiKey = getScriptProp("RESEND_API_KEY", "");
  if (resendApiKey) {
    return sendEmailViaResend({...});
  }
  // PROBLEM: Falls back to personal Gmail
  return GmailApp.sendEmail(to, subject, stripHtml(html), { htmlBody: html });
}
```

## The Fix
Removed Gmail fallback entirely. If Resend isn't configured, email sending will fail (and be caught by the try/catch wrapper added in BUG-001).

```javascript
function sendEmail(to, subject, html) {
  const resendApiKey = getScriptProp("RESEND_API_KEY", "");
  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY not configured - email cannot be sent");
  }
  return sendEmailViaResend({...});
}
```

Also removed the `switchToGmail()` helper function and replaced it with `checkResendConfig()` diagnostic function.

## Files Changed
- `apps-script/Code.gs`
  - Modified `sendEmail()` to require Resend
  - Replaced `switchToGmail()` with `checkResendConfig()`

## Impact
- Registration will still succeed even if email fails (per BUG-001 fix)
- Must have `RESEND_API_KEY` configured for emails to send
- Run `checkResendConfig()` to verify Resend is properly set up
