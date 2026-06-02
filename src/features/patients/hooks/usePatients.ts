import { useState, useEffect, useCallback } from 'react';
import type { Patient } from '../types/patient';
import type { PatientFormData } from '../types/patientForm';
import { patientsService } from '../services/patientsService';

interface UsePatientsResult {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  addPatient: (data: PatientFormData) => void;
  editPatient: (id: string, data: PatientFormData) => void;
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

  const addPatient = useCallback((data: PatientFormData) => {
    const newPatient: Patient = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      name: data.name,
      avatar: data.avatar,
      website: data.website,
      description: data.description,
    };
    setPatients((prev) => [newPatient, ...prev]);
  }, []);

  const editPatient = useCallback((id: string, data: PatientFormData) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, name: data.name, avatar: data.avatar, website: data.website, description: data.description }
          : p,
      ),
    );
  }, []);

  return { patients, loading, error, addPatient, editPatient };
}
