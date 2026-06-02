import { useState, useCallback } from 'react';
import { usePatients } from './features/patients/hooks/usePatients';
import { PatientList } from './features/patients/components/PatientList';
import { PatientFormModal } from './features/patients/components/PatientFormModal';
import { Toast } from './components/Toast';
import type { Patient } from './features/patients/types/patient';
import type { PatientFormData } from './features/patients/types/patientForm';

interface ToastState {
  message: string;
  type: 'success' | 'error';
}

export default function App() {
  const { patients, loading, error, addPatient, editPatient } = usePatients();

  const [formOpen, setFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | undefined>(undefined);
  const [toast, setToast] = useState<ToastState | null>(null);

  function openAddForm() {
    setEditingPatient(undefined);
    setFormOpen(true);
  }

  const openEditForm = useCallback((patient: Patient) => {
    setEditingPatient(patient);
    setFormOpen(true);
  }, []);

  function closeForm() {
    setFormOpen(false);
  }

  function handleFormSubmit(data: PatientFormData) {
    try {
      if (editingPatient) {
        editPatient(editingPatient.id, data);
        setToast({ message: 'Patient updated.', type: 'success' });
      } else {
        addPatient(data);
        setToast({ message: 'Patient added.', type: 'success' });
      }
    } catch {
      setToast({ message: 'Something went wrong.', type: 'error' });
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-surface-elevated border-b border-border px-6 py-4">
        <h1 className="text-xl font-semibold text-content">Patient Data Management</h1>
      </header>

      <main className="max-w-[var(--width-container)] mx-auto px-4 py-6 pb-28">
        <PatientList
          patients={patients}
          loading={loading}
          error={error}
          onEdit={openEditForm}
        />
      </main>

      {/* Gradient scrim: fades list content out before the FAB */}
      <div
        className="fixed bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-surface to-transparent pointer-events-none z-30"
        aria-hidden="true"
      />

      {/* FAB */}
      <button
        type="button"
        onClick={openAddForm}
        aria-label="Add patient"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        Add patient
      </button>

      <PatientFormModal
        isOpen={formOpen}
        onClose={closeForm}
        patient={editingPatient}
        onSubmit={handleFormSubmit}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
}
