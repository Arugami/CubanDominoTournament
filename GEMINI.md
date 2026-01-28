# Cuban Domino Tournament (CDL)

## Project Overview

This project is the digital home for the **Cuban Domino League (CDL)**, specifically for its inaugural tournament ("La Salida"). It is a visually rich, mobile-first web application designed to capture the "ritual" and "heritage" of Cuban dominoes.

**Key Characteristics:**
- **Vibe:** "Cuban cigar lounge × ESPN UFC broadcast" (see `DESIGN-SYSTEM.md`).
- **User Base:** 99% mobile traffic. Design is strictly mobile-first.
- **UX:** Single-page application with a 5-panel scroll-snap layout (Hero, Ancestry, Heritage, Challenge, Registration).
- **Features:** Real-time chat ("La Mesa"), live ticker, registration system, waitlist management.

## Tech Stack & Architecture

- **Frontend:** [Astro](https://astro.build) (Static Site Generator).
- **Hosting:** Cloudflare Pages.
- **Backend/API:**
    - **Registration:** Cloudflare Pages Functions (`functions/api/register.ts`) proxying to Google Apps Script.
    - **Database (Registration):** Google Sheets (via Apps Script).
    - **Realtime (Chat):** [Supabase](https://supabase.com).
    - **Emails:** Resend (via Apps Script).

**Data Flow (Registration):**
`Browser Form` -> `Cloudflare Pages Function` -> `Google Apps Script` -> `Google Sheets` + `Email (Resend)`

## Project Structure

```text
/
├── .dev.vars              # Local development environment variables (secrets)
├── astro.config.mjs       # Astro configuration (Public dir: ./PUBLIC, Out dir: ./dist)
├── apps-script/           # Google Apps Script backend code (Code.gs)
├── functions/             # Cloudflare Pages Functions (API endpoints)
├── PUBLIC/                # Static assets (images, fonts, audio) - Note: NOT "public/"
├── src/
│   ├── pages/
│   │   ├── index.astro    # Main entry point (the entire site is effectively here)
│   │   └── admin/         # Admin dashboard pages
│   └── lib/               # Shared logic (event details, site URL)
├── supabase/              # Database migrations and config
├── DESIGN-SYSTEM.md       # "The Bone Language" - CRITICAL visual guidelines
├── CLAUDE.md              # Developer workflow and architecture details
└── MASTERTODO.md          # Project roadmap and task tracker
```

## Critical Files

- **`src/pages/index.astro`**: The heart of the application. Contains the 5-panel layout, inline CSS variables, and main component logic.
- **`DESIGN-SYSTEM.md`**: The bible for visual style. Defines colors (`--copper`, `--ink`), typography (Bodoni Moda, IBM Plex Sans), and the "Bone Language" (domino tile aesthetics). **Read this before making any UI changes.**
- **`functions/api/register.ts`**: The edge function handling form submissions.
- **`apps-script/Code.gs`**: The Google side of the backend. Handles Sheet insertions and email dispatch.

## Development & Usage

### 1. Setup
Ensure you have `npm` installed.

### 2. Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Astro dev server (Note: API functions won't work). |
| `npm run dev:pages` | Starts Wrangler Pages dev server. **Use this to test API endpoints locally.** |
| `npm run build` | Builds the static site to `./dist`. |
| `npm run preview` | Previews the production build locally. |

### 3. Deployment
Deployments are automatic via **Cloudflare Pages** when pushing to the `main` branch.

## Conventions

- **Mobile First:** Always design and test for mobile (375px width) first.
- **Typography:**
    - *Bodoni Moda*: Ceremonial headlines, brand moments.
    - *IBM Plex Sans Condensed*: Sports/broadcast stats, UI labels, buttons.
    - *IBM Plex Sans*: Body text.
    - *SF Sports Night*: Limited use for specific broadcast-style labels.
- **Styling:** CSS variables are defined in the `:root` of `index.astro`. Use them strictly (`var(--ink)`, `var(--bone)`, etc.).
- **"The Bone":** UI elements often mimic domino tiles (12px radius, pip patterns).

## Reference Documentation
*   **`CLAUDE.md`**: Detailed architecture notes and development context.
*   **`DESIGN-SYSTEM.md`**: Comprehensive design guide ("The Bone Language").
*   **`SETUP.md`**: Instructions for setting up the Google Sheet and Apps Script backend.
