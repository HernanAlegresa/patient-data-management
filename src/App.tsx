import { PatientList } from './features/patients/components/PatientList';

export default function App() {
  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-surface-elevated border-b border-border px-6 py-4">
        <h1 className="text-xl font-semibold text-content">Patient Data Management</h1>
      </header>
      <main className="max-w-[var(--width-container)] mx-auto px-4 py-6">
        <PatientList />
      </main>
    </div>
  );
}
