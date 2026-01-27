type EnvWithSiteUrl = {
  SITE_URL?: string;
};

function trimTrailingSlashes(url: string) {
  return url.replace(/\/+$/, "");
}

export function getCanonicalSiteUrl(request: Request, env: EnvWithSiteUrl): string {
  const configured = String(env.SITE_URL ?? "").trim();
  if (configured) return trimTrailingSlashes(configured);

  const host =
    request.headers.get("x-forwarded-host")
    || request.headers.get("host")
    || "";

  const proto =
    request.headers.get("x-forwarded-proto")
    || request.headers.get("cf-connecting-proto")
    || "";

  if (host && proto) return trimTrailingSlashes(`${proto}://${host}`);
  if (host) return trimTrailingSlashes(`https://${host}`);

  return trimTrailingSlashes(new URL(request.url).origin);
}

