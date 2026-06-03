import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PatientFormModal } from './PatientFormModal';
import type { Patient } from '../types/patient';

const mockPatient: Patient = {
  id: '1',
  createdAt: '2024-01-01T00:00:00Z',
  name: 'Alice',
  avatar: '',
  website: '',
  description: '',
};

function renderModal(props: Partial<React.ComponentProps<typeof PatientFormModal>> = {}) {
  const onClose = vi.fn();
  const onSubmit = vi.fn();
  render(<PatientFormModal isOpen onClose={onClose} onSubmit={onSubmit} {...props} />);
  return { onClose, onSubmit };
}

describe('PatientFormModal — add mode', () => {
  it('opens with all fields empty', () => {
    renderModal();
    expect(screen.getByLabelText(/^name/i)).toHaveValue('');
    expect(screen.getByLabelText(/avatar url/i)).toHaveValue('');
    expect(screen.getByLabelText(/website url/i)).toHaveValue('');
    expect(screen.getByLabelText(/description/i)).toHaveValue('');
  });

  it('Save is disabled until a valid name is entered', async () => {
    const user = userEvent.setup();
    renderModal();
    const save = screen.getByRole('button', { name: /save/i });

    expect(save).toBeDisabled();

    await user.type(screen.getByLabelText(/^name/i), 'John');
    expect(save).toBeEnabled();
  });

  it('submitting a valid form calls onSubmit with the entered data and then calls onClose', async () => {
    const user = userEvent.setup();
    const { onSubmit, onClose } = renderModal();

    await user.type(screen.getByLabelText(/^name/i), 'John Doe');
    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'John Doe', avatar: '', website: '', description: '' }),
    );
    expect(onClose).toHaveBeenCalledOnce();
  });
});

describe('PatientFormModal — edit mode', () => {
  it('pre-populates fields with the existing patient data', () => {
    renderModal({ patient: mockPatient });
    expect(screen.getByLabelText(/^name/i)).toHaveValue('Alice');
  });

  it('Save is disabled when nothing has changed yet', () => {
    renderModal({ patient: mockPatient });
    expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
  });

  it('Save enables after a field is modified', async () => {
    const user = userEvent.setup();
    renderModal({ patient: mockPatient });

    await user.clear(screen.getByLabelText(/^name/i));
    await user.type(screen.getByLabelText(/^name/i), 'Alice Updated');

    expect(screen.getByRole('button', { name: /save/i })).toBeEnabled();
  });

  it('Save disables again when the field is reverted to its original value', async () => {
    const user = userEvent.setup();
    renderModal({ patient: mockPatient });
    const nameInput = screen.getByLabelText(/^name/i);
    const save = screen.getByRole('button', { name: /save/i });

    await user.clear(nameInput);
    await user.type(nameInput, 'Temporary');
    expect(save).toBeEnabled();

    await user.clear(nameInput);
    await user.type(nameInput, 'Alice'); // revert to original
    expect(save).toBeDisabled();
  });
});

describe('PatientFormModal — validation', () => {
  it('an invalid website URL shows an error message and keeps Save disabled', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.type(screen.getByLabelText(/^name/i), 'Jane');
    await user.type(screen.getByLabelText(/website url/i), 'not-a-url');
    await user.tab(); // blur to ensure validation settles

    expect(screen.getByRole('alert')).toHaveTextContent(/must be a valid url/i);
    expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
  });
});
