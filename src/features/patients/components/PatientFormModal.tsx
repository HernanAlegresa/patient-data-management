import { useEffect } from 'react';
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

function AddIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-4"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6z" />
      <path d="M16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
    </svg>
  );
}

function EditIcon() {
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

export function PatientFormModal({ isOpen, onClose, patient, onSubmit }: PatientFormModalProps) {
  const isEditMode = patient !== undefined;

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: EMPTY_FORM,
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
        <span className="flex items-center gap-2.5">
          <span
            className={[
              'flex items-center justify-center rounded-full p-1.5',
              isEditMode
                ? 'bg-primary/10 text-primary'
                : 'bg-success/10 text-success',
            ].join(' ')}
          >
            {isEditMode ? <EditIcon /> : <AddIcon />}
          </span>
          {isEditMode ? 'Edit Patient' : 'Add Patient'}
        </span>
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
                label="Name *"
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
            className="rounded-btn px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-content"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-btn bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}
