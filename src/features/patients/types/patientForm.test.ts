import { patientFormSchema } from './patientForm';

const validBase = { name: 'John Doe', avatar: '', website: '', description: '' };

describe('patientFormSchema — website field', () => {
  it('accepts an empty string', () => {
    const result = patientFormSchema.safeParse({ ...validBase, website: '' });
    expect(result.success).toBe(true);
  });

  it('accepts a protocol-less domain (penn.io)', () => {
    const result = patientFormSchema.safeParse({ ...validBase, website: 'penn.io' });
    expect(result.success).toBe(true);
  });

  it('accepts a protocol-less domain (elle-woods.io)', () => {
    const result = patientFormSchema.safeParse({ ...validBase, website: 'elle-woods.io' });
    expect(result.success).toBe(true);
  });

  it('accepts a full https URL', () => {
    const result = patientFormSchema.safeParse({ ...validBase, website: 'https://example.com' });
    expect(result.success).toBe(true);
  });

  it('rejects a clearly invalid value', () => {
    const result = patientFormSchema.safeParse({ ...validBase, website: 'not a url at all' });
    expect(result.success).toBe(false);
  });
});

describe('patientFormSchema — avatar field', () => {
  it('accepts an empty string', () => {
    const result = patientFormSchema.safeParse({ ...validBase, avatar: '' });
    expect(result.success).toBe(true);
  });

  it('accepts a full https URL', () => {
    const result = patientFormSchema.safeParse({
      ...validBase,
      avatar: 'https://example.com/avatar.jpg',
    });
    expect(result.success).toBe(true);
  });

  it('rejects a clearly invalid value', () => {
    const result = patientFormSchema.safeParse({ ...validBase, avatar: 'not a url at all' });
    expect(result.success).toBe(false);
  });
});
