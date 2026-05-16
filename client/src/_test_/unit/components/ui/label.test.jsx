import { render, screen } from '@testing-library/react';
import { Label } from '@/components/ui/label';

describe('Label', () => {
  it('should render label with text', () => {
    render(<Label>Test Label</Label>);
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe('LABEL');
  });

  it('should apply glass variant', () => {
    render(<Label glass>Glass Label</Label>);
    expect(screen.getByText('Glass Label')).toHaveClass('backdrop-blur-sm');
  });

  it('should apply custom className', () => {
    render(<Label className="custom-class">Custom</Label>);
    expect(screen.getByText('Custom')).toHaveClass('custom-class');
  });

  it('should forward ref', () => {
    const ref = { current: null };
    render(<Label ref={ref}>Ref Label</Label>);
    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
  });

  it('should forward htmlFor attribute', () => {
    render(<Label htmlFor="input-id">Label for Input</Label>);
    const label = screen.getByText('Label for Input');
    expect(label).toHaveAttribute('for', 'input-id');
  });

  it('should forward other props', () => {
    render(<Label data-testid="custom-label" aria-label="Custom">Label</Label>);
    const label = screen.getByTestId('custom-label');
    expect(label).toHaveAttribute('aria-label', 'Custom');
  });
});

