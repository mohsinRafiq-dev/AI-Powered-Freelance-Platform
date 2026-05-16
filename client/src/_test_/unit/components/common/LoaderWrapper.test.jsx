import { render, screen, waitFor } from '@testing-library/react';
import { LoaderWrapper } from '@/components/common/LoaderWrapper';
import { Loader } from '@/components/common/Loader';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock Loader component
jest.mock('@/components/common/Loader', () => ({
  Loader: ({ text }) => <div data-testid="loader">{text || 'Loading...'}</div>,
}));

describe('LoaderWrapper', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should show loader when isLoading is true', () => {
    render(
      <LoaderWrapper isLoading={true} loader={<Loader />}>
        <div>Content</div>
      </LoaderWrapper>
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('should show content when isLoading is false', () => {
    render(
      <LoaderWrapper isLoading={false} loader={<Loader />}>
        <div>Content</div>
      </LoaderWrapper>
    );

    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should maintain loader for minimum time', async () => {
    const { rerender } = render(
      <LoaderWrapper isLoading={true} loader={<Loader />} minTime={1000}>
        <div>Content</div>
      </LoaderWrapper>
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();

    // Change to not loading
    rerender(
      <LoaderWrapper isLoading={false} loader={<Loader />} minTime={1000}>
        <div>Content</div>
      </LoaderWrapper>
    );

    // Should still show loader
    expect(screen.getByTestId('loader')).toBeInTheDocument();

    // Advance time by 1000ms
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  it('should use custom minTime', async () => {
    const { rerender } = render(
      <LoaderWrapper isLoading={true} loader={<Loader />} minTime={2000}>
        <div>Content</div>
      </LoaderWrapper>
    );

    rerender(
      <LoaderWrapper isLoading={false} loader={<Loader />} minTime={2000}>
        <div>Content</div>
      </LoaderWrapper>
    );

    // Advance time by less than minTime
    jest.advanceTimersByTime(1000);
    expect(screen.getByTestId('loader')).toBeInTheDocument();

    // Advance remaining time
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });
  });

  it('should handle rapid loading state changes', async () => {
    const { rerender } = render(
      <LoaderWrapper isLoading={true} loader={<Loader />} minTime={1000}>
        <div>Content</div>
      </LoaderWrapper>
    );

    // Quickly toggle loading state
    rerender(
      <LoaderWrapper isLoading={false} loader={<Loader />} minTime={1000}>
        <div>Content</div>
      </LoaderWrapper>
    );

    jest.advanceTimersByTime(500);

    // Change back to loading
    rerender(
      <LoaderWrapper isLoading={true} loader={<Loader />} minTime={1000}>
        <div>Content</div>
      </LoaderWrapper>
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should show content immediately if minTime already passed', async () => {
    const { rerender } = render(
      <LoaderWrapper isLoading={true} loader={<Loader />} minTime={1000}>
        <div>Content</div>
      </LoaderWrapper>
    );

    // Wait for minTime
    jest.advanceTimersByTime(1000);

    rerender(
      <LoaderWrapper isLoading={false} loader={<Loader />} minTime={1000}>
        <div>Content</div>
      </LoaderWrapper>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });
});

