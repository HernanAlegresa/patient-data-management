import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from './App';
import * as usePatientsModule from './features/patients/hooks/usePatients';
import type { Patient } from './features/patients/types/patient';

const PATIENTS: Patient[] = [
  { id: '1', createdAt: '', name: 'Alice Smith', avatar: '', description: '', website: '' },
  { id: '2', createdAt: '', name: 'Hernán García', avatar: '', description: '', website: '' },
  { id: '3', createdAt: '', name: 'Bob Johnson', avatar: '', description: '', website: '' },
];

function mockUsePatients(patients: Patient[] = PATIENTS) {
  vi.spyOn(usePatientsModule, 'usePatients').mockReturnValue({
    patients,
    loading: false,
    error: null,
    addPatient: vi.fn(),
    editPatient: vi.fn(),
  });
}

describe('App — search and filtering', () => {
  beforeEach(() => mockUsePatients());
  afterEach(() => vi.restoreAllMocks());

  it('renders all patients before any search', () => {
    render(<App />);
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('Hernán García')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
  });

  it('narrows the list when a search term is typed', async () => {
    render(<App />);
    await userEvent.type(screen.getByLabelText(/search patients/i), 'alice');
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.queryByText('Bob Johnson')).not.toBeInTheDocument();
    expect(screen.queryByText('Hernán García')).not.toBeInTheDocument();
  });

  it('matches accented names with unaccented search term', async () => {
    render(<App />);
    await userEvent.type(screen.getByLabelText(/search patients/i), 'hernan');
    expect(screen.getByText('Hernán García')).toBeInTheDocument();
    expect(screen.queryByText('Alice Smith')).not.toBeInTheDocument();
  });

  it('restores the full list when the search is cleared', async () => {
    render(<App />);
    const input = screen.getByLabelText(/search patients/i);
    await userEvent.type(input, 'alice');
    expect(screen.queryByText('Bob Johnson')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /clear search/i }));
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
  });

  it('shows the search empty state when no patients match', async () => {
    render(<App />);
    await userEvent.type(screen.getByLabelText(/search patients/i), 'zzznomatch');
    expect(screen.getByText(/no patients match your search/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show all patients/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/search patients/i)).toBeInTheDocument();
  });

  it('shows patient count above the list', () => {
    render(<App />);
    expect(screen.getByText(/3 patients/i)).toBeInTheDocument();
  });

  it('updates patient count when filtering', async () => {
    render(<App />);
    await userEvent.type(screen.getByLabelText(/search patients/i), 'alice');
    expect(screen.getByText(/1 patient/i)).toBeInTheDocument();
  });
});
