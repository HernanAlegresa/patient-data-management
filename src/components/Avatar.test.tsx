import { render, screen, fireEvent } from '@testing-library/react';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('renders an image for a valid URL', () => {
    render(<Avatar src="https://example.com/photo.jpg" name="John Doe" />);
    expect(screen.getByAltText('John Doe')).toBeInTheDocument();
  });

  it('shows initials when the URL is not a valid image URL', () => {
    render(<Avatar src="not-a-url" name="John Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('shows initials when the URL is empty', () => {
    render(<Avatar src="" name="Jane Smith" />);
    expect(screen.getByText('JS')).toBeInTheDocument();
  });

  it('falls back to initials on image load error', () => {
    render(<Avatar src="https://example.com/broken.jpg" name="Alice Wonder" />);
    fireEvent.error(screen.getByAltText('Alice Wonder'));
    expect(screen.getByText('AW')).toBeInTheDocument();
  });

  it('shows a single initial for a one-word name', () => {
    render(<Avatar src="" name="Madonna" />);
    expect(screen.getByText('M')).toBeInTheDocument();
  });
});
