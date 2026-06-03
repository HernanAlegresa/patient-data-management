import { describe, it, expect } from 'vitest';
import { sortPatients } from './sortUtils';
import type { Patient } from '../features/patients/types/patient';

function makePatient(overrides: Partial<Patient>): Patient {
  return {
    id: '1',
    createdAt: '2024-01-01T00:00:00.000Z',
    name: 'Test Patient',
    avatar: '',
    description: '',
    website: '',
    ...overrides,
  };
}

describe('sortPatients — name sort', () => {
  it('sorts by name A–Z case-insensitively', () => {
    const patients = [
      makePatient({ id: '1', name: 'COSME FULANITO' }),
      makePatient({ id: '2', name: 'valentin' }),
      makePatient({ id: '3', name: 'Alice' }),
    ];
    const result = sortPatients(patients, 'name');
    expect(result.map((p) => p.id)).toEqual(['3', '1', '2']);
  });

  it('sorts accent-insensitively so Penélope groups with P', () => {
    const patients = [
      makePatient({ id: '1', name: 'Quentin' }),
      makePatient({ id: '2', name: 'Penélope García' }),
      makePatient({ id: '3', name: 'Pedro' }),
    ];
    const result = sortPatients(patients, 'name');
    expect(result.map((p) => p.id)).toEqual(['3', '2', '1']);
  });

  it('sorts names that arrived trimmed from ingestion correctly', () => {
    // Names are trimmed by the schema before reaching this function.
    // 'Donna' (formerly ' Donna Doe') sorts before 'Zachary'.
    const patients = [
      makePatient({ id: '1', name: 'Zachary' }),
      makePatient({ id: '2', name: 'Donna' }),
    ];
    const result = sortPatients(patients, 'name');
    expect(result.map((p) => p.id)).toEqual(['2', '1']);
  });

  it('does not mutate the input array', () => {
    const patients = [
      makePatient({ id: '1', name: 'Zachary' }),
      makePatient({ id: '2', name: 'Alice' }),
    ];
    const snapshot = [...patients];
    sortPatients(patients, 'name');
    expect(patients[0].id).toBe(snapshot[0].id);
    expect(patients[1].id).toBe(snapshot[1].id);
  });
});

describe('sortPatients — date sort', () => {
  const older = makePatient({ id: 'old', name: 'Older', createdAt: '2023-01-01T00:00:00.000Z' });
  const middle = makePatient({ id: 'mid', name: 'Middle', createdAt: '2024-06-15T00:00:00.000Z' });
  const newer = makePatient({ id: 'new', name: 'Newer', createdAt: '2025-12-31T00:00:00.000Z' });

  it('sorts newest first (descending by createdAt)', () => {
    const result = sortPatients([older, newer, middle], 'newest');
    expect(result.map((p) => p.id)).toEqual(['new', 'mid', 'old']);
  });

  it('sorts oldest first (ascending by createdAt)', () => {
    const result = sortPatients([newer, older, middle], 'oldest');
    expect(result.map((p) => p.id)).toEqual(['old', 'mid', 'new']);
  });

  it('sends a record with an unparseable createdAt to the end of newest-first sort', () => {
    const bad = makePatient({ id: 'bad', name: 'Bad Date', createdAt: '' });
    const result = sortPatients([bad, newer, older], 'newest');
    expect(result[result.length - 1].id).toBe('bad');
  });

  it('sends a record with an unparseable createdAt to the end of oldest-first sort', () => {
    const bad = makePatient({ id: 'bad', name: 'Bad Date', createdAt: '' });
    const result = sortPatients([bad, newer, older], 'oldest');
    expect(result[result.length - 1].id).toBe('bad');
  });
});
