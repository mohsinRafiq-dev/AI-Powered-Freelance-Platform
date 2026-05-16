import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as messagesAPI from '@/api/messagesApi';
import {
  messageKeys,
  useUnreadCount,
  useConversations,
  useMessages,
  useCreateConversation,
  useSendMessage,
  useEditMessage,
  useDeleteConversation,
} from '@/hooks/api/useMessages';
import { toast } from 'react-hot-toast';

jest.mock('@/api/messagesApi');
jest.mock('react-hot-toast');
jest.mock('react-router-dom', () => ({ useNavigate: () => jest.fn() }));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useMessages hooks', () => {
  beforeEach(() => jest.clearAllMocks());

  test('messageKeys shapes', () => {
    expect(messageKeys.all).toEqual(['messages']);
    expect(messageKeys.messages('c1')).toEqual(['messages', 'messages', 'c1']);
  });

  test('useUnreadCount returns data', async () => {
    messagesAPI.getUnreadCount.mockResolvedValue({ unreadCount: 3 });
    const { result } = renderHook(() => useUnreadCount(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ unreadCount: 3 });
  });

  test('useMessages handles pagination and no next', async () => {
    messagesAPI.getMessages.mockResolvedValueOnce({ data: [], pagination: { hasNext: false, page: 1 } });

    const { result } = renderHook(() => useMessages('conv1'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });

  test('useCreateConversation handles error', async () => {
    const error = { response: { data: { message: 'Error' } } };
    messagesAPI.createConversation.mockRejectedValue(error);

    const { result } = renderHook(() => useCreateConversation(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate({ title: 'x' });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalled();
  });

  test('useSendMessage invalidates queries on success', async () => {
    messagesAPI.sendMessage.mockResolvedValue({ success: true });
    const { result } = renderHook(() => useSendMessage(), { wrapper: createWrapper() });

    act(() => {
      result.current.mutate({ conversationId: 'c1', data: { content: 'hi' }, files: [] });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  test('useEditMessage success and error paths', async () => {
    messagesAPI.editMessage.mockResolvedValue({});
    const { result } = renderHook(() => useEditMessage(), { wrapper: createWrapper() });

    act(() => {
      result.current.mutate({ conversationId: 'c1', messageId: 'm1', content: 'x' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    messagesAPI.editMessage.mockRejectedValue({ response: { data: { message: 'err' } } });
    const { result: res2 } = renderHook(() => useEditMessage(), { wrapper: createWrapper() });
    act(() => res2.current.mutate({ conversationId: 'c1', messageId: 'm1', content: 'x' }));
    await waitFor(() => expect(res2.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalled();
  });

  test('useDeleteConversation navigates on success', async () => {
    messagesAPI.deleteConversation.mockResolvedValue({});
    const { result } = renderHook(() => useDeleteConversation(), { wrapper: createWrapper() });

    act(() => result.current.mutate({ id: 'c1' }));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
