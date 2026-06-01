import { usePatients } from '../hooks/usePatients';
import { PatientCard } from './PatientCard';
import { Spinner } from '../../../components/Spinner';

export function PatientList() {
  const { patients, loading, error } = usePatients();

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
    <ul className="flex flex-col gap-3" aria-label="Patient list">
      {patients.map((patient) => (
        <PatientCard
          key={patient.id}
          patient={patient}
          onViewDetails={() => {}}
        />
      ))}
    </ul>
  );
}
