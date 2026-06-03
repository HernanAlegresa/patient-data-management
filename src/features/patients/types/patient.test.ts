import { patientApiSchema } from './patient';

const base = {
  id: '1',
  createdAt: '2024-01-01T00:00:00.000Z',
  name: 'John Doe',
  avatar: 'https://example.com/avatar.jpg',
  description: 'A patient',
  website: 'https://example.com',
};

describe('patientApiSchema — shape normalization', () => {
  it('coerces avatar:{} to empty string', () => {
    const result = patientApiSchema.parse({ ...base, avatar: {} });
    expect(result.avatar).toBe('');
  });

  it('coerces a non-string avatar to empty string', () => {
    const result = patientApiSchema.parse({ ...base, avatar: 42 });
    expect(result.avatar).toBe('');
  });

  it('strips unexpected extra fields', () => {
    const result = patientApiSchema.parse({ ...base, password: 'secret', body: 'extra' });
    expect(result).not.toHaveProperty('password');
    expect(result).not.toHaveProperty('body');
  });

  it('coerces all fields to empty strings when entire record is missing fields', () => {
    const result = patientApiSchema.parse({});
    expect(result).toEqual({
      id: '',
      createdAt: '',
      name: '',
      avatar: '',
      description: '',
      website: '',
    });
  });

  it('passes through a clean record unchanged', () => {
    const result = patientApiSchema.parse(base);
    expect(result).toEqual(base);
  });

  it('safeParse returns failure for a non-object item (null)', () => {
    const result = patientApiSchema.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('trims surrounding whitespace from name', () => {
    const result = patientApiSchema.parse({ ...base, name: '  Donna Doe  ' });
    expect(result.name).toBe('Donna Doe');
  });
});
