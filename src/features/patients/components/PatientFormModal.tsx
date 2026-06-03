import { useEffect, type ReactNode } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Patient } from '../types/patient';
import { patientFormSchema, type PatientFormData } from '../types/patientForm';
import { Modal } from '../../../components/Modal';
import { Input } from '../../../components/Input';
import { Textarea } from '../../../components/Textarea';

const EMPTY_FORM: PatientFormData = {
  name: '',
  avatar: '',
  website: '',
  description: '',
};

interface PatientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient?: Patient;
  onSubmit: (data: PatientFormData) => void;
}

function AddIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6z" />
      <path d="M16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
    </svg>
  );
}

/*
  Centered title for modal headers. The text lands at the Modal header's
  TRUE visual midpoint (not the title slot's midpoint, which sits ~22px
  to the left of the header center because of the X close button on the
  right side of the slot).

  The left column width (2.75rem = 44px) mirrors the visual weight of
  the X close button + gap on the right side of the slot:
    - Close button: size-5 svg + p-1.5 padding = 32px
    - Header gap-3 between slot and close button = 12px
    - Total right-side weight = 44px

  With the icon column matching that 44px, the 1fr text column is
  geometrically symmetric to the area between the slot's right edge
  and the X button, so text-center inside it lands exactly at the
  header's midline.

  NOTE: this mirrors dimensions defined in Modal.tsx. If the close
  button size or the header's gap-3 change there, update this value.
*/
function CenteredTitle({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <span className="grid w-full grid-cols-[2.75rem_1fr] items-center text-lg font-semibold text-content">
      <span className="justify-self-start">{icon}</span>
      <span className="text-center">{text}</span>
    </span>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
  );
}

export function PatientFormModal({ isOpen, onClose, patient, onSubmit }: PatientFormModalProps) {
  const isEditMode = patient !== undefined;

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid, isDirty },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: EMPTY_FORM,
    mode: 'onChange',
  });

  useEffect(() => {
    if (!isOpen) return;
    reset(
      patient
        ? {
            name: patient.name,
            avatar: patient.avatar,
            website: patient.website,
            description: patient.description,
          }
        : EMPTY_FORM,
    );
  }, [patient, isOpen, reset]);

  function handleFormSubmit(data: PatientFormData) {
    onSubmit(data);
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isEditMode ? (
          <CenteredTitle
            icon={<EditIcon className="size-6 text-identity" />}
            text="Edit Patient"
          />
        ) : (
          <CenteredTitle
            icon={<AddIcon className="size-6 text-action" />}
            text="Add Patient"
          />
        )
      }
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        {/* Fields */}
        <div className="flex flex-col gap-5 px-5 pb-6 pt-5">
          {/* Name — required, always full width */}
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                id="patient-name"
                label="Name"
                required
                value={field.value}
                onChange={(e) => field.onChange(e)}
                error={fieldState.error?.message}
                placeholder="Full name"
              />
            )}
          />

          {/* URL fields — side by side when space allows */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Controller
              name="avatar"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  id="patient-avatar"
                  label="Avatar URL"
                  value={field.value}
                  onChange={(e) => field.onChange(e)}
                  error={fieldState.error?.message}
                  placeholder="https://..."
                />
              )}
            />
            <Controller
              name="website"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  id="patient-website"
                  label="Website URL"
                  value={field.value}
                  onChange={(e) => field.onChange(e)}
                  error={fieldState.error?.message}
                  placeholder="https://..."
                />
              )}
            />
          </div>

          {/* Description — full width, last */}
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <Textarea
                id="patient-description"
                label="Description"
                value={field.value}
                onChange={(e) => field.onChange(e)}
                error={fieldState.error?.message}
                placeholder="Brief description of the patient…"
                rows={4}
              />
            )}
          />
        </div>

        {/* Separator + actions */}
        <div className="flex items-center justify-end gap-3 border-t border-border px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-btn px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-background hover:text-content"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isEditMode ? (!isValid || !isDirty || isSubmitting) : (!isValid || isSubmitting)}
            className="rounded-btn bg-action px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-action-hover disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-action"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}
