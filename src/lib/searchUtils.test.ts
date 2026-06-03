import { normalizeForSearch } from './searchUtils';

describe('normalizeForSearch', () => {
  it('lowercases ASCII text', () => {
    expect(normalizeForSearch('Hello World')).toBe('hello world');
  });

  it('strips acute accents (é → e)', () => {
    expect(normalizeForSearch('café')).toBe('cafe');
  });

  it('strips tildes (ñ → n)', () => {
    expect(normalizeForSearch('Hernán')).toBe('hernan');
  });

  it('matches accented name with unaccented search term', () => {
    const name = normalizeForSearch('Hernán');
    const term = normalizeForSearch('hernan');
    expect(name.includes(term)).toBe(true);
  });

  it('handles mixed accents and case', () => {
    expect(normalizeForSearch('Ångström')).toBe('angstrom');
  });

  it('returns empty string unchanged', () => {
    expect(normalizeForSearch('')).toBe('');
  });

  it('does not trim whitespace — trimming is the caller\'s responsibility', () => {
    expect(normalizeForSearch(' alice ')).toBe(' alice ');
  });
});
