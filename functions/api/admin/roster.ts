interface Env {
  APP_SCRIPT_URL?: string;
  APP_SCRIPT_SECRET?: string;
  PUBLIC_SUPABASE_URL?: string;
  PUBLIC_SUPABASE_ANON_KEY?: string;
}

function json(data: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("cache-control", "no-store");
  return new Response(JSON.stringify(data), { ...init, headers });
}

function bearerToken(request: Request) {
  const header = request.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || "";
}

async function requireAdmin(request: Request, env: Env) {
  const supabaseUrl = env.PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = env.PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return { ok: false as const, error: "missing_supabase_env" };

  const token = bearerToken(request);
  if (!token) return { ok: false as const, error: "missing_auth" };

  const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
    method: "GET",
    headers: {
      apikey: supabaseAnonKey,
      authorization: `Bearer ${token}`,
    },
  });

  if (!userRes.ok) return { ok: false as const, error: "invalid_auth" };
  const userJson = (await userRes.json().catch(() => null)) as any;
  const email = String(userJson?.email || userJson?.user?.email || "").trim();
  if (!email) return { ok: false as const, error: "invalid_auth" };

  const adminRes = await fetch(
    `${supabaseUrl}/rest/v1/admin_users?select=email&email=eq.${encodeURIComponent(email)}`,
    {
      method: "GET",
      headers: {
        apikey: supabaseAnonKey,
        authorization: `Bearer ${token}`,
        accept: "application/json",
      },
    },
  );

  if (!adminRes.ok) return { ok: false as const, error: "admin_check_failed" };
  const admins = (await adminRes.json().catch(() => null)) as any;
  if (!Array.isArray(admins) || admins.length < 1) return { ok: false as const, error: "not_admin" };

  return { ok: true as const, email };
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const admin = await requireAdmin(request, env);
  if (!admin.ok) {
    const status = admin.error === "missing_auth" ? 401 : admin.error === "not_admin" ? 403 : 500;
    return json({ ok: false, error: admin.error }, { status });
  }

  const appScriptUrl = env.APP_SCRIPT_URL;
  const secret = env.APP_SCRIPT_SECRET;
  if (!appScriptUrl || !secret) return json({ ok: false, error: "missing_server_env" }, { status: 500 });

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(appScriptUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ secret, action: "admin_list_players" }),
    });
  } catch {
    return json({ ok: false, error: "upstream_network_error" }, { status: 502 });
  }

  const upstreamJson = await upstreamResponse.json().catch(() => null);
  if (upstreamJson && typeof upstreamJson === "object" && Array.isArray((upstreamJson as any).players)) {
    return json({ ok: true, players: (upstreamJson as any).players });
  }

  return json({ ok: false, error: "upstream_error", upstream: upstreamJson }, { status: 502 });
};

