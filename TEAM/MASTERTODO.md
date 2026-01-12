# CDL Master TODO
## Everything We Need To Do

> *"A dream without a plan is just a wish."*

---

## 🔴 CRITICAL — Before Tournament I (Jan 31)

### Registration & Teams
- [ ] Get first team registered (proof of concept)
- [ ] Reach 5 teams (halfway)
- [ ] Reach 10 teams (full tournament)
- [ ] Create waitlist system if we exceed capacity
- [ ] Confirm all registered teams 48 hours before

### Venue & Logistics
- [ ] Confirm Mr Garcia Cigars booking
- [ ] Site visit — measure space, plan layout
- [ ] Determine table setup (how many games simultaneously?)
- [ ] Plan bracket/tournament flow
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
- [ ] Mobile-friendly improvements

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
- [x] Venue identified (Mr Garcia Cigars)
- [x] Date set (January 31, 2025)
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
VENUE_URL=https://mrgarciacigars.com/
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

*Add notes from team discussions here*

---

**Last Updated:** January 12, 2026

*"Your seat's waiting."*
