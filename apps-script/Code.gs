// Apps Script (Code.gs)
// Deploy as Web App: Execute as "Me", Access "Anyone"
// Updated for CDL:1 La Salida - Individual Player Registration

const DEFAULT_SHEET_NAME = "Registrations";
const DEFAULT_FROM_EMAIL = "Cuban Domino League <no-reply@cubandominoleague.com>";

// Individual player registration headers
const DESIRED_HEADERS = [
  "createdAt",
  "playerName",
  "email",
  "phone",
  "notes",
  "status",
  "source",
];

function getScriptProp(name, fallback) {
  const value = PropertiesService.getScriptProperties().getProperty(name);
  if (value !== null && value !== undefined && String(value).trim()) return String(value).trim();
  return fallback;
}

function requireScriptProp(name) {
  const value = getScriptProp(name, null);
  if (!value) throw new Error(`missing_property_${name}`);
  return value;
}

function getHostEmails() {
  const raw = getScriptProp("HOST_EMAILS", "");
  if (!raw) return [];
  return raw
    .split(",")
    .map((email) => String(email).trim())
    .filter(Boolean);
}

function getSheetName() {
  return getScriptProp("SHEET_NAME", DEFAULT_SHEET_NAME);
}

function getSpreadsheet() {
  const spreadsheetId = getScriptProp("SPREADSHEET_ID", "");
  if (spreadsheetId) return SpreadsheetApp.openById(spreadsheetId);

  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;

  throw new Error("missing_spreadsheet");
}

function getFromEmail() {
  return getScriptProp("FROM_EMAIL", DEFAULT_FROM_EMAIL);
}

function normalizeHeader(value) {
  return String(value || "").trim();
}

function getExistingHeaders(sheet) {
  const lastCol = sheet.getLastColumn();
  if (lastCol < 1) return [];
  const values = sheet.getRange(1, 1, 1, lastCol).getValues()[0] || [];
  return values.map(normalizeHeader);
}

function ensureSheetHeaders(sheet) {
  const lastRow = sheet.getLastRow();

  if (lastRow < 1) {
    sheet.appendRow(DESIRED_HEADERS);
    return DESIRED_HEADERS.slice();
  }

  const existing = getExistingHeaders(sheet);
  const isBlank = existing.length === 0 || existing.every((h) => h.length === 0);
  if (isBlank) {
    sheet.getRange(1, 1, 1, DESIRED_HEADERS.length).setValues([DESIRED_HEADERS]);
    return DESIRED_HEADERS.slice();
  }

  const set = new Set(existing);
  let changed = false;
  for (const header of DESIRED_HEADERS) {
    if (!set.has(header)) {
      existing.push(header);
      set.add(header);
      changed = true;
    }
  }

  if (changed) {
    sheet.getRange(1, 1, 1, existing.length).setValues([existing]);
  }

  return existing;
}

function appendByHeaders(sheet, data) {
  const headers = ensureSheetHeaders(sheet);
  const row = new Array(headers.length).fill("");
  headers.forEach((header, idx) => {
    if (Object.prototype.hasOwnProperty.call(data, header)) {
      row[idx] = data[header];
    }
  });
  sheet.appendRow(row);
}

// GET endpoint - returns list of registered players for "Who's In" display
function doGet(e) {
  try {
    const action = e.parameter.action || "teams"; // Default to teams for backward compatibility

    const ss = getSpreadsheet();
    const sheetName = getSheetName();
    const sh = ss.getSheetByName(sheetName);

    if (!sh || sh.getLastRow() < 2) {
      return action === "players" ? json({ players: [] }, 200) : json({ teams: [] }, 200);
    }

    const headers = getExistingHeaders(sh);
    const statusIdx = headers.indexOf("status");
    const dataRange = sh.getRange(2, 1, sh.getLastRow() - 1, headers.length);
    const rows = dataRange.getValues();

    // Filter to only registered/confirmed players
    const filteredRows = rows.filter(row => {
      const status = statusIdx >= 0 ? String(row[statusIdx]).toLowerCase() : "registered";
      return status === "registered" || status === "confirmed";
    });

    // Return individual players for CDL:1 La Salida
    if (action === "players") {
      const playerNameIdx = headers.indexOf("playerName");

      if (playerNameIdx === -1) {
        // Fallback: try old format with p1Name/p2Name
        const p1NameIdx = headers.indexOf("p1Name");
        const p2NameIdx = headers.indexOf("p2Name");

        if (p1NameIdx === -1) {
          return json({ players: [], error: "missing_headers" }, 200);
        }

        // Convert old team format to individual players
        const players = [];
        filteredRows.forEach(row => {
          const p1Name = String(row[p1NameIdx]).trim();
          const p2Name = p2NameIdx >= 0 ? String(row[p2NameIdx]).trim() : "";
          if (p1Name) players.push({ name: p1Name.split(" ")[0] }); // First name only
          if (p2Name) players.push({ name: p2Name.split(" ")[0] });
        });

        return json({ players: players }, 200);
      }

      // New individual player format
      const players = filteredRows
        .map(row => {
          const playerName = String(row[playerNameIdx]).trim();
          // Only use first name for privacy
          const firstName = playerName.split(" ")[0];
          return { name: firstName };
        })
        .filter(player => player.name);

      return json({ players: players }, 200);
    }

    // Legacy: Return teams format (for backward compatibility)
    const teamNameIdx = headers.indexOf("teamName");
    const p1NameIdx = headers.indexOf("p1Name");
    const p2NameIdx = headers.indexOf("p2Name");

    if (teamNameIdx === -1 || p1NameIdx === -1 || p2NameIdx === -1) {
      return json({ teams: [], error: "missing_headers" }, 200);
    }

    const teams = filteredRows
      .map(row => {
        const teamName = String(row[teamNameIdx]).trim();
        const p1First = String(row[p1NameIdx]).trim().split(" ")[0];
        const p2First = String(row[p2NameIdx]).trim().split(" ")[0];
        return {
          name: teamName,
          players: `${p1First} & ${p2First}`
        };
      })
      .filter(team => team.name);

    return json({ teams: teams }, 200);

  } catch (err) {
    console.error(err);
    return json({ players: [], teams: [], error: String(err) }, 500);
  }
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || "{}");

    // Simple auth
    const sharedSecret = requireScriptProp("SHARED_SECRET");
    if (body.secret !== sharedSecret) {
      return json({ ok: false, error: "unauthorized" }, 401);
    }

    // Honeypot (hidden field "company" in form)
    if (body.company) {
      return json({ ok: true }, 200);
    }

    // Admin actions (server-to-server only; protected by shared secret)
    if (body.action === "admin_list_players") {
      const ss = getSpreadsheet();
      const sheetName = getSheetName();
      const sh = ss.getSheetByName(sheetName);

      if (!sh || sh.getLastRow() < 2) {
        return json({ ok: true, players: [] }, 200);
      }

      const headers = ensureSheetHeaders(sh);
      const createdAtIdx = headers.indexOf("createdAt");
      const playerNameIdx = headers.indexOf("playerName");
      const emailIdx = headers.indexOf("email");
      const phoneIdx = headers.indexOf("phone");
      const notesIdx = headers.indexOf("notes");
      const statusIdx = headers.indexOf("status");
      const sourceIdx = headers.indexOf("source");

      const dataRange = sh.getRange(2, 1, sh.getLastRow() - 1, headers.length);
      const rows = dataRange.getValues();

      const players = rows
        .map((row, idx) => ({
          rowNumber: idx + 2,
          createdAt: createdAtIdx >= 0 ? String(row[createdAtIdx] || "").trim() : "",
          playerName: playerNameIdx >= 0 ? String(row[playerNameIdx] || "").trim() : "",
          email: emailIdx >= 0 ? String(row[emailIdx] || "").trim().toLowerCase() : "",
          phone: phoneIdx >= 0 ? String(row[phoneIdx] || "").trim() : "",
          notes: notesIdx >= 0 ? String(row[notesIdx] || "").trim() : "",
          status: statusIdx >= 0 ? String(row[statusIdx] || "").trim().toLowerCase() : "registered",
          source: sourceIdx >= 0 ? String(row[sourceIdx] || "").trim() : "",
        }))
        .filter((p) => p.email && p.playerName);

      return json({ ok: true, players: players }, 200);
    }

    // La Mesa actions (server-to-server only; protected by shared secret)
    if (body.action === "mesa_lookup_player") {
      const email = String(body.email || "").trim().toLowerCase();
      if (!email) return json({ ok: false, error: "missing_email" }, 400);

      const ss = getSpreadsheet();
      const sheetName = getSheetName();
      const sh = ss.getSheetByName(sheetName);
      if (!sh || sh.getLastRow() < 2) return json({ ok: true, found: false }, 200);

      const headers = ensureSheetHeaders(sh);
      const playerNameIdx = headers.indexOf("playerName");
      const emailIdx = headers.indexOf("email");
      const statusIdx = headers.indexOf("status");

      const dataRange = sh.getRange(2, 1, sh.getLastRow() - 1, headers.length);
      const rows = dataRange.getValues();

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowEmail = emailIdx >= 0 ? String(row[emailIdx] || "").trim().toLowerCase() : "";
        if (!rowEmail || rowEmail !== email) continue;

        const status = statusIdx >= 0 ? String(row[statusIdx] || "").trim().toLowerCase() : "registered";
        const playerName = playerNameIdx >= 0 ? String(row[playerNameIdx] || "").trim() : "";
        return json({ ok: true, found: true, player: { playerName, email: rowEmail, status } }, 200);
      }

      return json({ ok: true, found: false }, 200);
    }

    if (body.action === "mesa_send_table_key") {
      const email = String(body.email || "").trim().toLowerCase();
      const playerName = String(body.playerName || "").trim();
      const mesaLoginLink = String(body.mesaLoginLink || "").trim();
      const venueUrl = String(body.venueUrl || "").trim() || "https://maps.google.com/?q=333+Bergenline+Blvd,+Fairview,+NJ";

      if (!email) return json({ ok: false, error: "missing_email" }, 400);
      if (!mesaLoginLink) return json({ ok: false, error: "missing_key" }, 400);

      // Verify registration (Sheets is the source of truth).
      const ss = getSpreadsheet();
      const sheetName = getSheetName();
      const sh = ss.getSheetByName(sheetName);
      if (!sh || sh.getLastRow() < 2) return json({ ok: false, error: "not_registered" }, 404);

      const headers = ensureSheetHeaders(sh);
      const playerNameIdx = headers.indexOf("playerName");
      const emailIdx = headers.indexOf("email");
      const statusIdx = headers.indexOf("status");

      const dataRange = sh.getRange(2, 1, sh.getLastRow() - 1, headers.length);
      const rows = dataRange.getValues();

      let found = false;
      let foundStatus = "";
      let foundName = "";

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowEmail = emailIdx >= 0 ? String(row[emailIdx] || "").trim().toLowerCase() : "";
        if (!rowEmail || rowEmail !== email) continue;

        found = true;
        foundStatus = statusIdx >= 0 ? String(row[statusIdx] || "").trim().toLowerCase() : "registered";
        foundName = playerName || (playerNameIdx >= 0 ? String(row[playerNameIdx] || "").trim() : "");
        break;
      }

      if (!found) return json({ ok: false, error: "not_registered" }, 404);
      if (foundStatus && foundStatus !== "registered" && foundStatus !== "confirmed") {
        return json({ ok: false, error: "not_registered" }, 404);
      }

      const subject = "🌴 THE TABLE IS OPEN — CDL:1 La Mesa";
      const htmlBody = buildMesaTableKeyEmailHTML({
        playerName: foundName,
        mesaLoginLink,
        venueUrl,
      });

      try {
        sendEmail(email, subject, htmlBody);
      } catch (emailErr) {
        console.error("Failed to send Table Key email:", email, emailErr);
        return json({ ok: false, error: "email_failed" }, 500);
      }

      return json({ ok: true }, 200);
    }

    // Validate required fields - individual player registration
    const required = ["playerName", "email", "phone", "ruleConfirm"];
    for (const k of required) {
      if (!String(body[k] || "").trim()) {
        return json({ ok: false, error: `missing_${k}` }, 400);
      }
    }

    // Append to sheet FIRST (most important - don't lose the registration!)
    const ss = getSpreadsheet();
    const sheetName = getSheetName();
    const sh = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
    const createdAt = new Date();
    appendByHeaders(sh, {
      createdAt: createdAt.toISOString(),
      playerName: body.playerName.trim(),
      email: body.email.trim(),
      phone: body.phone.trim(),
      notes: (body.notes || "").trim(),
      status: "registered",
      source: "landing",
    });

    // Send confirmation email to player
    const subject = "🌴 YOU'RE IN — CDL:1 La Mesa";
    const htmlBody = buildConfirmationEmailHTML(body);

    try {
      sendEmail(body.email, subject, htmlBody);
    } catch (emailErr) {
      console.error("Failed to send email to player:", body.email, emailErr);
    }

    // NOTIFY HOST
    try {
      sendHostNotification(body, createdAt);
    } catch (hostErr) {
      console.error("Failed to send host notification:", hostErr);
    }

    return json({ ok: true }, 200);

  } catch (err) {
    console.error(err);
    return json({ ok: false, error: String(err) }, 500);
  }
}

function buildMesaTableKeyEmailHTML({ playerName, mesaLoginLink, venueUrl }) {
  const safeName = String(playerName || "").trim() || "Player";
  const safeLink = String(mesaLoginLink || "").trim();
  const safeVenue = String(venueUrl || "").trim() || "https://maps.google.com/?q=333+Bergenline+Blvd,+Fairview,+NJ";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0705; color: #f8efe6; padding: 32px 16px; margin: 0;">
  <div style="max-width: 380px; margin: 0 auto; background: linear-gradient(180deg, #1a120d 0%, #0d0906 100%); border: 1px solid #3d2e26; text-align: center;">
    
    <!-- Top accent line -->
    <div style="height: 3px; background: linear-gradient(90deg, transparent 0%, #b76a3b 50%, transparent 100%);"></div>
    
    <div style="padding: 40px 28px 32px;">
      
      <!-- CDL 1 Badge -->
      <div style="display: inline-block; margin-bottom: 24px;">
        <div style="width: 56px; height: 80px; background: linear-gradient(145deg, #2a1f1a 0%, #1c130f 100%); border: 2px solid #d4a574; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 0 auto; box-shadow: 0 4px 20px rgba(183, 106, 59, 0.3);">
          <span style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 10px; color: #b76a3b; letter-spacing: 0.15em; text-transform: uppercase; margin-top: 8px;">CDL</span>
          <div style="width: 36px; height: 2px; background: linear-gradient(90deg, transparent 0%, #d4a574 50%, transparent 100%); margin: 6px 0;"></div>
          <span style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 28px; color: #d4a574; font-weight: 700; line-height: 1; margin-bottom: 8px;">1</span>
        </div>
      </div>
      
      <!-- Kicker -->
      <p style="color: #b76a3b; margin: 0 0 12px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 5px; font-weight: 600;">CDL:1 La Mesa</p>
      
      <!-- THE TABLE IS OPEN -->
      <h1 style="font-family: Impact, 'Arial Black', sans-serif; font-size: 36px; color: #d4a574; margin: 0 0 16px 0; font-weight: 900; letter-spacing: 0.02em; text-transform: uppercase; line-height: 1.1; text-shadow: 0 2px 20px rgba(212, 165, 116, 0.3);">THE TABLE<br>IS OPEN</h1>
      
      <!-- Personal welcome -->
      <p style="color: rgba(248, 239, 230, 0.9); margin: 0 0 8px 0; font-size: 16px; font-weight: 500;">Welcome back, <span style="color: #d4a574;">${safeName}</span>.</p>
      
      <p style="color: rgba(248, 239, 230, 0.6); margin: 0 0 32px 0; font-size: 13px; line-height: 1.6; font-style: italic;">Your seat is waiting.</p>
      
      ${safeLink ? `
        <!-- CTA Button -->
        <a href="${safeLink}" style="display: block; background: linear-gradient(180deg, #c4784a 0%, #b76a3b 50%, #9a5a30 100%); color: #fff; text-decoration: none; padding: 20px 32px; border-radius: 2px; font-family: 'Bodoni Moda', Georgia, serif; font-weight: 700; font-style: italic; font-size: 16px; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px; box-shadow: 0 8px 30px rgba(183, 106, 59, 0.4);">
          Enter La Mesa
        </a>
        <p style="margin: 0 0 24px 0; font-size: 11px; color: #666; letter-spacing: 0.05em;">One tap to take your seat</p>
      ` : ''}
      
      <!-- Footer links -->
      <p style="margin: 24px 0 0 0; padding-top: 20px; border-top: 1px solid #3d2e26; font-size: 11px; color: #666;">
        <a href="${safeVenue}" style="color: #b76a3b; text-decoration: none; margin: 0 8px;">View Venue</a>
        <span style="color: #3d2e26;">·</span>
        <a href="mailto:Erik@cubandominoleague.com" style="color: #b76a3b; text-decoration: none; margin: 0 8px;">Questions</a>
      </p>
      
      <!-- Brand sign-off -->
      <p style="font-family: 'Bodoni Moda', Georgia, serif; font-style: italic; text-align: center; margin-top: 20px; font-size: 18px; color: #d4a574; letter-spacing: 0.02em;">La mesa te espera.</p>
      
    </div>
    
    <!-- Bottom accent line -->
    <div style="height: 2px; background: linear-gradient(90deg, transparent 0%, #3d2e26 50%, transparent 100%);"></div>
  </div>
</body>
</html>`;
}

function sendEmail(to, subject, html) {
  const resendApiKey = getScriptProp("RESEND_API_KEY", "");
  if (resendApiKey) {
    return sendEmailViaResend({
      apiKey: resendApiKey,
      from: getFromEmail(),
      to,
      subject,
      html,
    });
  }

  return GmailApp.sendEmail(to, subject, stripHtml(html), { htmlBody: html });
}

function stripHtml(html) {
  return String(html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function sendEmailViaResend({ apiKey, from, to, subject, html }) {
  const payload = {
    from,
    to: [to],
    subject: subject,
    html: html
  };

  const options = {
    method: "POST",
    contentType: "application/json",
    headers: {
      "Authorization": "Bearer " + apiKey
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch("https://api.resend.com/emails", options);
  const result = JSON.parse(response.getContentText());

  const code = response.getResponseCode();
  if (code < 200 || code >= 300) {
    console.error("Resend error for " + to + ":", result);
    throw new Error("Email failed: " + JSON.stringify(result));
  }

  return result;
}

function buildConfirmationEmailHTML(body) {
  const venueUrl = body.venueUrl || "https://maps.google.com/?q=333+Bergenline+Blvd,+Fairview,+NJ";
  const mesaLoginLink = String(body.mesaLoginLink || "").trim();
  const siteUrl = String(body.siteUrl || "").trim();
  const canonicalSiteUrl = (siteUrl || "https://cubandominoleague.com").replace(/\/+$/, "");
  const mesaEntryUrl = mesaLoginLink || (canonicalSiteUrl ? (canonicalSiteUrl + "/?mesa=1") : "");
  const playerName = body.playerName || "Player";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0705; color: #f8efe6; padding: 32px 16px; margin: 0;">
  <div style="max-width: 380px; margin: 0 auto; background: linear-gradient(180deg, #1a120d 0%, #0d0906 100%); border: 1px solid #3d2e26; text-align: center; position: relative;">
    
    <!-- Top accent line -->
    <div style="height: 3px; background: linear-gradient(90deg, transparent 0%, #b76a3b 50%, transparent 100%);"></div>
    
    <div style="padding: 40px 28px 32px;">
      
      <!-- CDL 1 Badge -->
      <div style="display: inline-block; margin-bottom: 24px;">
        <div style="width: 56px; height: 80px; background: linear-gradient(145deg, #2a1f1a 0%, #1c130f 100%); border: 2px solid #d4a574; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 0 auto; box-shadow: 0 4px 20px rgba(183, 106, 59, 0.3);">
          <span style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 10px; color: #b76a3b; letter-spacing: 0.15em; text-transform: uppercase; margin-top: 8px;">CDL</span>
          <div style="width: 36px; height: 2px; background: linear-gradient(90deg, transparent 0%, #d4a574 50%, transparent 100%); margin: 6px 0;"></div>
          <span style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 28px; color: #d4a574; font-weight: 700; line-height: 1; margin-bottom: 8px;">1</span>
        </div>
      </div>
      
      <!-- Kicker -->
      <p style="color: #b76a3b; margin: 0 0 12px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 5px; font-weight: 600;">CDL:1 La Salida</p>
      
      <!-- YOU'RE IN - ESPN Broadcast Energy -->
      <h1 style="font-family: Impact, 'Arial Black', sans-serif; font-size: 42px; color: #d4a574; margin: 0 0 16px 0; font-weight: 900; letter-spacing: 0.02em; text-transform: uppercase; line-height: 1; text-shadow: 0 2px 20px rgba(212, 165, 116, 0.3);">YOU'RE IN</h1>
      
      <!-- Personal welcome -->
      <p style="color: rgba(248, 239, 230, 0.9); margin: 0 0 8px 0; font-size: 16px; font-weight: 500;">Welcome to La Mesa, <span style="color: #d4a574;">${playerName}</span>.</p>
      
      <!-- Club 33 copy -->
      <p style="color: rgba(248, 239, 230, 0.6); margin: 0 0 28px 0; font-size: 13px; line-height: 1.6; font-style: italic;">Your seat at the Cuban Domino League's first tournament is secured.</p>
      
      <!-- Event details - minimal -->
      <div style="background: rgba(183, 106, 59, 0.08); border: 1px solid rgba(183, 106, 59, 0.2); padding: 16px; margin-bottom: 28px;">
        <p style="margin: 0; font-size: 14px; color: #d4a574; font-weight: 500;">Saturday, January 31st, 2026</p>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #888;">Stefan's Lounge · Fairview, NJ</p>
      </div>
      
      ${mesaEntryUrl ? `
        <!-- CTA Button -->
        <a href="${mesaEntryUrl}" style="display: block; background: linear-gradient(180deg, #c4784a 0%, #b76a3b 50%, #9a5a30 100%); color: #fff; text-decoration: none; padding: 20px 32px; border-radius: 2px; font-family: 'Bodoni Moda', Georgia, serif; font-weight: 700; font-style: italic; font-size: 16px; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px; box-shadow: 0 8px 30px rgba(183, 106, 59, 0.4);">
          Enter La Mesa
        </a>
        <p style="margin: 0 0 24px 0; font-size: 11px; color: #666; letter-spacing: 0.05em;">One tap to join the table</p>
      ` : ''}
      
      <!-- Footer links -->
      <p style="margin: 24px 0 0 0; padding-top: 20px; border-top: 1px solid #3d2e26; font-size: 11px; color: #666;">
        <a href="${venueUrl}" style="color: #b76a3b; text-decoration: none; margin: 0 8px;">View Venue</a>
        <span style="color: #3d2e26;">·</span>
        <a href="mailto:Erik@cubandominoleague.com" style="color: #b76a3b; text-decoration: none; margin: 0 8px;">Questions</a>
      </p>
      
      <!-- Brand sign-off - Bodoni Moda Italic -->
      <p style="font-family: 'Bodoni Moda', Georgia, serif; font-style: italic; text-align: center; margin-top: 20px; font-size: 18px; color: #d4a574; letter-spacing: 0.02em;">La mesa te espera.</p>
      
    </div>
    
    <!-- Bottom accent line -->
    <div style="height: 2px; background: linear-gradient(90deg, transparent 0%, #3d2e26 50%, transparent 100%);"></div>
  </div>
</body>
</html>`;
}

function sendHostNotification(body, timestamp) {
  const subject = `🌴 New Player: ${body.playerName}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; background: #f5f5f5;">
  <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <h2 style="color: #b76a3b; margin: 0 0 16px 0;">New Player Registered! 🌴</h2>
    <p style="color: #666; margin: 0 0 24px 0;">${timestamp.toLocaleString()}</p>

    <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; margin: 16px 0;">
      <p style="margin: 0 0 8px 0;"><strong>Name:</strong> ${body.playerName}</p>
      <p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${body.email}</p>
      <p style="margin: 0;"><strong>Phone:</strong> ${body.phone}</p>
    </div>

    ${body.notes ? `<p style="color: #666;">Notes: ${body.notes}</p>` : ''}

    <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
    <a href="${getSpreadsheet().getUrl()}" style="color: #b76a3b;">View All Registrations →</a>
  </div>
</body>
</html>`;

  const hostEmails = getHostEmails();
  hostEmails.forEach((email) => {
    sendEmail(email, subject, html);
  });
}

function json(obj, code) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// HELPER FUNCTIONS - Run these manually
// ============================================

// Run this to test sheet access
function testSheetAccess() {
  const ss = getSpreadsheet();
  const sheetName = getSheetName();
  const sh = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
  ensureSheetHeaders(sh);
  Logger.log("Sheet name: " + sh.getName());
  Logger.log("Test passed!");
}

// Run this to test Resend email
function testResend() {
  const to = requireScriptProp("TEST_EMAIL");
  sendEmail(to, "Test from CDL:1 La Salida", "<h1>It works!</h1><p>Email is configured correctly.</p>");
  Logger.log("Test email sent to: " + to);
}

// Run this to check current properties
function testProperties() {
  const props = PropertiesService.getScriptProperties().getAll();
  // Mask sensitive values
  const masked = {};
  for (const key in props) {
    const val = props[key];
    if (key.includes("SECRET") || key.includes("API_KEY")) {
      const s = String(val || "");
      if (s.length <= 12) masked[key] = "***";
      else masked[key] = s.substring(0, 7) + "..." + s.substring(s.length - 4);
    } else {
      masked[key] = val;
    }
  }
  Logger.log("All properties: " + JSON.stringify(masked, null, 2));
}

// Run this to check if Resend is configured
function checkResendConfig() {
  const key = getScriptProp("RESEND_API_KEY", "");
  if (!key) {
    Logger.log("❌ RESEND_API_KEY is NOT configured - emails will fail!");
  } else {
    Logger.log("✅ RESEND_API_KEY is configured");
  }
}

// ============================================
// MIGRATION: Run this ONCE to convert team headers to solo player format
// ============================================
function migrateHeadersToSoloPlayer() {
  const ss = getSpreadsheet();
  const sheetName = getSheetName();
  const sh = ss.getSheetByName(sheetName);

  if (!sh) {
    Logger.log("❌ Sheet '" + sheetName + "' not found!");
    return;
  }

  const headers = getExistingHeaders(sh);
  Logger.log("Current headers: " + JSON.stringify(headers));

  // Map old team headers to new solo player headers
  const headerMap = {
    "teamName": "playerName",
    "p1Name": "email",
    "p1Email": "phone"
  };

  // Columns to delete (0-indexed): p1Phone, p2Name, p2Email, p2Phone
  const columnsToDelete = ["p1Phone", "p2Name", "p2Email", "p2Phone"];

  // First, rename the headers we're keeping
  headers.forEach((header, idx) => {
    if (headerMap[header]) {
      sh.getRange(1, idx + 1).setValue(headerMap[header]);
      Logger.log("Renamed column " + (idx + 1) + ": " + header + " → " + headerMap[header]);
    }
  });

  // Delete columns from right to left (so indices don't shift)
  const deleteIndices = columnsToDelete
    .map(col => headers.indexOf(col))
    .filter(idx => idx !== -1)
    .sort((a, b) => b - a); // Sort descending

  deleteIndices.forEach(idx => {
    sh.deleteColumn(idx + 1);
    Logger.log("Deleted column " + (idx + 1) + ": " + headers[idx]);
  });

  Logger.log("✅ Migration complete! New headers: " + JSON.stringify(getExistingHeaders(sh)));
}
