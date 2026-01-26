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

    const ss = SpreadsheetApp.getActiveSpreadsheet();
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
      const ss = SpreadsheetApp.getActiveSpreadsheet();
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

    // Validate required fields - individual player registration
    const required = ["playerName", "email", "phone", "ruleConfirm"];
    for (const k of required) {
      if (!String(body[k] || "").trim()) {
        return json({ ok: false, error: `missing_${k}` }, 400);
      }
    }

    // Append to sheet FIRST (most important - don't lose the registration!)
    const ss = SpreadsheetApp.getActiveSpreadsheet();
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
    const subject = "CDL:1 La Salida - You're Registered!";
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

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #1c130f; color: #f8efe6; padding: 40px 20px; margin: 0;">
  <div style="max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, #2a1f1a 0%, #1c130f 100%); border-radius: 16px; padding: 40px; border: 1px solid #3d2e26;">

    <div style="text-align: center; margin-bottom: 32px;">
      <p style="color: #b76a3b; margin: 0 0 4px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 3px;">CDL:1</p>
      <h1 style="font-size: 32px; color: #d4a574; margin: 0 0 8px 0; font-style: italic;">La Salida</h1>
      <p style="color: #b76a3b; margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">You're In!</p>
    </div>

    <div style="background: rgba(183, 106, 59, 0.1); border-radius: 12px; padding: 24px; margin-bottom: 24px; border: 1px solid rgba(183, 106, 59, 0.2);">
      <p style="margin: 0 0 12px 0; font-size: 16px;">
        <strong style="color: #d4a574;">📅 Date:</strong> Saturday, January 31st, 2026 @ 6PM
      </p>
      <p style="margin: 0 0 12px 0; font-size: 16px;">
        <strong style="color: #d4a574;">📍 Location:</strong> Stefan's Lounge (333 Bergenline Blvd, Fairview)
      </p>
      <p style="margin: 0; font-size: 16px;">
        <strong style="color: #d4a574;">🎯 Entry:</strong> $25 per player (cash on arrival)
      </p>
    </div>

    <div style="margin-bottom: 24px;">
      <h2 style="color: #d4a574; font-size: 18px; margin: 0 0 16px 0; border-bottom: 1px solid #3d2e26; padding-bottom: 8px;">Registration Details</h2>
      <p style="margin: 0 0 8px 0; font-size: 16px;">
        <span style="color: #b76a3b;">Name:</span> ${body.playerName}
      </p>
      <p style="margin: 0; font-size: 16px;">
        <span style="color: #b76a3b;">Phone:</span> ${body.phone}
      </p>
    </div>

    <div style="background: rgba(212, 165, 116, 0.1); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #d4a574;"><strong>How it works:</strong></p>
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #f8efe6;">1. Register solo</p>
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #f8efe6;">2. Enter La Mesa (the table)</p>
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #f8efe6;">3. Team up in La Mesa</p>
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #f8efe6;">4. Play to 150 points</p>
      <p style="margin: 0; font-size: 14px; color: #d4a574;"><strong>🏆 Winning team takes the pot!</strong></p>
    </div>

    ${body.notes ? `<p style="font-size: 14px; color: #888;">Notes: ${body.notes}</p>` : ''}

    ${mesaLoginLink ? `
      <div style="text-align: center; margin: 0 0 22px 0;">
        <a href="${mesaLoginLink}" style="display: inline-block; background: linear-gradient(135deg, #b76a3b 0%, #d4a574 100%); color: #1c130f; text-decoration: none; padding: 14px 22px; border-radius: 10px; font-weight: 700; font-size: 14px; letter-spacing: 0.06em; text-transform: uppercase;">
          Enter La Mesa
        </a>
        <p style="margin: 10px 0 0 0; font-size: 12px; color: #888;">This link is your door key.</p>
      </div>
    ` : ''}

    <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #3d2e26;">
      <p style="margin: 0 0 16px 0; color: #888; font-size: 14px;">Questions? Email us at <a href="mailto:Erik@cubandominoleague.com" style="color: #d4a574;">Erik@cubandominoleague.com</a></p>
      <a href="${venueUrl}" style="display: inline-block; background: linear-gradient(135deg, #b76a3b 0%, #d4a574 100%); color: #1c130f; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px;">View Venue</a>
    </div>

    <p style="text-align: center; margin-top: 32px; font-size: 20px;">La mesa te espera. 🌴</p>
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
    <a href="${SpreadsheetApp.getActiveSpreadsheet().getUrl()}" style="color: #b76a3b;">View All Registrations →</a>
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
  const ss = SpreadsheetApp.getActiveSpreadsheet();
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
  const ss = SpreadsheetApp.getActiveSpreadsheet();
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
