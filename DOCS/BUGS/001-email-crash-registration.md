# BUG-001: Email Failure Crashes Registration

**Status:** FIXED
**Date Fixed:** January 2025
**Severity:** Critical

---

## Symptoms
- Form submission fails with 500/502 error
- Registration not saved to Google Sheets
- Resend dashboard shows some emails as "Bounced" or "Suppressed"
- Error in Apps Script logs: `Email failed: {...}`

## Root Cause
The original `doPost()` function in `Code.gs` sent confirmation emails **before** returning success. If the email failed for any reason (invalid address, bounced, suppressed), the entire registration would fail - even though the data was already saved to the sheet.

```javascript
// OLD CODE - Email failure crashes the whole request
sendEmail(body.p1Email, subject, htmlBody);  // If this throws, registration fails
return json({ ok: true }, 200);
```

## Why Emails Can Fail
1. **Invalid email address** - typos like `test@yaho.com`
2. **Bounced** - mailbox doesn't exist (`TEST@yahoo.com`)
3. **Suppressed** - previously bounced, Resend won't retry
4. **Rate limited** - too many emails too fast
5. **API key issues** - wrong permissions or expired key

## The Fix
Wrap email sending in try/catch blocks so registration succeeds even if email delivery fails:

```javascript
// NEW CODE - Registration succeeds, email failure is logged but doesn't crash
try {
  sendEmail(body.p1Email, subject, htmlBody);
} catch (emailErr) {
  console.error("Failed to send email to p1:", body.p1Email, emailErr);
}
```

**Key insight:** The most important thing is capturing the registration data. Email confirmation is nice-to-have but shouldn't block the primary goal.

## Files Changed
- `apps-script/Code.gs` - Added try/catch around all `sendEmail()` calls in `doPost()`

## How to Verify
1. Submit form with a real email → Should get confirmation email
2. Submit form with fake email (test@fake.com) → Registration still saves, no email sent
3. Check Google Sheets → Both registrations should appear
4. Check Resend dashboard → Real email = Delivered, Fake email = Bounced
