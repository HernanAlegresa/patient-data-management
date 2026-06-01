import { render, screen } from '@testing-library/react';
import { PatientDetailModal } from './PatientDetailModal';
import type { Patient } from '../types/patient';

const mockPatient: Patient = {
  id: '1',
  createdAt: '2024-06-15T12:00:00.000Z',
  name: 'Jane Smith',
  avatar: '',
  description: 'A test patient.',
  website: '',
};

describe('PatientDetailModal', () => {
  it('renders patient name and description', () => {
    render(<PatientDetailModal patient={mockPatient} isOpen onClose={() => {}} />);
    expect(screen.getAllByText('Jane Smith').length).toBeGreaterThan(0);
    expect(screen.getByText('A test patient.')).toBeInTheDocument();
  });

  it('formats the creation date in a human-readable way', () => {
    render(<PatientDetailModal patient={mockPatient} isOpen onClose={() => {}} />);
    expect(screen.getByText(/june 15, 2024/i)).toBeInTheDocument();
  });

  it('renders a valid website as a safe external link', () => {
    render(
      <PatientDetailModal
        patient={{ ...mockPatient, website: 'https://example.com' }}
        isOpen
        onClose={() => {}}
      />,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com/');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('omits the website section entirely for an invalid URL', () => {
    render(
      <PatientDetailModal
        patient={{ ...mockPatient, website: 'not-a-real-url' }}
        isOpen
        onClose={() => {}}
      />,
    );
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByText('not-a-real-url')).not.toBeInTheDocument();
  });

  it('renders nothing when patient is null and modal is closed', () => {
    const { container } = render(
      <PatientDetailModal patient={null} isOpen={false} onClose={() => {}} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
