import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/slices/authSlice';
import * as jobsAPI from '@/api/jobsApi';
import { useJobs, useCreateJob } from '@/hooks/api/useJobs';

jest.mock('@/api/jobsApi');

const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
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
const JobsTestComponent = () => {
  const { data, isLoading } = useJobs({ page: 1 });
  const createJob = useCreateJob();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div data-testid="jobs-count">{data?.jobs?.length || 0}</div>
      <button
        onClick={() =>
          createJob.mutate({
            title: 'Test Job',
            description: 'Test Description',
          })
        }
      >
        Create Job
      </button>
    </div>
  );
};

describe('Jobs Integration', () => {
  let store;

  beforeEach(() => {
    store = createTestStore();
    jest.clearAllMocks();
  });

  describe('Fetch Jobs', () => {
    it('should fetch and display jobs', async () => {
      const mockJobs = {
        jobs: [
          { id: 1, title: 'Job 1' },
          { id: 2, title: 'Job 2' },
        ],
      };

      jobsAPI.getAllJobs.mockResolvedValue(mockJobs);

      render(<JobsTestComponent />, {
        wrapper: createWrapper(store),
      });

      await waitFor(() => {
        expect(screen.getByTestId('jobs-count')).toHaveTextContent('2');
      });

      expect(jobsAPI.getAllJobs).toHaveBeenCalledWith({ page: 1 });
    });

    it('should handle fetch error', async () => {
      jobsAPI.getAllJobs.mockRejectedValue(new Error('Failed to fetch'));

      render(<JobsTestComponent />, {
        wrapper: createWrapper(store),
      });

      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
    });
  });

  describe('Create Job', () => {
    it('should create job successfully', async () => {
      const mockJobs = { jobs: [] };
      const mockNewJob = { id: 1, title: 'Test Job' };

      jobsAPI.getAllJobs.mockResolvedValue(mockJobs);
      jobsAPI.createJob.mockResolvedValue({ job: mockNewJob });

      render(<JobsTestComponent />, {
        wrapper: createWrapper(store),
      });

      await waitFor(() => {
        expect(screen.getByText('Create Job')).toBeInTheDocument();
      });

      const createButton = screen.getByText('Create Job');
      await userEvent.click(createButton);

      await waitFor(() => {
        expect(jobsAPI.createJob).toHaveBeenCalledWith({
          title: 'Test Job',
          description: 'Test Description',
        });
      });
    });
  });
});


