import { render, screen } from '@testing-library/react';
import { PatientList } from './PatientList';
import { usePatients } from '../hooks/usePatients';
import type { Patient } from '../types/patient';

vi.mock('../hooks/usePatients');

const mocked = vi.mocked(usePatients);

describe('PatientList', () => {
  beforeEach(() => {
    mocked.mockReset();
  });

  it('shows a spinner while loading', () => {
    mocked.mockReturnValue({ patients: [], loading: true, error: null });
    render(<PatientList />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows the error message on failure', () => {
    mocked.mockReturnValue({ patients: [], loading: false, error: 'Network error' });
    render(<PatientList />);
    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  it('shows the empty state when there are no patients', () => {
    mocked.mockReturnValue({ patients: [], loading: false, error: null });
    render(<PatientList />);
    expect(screen.getByText(/no patients/i)).toBeInTheDocument();
  });

  it('renders a card for each patient', () => {
    const patients: Patient[] = [
      { id: '1', createdAt: '', name: 'Alice', avatar: '', description: '', website: '' },
      { id: '2', createdAt: '', name: 'Bob', avatar: '', description: '', website: '' },
    ];
    mocked.mockReturnValue({ patients, loading: false, error: null });
    render(<PatientList />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });
});
