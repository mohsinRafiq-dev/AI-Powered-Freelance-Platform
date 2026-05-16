import { render, screen } from '@testing-library/react';
import { Loader } from '@/components/common/Loader';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('Loader', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render fullscreen loader by default', () => {
    render(<Loader />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('should render with custom text', () => {
    render(<Loader text="Please wait..." />);
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  it('should render inline variant', () => {
    render(<Loader variant="inline" />);
    const loader = screen.getByText(/Loading/i).closest('div');
    expect(loader).toHaveClass('flex', 'flex-col', 'items-center');
  });

  it('should render button variant', () => {
    render(<Loader variant="button" />);
    const loader = screen.getByText(/Loading/i).closest('div');
    expect(loader).toHaveClass('flex', 'items-center');
  });

  it('should render success state', () => {
    render(<Loader state="success" text="Success!" />);
    expect(screen.getByText('Success!')).toBeInTheDocument();
  });

  it('should render different sizes', () => {
    const { rerender } = render(<Loader size="small" />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    rerender(<Loader size="large" />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('should call onMinTimeComplete after minimum display time', () => {
    const onMinTimeComplete = jest.fn();
    render(<Loader minDisplayTime={1000} onMinTimeComplete={onMinTimeComplete} />);

    jest.advanceTimersByTime(1000);

    expect(onMinTimeComplete).toHaveBeenCalled();
  });
});


