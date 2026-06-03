import { useState } from 'react';
import { PatientCard } from './PatientCard';
import { PatientDetailModal } from './PatientDetailModal';
import { Spinner } from '../../../components/Spinner';
import type { Patient } from '../types/patient';

interface PatientListProps {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  onEdit: (patient: Patient) => void;
  searchTerm?: string;
  onClearSearch: () => void;
}

export function PatientList({ patients, loading, error, onEdit, searchTerm, onClearSearch }: PatientListProps) {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <p role="alert" className="text-error text-center py-16">
        {error}
      </p>
    );
  }

  if (patients.length === 0) {
    if (searchTerm) {
      return (
        <div role="status" className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-muted">No patients match your search.</p>
          <button
            type="button"
            onClick={onClearSearch}
            className="rounded-btn border border-border px-4 py-2 text-sm text-content transition-colors hover:border-muted hover:bg-surface"
          >
            Show all patients
          </button>
        </div>
      );
    }
    return <p role="status" className="text-muted text-center py-16">No patients found.</p>;
  }

  return (
    <>
      <ul className="flex flex-col gap-3" aria-label="Patient list">
        {patients.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            onViewDetails={() => setSelectedPatient(patient)}
            onEdit={onEdit}
          />
        ))}
      </ul>
      <PatientDetailModal
        patient={selectedPatient}
        isOpen={selectedPatient !== null}
        onClose={() => setSelectedPatient(null)}
      />
    </>
  );
}
