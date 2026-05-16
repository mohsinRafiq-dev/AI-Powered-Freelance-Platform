import { render, screen } from '@testing-library/react';
import { Badge } from '@/components/ui/badge';

describe('Badge', () => {
  it('should render badge with text', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('should apply default variant styles', () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText('Default');
    expect(badge).toHaveClass('bg-blue-600');
  });

  it('should apply variant classes', () => {
    const { rerender } = render(<Badge variant="secondary">Secondary</Badge>);
    expect(screen.getByText('Secondary')).toHaveClass('bg-gray-200');

    rerender(<Badge variant="destructive">Destructive</Badge>);
    expect(screen.getByText('Destructive')).toHaveClass('bg-red-600');

    rerender(<Badge variant="outline">Outline</Badge>);
    expect(screen.getByText('Outline')).toHaveClass('border');

    rerender(<Badge variant="success">Success</Badge>);
    expect(screen.getByText('Success')).toHaveClass('bg-green-100');
  });

  it('should apply size classes', () => {
    const { rerender } = render(<Badge size="sm">Small</Badge>);
    expect(screen.getByText('Small')).toHaveClass('px-2', 'py-0.5');

    rerender(<Badge size="lg">Large</Badge>);
    expect(screen.getByText('Large')).toHaveClass('px-4', 'py-1.5');
  });

  it('should apply glass variant', () => {
    render(<Badge glass>Glass Badge</Badge>);
    const badge = screen.getByText('Glass Badge');
    expect(badge).toHaveClass('backdrop-blur-md');
  });

  it('should apply custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>);
    expect(screen.getByText('Custom')).toHaveClass('custom-class');
  });

  it('should forward ref', () => {
    const ref = { current: null };
    render(<Badge ref={ref}>Ref Badge</Badge>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('should apply color variants', () => {
    const { rerender } = render(<Badge variant="green">Green</Badge>);
    expect(screen.getByText('Green')).toHaveClass('bg-green-100');

    rerender(<Badge variant="blue">Blue</Badge>);
    expect(screen.getByText('Blue')).toHaveClass('bg-blue-100');

    rerender(<Badge variant="purple">Purple</Badge>);
    expect(screen.getByText('Purple')).toHaveClass('bg-purple-100');

    rerender(<Badge variant="yellow">Yellow</Badge>);
    expect(screen.getByText('Yellow')).toHaveClass('bg-yellow-100');

    rerender(<Badge variant="red">Red</Badge>);
    expect(screen.getByText('Red')).toHaveClass('bg-red-100');

    rerender(<Badge variant="orange">Orange</Badge>);
    expect(screen.getByText('Orange')).toHaveClass('bg-orange-100');
  });
});

