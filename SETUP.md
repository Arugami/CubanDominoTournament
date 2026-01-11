# Setup

This repo only contains the landing page and config. If you haven't initialized Astro yet, do that first:

```bash
npm create astro@latest
```

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
- igHandle
- notes
- status
- source

## 2) Apps Script Web App

Open Extensions -> Apps Script and paste the backend script. Deploy as a Web App:

- Execute as: Me
- Access: Anyone

Copy the Web App URL.

## 3) Environment variables

Set these env vars in Cloudflare Pages (and locally if you test):

```
PUBLIC_APP_SCRIPT_URL="https://script.google.com/macros/s/REPLACE/exec"
PUBLIC_SIGNUP_SECRET="REPLACE_WITH_SAME_LONG_RANDOM"
```

## 4) Build + deploy

Build the site and deploy the `dist` folder.

```bash
npm run build
wrangler pages deploy dist
```

## 5) Quick smoke test

- Submit the form once
- Confirm a new row is appended in the sheet
- Confirm confirmation email arrives for both players

