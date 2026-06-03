import { render, screen, within } from '@testing-library/react';
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

const SORT_PATIENTS: Patient[] = [
  {
    id: '1',
    createdAt: '2024-03-01T00:00:00.000Z',
    name: 'Charlie',
    avatar: '',
    description: '',
    website: '',
  },
  {
    id: '2',
    createdAt: '2023-01-15T00:00:00.000Z',
    name: 'Alice',
    avatar: '',
    description: '',
    website: '',
  },
  {
    id: '3',
    createdAt: '2025-06-10T00:00:00.000Z',
    name: 'Bob',
    avatar: '',
    description: '',
    website: '',
  },
];

describe('App — sort control', () => {
  beforeEach(() => mockUsePatients(SORT_PATIENTS));
  afterEach(() => vi.restoreAllMocks());

  function getNameOrder(): string[] {
    const list = screen.getByRole('list', { name: /patient list/i });
    return within(list)
      .getAllByRole('button', { name: /^view details for/i })
      .map((btn) => btn.getAttribute('aria-label')!.replace('View details for ', ''));
  }

  it('renders a sort select defaulting to name A–Z', () => {
    render(<App />);
    expect(screen.getByLabelText(/sort patients/i)).toHaveValue('name');
  });

  it('default name sort orders Alice → Bob → Charlie', () => {
    render(<App />);
    expect(getNameOrder()).toEqual(['Alice', 'Bob', 'Charlie']);
  });

  it('Newest first sort orders Bob → Charlie → Alice', async () => {
    render(<App />);
    await userEvent.selectOptions(screen.getByLabelText(/sort patients/i), 'newest');
    expect(getNameOrder()).toEqual(['Bob', 'Charlie', 'Alice']);
  });

  it('sort applies to the already-filtered list when search is active', async () => {
    // Search "a" matches Alice ('alice' contains 'a') and Charlie ('charlie'
    // contains 'a' at position 2); Bob ('bob') does not match.
    // With Newest sort: Charlie (2024) → Alice (2023). Bob must not appear.
    render(<App />);
    await userEvent.type(screen.getByLabelText(/search patients/i), 'a');
    await userEvent.selectOptions(screen.getByLabelText(/sort patients/i), 'newest');
    expect(getNameOrder()).toEqual(['Charlie', 'Alice']);
  });
});
