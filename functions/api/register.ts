interface Env {
  APP_SCRIPT_URL?: string;
  APP_SCRIPT_SECRET?: string;
  VENUE_URL?: string;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SITE_URL?: string;
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

import { getCanonicalSiteUrl } from "../lib/site-url";

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

  const supabaseUrl = clean(env.SUPABASE_URL);
  const serviceKey = clean(env.SUPABASE_SERVICE_ROLE_KEY);
  const siteUrl = getCanonicalSiteUrl(request, env);

  // Optional: create a one-click "Table Key" link for La Mesa that can be embedded in the registration confirmation email.
  // This keeps the flow to a single email: register -> receive confirmation (with key) -> enter La Mesa.
  let mesaLoginLink = "";
  if (supabaseUrl && serviceKey) {
    try {
      const url = new URL("/auth/v1/admin/generate_link", supabaseUrl);
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
          email: email.toLowerCase(),
          // Supabase Auth HTTP API has historically used `redirect_to` (snake_case) while some SDKs use `redirectTo`.
          // Sending both is harmless and ensures redirects always land on `/mesa/callback`.
          options: { redirectTo, redirect_to: redirectTo },
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
  }

  // Individual player registration payload
  const payload = {
    secret,
    playerName: clean(body.playerName),
    email,
    phone: clean(body.phone),
    notes: clean(body.notes),
    ruleConfirm: clean(body.ruleConfirm),
    venueUrl: env.VENUE_URL || "https://maps.google.com/?q=333+Bergenline+Blvd,+Fairview,+NJ",
    siteUrl,
    mesaLoginLink,
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

  if (ok) {
    // Best-effort: sync the player into Supabase so La Mesa login can verify seats cross-device.
    // Never block registration success on this sync (Sheets is the primary source for now).
    let supabaseSynced = false;

    if (supabaseUrl && serviceKey) {
      try {
        const restUrl = new URL("/rest/v1/players", supabaseUrl);
        restUrl.searchParams.set("on_conflict", "email");

        const player = {
          email: email.toLowerCase(),
          name: clean(body.playerName),
          phone: clean(body.phone),
          notes: clean(body.notes),
          status: "registered",
        };

        const res = await fetch(restUrl.toString(), {
          method: "POST",
          headers: {
            apikey: serviceKey,
            authorization: `Bearer ${serviceKey}`,
            "content-type": "application/json",
            prefer: "resolution=merge-duplicates,return=minimal",
          },
          body: JSON.stringify(player),
        });

        supabaseSynced = res.ok;
      } catch {
        supabaseSynced = false;
      }
    }

    return json({ ok: true, supabaseSynced, mesaLoginLinkIncluded: !!mesaLoginLink });
  }

  return json(
    { ok: false, error: "upstream_error", upstream: upstreamJson },
    { status: 502 },
  );
};
