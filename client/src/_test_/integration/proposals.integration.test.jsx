import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/slices/authSlice';
import * as proposalsAPI from '@/api/proposalsApi';
import { useMyProposals, useSubmitProposal } from '@/hooks/api/useProposals';

jest.mock('@/api/proposalsApi');

const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        isAuthenticated: true,
        user: {
          id: 1,
          email: 'test@example.com',
          role: 'freelancer',
        },
      },
    },
  });
};

const createWrapper = (store) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }) => (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>{children}</BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
};

// Test component that uses hooks
const ProposalsTestComponent = () => {
  const { data, isLoading } = useMyProposals({ status: 'pending' });
  const submitProposal = useSubmitProposal();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div data-testid="proposals-count">{data?.data?.proposals?.length || 0}</div>
      <button
        onClick={() =>
          submitProposal.mutate({
            jobId: 1,
            coverLetter: 'Test cover letter',
            proposedAmount: 1000,
          })
        }
      >
        Submit Proposal
      </button>
    </div>
  );
};

describe('Proposals Integration', () => {
  let store;
  const mockNewProposal = {
    id: 1,
    jobId: 1,
    coverLetter: 'Test cover letter',
    proposedAmount: 1000,
    status: 'pending',
  };

  beforeEach(() => {
    store = createTestStore();
    jest.clearAllMocks();
  });

  describe('Fetch Proposals', () => {
    it('should fetch and display proposals', async () => {
      proposalsAPI.getMyProposals.mockResolvedValue({
        success: true,
        data: {
          proposals: [
            { id: 1, status: 'pending', jobId: 1 },
            { id: 2, status: 'pending', jobId: 2 },
          ],
        },
      });

      render(<ProposalsTestComponent />, {
        wrapper: createWrapper(store),
      });

      await waitFor(() => {
        expect(screen.getByTestId('proposals-count')).toHaveTextContent('2');
      });

      expect(proposalsAPI.getMyProposals).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'pending' })
      );
    });

    it('should handle fetch error', async () => {
      proposalsAPI.getMyProposals.mockRejectedValue(
        new Error('Failed to fetch')
      );

      render(<ProposalsTestComponent />, {
        wrapper: createWrapper(store),
      });

      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
    });
  });

  describe('Submit Proposal', () => {
    it('should submit proposal successfully', async () => {
      proposalsAPI.getMyProposals.mockResolvedValue({
        success: true,
        data: { proposals: [] },
      });
      proposalsAPI.submitProposal.mockResolvedValue({
        data: { proposal: mockNewProposal },
      });

      render(<ProposalsTestComponent />, {
        wrapper: createWrapper(store),
      });

      await waitFor(() => {
        expect(screen.getByText('Submit Proposal')).toBeInTheDocument();
      });

      const submitButton = screen.getByText('Submit Proposal');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(proposalsAPI.submitProposal).toHaveBeenCalledWith({
          jobId: 1,
          coverLetter: 'Test cover letter',
          proposedAmount: 1000,
        });
      });
    });

    it('should handle submit proposal error', async () => {
      proposalsAPI.getMyProposals.mockResolvedValue({
        success: true,
        data: { proposals: [] },
      });
      proposalsAPI.submitProposal.mockRejectedValue(
        new Error('Failed to submit')
      );

      render(<ProposalsTestComponent />, {
        wrapper: createWrapper(store),
      });

      await waitFor(() => {
        expect(screen.getByText('Submit Proposal')).toBeInTheDocument();
      });

      const submitButton = screen.getByText('Submit Proposal');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(proposalsAPI.submitProposal).toHaveBeenCalled();
      });
    });
  });
});

