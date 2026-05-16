import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as proposalsAPI from '@/api/proposalsApi';
import { useAcceptProposal, useRejectProposal } from '@/hooks/api/useProposals';
import { toast } from 'sonner';

jest.mock('@/api/proposalsApi');
jest.mock('sonner');

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useProposals error branches', () => {
  beforeEach(() => jest.clearAllMocks());

  test('accept/reject proposal onError show toast', async () => {
    proposalsAPI.acceptProposal.mockRejectedValue({ response: { data: { message: 'fail' } } });
    proposalsAPI.rejectProposal.mockRejectedValue({ response: { data: { message: 'fail' } } });

    const { result } = renderHook(() => useAcceptProposal(), { wrapper: createWrapper() });
    act(() => result.current.mutate(1));
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalled();

    const { result: r2 } = renderHook(() => useRejectProposal(), { wrapper: createWrapper() });
    act(() => r2.current.mutate({ proposalId: 1, reason: 'x' }));
    await waitFor(() => expect(r2.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalled();
  });
});