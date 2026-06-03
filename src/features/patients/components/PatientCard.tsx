import type { Patient } from '../types/patient';
import { Avatar } from '../../../components/Avatar';

interface PatientCardProps {
  patient: Patient;
  onViewDetails: () => void;
  onEdit: (patient: Patient) => void;
}

function PencilIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-5"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
  );
}

export function PatientCard({ patient, onViewDetails, onEdit }: PatientCardProps) {
  return (
    <li className="group bg-surface border border-border rounded-card shadow-resting flex items-stretch transition-all duration-150 hover:border-bark hover:bg-surface-bright hover:shadow-elevated">
      <button
        type="button"
        onClick={onViewDetails}
        aria-label={`View details for ${patient.name}`}
        className="flex flex-1 items-center gap-4 p-4 text-left min-w-0 rounded-l-[var(--radius-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-identity"
      >
        <Avatar src={patient.avatar} name={patient.name} />
        <div className="flex-1 min-w-0">
          <p className="text-card-title font-semibold text-content truncate">{patient.name || '—'}</p>
          <p className="text-label text-muted line-clamp-2">
            {patient.description || 'No description provided'}
          </p>
        </div>
      </button>
      <button
        type="button"
        onClick={() => onEdit(patient)}
        aria-label={`Edit ${patient.name}`}
        className="shrink-0 flex items-center px-4 rounded-r-[var(--radius-card)] text-identity/60 transition-[color,transform] duration-150 hover:text-identity-hover hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-identity"
      >
        <PencilIcon />
      </button>
    </li>
  );
}
