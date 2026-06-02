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
}

export function PatientDetailModal({
  patient,
  isOpen,
  onClose,
}: PatientDetailModalProps) {
  const normalizedUrl = patient ? normalizeWebsiteUrl(patient.website) : null;
  const hasDetails = Boolean(patient?.description) || normalizedUrl !== null;

  const titleNode = patient ? (
    <div className="flex items-center gap-3 min-w-0">
      <Avatar src={patient.avatar} name={patient.name} alt="" />
      <div className="min-w-0">
        <p className="truncate text-base font-semibold text-content">
          {patient.name || '—'}
        </p>
        <p className="truncate text-sm text-muted">
          Added {formatCreatedAt(patient.createdAt)}
        </p>
      </div>
    </div>
  ) : (
    'Patient Details'
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={titleNode}>
      {patient && (
        <div className="flex flex-col gap-6 p-5">
          {patient.description && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-bark/80">
                Description
              </p>
              <p className="leading-relaxed text-content">{patient.description}</p>
            </div>
          )}

          {normalizedUrl !== null && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-bark/80">
                Website
              </p>
              <a
                href={normalizedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-identity hover:underline"
              >
                {patient.website}
              </a>
            </div>
          )}

          {!hasDetails && (
            <p className="text-sm text-muted italic">
              No additional details available.
            </p>
          )}
        </div>
      )}
    </Modal>
  );
}
