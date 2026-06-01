import { useState, useEffect } from 'react';
import type { Patient } from '../types/patient';
import { patientsService } from '../services/patientsService';

interface UsePatientsResult {
  patients: Patient[];
  loading: boolean;
  error: string | null;
}

export function usePatients(): UsePatientsResult {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    patientsService
      .getAll()
      .then((data) => {
        if (!cancelled) {
          setPatients(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load patients');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { patients, loading, error };
}
