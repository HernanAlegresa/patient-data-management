import { useState, useCallback, useEffect, useRef } from 'react';
import { usePatients } from './features/patients/hooks/usePatients';
import { PatientList } from './features/patients/components/PatientList';
import { PatientFormModal } from './features/patients/components/PatientFormModal';
import { Toast } from './components/Toast';
import type { Patient } from './features/patients/types/patient';
import type { PatientFormData } from './features/patients/types/patientForm';
import logo from './assets/logo.png';

interface ToastState {
  message: string;
  type: 'success' | 'error';
}

export default function App() {
  const { patients, loading, error, addPatient, editPatient } = usePatients();

  const [formOpen, setFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | undefined>(undefined);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

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
    <div className="min-h-screen bg-background">
      <header
        className={[
          'sticky top-0 z-[60] bg-bark px-6 py-4 transition-shadow duration-200',
          scrolled ? 'shadow-resting' : '',
        ].join(' ')}
      >
        {/*
          Mobile (flex): title on the left (order-1), logo on the right (order-2).
          Desktop md+ (grid 1fr auto 1fr): logo in col 1 (md:order-1), title
          truly centered in col 2 (md:order-2), right col reserved for future use.
        */}
        <div className="flex items-center gap-3 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-4">
          {/*
            Visual size = size-14 (56px), layout slot = 36px via -my-2.5.
            The image overflows its flex box by 10px top/bottom into the
            header's 16px padding zone, so it appears larger without
            pushing the header height past --header-height (4.25rem).
          */}
          <img
            src={logo}
            alt=""
            aria-hidden="true"
            width={56}
            height={56}
            className="size-14 shrink-0 -my-2.5 select-none order-2 md:order-1 md:justify-self-start"
          />
          <h1 className="flex-1 min-w-0 truncate order-1 text-left text-base md:flex-none md:text-page-title font-semibold text-background md:order-2 md:text-center md:justify-self-center">
            Patient Data Management
          </h1>
          <div className="hidden md:block md:order-3" aria-hidden="true" />
        </div>
      </header>

      {/* Scroll sentinel — exits viewport on first scroll, triggering the header shadow */}
      <div ref={sentinelRef} className="h-0" aria-hidden="true" />

      <main className="max-w-[var(--width-container)] mx-auto px-4 py-6 pb-28">
        <PatientList
          patients={patients}
          loading={loading}
          error={error}
          onEdit={openEditForm}
        />
      </main>

      {/* Gradient scrim: fades list content before the FAB */}
      <div
        className="fixed bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-background to-transparent pointer-events-none z-30"
        aria-hidden="true"
      />

      {/* FAB */}
      <button
        type="button"
        onClick={openAddForm}
        aria-label="Add patient"
        style={{ right: 'calc(1.5rem + var(--scrollbar-width, 0px))' }}
        className="fixed bottom-6 z-40 flex items-center gap-2 rounded-full bg-action px-5 py-3 text-sm font-semibold text-white shadow-elevated backdrop-blur-sm transition-[background-color,border-color,right] hover:bg-action-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
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
