import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/slices/authSlice';
import * as contractsAPI from '@/api/contractsApi';
import { useContracts, useCreateContract } from '@/hooks/api/useContracts';

jest.mock('@/api/contractsApi');

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
          role: 'client',
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
const ContractsTestComponent = () => {
  const { data, isLoading } = useContracts({ status: 'active' });
  const createContract = useCreateContract();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div data-testid="contracts-count">{data?.data?.length || 0}</div>
      <button
        onClick={() =>
          createContract.mutate({
            proposalId: 1,
            terms: 'Test terms',
          })
        }
      >
        Create Contract
      </button>
    </div>
  );
};

describe('Contracts Integration', () => {
  let store;
  const mockNewContract = {
    id: 1,
    proposalId: 1,
    terms: 'Test terms',
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    store = createTestStore();
    jest.clearAllMocks();
  });

  describe('Fetch Contracts', () => {
    it('should fetch and display contracts', async () => {
      const mockContracts = {
        contracts: [
          { id: 1, status: 'active', title: 'Contract 1' },
          { id: 2, status: 'active', title: 'Contract 2' },
        ],
      };

      contractsAPI.getMyContracts.mockResolvedValue({
        success: true,
        data: [
          { id: 1, status: 'active', title: 'Contract 1' },
          { id: 2, status: 'active', title: 'Contract 2' },
        ],
      });

      render(<ContractsTestComponent />, {
        wrapper: createWrapper(store),
      });

      await waitFor(() => {
        expect(screen.getByTestId('contracts-count')).toHaveTextContent('2');
      });

      expect(contractsAPI.getMyContracts).toHaveBeenCalledWith({
        status: 'active',
      });
    });

    it('should handle fetch error', async () => {
      contractsAPI.getMyContracts.mockRejectedValue(
        new Error('Failed to fetch')
      );

      render(<ContractsTestComponent />, {
        wrapper: createWrapper(store),
      });

      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
    });

    it('should filter contracts by status', async () => {
      contractsAPI.getMyContracts.mockResolvedValue({
        success: true,
        data: [{ id: 1, status: 'completed' }],
      });

      render(<ContractsTestComponent />, {
        wrapper: createWrapper(store),
      });

      await waitFor(() => {
        expect(contractsAPI.getMyContracts).toHaveBeenCalledWith({
          status: 'active',
        });
      });
    });
  });

  describe('Create Contract', () => {
    it('should create contract successfully', async () => {
      contractsAPI.getMyContracts.mockResolvedValue({
        success: true,
        data: [],
      });
      contractsAPI.createContractFromProposal.mockResolvedValue({
        data: { contract: mockNewContract },
      });

      render(<ContractsTestComponent />, {
        wrapper: createWrapper(store),
      });

      await waitFor(() => {
        expect(screen.getByText('Create Contract')).toBeInTheDocument();
      });

      const createButton = screen.getByText('Create Contract');
      await userEvent.click(createButton);

      await waitFor(() => {
        // React Query passes mutation variables directly to mutationFn
        expect(contractsAPI.createContractFromProposal).toHaveBeenCalled();
        const callArgs = contractsAPI.createContractFromProposal.mock.calls[0][0];
        expect(callArgs).toEqual({
          proposalId: 1,
          terms: 'Test terms',
        });
      }, { timeout: 3000 });
    });

    it('should handle create contract error', async () => {
      contractsAPI.getMyContracts.mockResolvedValue({
        success: true,
        data: [],
      });
      contractsAPI.createContractFromProposal.mockRejectedValue(
        new Error('Failed to create')
      );

      render(<ContractsTestComponent />, {
        wrapper: createWrapper(store),
      });

      await waitFor(() => {
        expect(screen.getByText('Create Contract')).toBeInTheDocument();
      });

      const createButton = screen.getByText('Create Contract');
      await userEvent.click(createButton);

      await waitFor(() => {
        expect(contractsAPI.createContractFromProposal).toHaveBeenCalled();
      });
    });
  });
});

