function tryParseWebUrl(value: string): URL | null {
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(withProtocol);
    if ((url.protocol === 'http:' || url.protocol === 'https:') && url.hostname.includes('.')) {
      return url;
    }
    return null;
  } catch {
    return null;
  }
}

// Checks whether a value is a valid http/https URL worth trying to render in
// an <img>. Requires a proper hostname (dot present). Does NOT check file
// extension — CDN avatar URLs rarely carry one; the component's onError handler
// is the real guard against non-image responses.
export function isValidImageUrl(value: unknown): boolean {
  if (typeof value !== 'string' || value === '') return false;
  try {
    const url = new URL(value);
    return (url.protocol === 'http:' || url.protocol === 'https:') && url.hostname.includes('.');
  } catch {
    return false;
  }
}

export function isValidWebsiteUrl(value: unknown): boolean {
  if (typeof value !== 'string' || value.trim() === '') return false;
  return tryParseWebUrl(value.trim()) !== null;
}

// Returns the normalized href (with protocol, trailing slash) or null if the
// value cannot be turned into a navigable URL.
export function normalizeWebsiteUrl(value: unknown): string | null {
  if (typeof value !== 'string' || value.trim() === '') return null;
  const url = tryParseWebUrl(value.trim());
  return url ? url.href : null;
}
