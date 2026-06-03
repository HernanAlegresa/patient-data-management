import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
  it('renders with an accessible label', () => {
    render(<SearchInput value="" onChange={() => {}} />);
    expect(screen.getByLabelText(/search patients/i)).toBeInTheDocument();
  });

  it('calls onChange when the user types', async () => {
    const onChange = vi.fn();
    render(<SearchInput value="" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText(/search patients/i), 'ali');
    expect(onChange).toHaveBeenCalledTimes(3);
  });

  it('does not show the clear button when the value is empty', () => {
    render(<SearchInput value="" onChange={() => {}} />);
    expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument();
  });

  it('shows the clear button when the value is not empty', () => {
    render(<SearchInput value="alice" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: /clear search/i })).toBeInTheDocument();
  });

  it('calls onChange with empty string when the clear button is clicked', async () => {
    const onChange = vi.fn();
    render(<SearchInput value="alice" onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /clear search/i }));
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('returns focus to the search input after clearing', async () => {
    render(<SearchInput value="alice" onChange={() => {}} />);
    await userEvent.click(screen.getByRole('button', { name: /clear search/i }));
    expect(screen.getByLabelText(/search patients/i)).toHaveFocus();
  });

  it('calls onChange with empty string when Escape is pressed', async () => {
    const onChange = vi.fn();
    render(<SearchInput value="alice" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText(/search patients/i), '{Escape}');
    expect(onChange).toHaveBeenCalledWith('');
  });
});
