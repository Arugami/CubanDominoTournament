interface Env {
  APP_SCRIPT_URL?: string;
  APP_SCRIPT_SECRET?: string;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
}

function json(data: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("cache-control", "no-store");
  return new Response(JSON.stringify(data), { ...init, headers });
}

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function bearerToken(value: string | null) {
  if (!value) return "";
  const match = value.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : "";
}

type SheetLookupResult =
  | { ok: true; found: true; playerName: string; status: string }
  | { ok: true; found: false }
  | { ok: false; error: string };

async function lookupPlayerInSheet(appScriptUrl: string, secret: string, email: string): Promise<SheetLookupResult> {
  // Preferred: direct lookup endpoint
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

  // Fallback: list all players and match by email
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

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const appScriptUrl = env.APP_SCRIPT_URL;
  const secret = env.APP_SCRIPT_SECRET;
  const supabaseUrl = clean(env.SUPABASE_URL);
  const serviceKey = clean(env.SUPABASE_SERVICE_ROLE_KEY);
  if (!appScriptUrl || !secret || !supabaseUrl || !serviceKey) {
    return json({ ok: false, error: "missing_server_env" }, { status: 500 });
  }

  const accessToken = bearerToken(request.headers.get("authorization"));
  if (!accessToken) return json({ ok: false, error: "missing_access_token" }, { status: 401 });

  // Resolve email from the Supabase session token.
  let email = "";
  try {
    const userUrl = new URL("/auth/v1/user", supabaseUrl);
    const res = await fetch(userUrl.toString(), {
      method: "GET",
      headers: {
        apikey: serviceKey,
        authorization: `Bearer ${accessToken}`,
      },
    });
    if (!res.ok) return json({ ok: false, error: "invalid_session" }, { status: 401 });
    const data = await res.json().catch(() => null);
    email = clean(data?.email).toLowerCase();
  } catch {
    return json({ ok: false, error: "supabase_network_error" }, { status: 502 });
  }

  if (!email) return json({ ok: false, error: "missing_email" }, { status: 401 });

  // Verify registration against Google Sheet (source of truth).
  let playerName = "";
  let status = "";
  const lookup = await lookupPlayerInSheet(appScriptUrl, secret, email);
  if (!lookup.ok) return json({ ok: false, error: lookup.error }, { status: 502 });
  if (!lookup.found) return json({ ok: false, error: "not_registered" }, { status: 403 });
  playerName = lookup.playerName;
  status = lookup.status;
  if (status && status !== "registered" && status !== "confirmed") {
    return json({ ok: false, error: "not_registered" }, { status: 403 });
  }

  // Best-effort: ensure Supabase has the player so La Mesa can lock identity + RLS can apply.
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
    // never block on sync failures
  }

  return json({ ok: true, player: { email, name: playerName, status: status || "registered" } });
};
