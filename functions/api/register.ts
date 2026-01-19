interface Env {
  APP_SCRIPT_URL?: string;
  APP_SCRIPT_SECRET?: string;
  VENUE_URL?: string;
}

type RegistrationPayload = {
  playerName?: string;
  email?: string;
  phone?: string;
  notes?: string;
  ruleConfirm?: string;
  company?: string; // honeypot
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

  // Honeypot check - bots fill this, humans don't
  if (clean(body.company)) return json({ ok: true });

  // Validate required fields for individual sign-up
  const requiredFields: Array<keyof RegistrationPayload> = [
    "playerName",
    "email",
    "phone",
    "ruleConfirm",
  ];

  for (const field of requiredFields) {
    if (!clean(body[field])) return json({ ok: false, error: `missing_${field}` }, { status: 400 });
  }

  const email = clean(body.email);
  if (!isEmail(email)) return json({ ok: false, error: "invalid_email" }, { status: 400 });

  const appScriptUrl = env.APP_SCRIPT_URL;
  const secret = env.APP_SCRIPT_SECRET;
  if (!appScriptUrl || !secret) return json({ ok: false, error: "missing_server_env" }, { status: 500 });

  // Individual player registration payload
  const payload = {
    secret,
    playerName: clean(body.playerName),
    email,
    phone: clean(body.phone),
    notes: clean(body.notes),
    ruleConfirm: clean(body.ruleConfirm),
    venueUrl: env.VENUE_URL || "https://share.google/Bd3ZofPsvccfdT7EC",
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
