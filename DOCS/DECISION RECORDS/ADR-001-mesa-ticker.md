# ADR-001: Mesa Ticker — ESPN-Style Activity Feed

**Status:** ✅ Mobile-First Complete  
**Date Created:** 2026-01-14  
**Last Updated:** 2026-01-14  
**Owner:** Tobias van Schneider (Design Philosophy), Dev Team  

---

## Context

The Cuban Domino League tournament landing page needed "ambient awareness" — a way to make the static lobby feel alive without being intrusive. Inspired by ESPN's live sports tickers, we implemented a persistent bottom ticker that scrolls activity (registrations, joins, chat messages) in real-time.

**Target Audience:** 90% mobile users. Desktop is secondary.

---

## Decision

Implement an **Expandable Ticker & Chat** system:
- **Ticker**: Always visible at the bottom of the viewport (40px height desktop, 34px mobile)
- **Chat Panel**: Slides up on demand when the ticker's chat button is tapped
- **Backdrop Dimming**: Main page content dims when chat is open

---

## Design Philosophy (Tobias van Schneider)

> "A ticker is a hallway. Make it a room."

### Core Principles Applied:
1. **"Physical Digital"** — The ticker should feel like a real ticker tape, not floating UI
2. **"Micro-Moments"** — Every event is a moment. Treat it like one.
3. **"Breath Spacing"** — Don't rush the scroll. Let users read.
4. **"Depth Through Layers"** — Use shadows, blur, and opacity for layering
5. **"Sound in Silence"** — Haptic feedback makes interactions feel tactile

---

## Implementation Log

### Session 1: 2026-01-14

#### ✅ COMPLETED

| Feature | Description | Status |
|---------|-------------|--------|
| Fixed Ticker | Ticker is `position: fixed` at bottom of viewport | ✅ Done |
| Expandable Chat | Chat slides up from bottom with `.is-open` class | ✅ Done |
| Backdrop Dimming | `.chat-backdrop` with blur + opacity | ✅ Done |
| Pause-on-Hover | `.mesa-ticker__track:hover` pauses animation | ✅ Done (Desktop) |
| **Touch-to-Pause** | `touchstart`/`touchend` pauses ticker on mobile with 1.5s resume delay | ✅ Done |
| Slower Scroll | Animation duration: 18s → 24s | ✅ Done |
| More Spacing | Item padding: 24px → 32px | ✅ Done |
| Inner Shadow | Subtle depth to ticker | ✅ Done |
| Event Icons | 🎟️ register, 💬 join, 🎙️ chat, 🏆 update | ✅ Done |
| Visual Hierarchy | Registrations = gold/bold, Joins = muted | ✅ Done |
| Haptic on Registration | `vibrate([10, 30, 10])` on new registration | ✅ Done |
| **JS Fallback for :has()** | `.ticker-dimmed` class added via JS for browser compat | ✅ Done |
| **Mobile Focus Shift** | Ticker dims when chat open, no hover-peek on mobile | ✅ Done |

#### ✅ ISSUES RESOLVED

| Issue | Description | Resolution |
|-------|-------------|------------|
| Focus Shift Not Visible | CSS `:has()` not working in all browsers | ✅ Added JS fallback with `.ticker-dimmed` class |
| Mobile Peek Missing | Hover-to-restore doesn't work on touch | ✅ Disabled hover-peek on mobile via `@media (min-width: 769px)` |
| No Touch Pause | `hover` to pause doesn't work on mobile | ✅ Added `touchstart`/`touchend` listeners with 1.5s delay |

#### 🟡 REMAINING POLISH (Nice-to-Have)

| Feature | Description | Priority |
|---------|-------------|----------|
| Event Entrance Animation | New events should fade/slide in, not just appear | 🟡 Medium |
| Variable Scroll Speed | High-priority events slow the ticker for 2-3s | 🟡 Medium |
| Chat Button Glow | Pulse glow when unread messages arrive | 🟡 Medium |

---

## Implementation Details

### 1. Touch-to-Pause (Mobile)
```javascript
// Mobile: Pause ticker on touch (since hover doesn't work on touch devices)
tickerTrack.addEventListener('touchstart', () => {
  tickerTrack.style.animationPlayState = 'paused';
}, { passive: true });

tickerTrack.addEventListener('touchend', () => {
  // Resume after a brief moment so user can read
  setTimeout(() => {
    tickerTrack.style.animationPlayState = 'running';
  }, 1500); // 1.5s delay before resuming
}, { passive: true });
```

### 2. Focus Shift (Desktop Peek, Mobile Static)
```css
/* Desktop only: restore on hover to "peek" */
@media (min-width: 769px) {
  .chat-widget:has(.chat-panel.is-open) .mesa-ticker:hover .mesa-ticker__track,
  .chat-widget:has(.chat-panel.is-open) .mesa-ticker:hover .mesa-ticker__badge {
    opacity: 1;
  }
}
/* On mobile: ticker stays dimmed, no hover restoration */
```

### 3. CSS `:has()` JS Fallback
```javascript
function toggleChat() {
  const isOpen = chatPanel.classList.contains('is-open');
  
  if (isOpen) {
    mesaTicker.classList.remove('ticker-dimmed'); // JS fallback
    // ...
  } else {
    mesaTicker.classList.add('ticker-dimmed'); // JS fallback
    // ...
  }
}
```

```css
/* JS Fallback for browsers without :has() support */
.mesa-ticker.ticker-dimmed {
  background: rgba(10, 6, 4, 0.85);
  backdrop-filter: blur(8px);
}
.mesa-ticker.ticker-dimmed .mesa-ticker__track,
.mesa-ticker.ticker-dimmed .mesa-ticker__badge {
  opacity: 0.5;
  transition: opacity 0.3s ease;
}
```

---

## File Locations

| Component | File | Lines (approx) |
|-----------|------|----------------|
| Ticker HTML | `src/pages/index.astro` | ~4098-4114 |
| Ticker CSS | `src/pages/index.astro` | ~1535-1820 |
| Ticker JS | `src/pages/index.astro` | ~5265-5395 |
| Toggle Logic | `src/pages/index.astro` | ~4908-4950 |

---

## Next Steps

1. [x] ~~Implement touch-to-pause for mobile~~
2. [x] ~~Add JS fallback for `:has()` selector (ticker dimming)~~
3. [x] ~~Disable hover-peek on mobile (keep ticker dimmed)~~
4. [ ] Test on actual iOS Safari and Android Chrome
5. [ ] Implement event entrance animations (optional polish)
6. [ ] Add chat button glow on unread (optional polish)

---

## Design Decisions Log

### Why 24s instead of 18s?
Tobias: "If your design feels rushed, your users will feel rushed." Slowing the scroll by ~30% lets users read each event as it passes.

### Why icons instead of just dots?
Scannability. Users can identify event types at a glance without reading. This is especially important on mobile where the text is smaller.

### Why dim the ticker when chat is open?
Focus hierarchy. When the chat is open, the user's primary task is conversation. The ticker becomes secondary information — still present, but not competing for attention.

### Why vibrate on registration?
Tobias: "Design isn't just what you see. It's what you feel." Haptic feedback turns a visual event into a tactile one, creating a "micro-celebration" when someone registers.

### Why 1.5s delay on touch-resume?
Mobile users need time to read. When they tap the ticker, it pauses. When they release, we give them an extra 1.5 seconds to finish reading before the scroll resumes. This is the "breath" Tobias talks about.

### Why no hover-peek on mobile?
Hover doesn't exist on touch devices. Rather than creating a confusing tap-to-peek interaction, we keep the ticker dimmed when chat is open. The user's focus should be on the conversation, not the ticker.

---

## Appendix: CSS Variables Used

```css
--brass: #d4a574;
--copper: #b76a3b;
--cream: #f5f0e8;
--muted: rgba(255, 255, 255, 0.3);
```

---

**Next ADR:** ADR-002 will cover the Chat Panel design decisions.
