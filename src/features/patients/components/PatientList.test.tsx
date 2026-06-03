import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PatientList } from './PatientList';
import type { Patient } from '../types/patient';

describe('PatientList', () => {
  it('shows a spinner while loading', () => {
    render(<PatientList patients={[]} loading={true} error={null} onEdit={() => {}} onClearSearch={() => {}} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows the error message on failure', () => {
    render(<PatientList patients={[]} loading={false} error="Network error" onEdit={() => {}} onClearSearch={() => {}} />);
    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  it('shows the empty state when there are no patients', () => {
    render(<PatientList patients={[]} loading={false} error={null} onEdit={() => {}} onClearSearch={() => {}} />);
    expect(screen.getByText(/no patients/i)).toBeInTheDocument();
  });

  it('renders a card for each patient', () => {
    const patients: Patient[] = [
      { id: '1', createdAt: '', name: 'Alice', avatar: '', description: '', website: '' },
      { id: '2', createdAt: '', name: 'Bob', avatar: '', description: '', website: '' },
    ];
    render(<PatientList patients={patients} loading={false} error={null} onEdit={() => {}} onClearSearch={() => {}} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('shows the generic empty state when there are no patients and no search term', () => {
    render(<PatientList patients={[]} loading={false} error={null} onEdit={() => {}} onClearSearch={() => {}} />);
    expect(screen.getByText(/no patients found/i)).toBeInTheDocument();
    expect(screen.queryByText(/no patients match/i)).not.toBeInTheDocument();
  });

  it('shows the search empty state when search term is set and no patients match', () => {
    const onClearSearch = vi.fn();
    render(
      <PatientList
        patients={[]}
        loading={false}
        error={null}
        onEdit={() => {}}
        searchTerm="xyz"
        onClearSearch={onClearSearch}
      />,
    );
    expect(screen.getByText(/no patients match your search/i)).toBeInTheDocument();
    expect(screen.queryByText(/no patients found/i)).not.toBeInTheDocument();
  });

  it('calls onClearSearch when the "Show all patients" button is clicked', async () => {
    const onClearSearch = vi.fn();
    render(
      <PatientList
        patients={[]}
        loading={false}
        error={null}
        onEdit={() => {}}
        searchTerm="xyz"
        onClearSearch={onClearSearch}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: /show all patients/i }));
    expect(onClearSearch).toHaveBeenCalledOnce();
  });
});
