import { render, screen } from '@testing-library/react';
import { PatientList } from './PatientList';
import type { Patient } from '../types/patient';

describe('PatientList', () => {
  it('shows a spinner while loading', () => {
    render(<PatientList patients={[]} loading={true} error={null} onEdit={() => {}} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows the error message on failure', () => {
    render(<PatientList patients={[]} loading={false} error="Network error" onEdit={() => {}} />);
    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  it('shows the empty state when there are no patients', () => {
    render(<PatientList patients={[]} loading={false} error={null} onEdit={() => {}} />);
    expect(screen.getByText(/no patients/i)).toBeInTheDocument();
  });

  it('renders a card for each patient', () => {
    const patients: Patient[] = [
      { id: '1', createdAt: '', name: 'Alice', avatar: '', description: '', website: '' },
      { id: '2', createdAt: '', name: 'Bob', avatar: '', description: '', website: '' },
    ];
    render(<PatientList patients={patients} loading={false} error={null} onEdit={() => {}} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });
});
