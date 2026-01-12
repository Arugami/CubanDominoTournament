# Bug 004: Supabase Script Not Loading

**Date:** January 11, 2026
**Status:** RESOLVED
**Severity:** High
**Component:** Live Chat Feature

---

## Problem

When implementing the live chat feature using Supabase, the chat button would not respond to clicks and sending messages showed "Chat is still loading. Please try again."

## Root Cause

The Supabase client library was being loaded via a `<script src="...">` tag placed before our inline script. However, external scripts can load asynchronously even when placed sequentially in HTML, causing our code to execute before `window.supabase` was available.

```html
<!-- This script might not finish loading before the next script runs -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<script>
  // This runs immediately, but window.supabase may be undefined
  const supabase = window.supabase.createClient(...);
</script>
```

## Console Errors

```
TypeError: Cannot read properties of null (reading 'then')
    at subscribeToMessages
```

## Solution

Dynamically load the Supabase script with a Promise wrapper that ensures the script is fully loaded before initializing the client:

```javascript
function loadSupabaseScript() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.47.10/dist/umd/supabase.min.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Wait for script to load, then initialize
loadSupabaseScript().then(() => {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  // Now safe to use supabase
});
```

## Additional Safeguards

Added null checks before any Supabase operations:

```javascript
async function sendMessage() {
  if (!supabase) {
    initSupabase();
    if (!supabase) {
      alert('Chat is still loading. Please try again.');
      return;
    }
  }
  // ... rest of function
}
```

## Lesson Learned

When using external CDN scripts that are needed immediately, either:
1. Load them dynamically with `onload` callback
2. Use a module bundler (npm install + import)
3. Add loading state UI to handle async initialization

---

## Related Files

- `src/pages/index.astro` (lines 2247-2277)

## Commit

`50390d6` - Add live chat and "Who's In" team display
