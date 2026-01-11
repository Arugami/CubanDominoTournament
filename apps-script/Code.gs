// Apps Script (Code.gs)
// Deploy as Web App: Execute as "Me", Access "Anyone"

const DEFAULT_SHEET_NAME = "Registrations";
const DEFAULT_FROM_EMAIL = "Cuban Domino League <no-reply@cubandominoleague.com>";
const DESIRED_HEADERS = [
  "createdAt",
  "teamName",
  "p1Name",
  "p1Email",
  "p1Phone",
  "p2Name",
  "p2Email",
  "p2Phone",
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

// GET endpoint - returns list of registered teams for "Who's In" display
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = getSheetName();
    const sh = ss.getSheetByName(sheetName);

    if (!sh || sh.getLastRow() < 2) {
      return json({ teams: [] }, 200);
    }

    const headers = getExistingHeaders(sh);
    const teamNameIdx = headers.indexOf("teamName");
    const p1NameIdx = headers.indexOf("p1Name");
    const p2NameIdx = headers.indexOf("p2Name");
    const statusIdx = headers.indexOf("status");

    if (teamNameIdx === -1 || p1NameIdx === -1 || p2NameIdx === -1) {
      return json({ teams: [], error: "missing_headers" }, 200);
    }

    const dataRange = sh.getRange(2, 1, sh.getLastRow() - 1, headers.length);
    const rows = dataRange.getValues();

    const teams = rows
      .filter(row => {
        // Only include registered teams (not cancelled, etc.)
        const status = statusIdx >= 0 ? String(row[statusIdx]).toLowerCase() : "registered";
        return status === "registered" || status === "confirmed";
      })
      .map(row => {
        const teamName = String(row[teamNameIdx]).trim();
        // Only use first names for privacy
        const p1First = String(row[p1NameIdx]).trim().split(" ")[0];
        const p2First = String(row[p2NameIdx]).trim().split(" ")[0];
        return {
          name: teamName,
          players: `${p1First} & ${p2First}`
        };
      })
      .filter(team => team.name); // Remove empty entries

    return json({ teams: teams }, 200);

  } catch (err) {
    console.error(err);
    return json({ teams: [], error: String(err) }, 500);
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

    // Validate required fields
    const required = ["teamName","p1Name","p1Email","p1Phone","p2Name","p2Email","p2Phone","ruleConfirm"];
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
      teamName: body.teamName.trim(),
      p1Name: body.p1Name.trim(),
      p1Email: body.p1Email.trim(),
      p1Phone: body.p1Phone.trim(),
      p2Name: body.p2Name.trim(),
      p2Email: body.p2Email.trim(),
      p2Phone: body.p2Phone.trim(),
      notes: (body.notes || "").trim(),
      status: "registered",
      source: "landing",
    });

    // Send confirmation emails to players (don't fail registration if email fails)
    const subject = "Cuban Domino Tournament - Registration Confirmed";
    const htmlBody = buildConfirmationEmailHTML(body);

    try {
      sendEmail(body.p1Email, subject, htmlBody);
    } catch (emailErr) {
      console.error("Failed to send email to p1:", body.p1Email, emailErr);
    }

    if (body.p2Email && body.p2Email !== body.p1Email) {
      try {
        sendEmail(body.p2Email, subject, htmlBody);
      } catch (emailErr) {
        console.error("Failed to send email to p2:", body.p2Email, emailErr);
      }
    }

    // NOTIFY HOST - sends you an email for every registration
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
  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY not configured - email cannot be sent");
  }

  return sendEmailViaResend({
    apiKey: resendApiKey,
    from: getFromEmail(),
    to,
    subject,
    html,
  });
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
      <h1 style="font-size: 28px; color: #d4a574; margin: 0 0 8px 0;">You're In! 🌴</h1>
      <p style="color: #b76a3b; margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Registration Confirmed</p>
    </div>

    <div style="background: rgba(183, 106, 59, 0.1); border-radius: 12px; padding: 24px; margin-bottom: 24px; border: 1px solid rgba(183, 106, 59, 0.2);">
      <p style="margin: 0 0 12px 0; font-size: 16px;">
        <strong style="color: #d4a574;">📅 Date:</strong> Friday, January 31st, 2025 @ 7PM
      </p>
      <p style="margin: 0 0 12px 0; font-size: 16px;">
        <strong style="color: #d4a574;">📍 Location:</strong> Mr Garcia Cigars (74th & Broadway)
      </p>
      <p style="margin: 0; font-size: 16px;">
        <strong style="color: #d4a574;">🎯 Entry:</strong> $50 per team ($25 per person)
      </p>
    </div>

    <div style="margin-bottom: 24px;">
      <h2 style="color: #d4a574; font-size: 18px; margin: 0 0 16px 0; border-bottom: 1px solid #3d2e26; padding-bottom: 8px;">Team: ${body.teamName}</h2>
      <p style="margin: 0 0 8px 0; font-size: 16px;">
        <span style="color: #b76a3b;">Player 1:</span> ${body.p1Name} — ${body.p1Phone}
      </p>
      <p style="margin: 0; font-size: 16px;">
        <span style="color: #b76a3b;">Player 2:</span> ${body.p2Name} — ${body.p2Phone}
      </p>
    </div>

    <div style="background: rgba(212, 165, 116, 0.1); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #d4a574;"><strong>Format:</strong> Play to 150 points</p>
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #d4a574;"><strong>Playoffs:</strong> Top 4 teams advance</p>
      <p style="margin: 0; font-size: 14px; color: #d4a574;"><strong>Prize:</strong> Winner takes all! 🏆</p>
    </div>

    ${body.notes ? `<p style="font-size: 14px; color: #888;">Notes: ${body.notes}</p>` : ''}

    <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #3d2e26;">
      <p style="margin: 0 0 16px 0; color: #888; font-size: 14px;">Questions? Email us at <a href="mailto:Erik@cubandominoleague.com" style="color: #d4a574;">Erik@cubandominoleague.com</a></p>
      <a href="https://mrgarciacigars.com/" style="display: inline-block; background: linear-gradient(135deg, #b76a3b 0%, #d4a574 100%); color: #1c130f; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px;">View Venue</a>
    </div>

    <p style="text-align: center; margin-top: 32px; font-size: 20px;">See you at the tables! 🌴</p>
  </div>
</body>
</html>`;
}

function sendHostNotification(body, timestamp) {
  const subject = `🌴 New Registration: ${body.teamName}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; background: #f5f5f5;">
  <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <h2 style="color: #b76a3b; margin: 0 0 16px 0;">New Team Registered! 🌴</h2>
    <p style="color: #666; margin: 0 0 24px 0;">${timestamp.toLocaleString()}</p>

    <h3 style="color: #333; margin: 0 0 8px 0;">Team: ${body.teamName}</h3>

    <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; margin: 16px 0;">
      <p style="margin: 0 0 8px 0;"><strong>Player 1:</strong></p>
      <p style="margin: 0 0 4px 0; color: #333;">${body.p1Name}</p>
      <p style="margin: 0 0 4px 0; color: #666;">${body.p1Email}</p>
      <p style="margin: 0; color: #666;">${body.p1Phone}</p>
    </div>

    <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; margin: 16px 0;">
      <p style="margin: 0 0 8px 0;"><strong>Player 2:</strong></p>
      <p style="margin: 0 0 4px 0; color: #333;">${body.p2Name}</p>
      <p style="margin: 0 0 4px 0; color: #666;">${body.p2Email}</p>
      <p style="margin: 0; color: #666;">${body.p2Phone}</p>
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
  sendEmail(to, "Test from Cuban Domino League", "<h1>It works!</h1><p>Email is configured correctly.</p>");
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
      masked[key] = val.substring(0, 7) + "..." + val.substring(val.length - 4);
    } else {
      masked[key] = val;
    }
  }
  Logger.log("All properties: " + JSON.stringify(masked, null, 2));
}

// Run this ONCE to set all properties (update the values first!)
function setProperties() {
  PropertiesService.getScriptProperties().setProperties({
    "SHARED_SECRET": "QIW/fso0Gp5hRL/JJnEfIqjstwyG6VEeFFL8csK2J6M=",
    "RESEND_API_KEY": "re_cNLmAjP9_Dz5AQNGjXV8uotP5ax2gYkzt",
    "HOST_EMAILS": "EFelipe1992@gmail.com,jordan@arugami.com",
    "TEST_EMAIL": "jordan@arugami.com"
  });
  Logger.log("All properties set!");
}

// Run this to update just the Resend API key
function updateResendKey() {
  PropertiesService.getScriptProperties().setProperty(
    "RESEND_API_KEY",
    "re_cNLmAjP9_Dz5AQNGjXV8uotP5ax2gYkzt"
  );
  Logger.log("Resend API key updated!");
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
