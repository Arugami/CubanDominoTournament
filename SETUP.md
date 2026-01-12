# Setup

This repo is an Astro site deployed on Cloudflare Pages (via Wrangler) with a signup form that writes to Google Sheets and emails confirmations via an Apps Script Web App.

## 1) Google Sheet

Create a Google Sheet with a tab named `Registrations` and these headers:

- createdAt
- teamName
- p1Name
- p1Email
- p1Phone
- p2Name
- p2Email
- p2Phone
- notes
- status
- source

## 2) Apps Script Web App

Open Extensions -> Apps Script and paste the backend script. Deploy as a Web App:

- Execute as: Me
- Access: Anyone

Copy the Web App URL.

### Apps Script properties (required)

In Apps Script: Project Settings -> Script properties, set:

- `SHARED_SECRET` (long random string)
- `HOST_EMAILS` (comma-separated emails to notify on every registration)

Optional:

- `SHEET_NAME` (defaults to `Registrations`)
- `RESEND_API_KEY` (if set, emails send via Resend; otherwise GmailApp is used)
- `FROM_EMAIL` (Resend only; defaults to `Cuban Domino League <no-reply@cubandominoleague.com>`)

## 3) Environment variables

The browser submits to a Cloudflare Pages Function (`/api/register`), which forwards to Apps Script. Set these env vars in Cloudflare Pages (and locally if you test):

```
APP_SCRIPT_URL="https://script.google.com/macros/s/REPLACE/exec"
APP_SCRIPT_SECRET="REPLACE_WITH_SAME_LONG_RANDOM"
VENUE_URL="https://mrgarciacigars.com/"
```

### Optional: realtime chat

If you want to enable the realtime chat widget on the landing page, set:

```
PUBLIC_SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
```

## 4) Build + deploy

Build the site and deploy the `dist` folder.

```bash
npm run build
wrangler pages deploy dist
```

### Local Pages dev (optional)

Cloudflare Pages Functions don’t run under `astro dev`. To test the `/api/register` function locally:

```bash
npm run build
wrangler pages dev dist
```

## 5) Quick smoke test

- Submit the form once
- Confirm a new row is appended in the sheet
- Confirm confirmation email arrives for both players
