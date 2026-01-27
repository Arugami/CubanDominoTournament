# CDL Master TODO
## Everything We Need To Do

> *"A dream without a plan is just a wish."*

---

## 🔴 CRITICAL — Before Tournament I (Jan 31)

### Registration & Teams
- [x] Verify first player registration + roster sync (Google Sheet → Admin) ✅
- [ ] Get first team formed in La Mesa + imported into tournament teams (proof of concept)
- [ ] Reach 4 teams (halfway)
- [ ] Reach 8 teams (full tournament)
- [ ] Create waitlist system if we exceed capacity
- [ ] Confirm all registered teams 48 hours before
- [ ] La Mesa login-required rollout (Table Key): set Cloudflare env vars `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (server-side)
- [ ] La Mesa login-required rollout (Table Key): allow redirect URL `/mesa/callback` in Supabase Auth settings
- [ ] La Mesa login-required rollout (Table Key): apply migration `supabase/migrations/20260126_mesa_player_auth.sql`
- [ ] Confirmation email: include one-click **“Claim Your Seat”** Table Key button (ADR-003)
- [ ] Apps Script deploy: enable `mesa_lookup_player` + `mesa_send_table_key` actions and updated confirmation email CTA (ADR-003)
- [ ] Local full-stack test: run Pages Functions via Wrangler (Astro dev alone won’t serve `/functions/*`)
- [ ] Email deliverability: stop Supabase bouncebacks (configure custom SMTP like Resend/Postmark; use valid test emails only)

### Venue & Logistics
- [ ] Confirm Stefan's Lounge booking
- [ ] Site visit — measure space, plan layout
- [ ] Determine table setup (how many games simultaneously?)
- [ ] Plan bracket/tournament flow (ADR-004: Group Stage A/B → Semis → Final)
- [ ] Equipment list (tables, dominoes, scoreboards)
- [ ] Source quality domino sets
- [ ] Backup dominoes
- [ ] Printed brackets
- [ ] Signage for venue

### Marketing & Outreach
- [ ] Create Instagram account (@cubandominoleague)
- [ ] Create TikTok account
- [ ] First post — announcement
- [ ] Outreach to North Jersey Cuban community (Union City, West New York)
- [ ] Outreach to NYC Cuban community
- [ ] Find 3-5 OG players to invite/feature
- [ ] Flyer design for local distribution
- [ ] Print flyers
- [ ] Distribute flyers at Cuban spots

### Content & Production
- [ ] Plan filming setup for Tournament I
- [ ] Camera equipment sourced
- [ ] Audio equipment (table mic for slams)
- [ ] Shot list for the event
- [ ] Identify 2-3 compelling player stories to follow
- [ ] B-roll shot list (cigars, cafecito, atmosphere)

### Brand & Design
- [ ] **Create CDL logo/brandmark** — Needed for hero page top-left corner (see session 2026-01-12). Currently using "Cuban Domino League presents" text but logo would clean up hierarchy.
- [ ] Finalize CDL logo usage guidelines
- [ ] Create social media templates
- [ ] Event poster/graphic
- [ ] Player name tags/cards
- [ ] Winner trophy/prize presentation

---

## 🟡 IMPORTANT — First 30 Days After Tournament I

### Content Creation
- [ ] Edit Tournament I highlight reel (60-90 seconds)
- [ ] Create 5-10 short clips for social
- [ ] Full match edit of finals
- [ ] Player profile videos
- [ ] "Best slams" compilation
- [ ] "Best trash talk" compilation
- [ ] Behind-the-scenes content
- [ ] Winner interview

### Growth & Community
- [ ] Post-tournament email to all participants
- [ ] Gather testimonials
- [ ] Photo gallery on website
- [ ] Announce Tournament II date
- [ ] Start Tournament II registration
- [ ] Build email list
- [x] Community chat (Built into website!)

### Brand Development
- [ ] Brand guidelines document (colors, fonts, usage)
- [ ] Tagline finalized ("Your seat's waiting" or alternative)
- [ ] Tone of voice guide
- [ ] Photography style guide
- [ ] Video style guide

### Partnerships
- [ ] Identify potential sponsors (local first)
- [ ] Cigar brands outreach
- [ ] Cuban coffee brands outreach
- [ ] Local Cuban restaurants/businesses
- [ ] Media outreach (local Cuban press)

---

## 🟢 FUTURE — Building The League

### Expansion
- [ ] Tournament II planning
- [ ] Miami market research
- [ ] North Jersey venue scouting
- [ ] Regular league night format?
- [ ] Rankings/standings system
- [ ] Player profiles database

### Broadcast & Media
- [ ] YouTube channel setup
- [ ] Streaming capability research
- [ ] Commentary team identification
- [ ] Broadcast graphics package
- [ ] Theme music/audio branding

### Business & Operations
- [ ] Legal entity formation
- [ ] Bank account
- [ ] Sponsorship deck
- [ ] Pricing structure for future events
- [ ] Merchandise exploration
- [ ] Website upgrades (player profiles, brackets, etc.)

### Technology
- [ ] Live scoring system?
- [ ] Bracket management tool
- [ ] Player registration database
- [x] Mobile-friendly improvements (90% of users are mobile - optimized chat, ticker, safe areas)
- [ ] Apply migration `supabase/migrations/20260127194500_group_stage_system.sql` (ADR-004)
- [ ] Verify `/admin/round-robin` builds groups and `/admin/bracket` seeds finals from groups
- [ ] La Mesa login-required rollout (Table Key): deploy Apps Script updates + Cloudflare env vars (ADR-003)

---

## By Department

### Dana White (CEO)
- [ ] Secure venue confirmation
- [ ] Set budget for Tournament I
- [ ] Identify potential sponsors to approach
- [ ] Overall timeline accountability

### Jay-Z (Chief Brand Officer)
- [ ] Approve final brand positioning
- [ ] Review all public-facing materials
- [ ] Cultural authenticity check
- [ ] "Cool factor" gut check on everything

### Capablanca (Commissioner)
- [ ] Official ruleset document
- [ ] Tournament format finalized
- [ ] Dispute resolution process
- [ ] Fair play guidelines

### Benny Binion (Tournament Ops)
- [ ] Event day run-of-show
- [ ] Registration/check-in process
- [ ] Bracket management
- [ ] Prize distribution plan
- [ ] Venue layout diagram
- [ ] Pace policy (suggested): 10-second move clock / shot clock
- [ ] Matchday cadence: 3 group matchdays → seed semis → final
- [ ] Pace policy (suggested): 10-second move clock / shot clock
- [ ] Matchday cadence: 3 group matchdays → seed semis → final

### Herb Lubalin (Brand Identity)
- [ ] **CDL logo concepts** — Priority! Needed for hero page and all branding
- [ ] Typography system
- [ ] Color specifications
- [ ] Logo usage guidelines

### George Lois (Advertising)
- [ ] Tagline options
- [ ] Flyer/poster concept
- [ ] Social ad concepts
- [ ] Messaging hierarchy

### Wes Anderson (Visual Style)
- [ ] Color palette hex codes
- [ ] Photography direction
- [ ] Video composition rules
- [ ] Event aesthetic direction

### Wifredo Lam (Artistic Director)
- [ ] Cultural authenticity review
- [ ] Symbolic elements guidance
- [ ] Spiritual/ceremonial aspects
- [ ] Cuban heritage verification

### Daisy Expósito-Ulla (Marketing)
- [ ] Social media strategy
- [ ] Community outreach plan
- [ ] Content calendar
- [ ] Influencer/OG identification
- [ ] North Jersey community connections

### Steve Lipscomb (Broadcast & Production)
- [ ] Equipment list
- [ ] Filming plan
- [ ] Shot list
- [ ] Audio setup
- [ ] Post-production workflow

---

## Completed ✅

- [x] Assemble dream team (10 legends)
- [x] **cubandominoleague.com LIVE**
- [x] Registration system working
- [x] Venue identified (Stefan's Lounge, 333 Bergenline Blvd, Fairview, NJ)
- [x] Date set (January 31, 2026)
- [x] Visual assets created (4 panels)
- [x] Team documentation complete
- [x] Domain secured and pointing
- [x] Git-connected Cloudflare Pages deployment configured
- [x] Environment variables set in Cloudflare (APP_SCRIPT_URL, APP_SCRIPT_SECRET, VENUE_URL)
- [x] Custom domain migrated to new Git-connected project
- [x] Old direct-upload project deleted
- [x] **"Who's In So Far"** - Live display of registered teams on form panel
- [x] **Live Tournament Chat** - Real-time chat using Supabase for pre-tournament hype
- [x] Website copy finalized (all panels reviewed by Dream Team)
- [x] Music toggle hides on mobile when form is visible
- [x] **Chat enhancements** - @mention highlighting, pixel flag avatars, pinned messages
- [x] **Registration form cleanup** - Removed redundant copy, simplified UX
- [x] **Rules panel** - Added "Your move." footer
- [x] **Local dev setup** - .env and .dev.vars for full local testing with Supabase
- [x] **Supabase schema updated** - avatar, reactions, is_pinned columns added
- [x] **La Mesa redesign** - ESPN-style ticker, expandable chat panel, backdrop dimming
- [x] **Mesa Ticker** - Live activity feed showing registrations/joins (ESPN sports broadcast style)
- [x] **Mobile scroll lock bug** - Fixed send button disappearing, page zoom issue
- [x] **Ticker visibility on mobile** - Ticker now shows below chat input when chat is open
- [x] **Chat simplified** - Removed reaction system (+ button, emoji picker) for cleaner UX
- [x] **Domino button redesign** - 50% larger with heartbeat pulse animation
- [x] **Touch-to-pause** - Mobile users can tap ticker to pause and read
- [x] **Focus hierarchy** - Ticker dims when chat is open, restored on close
- [x] **Pip visibility refinement** - Stays visible above form header, hides only when fields reach top
- [x] **Pip tooltip** - First touch shows "Chat here" above domino button, guiding chat discovery
- [x] **Admin announcements UI redesign** - Color-coded type badges (cyan info, red alert, purple hype, gold winner), visual priority system (orange glow for high, red pulse for urgent), improved card contrast and button styling
- [x] **Panel 2-4 animation timing fix** - Removed 1.5s mobile lock cap, compressed animation timings so climax moments ("Te toca", "SEAT") land before scroll unlock on iPhone Safari

---

## Deployment Guide: Cloudflare Pages + Git

### How It Works Now
Every `git push` to `main` automatically deploys to cubandominoleague.com.

### Build Configuration
| Setting | Value |
|---------|-------|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Production branch | `main` |

### Environment Variables (Set in Cloudflare Dashboard)
```
APP_SCRIPT_URL=https://script.google.com/macros/s/XXXXX/exec
APP_SCRIPT_SECRET=your-shared-secret
VENUE_URL=https://maps.google.com/?q=333+Bergenline+Blvd,+Fairview,+NJ
```

### Deploy Workflow
```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push origin main
# Cloudflare automatically builds and deploys
```

### Cloudflare Dashboard
- **Project**: cubandominotournament
- **Custom domain**: cubandominoleague.com
- **Settings → Environment variables**: Add secrets here
- **Deployments**: View build logs and rollback if needed

### Migration History (January 2025)
Original project (`cuban-domino-league`) was created via `wrangler pages deploy` (direct upload).
Since Git cannot be added to direct-upload projects, we created a new Git-connected project
(`cubandominotournament`), migrated the custom domain, and deleted the old project.

**Status: Complete** — All deploys now happen automatically via `git push`.

---

## Notes

### January 14, 2026 — La Mesa Redesign
- Implemented ESPN-style ticker for "ambient awareness" — shows registrations, joins, chat activity
- 90% of users are on mobile; all features optimized for touch
- Removed reaction system (too cluttered) — keeping chat simple and focused
- Design decision: Ticker stays visible below chat input on mobile for continuous activity feed
- See `DOCS/DECISION RECORDS/ADR-001-mesa-ticker.md` for full design rationale

### Design Philosophy (Tobias)
> "A ticker is a hallway. Make it a room."

Key principles applied:
- **Physical Digital** — Domino button has weight, slam animations
- **Breath Spacing** — 24s scroll speed, 1.5s pause on touch
- **Focus Hierarchy** — Ticker dims when chat open, conversation takes priority

---

**Last Updated:** January 19, 2026 (panel animation timing fix for mobile)

*"Your seat's waiting."*
