# BUG-005: Astro CSS Scoped Selector Stripping

**Status:** FIXED (workaround)
**Date Fixed:** January 13, 2026
**Severity:** Medium

---

## Summary

Astro's CSS scoping incorrectly strips parent selectors from descendant rules when using `:hover` or custom class selectors, causing CSS to apply globally instead of conditionally.

---

## The Problem

When writing scoped CSS like this:

```css
/* Hide button by default */
.reaction-add {
  display: none;
}

/* Show on hover */
.chat-message:hover .reaction-add {
  display: flex;
}
```

Astro compiled it to:

```css
.reaction-add[data-astro-cid-xxx]{display:none}
.reaction-add[data-astro-cid-xxx]{display:flex}  /* Parent selector STRIPPED! */
```

The `.chat-message:hover` parent was completely removed, causing `.reaction-add` to always have `display: flex` (the second rule wins).

---

## What We Tried (All Failed)

1. **opacity/visibility** - Same issue, parent selectors stripped
2. **More specific selectors** (`.chat-message:hover > .wrapper > .reactions > .reaction-add`) - Still stripped
3. **Separate rules** (not combined with comma) - Both rules still stripped
4. **`!important`** - Didn't help because both rules got `!important`

---

## The Solution

Use `<style is:global>` for rules that require parent selectors:

```astro
<style>
  /* Base styles - scoped is fine */
  .reaction-add {
    width: 28px;
    height: 28px;
    /* ... other styles ... */
  }
</style>

<style is:global>
  /* Visibility rules - must be global to preserve parent selectors */
  .reaction-add {
    display: none !important;
  }
  .chat-message:hover .reaction-add,
  .chat-message.tapped .reaction-add {
    display: flex !important;
  }
</style>
```

This bypasses Astro's CSS scoping entirely for these specific rules, preserving the parent selectors correctly.

---

## Why This Happens

Astro's CSS scoping adds `[data-astro-cid-xxx]` attributes to selectors for component isolation. However, the optimization/minification step appears to incorrectly merge or simplify selectors that share the same target element (`.reaction-add`), stripping the parent context.

This may be a bug in:
- Astro's CSS scoping logic
- The underlying CSS minifier (likely Lightning CSS)
- How Astro handles pseudo-selectors (`:hover`) with scoped styles

---

## Affected Versions

- Astro 5.x (confirmed)
- Possibly earlier versions

---

## Related Files

- `src/pages/index.astro` - Contains both scoped and global style blocks
- Lines ~3656-3666 - The `<style is:global>` block with the fix

---

## Lessons Learned

1. **Test compiled CSS output** - Always verify what Astro actually generates
2. **Use `is:global` sparingly** - Only for rules that require parent selectors
3. **Keep global rules minimal** - Only the visibility toggle, not all button styles
4. **`!important` won't save you** - If both rules get it, cascade still applies

---

*Documented by the CDL Dev Team*
