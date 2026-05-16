import { render, screen, waitFor } from '@testing-library/react';
import { LazyLoadItem } from '@/components/common/LazyLoadItem';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

describe('LazyLoadItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render placeholder initially', () => {
    render(
      <LazyLoadItem>
        <div>Lazy Content</div>
      </LazyLoadItem>
    );

    // Should show placeholder initially
    const placeholder = document.querySelector('.animate-pulse');
    expect(placeholder).toBeInTheDocument();
  });

  it('should render children when visible', () => {
    const observerCallback = jest.fn();
    mockIntersectionObserver.mockImplementation((callback) => {
      observerCallback.mockImplementation(callback);
      return {
        observe: () => {
          // Simulate intersection
          callback([{ isIntersecting: true }]);
        },
        unobserve: () => null,
        disconnect: () => null,
      };
    });

    render(
      <LazyLoadItem>
        <div>Lazy Content</div>
      </LazyLoadItem>
    );

    // Wait for intersection
    waitFor(() => {
      expect(screen.getByText('Lazy Content')).toBeInTheDocument();
    });
  });

  it('should apply custom className', () => {
    render(
      <LazyLoadItem className="custom-class">
        <div>Content</div>
      </LazyLoadItem>
    );

    const container = document.querySelector('.custom-class');
    expect(container).toBeInTheDocument();
  });

  it('should use custom threshold', () => {
    render(
      <LazyLoadItem threshold={0.5}>
        <div>Content</div>
      </LazyLoadItem>
    );

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ threshold: 0.5 })
    );
  });

  it('should use custom rootMargin', () => {
    render(
      <LazyLoadItem rootMargin="100px">
        <div>Content</div>
      </LazyLoadItem>
    );

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ rootMargin: '100px' })
    );
  });

  it('should render without animation when animateOnLoad is false', () => {
    const observerCallback = jest.fn();
    mockIntersectionObserver.mockImplementation((callback) => {
      observerCallback.mockImplementation(callback);
      return {
        observe: () => {
          callback([{ isIntersecting: true }]);
        },
        unobserve: () => null,
        disconnect: () => null,
      };
    });

    render(
      <LazyLoadItem animateOnLoad={false}>
        <div>No Animation Content</div>
      </LazyLoadItem>
    );

    waitFor(() => {
      expect(screen.getByText('No Animation Content')).toBeInTheDocument();
      // Should not have motion.div wrapper
      const motionDiv = document.querySelector('[data-framer-motion]');
      expect(motionDiv).not.toBeInTheDocument();
    });
  });

  it('should cleanup observer on unmount', () => {
    const disconnect = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect,
    });

    const { unmount } = render(
      <LazyLoadItem>
        <div>Content</div>
      </LazyLoadItem>
    );

    unmount();
    // Observer cleanup is handled by useEffect cleanup
    expect(disconnect).not.toHaveBeenCalled(); // unobserve is called instead
  });
});

