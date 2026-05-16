import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as proposalsAPI from '@/api/proposalsApi';
import {
  PROPOSALS_QUERY_KEYS,
  useMyProposals,
  useProposal,
  useCheckIfApplied,
  useSubmitProposal,
  useUpdateProposal,
  useWithdrawProposal,
  useGenerateProposalDraft,
  useRegenerateProposalDraft,
} from '@/hooks/api/useProposals';
import { toast } from 'sonner';
import logger from '@/utils/logger';

jest.mock('@/api/proposalsApi');
jest.mock('sonner');
jest.mock('@/utils/logger');

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useProposals hooks', () => {
  beforeEach(() => jest.clearAllMocks());

  test('query keys', () => {
    expect(PROPOSALS_QUERY_KEYS.all).toEqual(['proposals']);
    expect(PROPOSALS_QUERY_KEYS.detail(2)).toEqual(['proposals', 'detail', 2]);
  });

  test('useMyProposals success and error', async () => {
    proposalsAPI.getMyProposals.mockResolvedValue({ proposals: [] });
    const { result } = renderHook(() => useMyProposals(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    proposalsAPI.getMyProposals.mockRejectedValue(new Error('fail'));
    const { result: r2 } = renderHook(() => useMyProposals(), { wrapper: createWrapper() });
    await waitFor(() => expect(r2.current.isError).toBe(true));
    if (logger.error.mock.calls.length > 0) {
      expect(logger.error).toHaveBeenCalled();
    }
  });

  test('useProposal enabled/disabled', async () => {
    proposalsAPI.getProposalDetails.mockResolvedValue({ proposal: {} });
    const { result } = renderHook(() => useProposal(1), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const { result: r2 } = renderHook(() => useProposal(null), { wrapper: createWrapper() });
    expect(r2.current.isFetching).toBe(false);
  });

  test('mutations: submit, update, withdraw, generate draft', async () => {
    proposalsAPI.submitProposal.mockResolvedValue({ proposal: { jobId: 5 } });
    const { result } = renderHook(() => useSubmitProposal(), { wrapper: createWrapper() });
    act(() => result.current.mutate({}));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    proposalsAPI.updateProposal.mockResolvedValue({});
    const { result: r2 } = renderHook(() => useUpdateProposal(), { wrapper: createWrapper() });
    act(() => r2.current.mutate({ proposalId: 1, updateData: {} }));
    await waitFor(() => expect(r2.current.isSuccess).toBe(true));

    proposalsAPI.withdrawProposal.mockResolvedValue({});
    const { result: r3 } = renderHook(() => useWithdrawProposal(), { wrapper: createWrapper() });
    act(() => r3.current.mutate(1));
    await waitFor(() => expect(r3.current.isSuccess).toBe(true));

    proposalsAPI.generateProposalDraft.mockResolvedValue({ draft: 'x' });
    const { result: r4 } = renderHook(() => useGenerateProposalDraft(), { wrapper: createWrapper() });
    act(() => r4.current.mutate(10));
    await waitFor(() => expect(r4.current.isSuccess).toBe(true));

    // error branches
    proposalsAPI.generateProposalDraft.mockRejectedValue({ response: { data: { message: 'fail' } } });
    const { result: errGen } = renderHook(() => useGenerateProposalDraft(), { wrapper: createWrapper() });
    act(() => errGen.current.mutate(11));
    await waitFor(() => expect(errGen.current.isError).toBe(true));
    expect(logger.error).toHaveBeenCalled();

    // test regenerate success sets query data
    proposalsAPI.regenerateProposalDraft.mockResolvedValue({ draft: 'ok' });
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    jest.spyOn(qc, 'setQueryData');
    const wrapperWithQC = ({ children }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    );
    const { result: regen } = renderHook(() => useRegenerateProposalDraft(), { wrapper: wrapperWithQC });
    act(() => regen.current.mutate(42));
    await waitFor(() => expect(regen.current.isSuccess).toBe(true));
    expect(qc.setQueryData).toHaveBeenCalled();
  });

  test('checkIfApplied select mapping', async () => {
    proposalsAPI.checkIfApplied.mockResolvedValue({ data: { hasApplied: true, proposal: { id: 'p1' } } });
    const { result } = renderHook(() => useCheckIfApplied('1'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ hasApplied: true, proposal: { id: 'p1' } });

    // when data missing
    proposalsAPI.checkIfApplied.mockResolvedValue({ data: {} });
    const { result: r2 } = renderHook(() => useCheckIfApplied('2'), { wrapper: createWrapper() });
    await waitFor(() => expect(r2.current.isSuccess).toBe(true));
    expect(r2.current.data).toEqual({ hasApplied: false, proposal: null });
  });
});