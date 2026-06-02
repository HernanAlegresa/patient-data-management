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
      className="size-4"
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
    <li className="bg-surface-elevated border border-border rounded-card p-4 flex items-center gap-4">
      <Avatar src={patient.avatar} name={patient.name} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-content truncate">{patient.name || '—'}</p>
        <p className="text-sm text-muted line-clamp-2">
          {patient.description || 'No description provided'}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onEdit(patient)}
        aria-label={`Edit ${patient.name}`}
        className="shrink-0 p-1 text-muted hover:text-primary rounded-btn transition-colors"
      >
        <PencilIcon />
      </button>
      <button
        type="button"
        onClick={onViewDetails}
        aria-label={`View details for ${patient.name}`}
        className="shrink-0 p-1 text-muted hover:text-primary rounded-btn transition-colors"
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
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </li>
  );
}
