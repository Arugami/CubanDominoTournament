interface Env {
  APP_SCRIPT_URL?: string;
  APP_SCRIPT_SECRET?: string;
  VENUE_URL?: string;
}

type RegistrationPayload = {
  teamName?: string;
  p1Name?: string;
  p1Email?: string;
  p1Phone?: string;
  p2Name?: string;
  p2Email?: string;
  p2Phone?: string;
  notes?: string;
  ruleConfirm?: string;
  company?: string;
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
  let body: RegistrationPayload;
  try {
    body = (await request.json()) as RegistrationPayload;
  } catch {
    return json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (clean(body.company)) return json({ ok: true });

  const requiredFields: Array<keyof RegistrationPayload> = [
    "teamName",
    "p1Name",
    "p1Email",
    "p1Phone",
    "p2Name",
    "p2Email",
    "p2Phone",
    "ruleConfirm",
  ];

  for (const field of requiredFields) {
    if (!clean(body[field])) return json({ ok: false, error: `missing_${field}` }, { status: 400 });
  }

  const p1Email = clean(body.p1Email);
  const p2Email = clean(body.p2Email);

  if (!isEmail(p1Email)) return json({ ok: false, error: "invalid_p1Email" }, { status: 400 });
  if (!isEmail(p2Email)) return json({ ok: false, error: "invalid_p2Email" }, { status: 400 });

  const appScriptUrl = env.APP_SCRIPT_URL;
  const secret = env.APP_SCRIPT_SECRET;
  if (!appScriptUrl || !secret) return json({ ok: false, error: "missing_server_env" }, { status: 500 });

  const payload = {
    secret,
    teamName: clean(body.teamName),
    p1Name: clean(body.p1Name),
    p1Email,
    p1Phone: clean(body.p1Phone),
    p2Name: clean(body.p2Name),
    p2Email,
    p2Phone: clean(body.p2Phone),
    notes: clean(body.notes),
    ruleConfirm: clean(body.ruleConfirm),
    venueUrl: env.VENUE_URL || "https://mrgarciacigars.com/",
  };

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(appScriptUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return json({ ok: false, error: "upstream_network_error" }, { status: 502 });
  }

  const upstreamJson = await upstreamResponse.json().catch(() => null);
  const ok = !!(upstreamJson && typeof upstreamJson === "object" && (upstreamJson as any).ok === true);

  if (ok) return json({ ok: true });

  return json(
    { ok: false, error: "upstream_error", upstream: upstreamJson },
    { status: 502 },
  );
};
