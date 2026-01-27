interface Env {
  APP_SCRIPT_URL?: string;
  APP_SCRIPT_SECRET?: string;
  VENUE_URL?: string;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SITE_URL?: string;
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

import { getCanonicalSiteUrl } from "../../lib/site-url";

type SheetLookupResult =
  | { ok: true; found: true; playerName: string; status: string }
  | { ok: true; found: false }
  | { ok: false; error: string };

async function lookupPlayerInSheet(appScriptUrl: string, secret: string, email: string): Promise<SheetLookupResult> {
  // Preferred: direct lookup endpoint (fast, avoids scanning all players)
  try {
    const lookupRes = await fetch(appScriptUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ secret, action: "mesa_lookup_player", email }),
    });
    const lookupJson = await lookupRes.json().catch(() => null);

    const okFlag = !!(lookupJson && typeof lookupJson === "object" && (lookupJson as any).ok === true);
    if (!okFlag) {
      const err = lookupJson && typeof lookupJson === "object" ? String((lookupJson as any).error || "") : "";
      // Some older deployments may not implement mesa_lookup_player and return an error (or a non-object).
      // We'll fall back to admin_list_players below unless it looks like an auth failure.
      if (err === "unauthorized") return { ok: false, error: "upstream_unauthorized" };
    } else {
      const found = !!(lookupJson && typeof lookupJson === "object" && (lookupJson as any).found === true);
      if (found) {
        const playerName = clean((lookupJson as any)?.player?.playerName);
        const status = clean((lookupJson as any)?.player?.status).toLowerCase();
        return { ok: true, found: true, playerName, status };
      }
    }
  } catch {
    // fall through to admin_list_players
  }

  // Fallback: list all players (works even if mesa_lookup_player isn't deployed yet)
  try {
    const listRes = await fetch(appScriptUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ secret, action: "admin_list_players" }),
    });
    const listJson = await listRes.json().catch(() => null);

    const ok = !!(listJson && typeof listJson === "object" && (listJson as any).ok === true);
    if (!ok) {
      const err = listJson && typeof listJson === "object" ? String((listJson as any).error || "") : "";
      if (err === "unauthorized") return { ok: false, error: "upstream_unauthorized" };
      return { ok: false, error: "upstream_error" };
    }

    const players = Array.isArray((listJson as any).players) ? (listJson as any).players : [];
    const match = players.find((p: any) => String(p?.email || "").trim().toLowerCase() === email);
    if (!match) return { ok: true, found: false };

    const playerName = clean(match?.playerName);
    const status = clean(match?.status).toLowerCase();
    return { ok: true, found: true, playerName, status };
  } catch {
    return { ok: false, error: "upstream_network_error" };
  }
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
  const lookup = await lookupPlayerInSheet(appScriptUrl, secret, email);
  if (!lookup.ok) {
    const statusCode = lookup.error === "upstream_unauthorized" ? 502 : 502;
    return json({ ok: false, error: lookup.error }, { status: statusCode });
  }
  if (!lookup.found) return json({ ok: false, error: "not_registered" }, { status: 404 });
  playerName = lookup.playerName;
  status = lookup.status;
  if (status && status !== "registered" && status !== "confirmed") {
    return json({ ok: false, error: "not_registered" }, { status: 404 });
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
    const siteUrl = getCanonicalSiteUrl(request, env);
    const redirectTo = `${siteUrl}/mesa/callback`;
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
