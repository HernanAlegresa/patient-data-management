import { isValidImageUrl, isValidWebsiteUrl, normalizeWebsiteUrl } from './urlUtils';

describe('isValidImageUrl', () => {
  it('returns true for valid http/https URLs with a proper hostname', () => {
    expect(isValidImageUrl('https://example.com/photo.jpg')).toBe(true);
    expect(isValidImageUrl('https://cdn.example.com/avatars/123')).toBe(true);
    expect(isValidImageUrl('http://example.com/img.png')).toBe(true);
  });

  it('returns false for a URL with no dot in the hostname', () => {
    expect(isValidImageUrl('http://localhost/image.jpg')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isValidImageUrl('')).toBe(false);
  });

  it('returns false for non-string values', () => {
    expect(isValidImageUrl({})).toBe(false);
    expect(isValidImageUrl(null)).toBe(false);
    expect(isValidImageUrl(undefined)).toBe(false);
  });

  it('returns false for strings that are not URLs', () => {
    expect(isValidImageUrl('not-a-url')).toBe(false);
    expect(isValidImageUrl('linkedin')).toBe(false);
  });
});

describe('isValidWebsiteUrl', () => {
  it('returns true for valid fully-qualified URLs', () => {
    expect(isValidWebsiteUrl('https://example.com')).toBe(true);
    expect(isValidWebsiteUrl('http://example.com')).toBe(true);
  });

  it('returns true for bare domains that have a TLD', () => {
    expect(isValidWebsiteUrl('elle-woods.io')).toBe(true);
    expect(isValidWebsiteUrl('example.com')).toBe(true);
  });

  it('returns false for a single word with no TLD', () => {
    expect(isValidWebsiteUrl('linkedin')).toBe(false);
  });

  it('returns false for empty or non-string values', () => {
    expect(isValidWebsiteUrl('')).toBe(false);
    expect(isValidWebsiteUrl(null)).toBe(false);
  });
});

describe('normalizeWebsiteUrl', () => {
  it('prepends https:// to bare domains and returns the href', () => {
    expect(normalizeWebsiteUrl('elle-woods.io')).toBe('https://elle-woods.io/');
    expect(normalizeWebsiteUrl('example.com')).toBe('https://example.com/');
  });

  it('preserves an existing protocol', () => {
    expect(normalizeWebsiteUrl('https://example.com')).toBe('https://example.com/');
    expect(normalizeWebsiteUrl('http://example.com')).toBe('http://example.com/');
  });

  it('returns null for a single word with no TLD', () => {
    expect(normalizeWebsiteUrl('linkedin')).toBe(null);
  });

  it('returns null for empty or non-string values', () => {
    expect(normalizeWebsiteUrl('')).toBe(null);
    expect(normalizeWebsiteUrl(null)).toBe(null);
    expect(normalizeWebsiteUrl({})).toBe(null);
  });
});
