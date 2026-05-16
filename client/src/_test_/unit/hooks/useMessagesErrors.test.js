import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as messagesAPI from '@/api/messagesApi';
import {
  useUnarchiveConversation,
  usePinConversation,
  useUnpinConversation,
  useMuteConversation,
  useUnmuteConversation,
  useSendMessage,
  useDeleteConversation,
} from '@/hooks/api/useMessages';
import { toast } from 'react-hot-toast';

jest.mock('@/api/messagesApi');
jest.mock('react-hot-toast');
jest.mock('react-router-dom', () => ({ useNavigate: () => jest.fn() }));

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useMessages error branches', () => {
  beforeEach(() => jest.clearAllMocks());

  test('unarchive/pin/unpin/mute/unmute onError show toast', async () => {
    messagesAPI.unarchiveConversation.mockRejectedValue({ response: { data: { message: 'err' } } });
    messagesAPI.pinConversation.mockRejectedValue({ response: { data: { message: 'err' } } });
    messagesAPI.unpinConversation.mockRejectedValue({ response: { data: { message: 'err' } } });
    messagesAPI.muteConversation.mockRejectedValue({ response: { data: { message: 'err' } } });
    messagesAPI.unmuteConversation.mockRejectedValue({ response: { data: { message: 'err' } } });

    const hooks = [useUnarchiveConversation, usePinConversation, useUnpinConversation, useMuteConversation, useUnmuteConversation];

    for (const hook of hooks) {
      const { result } = renderHook(() => hook(), { wrapper: createWrapper() });
      act(() => result.current.mutate(1));
      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(toast.error).toHaveBeenCalled();
    }
  });

  test('sendMessage onError shows toast', async () => {
    messagesAPI.sendMessage.mockRejectedValue({ response: { data: { message: 'send fail' } } });
    const { result } = renderHook(() => useSendMessage(), { wrapper: createWrapper() });
    act(() => result.current.mutate({ conversationId: 'c1', data: { content: 'hi' }, files: [] }));
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalled();
  });

  test('deleteConversation onError shows toast', async () => {
    messagesAPI.deleteConversation.mockRejectedValue({ response: { data: { message: 'del fail' } } });
    const { result } = renderHook(() => useDeleteConversation(), { wrapper: createWrapper() });
    act(() => result.current.mutate({ conversationId: 'c1', messageId: 'm1' }));
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalled();
  });
});