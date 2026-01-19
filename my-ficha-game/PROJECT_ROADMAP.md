# MyFicha - Project Roadmap

**Last Updated**: November 25, 2024
**Current Phase**: Phase 2 (Core Gameplay) - In Progress

---

## 🎯 Vision

Build an authentic Cuban Dominoes experience that captures the soul of Friday night games - warm, tactile, and deeply cultural.

---

## ✅ Phase 1: Foundation (COMPLETED)

**Goal**: Establish solid technical foundation with Cuban aesthetic

### Completed Tasks
- [x] Project scaffold (Vite + React 18 + TypeScript)
- [x] Tailwind CSS with Cuban color palette
- [x] PWA configuration with offline support
- [x] Testing setup (Vitest + React Testing Library)
- [x] ESLint + Prettier configuration
- [x] Core domino engine (pure TypeScript, 34 tests passing)
- [x] Supabase schema documentation
- [x] Project documentation (README, .gitignore)

**Deliverables**: Fully tested game engine, project structure, development environment

---

## 🚧 Phase 2: Core Gameplay (IN PROGRESS)

**Goal**: Create polished local gameplay experience

### Phase 2.1: Basic UI ✅ (COMPLETED)
- [x] Game board component with chain visualization
- [x] Player hand display
- [x] Score tracking with progress bars
- [x] Game controls (pass turn)
- [x] Cuban lingo overlays (¡ME PEGUÉ!, ¡TRANQUE!, ¡POLLONA!, ¡CAPICÚA!)
- [x] Spanish localization throughout UI
- [x] Valid move indicators with visual feedback

### Phase 2.1b: Style Guide & Tokens ✅
- [x] Color + semantic tokens (wood/felt/brass, state colors)
- [x] Spacing scale and type scale
- [x] Animation curve library (slam overshoot, settle, pulse)
- [x] Haptic vocabulary (tap, invalid, warning, win flourish)
- [x] Icon stroke weight and shadow tokens

### Phase 2.1.5: Visual Polish ✅ (COMPLETED)
- [x] **"Cuban Midnight" aesthetic** throughout entire app
  - Radial vignette background (deep blue → black)
  - Wood texture panels for all UI components
  - Brass coin button styling with realistic shadows
  - Aged ivory tile gradients
- [x] **Game table enhancement**
  - Wood frame border with felt center
  - Noise texture overlay for realism
  - Pool-of-light vignette effect
  - End-tile glowing for valid moves
  - Pulsing directional arrows (LEFT/RIGHT)
- [x] **Component theming**
  - ScoreBoard: Wood panel with embossed gold numbers
  - PlayerHand: Wood texture with ivory tiles
  - GameControls: Brass buttons with Spanish text
  - Start screen: Dramatic title with atmospheric presentation
- [x] **Spanish localization enhancements**
  - "Marcador", "Jugador", "Ronda", "Meta"
  - "Paso" / "No Puedo" buttons
  - "Esperando primera ficha..."
  - Start screen tagline: "Donde cada ficha cuenta una historia..."
- [x] **Premium Domino Tiles** (Nov 25, 2024)
  - Traditional pip patterns (0-9) replacing numeric display
  - Embossed/recessed pips with inner shadows
  - Beveled edges with realistic depth
  - Multi-layer realistic shadows (close, mid, far)
  - Surface texture overlay (subtle grain)
  - Recessed separator groove
  - 3D tilt effects on drag (perspective transforms)
  - Lift animations on hover/selection
  - Haptic feedback integration (PWA vibration API)
  - Horizontal tile orientation on table (landscape)
  - DominoTile shared component for consistency

### Phase 2.2: Interactions ✅ (COMPLETED)
- [x] **Drag-and-drop tiles** from hand to table
  - HTML5 drag API implementation
  - Touch support for mobile
  - Visual drag preview with 3D tilt
  - Directional indicators (LEFT/RIGHT pulsing arrows)
- [x] **Tile placement animations**
  - Slam animation (280ms cubic-bezier overshoot)
  - Invalid move shake animation (100ms)
  - Lift animations on hover/selection
- [x] **Valid end highlights** on tile select (left/right glow + directional hints)
- [x] **Slam feedback**: brightness pulse + sound sync on place
- [x] **Sound effects** (Web Audio API, procedural generation)
  - Tile pickup sound (800Hz→200Hz tap, 50ms)
  - Tile placement slam (120Hz bass + harmonics + noise texture)
  - Invalid move feedback (gentle error tone)
  - Pass turn chime (two-tone 440Hz→330Hz)
  - Victory fanfare (C major chord progression, 9 notes)
  - Tranque dramatic effect (descending sawtooth 600Hz→150Hz)

### Phase 2.3: Polish ✅ (COMPLETED)
- [x] **Enhanced turn indicators**
  - Current player highlighting with ring glow + pulsing badge
  - Pulsing green dot in footer with player name
  - "YOUR TURN" badge on scoreboard
  - Smooth transition animations (300ms)
- [x] **Loading states and transitions**
  - LoadingTransition component with animated domino icon
  - Fade-in animations for game UI
  - Smooth game start transition (600ms)
  - Backdrop blur effects for polish
- [x] **Error handling with user-friendly messages**
  - Toast notification system (4 types: success, error, warning, info)
  - Auto-dismiss after 3 seconds
  - Color-coded with icons (✓, ✕, ⚠, ⓘ)
  - Integrated throughout game flow
- [x] **Keyboard shortcuts** (ESC to deselect, P to pass, 1/2 to play)
  - Global keyboard event handling
  - Visual hints showing shortcut keys
  - Dedicated keyboard shortcuts legend panel
  - N for new game when finished
- [x] **Accessibility improvements** (ARIA labels, focus management)
  - Semantic roles (region, list, listitem, status)
  - Descriptive aria-labels on all interactive elements
  - aria-live regions for dynamic content
  - aria-selected and aria-disabled states
  - Complete screen reader support

### Phase 2.4: Visual Refinement (IN PROGRESS)
- [ ] **Fix tile rendering consistency**
  - Issue: Board tiles look different from hand tiles despite using same component
  - Root cause: `orientation="horizontal"` prop triggers width/height swapping logic
  - Solution: Simplify DominoTile to always render vertically, let parent handle rotation
  - Files: `DominoTile.tsx`, `GameTable.tsx`
  - Expected outcome: Identical tile appearance in hand and on board

**Deliverables**: Fully playable local game with rich interactions, polish, and accessibility ✅

---

## 📡 Phase 3: Multiplayer

**Goal**: Enable real-time multiplayer with matchmaking

### Phase 3.1: Backend Setup
- [ ] Create Supabase project
- [ ] Apply database schema from `docs/SUPABASE_SCHEMA.md`
- [ ] Configure Row Level Security (RLS) policies
- [ ] Set up environment variables

### Phase 3.2: Authentication
- [ ] Implement Supabase Auth client
- [ ] Guest authentication (anonymous play)
- [ ] Email/password sign up
- [ ] Social auth (Google, optional)
- [ ] User profile management

### Phase 3.3: Real-time Sync
- [ ] Game state synchronization via Supabase Realtime
- [ ] Presence indicators (who's online)
- [ ] Optimistic UI updates
- [ ] Conflict resolution
- [ ] Connection state handling (offline/reconnect)
- [ ] Connection UX: subtle latency indicator, seat dim on disconnect, auto-recover without modals

### Phase 3.4: Matchmaking
- [ ] Join random game (quick match)
- [ ] Create private room with code
- [ ] Invite players to room
- [ ] Room lobby with player list
- [ ] Game start coordination
- [ ] 2v2 team formation

**Deliverables**: Working multiplayer with real-time sync

---

## 🎨 Phase 4: Polish & Features

**Goal**: Add cultural richness and social features

### Phase 4.1: Extended Lingo
- [ ] Viajera detection (100+ points in round)
- [ ] Capicúa detection (tile fits both ends)
- [ ] "Bota gorda" callout (high tiles early)
- [ ] "Estoy en la playa" (all low tiles)
- [ ] Contextual lingo based on game events

### Phase 4.2: Chat System
- [ ] Ephemeral text chat (disappears after game)
- [ ] Pre-canned Cuban phrases ("¡Qué jugada!", "Así no se juega")
- [ ] GIF integration (Tenor/Giphy API)
- [ ] Chat reactions/emojis
- [ ] Profanity filter (keeping it family-friendly)

### Phase 4.3: Leaderboards & Stats
- [ ] Cuban Domino Score (CDS) calculation
- [ ] Global leaderboard
- [ ] Personal statistics dashboard
- [ ] Match history
- [ ] Achievement badges

### Phase 4.4: Mobile Polish
- [ ] Haptic feedback on tile placement
- [ ] Optimized touch targets
- [ ] Landscape mode support
- [ ] iOS PWA installation prompt
- [ ] Android TWA consideration

**Deliverables**: Rich social experience with cultural authenticity

---

## 🔮 Phase 5: Advanced Features

**Goal**: Premium experiences and engagement

### Phase 5.1: 3D Havana Table
- [ ] React Three Fiber integration
- [ ] 3D tile models
- [ ] Realistic lighting and shadows
- [ ] Camera controls
- [ ] Performance optimization
- [ ] Fallback to 2D on low-end devices
- [ ] Feature-flagged + lazy-loaded three stack to keep main bundle lean

### Phase 5.2: AI Opponents
- [ ] AI strategy engine
- [ ] Difficulty levels (Easy, Medium, Hard)
- [ ] Named AI personalities ("Abuela Rosa", "Tío Pepe")
- [ ] AI trash talk with Cuban phrases
- [ ] Practice mode

### Phase 5.3: Tournaments
- [ ] Create tournament bracket
- [ ] Swiss-system tournaments
- [ ] Prize pool tracking (virtual currency)
- [ ] Tournament leaderboards
- [ ] Scheduled events

### Phase 5.4: Analytics
- [ ] Player behavior tracking
- [ ] A/B testing framework
- [ ] Performance monitoring
- [ ] Error logging (Sentry)
- [ ] User feedback system

**Deliverables**: Premium features for engaged players

---

## 🧪 Quality Assurance (Ongoing)

### Testing
- [x] Core engine unit tests (34 tests)
- [ ] Component tests (React Testing Library)
- [ ] Integration tests for game flows
- [ ] E2E tests (Playwright/Cypress)
- [ ] Visual regression tests
- [ ] Performance testing

### Deployment
- [ ] Staging environment setup
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Automated testing in CI
- [ ] Lint + test gates on PRs
- [ ] Preview deploys per PR
- [ ] Production deployment (Vercel/Netlify)
- [ ] CDN configuration
- [ ] Analytics integration
- [ ] Error monitoring
- [ ] Performance budgets: initial bundle ≤ 3MB, 60fps target on mid phones, table tex ≤ 2048², felt ≤ 1024²
- [ ] Accessibility: ARIA labels, reduced-motion mode, high-contrast toggle

**Deliverables**: Robust, production-ready application

---

## 📊 Success Metrics

### Phase 2 Completion
- [ ] Average game session > 10 minutes
- [ ] UI responsiveness < 100ms
- [ ] Zero critical bugs
- [ ] Mobile-friendly (Lighthouse > 90)

### Phase 3 Completion
- [ ] Real-time sync latency < 200ms
- [ ] Successful game completion rate > 95%
- [ ] Average matchmaking time < 30 seconds
- [ ] Player retention > 40% (week 1)

### Phase 4+ Completion
- [ ] Monthly active users > 1000
- [ ] Average session length > 15 minutes
- [ ] CDS leaderboard engagement > 20%
- [ ] Positive user feedback > 4.5/5

---

## 🎲 Current Sprint

**Focus**: Phase 2.3 Complete ✅ → Phase 3 Multiplayer (Next)

**Recently Completed** (Nov 26, 2024):
- ✅ **Enhanced turn indicators** (ring glow, pulsing badge, green dot)
- ✅ **Keyboard shortcuts** (ESC, P, 1/2, N with visual hints)
- ✅ **Error handling** (Toast notification system with 4 types)
- ✅ **Loading transitions** (animated domino icon, fade effects)
- ✅ **Accessibility improvements** (ARIA labels, roles, screen reader support)
- ✅ **Complete Phase 2.3 Polish** - All tasks completed!

**Phase 2 Complete Summary** (Nov 25-26, 2024):
- ✅ Premium domino visuals with authentic pip rendering
- ✅ Cuban-themed UI (wood texture, felt table, brass coins)
- ✅ Complete drag-and-drop system with 3D tilt animations
- ✅ Sound effects system (6 procedural sounds, Web Audio API)
- ✅ Tile placement animations (slam, shake, lift)
- ✅ Directional indicators (LEFT/RIGHT pulsing arrows)
- ✅ Keyboard shortcuts and accessibility (WCAG compliant)
- ✅ Error handling and loading transitions

**Next Phase** (Phase 3.1 - Backend Setup):
1. Create Supabase project
2. Apply database schema
3. Configure RLS policies
4. Set up environment variables

**Blockers**:
- None - Ready for Phase 3!

**Notes**:
- Dev server running on localhost:5173
- All 34 engine tests passing
- Sound manager: `/src/engine/audio.ts` with singleton pattern
- Visual + audio feedback fully integrated
- Bundle size: ~197 KB (includes DominoTile + animations + sound system)
- Ready for Phase 2.3 polish or Phase 3 multiplayer
