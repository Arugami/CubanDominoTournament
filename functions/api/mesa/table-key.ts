interface Env {
  APP_SCRIPT_URL?: string;
  APP_SCRIPT_SECRET?: string;
  VENUE_URL?: string;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
}

type TableKeyPayload = {
  email?: string;
};

function json(data: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("cache-control", "no-store");
  return new Response(JSON.stringify(data), { ...init, headers });
}

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: TableKeyPayload;
  try {
    body = (await request.json()) as TableKeyPayload;
  } catch {
    return json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const email = clean(body.email).toLowerCase();
  if (!isEmail(email)) return json({ ok: false, error: "invalid_email" }, { status: 400 });

  const appScriptUrl = env.APP_SCRIPT_URL;
  const secret = env.APP_SCRIPT_SECRET;
  const supabaseUrl = clean(env.SUPABASE_URL);
  const serviceKey = clean(env.SUPABASE_SERVICE_ROLE_KEY);
  if (!appScriptUrl || !secret || !supabaseUrl || !serviceKey) {
    return json({ ok: false, error: "missing_server_env" }, { status: 500 });
  }

  // First, confirm they are registered (Sheets is the source of truth).
  let playerName = "";
  let status = "";
  try {
    const lookupRes = await fetch(appScriptUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ secret, action: "mesa_lookup_player", email }),
    });
    const lookupJson = await lookupRes.json().catch(() => null);
    const found = !!(lookupJson && typeof lookupJson === "object" && (lookupJson as any).found === true);
    if (!found) return json({ ok: false, error: "not_registered" }, { status: 404 });
    playerName = clean((lookupJson as any)?.player?.playerName);
    status = clean((lookupJson as any)?.player?.status).toLowerCase();
    if (status && status !== "registered" && status !== "confirmed") {
      return json({ ok: false, error: "not_registered" }, { status: 404 });
    }
  } catch {
    return json({ ok: false, error: "upstream_network_error" }, { status: 502 });
  }

  // Best-effort: ensure Supabase has the player so the callback can verify cross-device.
  try {
    const restUrl = new URL("/rest/v1/players", supabaseUrl);
    restUrl.searchParams.set("on_conflict", "email");
    await fetch(restUrl.toString(), {
      method: "POST",
      headers: {
        apikey: serviceKey,
        authorization: `Bearer ${serviceKey}`,
        "content-type": "application/json",
        prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({
        email,
        name: playerName,
        status: status || "registered",
      }),
    });
  } catch {
    // never block Table Key sends on sync failures
  }

  // Generate a one-click Table Key link (magic link) with a safe redirect back into La Mesa.
  let mesaLoginLink = "";
  try {
    const url = new URL("/auth/v1/admin/generate_link", supabaseUrl);
    const origin = new URL(request.url).origin;
    const redirectTo = `${origin}/mesa/callback`;
    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        apikey: serviceKey,
        authorization: `Bearer ${serviceKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        type: "magiclink",
        email,
        options: { redirectTo },
      }),
    });

    const linkJson = await res.json().catch(() => null);
    if (linkJson && typeof linkJson === "object") {
      const direct =
        (linkJson as any).action_link
        || (linkJson as any)?.data?.action_link
        || (linkJson as any)?.properties?.action_link
        || (linkJson as any)?.data?.properties?.action_link;
      if (direct) mesaLoginLink = String(direct);
    }
  } catch {
    mesaLoginLink = "";
  }

  if (!mesaLoginLink) return json({ ok: false, error: "could_not_generate_key" }, { status: 502 });

  // Send the Table Key email via Apps Script (branded; CTA is "Claim Your Seat").
  try {
    const sendRes = await fetch(appScriptUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        secret,
        action: "mesa_send_table_key",
        email,
        playerName,
        mesaLoginLink,
        venueUrl: env.VENUE_URL || "https://maps.google.com/?q=333+Bergenline+Blvd,+Fairview,+NJ",
      }),
    });
    const sendJson = await sendRes.json().catch(() => null);
    const ok = !!(sendJson && typeof sendJson === "object" && (sendJson as any).ok === true);
    if (!ok) return json({ ok: false, error: "upstream_error", upstream: sendJson }, { status: 502 });
  } catch {
    return json({ ok: false, error: "upstream_network_error" }, { status: 502 });
  }

  return json({ ok: true });
};
