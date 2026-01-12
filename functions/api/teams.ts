interface Env {
  APP_SCRIPT_URL?: string;
}

function json(data: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("cache-control", "public, max-age=30");
  return new Response(JSON.stringify(data), { ...init, headers });
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const appScriptUrl = env.APP_SCRIPT_URL;
  if (!appScriptUrl) return json({ teams: [], error: "missing_server_env" }, { status: 500 });

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(appScriptUrl, { method: "GET" });
  } catch {
    return json({ teams: [], error: "upstream_network_error" }, { status: 502 });
  }

  const upstreamJson = await upstreamResponse.json().catch(() => null);
  if (upstreamJson && typeof upstreamJson === "object" && Array.isArray((upstreamJson as any).teams)) {
    return json({ teams: (upstreamJson as any).teams });
  }

  return json({ teams: [], error: "upstream_error" }, { status: 502 });
};

