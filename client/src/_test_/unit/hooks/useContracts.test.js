import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as contractsApi from '@/api/contractsApi';
import {
  useContracts,
  useContract,
  useCreateContract,
  useRespondToContract,
  useAddMilestone,
  useUpdateMilestone,
  useCompleteContract,
  useCancelContract,
  contractKeys,
} from '@/hooks/api/useContracts';
import { toast } from 'react-hot-toast';

jest.mock('@/api/contractsApi');
jest.mock('react-hot-toast');

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useContracts hooks', () => {
  beforeEach(() => jest.clearAllMocks());

  test('useContracts success path', async () => {
    contractsApi.getMyContracts.mockResolvedValue({ data: [] });
    const { result } = renderHook(() => useContracts({ status: 'active' }), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ data: [] });
  });

  test('useContract disabled when id falsy', () => {
    const { result } = renderHook(() => useContract(null), { wrapper: createWrapper() });
    expect(result.current.isFetching).toBe(false);
  });

  test('create contract onError shows toast', async () => {
    contractsApi.createContractFromProposal.mockRejectedValue({ response: { data: { message: 'err' } } });
    const { result } = renderHook(() => useCreateContract(), { wrapper: createWrapper() });
    act(() => result.current.mutate({}));
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalled();
  });

  test('create contract success invalidates queries and shows toast', async () => {
    contractsApi.createContractFromProposal.mockResolvedValue({});
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    jest.spyOn(qc, 'invalidateQueries');
    const wrapperWithQC = ({ children }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(() => useCreateContract(), { wrapper: wrapperWithQC });
    act(() => result.current.mutate({}));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(qc.invalidateQueries).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalled();
  });

  test('respond to contract success and failure', async () => {
    contractsApi.respondToContract.mockResolvedValue({});
    const { result } = renderHook(() => useRespondToContract(), { wrapper: createWrapper() });
    act(() => result.current.mutate({ id: '1', action: 'accept' }));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    contractsApi.respondToContract.mockRejectedValue({ response: { data: { message: 'fail' } } });
    const { result: r2 } = renderHook(() => useRespondToContract(), { wrapper: createWrapper() });
    act(() => r2.current.mutate({ id: '1', action: 'reject' }));
    await waitFor(() => expect(r2.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalled();
  });

  test('add/update milestone error paths', async () => {
    contractsApi.addMilestone.mockRejectedValue({ response: { data: { message: 'mfail' } } });
    const { result } = renderHook(() => useAddMilestone(), { wrapper: createWrapper() });
    act(() => result.current.mutate({ id: '1', data: {} }));
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalled();

    contractsApi.updateMilestone.mockRejectedValue({ response: { data: { message: 'ufail' } } });
    const { result: r2 } = renderHook(() => useUpdateMilestone(), { wrapper: createWrapper() });
    act(() => r2.current.mutate({ contractId: '1', milestoneId: '2', data: {} }));
    await waitFor(() => expect(r2.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalled();
  });

  test('complete/cancel contract error paths', async () => {
    contractsApi.completeContract.mockRejectedValue({ response: { data: { message: 'cfail' } } });
    const { result } = renderHook(() => useCompleteContract(), { wrapper: createWrapper() });
    act(() => result.current.mutate('1'));
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalled();

    contractsApi.cancelContract.mockRejectedValue({ response: { data: { message: 'cafail' } } });
    const { result: r2 } = renderHook(() => useCancelContract(), { wrapper: createWrapper() });
    act(() => r2.current.mutate({ id: '1', reason: 'x' }));
    await waitFor(() => expect(r2.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalled();
  });
});
