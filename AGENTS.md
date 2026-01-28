# Cuban Domino League (CDL) - Agent Guide

> **"La mesa te espera."** (The table awaits you.)

This document provides essential information for AI coding agents working on the Cuban Domino League project.

---

## Project Overview

The Cuban Domino League (CDL) is a cultural institution and tournament platform for Cuban-style dominoes. The website serves as the primary entry point for tournament registration, featuring a cinematic, mobile-first landing page with integrated registration flow.

**Live Site:** https://cubandominoleague.com

**Current Event:** CDL:1 La Salida — January 31, 2026 at Stefan's Lounge (Fairview, NJ)

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend Framework** | [Astro](https://astro.build/) v5.16.8 | Static site generation |
| **Hosting** | Cloudflare Pages | Edge deployment & CDN |
| **Serverless Functions** | Cloudflare Pages Functions | API endpoints (Node.js runtime) |
| **Backend** | Google Apps Script | Data persistence, email sending |
| **Database** | Google Sheets | Registration storage (primary source of truth) |
| **Optional Realtime** | Supabase | La Mesa chat widget (optional) |
| **Email** | Resend API or GmailApp | Transactional emails |

---

## Project Structure

```
/
├── src/                          # Astro source code
│   ├── pages/                    # Page routes
│   │   ├── index.astro           # Main landing page (11,000+ lines, monolithic)
│   │   ├── bracket.astro         # Tournament bracket display
│   │   ├── standings.astro       # Player standings
│   │   ├── concepts.astro        # Design concept showcase
│   │   ├── mesa/
│   │   │   └── callback.astro    # La Mesa auth callback
│   │   └── admin/                # Admin panel pages
│   │       ├── index.astro       # Admin dashboard
│   │       ├── login.astro       # Auth0 login
│   │       ├── callback.astro    # Auth0 callback
│   │       ├── registrations.astro
│   │       ├── teams.astro
│   │       ├── bracket.astro
│   │       ├── round-robin.astro
│   │       ├── announcements.astro
│   │       ├── settings.astro
│   │       └── setup.astro
│   ├── components/               # Reusable components
│   │   ├── admin/
│   │   │   └── AdminLayout.astro # Shared admin layout
│   │   └── Bracket.astro         # Tournament bracket component
│   └── lib/
│       └── event.ts              # Tournament event configuration
├── functions/                    # Cloudflare Pages Functions
│   ├── api/
│   │   ├── register.ts           # Registration endpoint
│   │   ├── players.ts            # Player listing endpoint
│   │   ├── teams.ts              # Team listing endpoint
│   │   ├── admin/
│   │   │   └── roster.ts         # Admin roster management
│   │   └── mesa/
│   │       ├── table-key.ts      # La Mesa table key generation
│   │       └── verify.ts         # La Mesa seat verification
│   └── lib/
│       └── site-url.ts           # Site URL utilities
├── apps-script/
│   └── Code.gs                   # Google Apps Script backend (707 lines)
├── PUBLIC/                       # Static assets (configured as publicDir)
│   ├── FRAMES/                   # Cinematic panel images (WebP)
│   ├── FONT/                     # Custom fonts (SF Sports Night)
│   ├── CDL/                      # Brand assets
│   └── AUDIO/                    # Background music
├── supabase/                     # Supabase migrations/schema
├── kimi-cli/                     # CLI tooling
├── dist/                         # Build output (deployed to Cloudflare)
├── package.json                  # NPM dependencies
├── astro.config.mjs              # Astro configuration
├── wrangler.toml                 # Cloudflare Wrangler config
└── .dev.vars                     # Local environment variables
```

---

## Build and Development Commands

```bash
# Development server (Astro only, no API routes)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Test with Cloudflare Pages Functions locally
npm run build && wrangler pages dev dist

# Alternative: Run with Wrangler using proxy mode
npm run dev:pages:proxy
```

**Important:** Cloudflare Pages Functions (in `functions/`) do NOT run under `astro dev`. You must build and use `wrangler pages dev` to test API endpoints locally.

---

## Architecture: Three-Tier Registration Flow

```
┌─────────────┐     ┌─────────────────────────┐     ┌─────────────────────┐     ┌──────────────────────────┐
│   Browser   │────▶│  Cloudflare Function    │────▶│   Google Apps Script │────▶│   Google Sheets + Email  │
│  (Astro)    │     │  (/api/register.ts)     │     │     (Code.gs)        │     │                          │
└─────────────┘     └─────────────────────────┘     └─────────────────────┘     └──────────────────────────┘
       │                       │                            │
       │                       │                            ├─► Writes to "Registrations" sheet
       │                       │                            ├─► Sends confirmation to player
       │                       │                            └─► Sends notification to HOST_EMAILS
       │                       │
       │                       ├─► Validates form data
       │                       ├─► Honeypot spam check
       │                       ├─► Generates La Mesa Table Key (optional)
       │                       └─► Forwards to Apps Script
       │
       └─► 5-panel scroll-snap UI
           Inline CSS/JS (no external bundles)
           Mobile-first design
```

---

## Environment Variables

### Cloudflare Pages Environment Variables (Production)

```bash
# Required for registration flow
APP_SCRIPT_URL="https://script.google.com/macros/s/.../exec"
APP_SCRIPT_SECRET="long-random-shared-secret"
VENUE_URL="https://maps.google.com/?q=333+Bergenline+Blvd,+Fairview,+NJ"

# Optional: La Mesa realtime chat
PUBLIC_SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Optional: Server-side Supabase (for Table Key emails)
SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Optional: Canonical site URL override
SITE_URL="https://cubandominoleague.com"
```

### Google Apps Script Properties

Set in: Extensions → Apps Script → Project Settings → Script Properties

```bash
SHARED_SECRET="same-as-APP_SCRIPT_SECRET"
HOST_EMAILS="admin1@email.com,admin2@email.com"

# Optional
SHEET_NAME="Registrations"          # Defaults to "Registrations"
RESEND_API_KEY="re_..."             # If set, uses Resend; otherwise GmailApp
FROM_EMAIL="Cuban Domino League <no-reply@cubandominoleague.com>"
SPREADSHE_ID="..."                  # Specific sheet ID (or uses active)
```

---

## Design System: The Bone Language

**Critical:** 99% of users are on mobile devices. Every decision must prioritize mobile experience.

### Visual Philosophy
- **Vibe:** Cuban cigar lounge × ESPN UFC broadcast × domino ritual
- **Core Question:** "Does this feel like it belongs on the table?"
- **Approach:** Mobile-first, touch-friendly, native-app feel

### Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| `--ink` | `#1c130f` | Primary dark (like mahogany) |
| `--muted` | `#594a3f` | Secondary text |
| `--copper` | `#b76a3b` | CTAs, buttons, emphasis |
| `--cream` | `#f8efe6` | Light backgrounds |
| `--bone` | `#fff7ef` | Domino tile base, cards |
| `--brass` | `#d4a574` | Accents, text highlights |
| `--gold` | `#ffd700` | Champion moments, victory |

### Typography (LOCKED)

| Font | Role | Weights |
|------|------|---------|
| **Bodoni Moda** | Display, Headlines | 400, 700, 800, 900 + Italic |
| **IBM Plex Sans** | Body, UI | 400, 500, 600 + Italic |
| **IBM Plex Sans Condensed** | Labels, Stats | 600, 700 |
| **SF Sports Night** | Broadcast labels (La Mesa only) | Regular |

### Key CSS Variables
```css
:root {
  --radius-bone: 12px;      /* Primary radius - matches domino tile */
  --radius-carved: 8px;     /* Inner surfaces */
  --radius-pip: 50%;        /* Circular dots only */
}
```

### Design Principles
1. **No pill shapes** - Use 12px radius (the "bone"), never 999px
2. **No flat design** - Everything needs depth, shadow, atmosphere
3. **No pure white** - Use cream/bone instead
4. **No generic blue** - Stay in brass/copper family
5. **Touch targets** - Minimum 44×44px, 48×48px preferred
6. **Thumb zones** - Primary actions in bottom 2/3 of screen

**Full design system:** See `DESIGN-SYSTEM.md` for comprehensive guidelines.

---

## Scroll Architecture: 5-Panel Layout

The landing page uses a cinematic scroll-snap layout:

1. **Hero** — Event branding, date/venue, registration progress
2. **Whisper** — "You've sat here before" (ancestry/recognition)
3. **Build** — "We didn't build La Mesa" (heritage narrative)
4. **Slam** — "Te toca" (the challenge)
5. **Form** — Registration (the conversion)

**Known friction point:** The form panel content can exceed viewport height on mobile, making it feel "stuck". Consider this when making changes.

---

## Security Considerations

### Honeypot Spam Protection
Hidden "company" field in form. Bots fill it; humans don't. Both `register.ts` and `Code.gs` check this field is empty.

### Multi-Layer Validation
1. Client-side HTML5 validation
2. Cloudflare function (`register.ts`) - checks required fields, email format
3. Apps Script (`Code.gs`) - re-validates before writing to sheet

### Secret-Based Auth
`APP_SCRIPT_SECRET` in Cloudflare must match `SHARED_SECRET` in Apps Script properties.

### XSS Vulnerability (Known Issue)
User input in email templates is not HTML-escaped. See `AUDIT.md` Critical Issue #1.

---

## Testing the Registration Flow

```bash
# 1. Build and run locally
npm run build
wrangler pages dev dist

# 2. Submit form on localhost

# 3. Verify:
#    - Row appears in Google Sheet
#    - Confirmation email sent to player
#    - Notification sent to HOST_EMAILS
```

---

## Deployment

**Automatic:** Push to `main` branch triggers Cloudflare Pages deployment.

**Manual:**
```bash
npm run build
wrangler pages deploy dist
```

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/pages/index.astro` | Main site (11,671 lines, inline CSS/JS) |
| `src/lib/event.ts` | Tournament configuration (date, venue, etc.) |
| `functions/api/register.ts` | Registration API endpoint |
| `apps-script/Code.gs` | Backend (Sheets, emails, admin APIs) |
| `DESIGN-SYSTEM.md` | Complete design guidelines |
| `CLAUDE.md` | Context for Claude Code |
| `AUDIT.md` | Known issues and improvement backlog |
| `SETUP.md` | Setup instructions for new environments |
| `STATUS.md` | Current project status and goals |

---

## Important Patterns

### Mobile-First CSS
```css
/* Base styles are mobile */
.element { ... }

/* Tablet */
@media (min-width: 768px) { ... }

/* Desktop */
@media (min-width: 1024px) { ... }
```

### Button Gradient Strategy
- **Public CTAs:** Copper → dark diagonal (ESPN punch / action)
- **La Mesa/La Oficina:** Gold → brass → copper vertical (ceremonial threshold)

### The La Mesa Tile
The floating chat toggle is a **vertical domino tile** (56×90px desktop, 60×96px mobile), NOT a pill button.

---

## Known Issues (See AUDIT.md)

- **Critical:** XSS vulnerability in email templates
- **Critical:** No `prefers-reduced-motion` support
- **Critical:** Viewport zoom restriction (`maximum-scale=1`)
- **High:** 8.3MB unoptimized PNG image
- **High:** Missing form label accessibility
- **High:** No duplicate registration prevention
- **Medium:** No rate limiting on registration endpoint
- **Medium:** Monolithic 368KB HTML file (index.astro)

---

## Communication Style

This project uses a distinctive voice inspired by Cuban domino culture:
- **Formal but warm** — "La mesa te espera"
- **Heritage-focused** — References to tradition and lineage
- **Confident but not aggressive** — No forced "competitive" language
- **Spanish phrases** — Used sparingly for cultural authenticity

**Example CTAs:**
- "Claim Your Seat"
- "Enter La Mesa"
- Not: "WIN BIG!" or "Compete Now!"

---

*For complete setup instructions, see `SETUP.md`. For design details, see `DESIGN-SYSTEM.md`. For current project status, see `STATUS.md`.*

*"La mesa te espera."*
