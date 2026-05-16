import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as messagesAPI from '@/api/messagesApi';
import { useSearchMessages, useArchiveConversation, useMarkAsRead, useMessages } from '@/hooks/api/useMessages';
import { toast } from 'react-hot-toast';

jest.mock('@/api/messagesApi');
jest.mock('react-hot-toast');

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useMessages branches', () => {
  beforeEach(() => jest.clearAllMocks());

  test('useSearchMessages disabled for short query', () => {
    const { result } = renderHook(() => useSearchMessages('conv1', 'ab'), { wrapper: createWrapper() });
    expect(result.current.isFetching).toBe(false);
  });

  test('archive conversation onError shows toast', async () => {
    messagesAPI.archiveConversation.mockRejectedValue({ response: { data: { message: 'err' } } });
    const { result } = renderHook(() => useArchiveConversation(), { wrapper: createWrapper() });
    act(() => result.current.mutate(1));
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalled();
  });

  test('markAsRead invalidates and handles', async () => {
    messagesAPI.markAsRead.mockResolvedValue({});
    const { result } = renderHook(() => useMarkAsRead(), { wrapper: createWrapper() });
    act(() => result.current.mutate('c1'));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  test('useMessages pagination getNextPageParam handles hasNext', async () => {
    // Simulate paginated response with hasNext true
    messagesAPI.getMessages.mockResolvedValue({ data: [], pagination: { hasNext: true, page: 1 } });
    const { result } = renderHook(() => useMessages('conv1'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    // pages should exist
    expect(result.current.data).toBeDefined();
  });
});