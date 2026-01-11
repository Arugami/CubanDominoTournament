# BUG-002: Resend API Key Permissions

**Status:** FIXED
**Date Fixed:** January 2025
**Severity:** High

---

## Symptoms
- Emails only send to your own verified email address
- Error: "You can only send testing emails to your own email address"
- 403 Forbidden responses from Resend API

## Root Cause
When you create a Resend API key, there are two types:
1. **Sending access** - Can only send to your own email (for testing)
2. **Full access** - Can send to any email address

The default/first key created is often "Sending access" only.

## The Fix
1. Go to [Resend Dashboard](https://resend.com/api-keys)
2. Create a new API key with **Full access** permissions
3. Update the key in Apps Script:
   - Edit the `setProperties()` function with new key
   - Run `setProperties()` to update Script Properties
   - Or manually update in Project Settings → Script Properties

## Verification Checklist
- [ ] Domain verified (DKIM ✓, SPF ✓) in Resend dashboard
- [ ] API key has "Full access" permission
- [ ] Test by sending to an external email address

## Files Changed
- `apps-script/Code.gs` - Updated `RESEND_API_KEY` in `setProperties()` function
