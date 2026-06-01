import type { Patient } from '../types/patient';
import { Modal } from '../../../components/Modal';
import { Avatar } from '../../../components/Avatar';
import { normalizeWebsiteUrl } from '../../../lib/urlUtils';

function formatCreatedAt(isoString: string): string {
  if (!isoString) return 'Unknown date';
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(isoString));
  } catch {
    return 'Unknown date';
  }
}

interface PatientDetailModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
}

export function PatientDetailModal({
  patient,
  isOpen,
  onClose,
}: PatientDetailModalProps) {
  const normalizedUrl = patient ? normalizeWebsiteUrl(patient.website) : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={patient?.name || 'Patient Details'}>
      {patient && (
        <div className="flex flex-col gap-6 p-5">
          <div className="flex items-center gap-4">
            <Avatar src={patient.avatar} name={patient.name} size="lg" />
            <div className="min-w-0">
              <p className="text-xl font-semibold text-content">{patient.name || '—'}</p>
              <p className="text-sm text-muted">Added {formatCreatedAt(patient.createdAt)}</p>
            </div>
          </div>

          {patient.description && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
                Description
              </p>
              <p className="leading-relaxed text-content">{patient.description}</p>
            </div>
          )}

          {normalizedUrl !== null && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
                Website
              </p>
              <a
                href={normalizedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-primary hover:underline"
              >
                {patient.website}
              </a>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
