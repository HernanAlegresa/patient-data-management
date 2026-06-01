import { z } from 'zod';
import { patientApiSchema } from '../types/patient';
import type { Patient } from '../types/patient';

const API_URL = 'https://63bedcf7f5cfc0949b634fc8.mockapi.io/users';

async function getAll(): Promise<Patient[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch patients: ${response.status} ${response.statusText}`);
  }
  const raw: unknown = await response.json();
  // Parse as unknown[] first so individual null/non-object items can be safely
  // skipped via safeParse rather than throwing. Per-field .catch() in the schema
  // still coerces dirty-but-object records (avatar:{}, missing fields, etc.).
  const items: unknown[] = z.array(z.unknown()).catch([]).parse(raw);
  return items.flatMap((item) => {
    const result = patientApiSchema.safeParse(item);
    return result.success ? [result.data] : [];
  });
}

export const patientsService = { getAll };
