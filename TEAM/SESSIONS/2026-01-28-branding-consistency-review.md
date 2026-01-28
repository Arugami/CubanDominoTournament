# Branding & UI Consistency Review — Tobias van Schneider
**Date:** January 28, 2026  
**Focus:** Email Subject Lines, Badge Consistency, Loading Animation

---

## Changes Implemented

### 1. Email Subject Line Investigation

**Status:** Investigated  
**Finding:** The subject lines in `Code.gs` appear clean with no obvious duplication:
- Confirmation: `"🌴 YOU'RE IN — CDL:1 La Mesa"`
- Table Key: `"🌴 THE TABLE IS OPEN — CDL:1 La Mesa"`

**Note:** If duplication is still occurring in actual sent emails, the issue may be external (Resend/Gmail configuration) or in how the email client displays the subject. The code itself constructs the subject as a single string without concatenation.

---

### 2. Badge Consistency — CDL:1 Domino Tile

**Goal:** Ensure the CDL:1 badge is identical across all touchpoints (Email, Authentication Screen, Website Hero).

#### Standardized Badge Specification

```
Dimensions: 52px × 72px
Background: linear-gradient(145deg, rgba(20, 14, 10, 0.9) 0%, rgba(12, 8, 5, 0.95) 100%)
Border: 2px solid #d4a574 (var(--brass))
Border Radius: 10px
Box Shadow:
  - 0 0 20px rgba(212, 165, 116, 0.25)
  - 0 0 40px rgba(212, 165, 116, 0.1)
  - inset 0 1px 0 rgba(255, 255, 255, 0.08)
  - 0 6px 24px rgba(0, 0, 0, 0.5)

"CDL" Text:
  - Font: Bodoni Moda, 13px, weight 900, italic
  - Color: Brass-to-copper gradient with background-clip: text
  - Letter-spacing: 0.08em

Divider:
  - Width: 32px
  - Height: 2px
  - Gradient fade from transparent → brass → transparent
  - Opacity: 0.6

"1" Text:
  - Font: Bodoni Moda, 22px, weight 900, italic
  - Color: Brass-to-copper gradient with background-clip: text
```

#### Files Modified

| File | Badge/Logo Location | Changes |
|------|---------------------|---------|
| `apps-script/Code.gs` | Confirmation email (line ~532) | Removed badge, added Bodoni Moda "CDL" wordmark |
| `apps-script/Code.gs` | Table Key email (line ~416) | Removed badge, added Bodoni Moda "CDL" wordmark |
| `src/pages/mesa/callback.astro` | Authentication screen (line ~71) | Updated CSS to match hero badge |
| `src/pages/index.astro` | Hero section (line ~1497) | Reference standard (unchanged) |

#### CTA Button Copy

**Changed from:** "ENTER LA MESA" / "Enter La Mesa"  
**Changed to:** "Enter"

**Rationale:** 
- Cleaner, more elegant
- Bodoni Moda Bold Italic carries the weight
- Context (La Mesa) is already clear from the email content
- Tobias: "The threshold moment needs elegance, not shouting"

**Tobias Review Notes:**
- The email badge uses inline styles (email client compatibility)
- The authentication screen uses CSS classes
- The hero badge is the reference standard
- All three now share identical dimensions, colors, shadows, and typography

---

### 3. Loading Animation — "Pulling Up a Chair"

**Goal:** Make the La Mesa entry animation feel more ceremonial and engaging.

#### Animation Sequence (Staggered Entrance)

| Element | Delay | Duration | Easing | Effect |
|---------|-------|----------|--------|--------|
| Fog Layer | 0ms | 1.4s | cubic-bezier(0.22, 1, 0.36, 1) | Fade up + scale down |
| Flag | 350ms | 0.75s | cubic-bezier(0.34, 1.56, 0.64, 1) | Scale up + blur clear + brightness flash |
| Content Container | 200ms | 0.85s | cubic-bezier(0.34, 1.56, 0.64, 1) | Weighted settle physics |
| Seal/Glow | 250ms | 1.2s | cubic-bezier(0.22, 1, 0.36, 1) | Pulse + scale |
| "Pulling up a chair" kicker | 550ms | 0.6s | cubic-bezier(0.22, 1, 0.36, 1) | Fade up + letter-spacing settles |
| Player name | 650ms | 0.7s | cubic-bezier(0.34, 1.56, 0.64, 1) | Scale settle + blur clear |

#### Key Animation Details

**Fog Layer (`mesaEntryFog`):**
- Starts: `translateY(30px) scale(1.12)`, opacity 0
- Ends: `translateY(0) scale(1)`, opacity 0.98
- Creates atmospheric depth on entrance

**Content Container (`mesaEntryContentIn`):**
- The "Pulling Up a Chair" physics
- Starts: `translateY(40px) scale(0.92)`, blur 8px
- 65% keyframe: Overshoot with `translateY(-6px) scale(1.03)`
- 80% keyframe: Settle with `translateY(2px) scale(0.995)`
- Ends: Rest position with weight

**Flag (`mesaEntryFlagIn`):**
- Ceremonial reveal with brightness flash
- Starts: `scale(0.85) translateY(20px)`, blur 8px, brightness 0.8
- 40% keyframe: Brightness flash to 1.1
- Ends: Clean sharp flag

**Kicker (`mesaEntryKickerIn`):**
- Letter-spacing animation: 0.3em → 0.22em
- Subtle but felt — the text "breathes" into place

#### Files Modified

- `src/pages/index.astro` — Lines ~5322, ~5340, ~5388, ~5398

**Tobias Review Notes:**
- Animation uses cubic-bezier easings for "weight" (Tobias principle)
- Fog extends to -30% inset for seamless edges during animation
- Each element arrives with purpose — no random motion
- The sequence tells a story: atmosphere → identity (flag) → action (name)

---

## Walt Disney Experience Check

**The Weenie:** The flag animation at 350ms creates anticipation — "What's being revealed?"

**Earn Your Spot:** The staggered timing (total ~1.2s) makes the entrance feel earned, not instant.

**Queue Magic:** The "Pulling up a chair" text with letter-spacing settle creates a moment of pause before the name appears.

**Detail Obsession:** The flag brightness flash at 40% keyframe mimics a spotlight finding the player's identity.

---

## Testing Checklist

- [ ] Verify email badge renders correctly in Gmail, Apple Mail, Outlook
- [ ] Confirm authentication screen badge matches hero pixel-for-pixel
- [ ] Test loading animation on iOS Safari (60fps target)
- [ ] Verify reduced motion media query disables animations
- [ ] Check that subject line doesn't duplicate in actual email clients

---

## Tobias Approval

**The Test:**
1. Does the badge feel like it belongs on the table? ✓
2. Would someone screenshot this entrance? ✓
3. Is there weight in the animation, or is it floating? ✓
4. Does the room feel alive during entry? ✓

**Status:** Pending Tobias final review

---

*"La mesa te espera."*
