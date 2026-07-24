// Base-aware internal links. Astro injects the configured `base` as
// import.meta.env.BASE_URL. Routing every internal href through url() means
// switching `base` in astro.config.mjs is the only change needed to move
// between a GitHub project page, a user page, or a custom domain.
//
// BASE_URL may or may not carry a trailing slash depending on config, so we
// normalize: strip any trailing slash off the base, ensure a leading slash on
// the path, then join. base='/'  -> BASE=''  -> url('/contact') = '/contact'.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function url(path = '/'): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${BASE}${p}`;
}
