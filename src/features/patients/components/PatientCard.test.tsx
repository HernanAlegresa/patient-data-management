import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PatientCard } from './PatientCard';
import type { Patient } from '../types/patient';

const mockPatient: Patient = {
  id: '1',
  createdAt: '2024-01-01T00:00:00.000Z',
  name: 'John Doe',
  avatar: '',
  description: 'A test patient description.',
  website: '',
};

describe('PatientCard', () => {
  it('renders the patient name', () => {
    render(<PatientCard patient={mockPatient} onViewDetails={() => {}} onEdit={() => {}} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('has an accessible label on the view-details button', () => {
    render(<PatientCard patient={mockPatient} onViewDetails={() => {}} onEdit={() => {}} />);
    expect(
      screen.getByRole('button', { name: /view details for john doe/i }),
    ).toBeInTheDocument();
  });

  it('calls onViewDetails when the arrow button is clicked', async () => {
    const handler = vi.fn();
    render(<PatientCard patient={mockPatient} onViewDetails={handler} onEdit={() => {}} />);
    await userEvent.click(screen.getByRole('button', { name: /view details/i }));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('has an accessible label on the edit button', () => {
    render(<PatientCard patient={mockPatient} onViewDetails={() => {}} onEdit={() => {}} />);
    expect(screen.getByRole('button', { name: /edit john doe/i })).toBeInTheDocument();
  });

  it('calls onEdit with the patient when the edit button is clicked', async () => {
    const handler = vi.fn();
    render(<PatientCard patient={mockPatient} onViewDetails={() => {}} onEdit={handler} />);
    await userEvent.click(screen.getByRole('button', { name: /edit john doe/i }));
    expect(handler).toHaveBeenCalledWith(mockPatient);
  });
});
