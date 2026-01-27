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
  try {
    const lookupRes = await fetch(appScriptUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ secret, action: "mesa_lookup_player", email }),
    });
    const lookupJson = await lookupRes.json().catch(() => null);
    const found = !!(lookupJson && typeof lookupJson === "object" && (lookupJson as any).found === true);
    if (!found) return json({ ok: false, error: "not_registered" }, { status: 403 });
    playerName = clean((lookupJson as any)?.player?.playerName);
    status = clean((lookupJson as any)?.player?.status).toLowerCase();
    if (status && status !== "registered" && status !== "confirmed") {
      return json({ ok: false, error: "not_registered" }, { status: 403 });
    }
  } catch {
    return json({ ok: false, error: "upstream_network_error" }, { status: 502 });
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

