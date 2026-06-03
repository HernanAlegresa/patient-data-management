import type { Patient } from '../features/patients/types/patient';

export type SortOrder = 'name' | 'newest' | 'oldest';

const collator = new Intl.Collator(undefined, { sensitivity: 'base' });

function compareByDate(a: Patient, b: Patient, direction: 'asc' | 'desc'): number {
  const aMs = Date.parse(a.createdAt);
  const bMs = Date.parse(b.createdAt);
  const aValid = !Number.isNaN(aMs);
  const bValid = !Number.isNaN(bMs);
  if (!aValid && !bValid) return 0;
  if (!aValid) return 1;
  if (!bValid) return -1;
  return direction === 'asc' ? aMs - bMs : bMs - aMs;
}

export function sortPatients(patients: Patient[], sortOrder: SortOrder): Patient[] {
  const sorted = [...patients];
  if (sortOrder === 'name') {
    sorted.sort((a, b) => collator.compare(a.name, b.name));
  } else if (sortOrder === 'newest') {
    sorted.sort((a, b) => compareByDate(a, b, 'desc'));
  } else {
    sorted.sort((a, b) => compareByDate(a, b, 'asc'));
  }
  return sorted;
}
