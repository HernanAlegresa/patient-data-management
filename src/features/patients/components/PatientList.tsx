import { useState } from 'react';
import { usePatients } from '../hooks/usePatients';
import { PatientCard } from './PatientCard';
import { PatientDetailModal } from './PatientDetailModal';
import { Spinner } from '../../../components/Spinner';
import type { Patient } from '../types/patient';

export function PatientList() {
  const { patients, loading, error } = usePatients();
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
    return <p className="text-muted text-center py-16">No patients found.</p>;
  }

  return (
    <>
      <ul className="flex flex-col gap-3" aria-label="Patient list">
        {patients.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            onViewDetails={() => setSelectedPatient(patient)}
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
