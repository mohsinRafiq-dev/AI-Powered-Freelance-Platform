import { render, screen } from '@testing-library/react';
import { Avatar } from '@/components/ui/Avatar';

describe('Avatar', () => {
  it('should render avatar with image', () => {
    render(<Avatar src="https://example.com/avatar.jpg" alt="John Doe" />);
    const img = screen.getByAltText('John Doe');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('should render initials when no image provided', () => {
    render(<Avatar alt="John Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('should render single initial for single name', () => {
    render(<Avatar alt="John" />);
    expect(screen.getByText('JO')).toBeInTheDocument();
  });

  it('should render question mark for empty alt', () => {
    render(<Avatar alt="" />);
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('should apply size classes', () => {
    const { rerender } = render(<Avatar alt="Test" size="xs" />);
    expect(screen.getByText('TE').closest('div')).toHaveClass('w-6', 'h-6');

    rerender(<Avatar alt="Test" size="sm" />);
    expect(screen.getByText('TE').closest('div')).toHaveClass('w-8', 'h-8');

    rerender(<Avatar alt="Test" size="lg" />);
    expect(screen.getByText('TE').closest('div')).toHaveClass('w-12', 'h-12');

    rerender(<Avatar alt="Test" size="xl" />);
    expect(screen.getByText('TE').closest('div')).toHaveClass('w-16', 'h-16');
  });

  it('should apply custom className', () => {
    render(<Avatar alt="Test" className="custom-class" />);
    expect(screen.getByText('TE').closest('div')).toHaveClass('custom-class');
  });

  it('should handle image error and show initials', () => {
    render(<Avatar src="invalid-url" alt="John Doe" />);
    const img = screen.getByAltText('John Doe');
    
    // Simulate image error
    const errorEvent = new Event('error');
    Object.defineProperty(errorEvent, 'target', {
      value: img,
      writable: false,
    });
    img.dispatchEvent(errorEvent);

    // After error, should show initials
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('should forward ref', () => {
    const ref = { current: null };
    render(<Avatar alt="Test" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

