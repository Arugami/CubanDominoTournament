// Apps Script (Code.gs)
// Deploy as Web App: Execute as "Me", Access "Anyone"

const SHEET_NAME = "Registrations";
const SHARED_SECRET = "REPLACE_WITH_LONG_RANDOM";
const RESEND_API_KEY = "re_314juMRW_CporJFQsbRcDXg25bPmgXGyi";
const FROM_EMAIL = "Cuban Domino League <quebola@cubandominoleague.com>";
const HOST_EMAILS = [
  "EFelipe1992@gmail.com",
  "jordan@arugami.com"
];

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || "{}");

    // Simple auth
    if (body.secret !== SHARED_SECRET) {
      return json({ ok: false, error: "unauthorized" }, 401);
    }

    // Honeypot (hidden field "company" in form)
    if (body.company) {
      return json({ ok: true }, 200);
    }

    // Validate required fields
    const required = ["teamName","p1Name","p1Email","p1Phone","p2Name","p2Email","p2Phone"];
    for (const k of required) {
      if (!String(body[k] || "").trim()) {
        return json({ ok: false, error: `missing_${k}` }, 400);
      }
    }

    // Append to sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    const createdAt = new Date();
    const row = [
      createdAt.toISOString(),
      body.teamName.trim(),
      body.p1Name.trim(),
      body.p1Email.trim(),
      body.p1Phone.trim(),
      body.p2Name.trim(),
      body.p2Email.trim(),
      body.p2Phone.trim(),
      (body.notes || "").trim(),
      "registered",
      "landing",
    ];
    sh.appendRow(row);

    // Send confirmation emails to players
    const subject = "Cuban Domino Tournament - Registration Confirmed";
    const htmlBody = buildConfirmationEmailHTML(body);

    sendEmailViaResend(body.p1Email, subject, htmlBody);

    if (body.p2Email && body.p2Email !== body.p1Email) {
      sendEmailViaResend(body.p2Email, subject, htmlBody);
    }

    // NOTIFY HOST - sends you an email for every registration
    sendHostNotification(body, createdAt);

    return json({ ok: true }, 200);

  } catch (err) {
    console.error(err);
    return json({ ok: false, error: String(err) }, 500);
  }
}

function sendEmailViaResend(to, subject, html) {
  const payload = {
    from: FROM_EMAIL,
    to: [to],
    subject: subject,
    html: html
  };

  const options = {
    method: "POST",
    contentType: "application/json",
    headers: {
      "Authorization": "Bearer " + RESEND_API_KEY
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch("https://api.resend.com/emails", options);
  const result = JSON.parse(response.getContentText());

  if (response.getResponseCode() !== 200) {
    console.error("Resend error:", result);
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
      <p style="margin: 0 0 16px 0; color: #888; font-size: 14px;">Questions? Reply to this email.</p>
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

  HOST_EMAILS.forEach(email => {
    sendEmailViaResend(email, subject, html);
  });
}

function json(obj, code) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Optional: Run this to test sheet access
function testSheetAccess() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  Logger.log("Sheet name: " + sh.getName());
  Logger.log("Test passed!");
}

// Test Resend connection
function testResend() {
  sendEmailViaResend("jordan@arugami.com", "Test from Cuban Domino League", "<h1>It works!</h1><p>Resend is configured correctly.</p>");
  Logger.log("Test email sent!");
}
