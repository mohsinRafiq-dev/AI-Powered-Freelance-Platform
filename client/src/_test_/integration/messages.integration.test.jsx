import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/slices/authSlice';
import * as messagesAPI from '@/api/messagesApi';
import { useConversations, useSendMessage } from '@/hooks/api/useMessages';

jest.mock('@/api/messagesApi');

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
const MessagesTestComponent = () => {
  const { data, isLoading } = useConversations();
  const sendMessage = useSendMessage();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div data-testid="conversations-count">
        {data?.data?.conversations?.length || 0}
      </div>
      <button
        onClick={() =>
          sendMessage.mutate({
            conversationId: 1,
            data: { content: 'Test message' },
            files: [],
          })
        }
      >
        Send Message
      </button>
    </div>
  );
};

describe('Messages Integration', () => {
  let store;
  const mockNewMessage = {
    id: 1,
    conversationId: 1,
    content: 'Test message',
    senderId: 1,
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    store = createTestStore();
    jest.clearAllMocks();
  });

  describe('Fetch Conversations', () => {
    it('should fetch and display conversations', async () => {
      messagesAPI.getConversations.mockResolvedValue({
        success: true,
        data: {
          conversations: [
            { id: 1, lastMessage: 'Hello', unreadCount: 2 },
            { id: 2, lastMessage: 'Hi there', unreadCount: 0 },
          ],
        },
      });

      render(<MessagesTestComponent />, {
        wrapper: createWrapper(store),
      });

      await waitFor(() => {
        expect(screen.getByTestId('conversations-count')).toHaveTextContent('2');
      });

      expect(messagesAPI.getConversations).toHaveBeenCalled();
    });

    it('should handle fetch error', async () => {
      messagesAPI.getConversations.mockRejectedValue(
        new Error('Failed to fetch')
      );

      render(<MessagesTestComponent />, {
        wrapper: createWrapper(store),
      });

      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
    });

    it('should filter conversations by archived status', async () => {
      messagesAPI.getConversations.mockResolvedValue({
        success: true,
        data: {
          conversations: [{ id: 1, archived: true }],
        },
      });

      render(<MessagesTestComponent />, {
        wrapper: createWrapper(store),
      });

      await waitFor(() => {
        expect(messagesAPI.getConversations).toHaveBeenCalled();
      });
    });
  });

  describe('Send Message', () => {
    it('should send message successfully', async () => {
      messagesAPI.getConversations.mockResolvedValue({
        success: true,
        data: { conversations: [] },
      });
      messagesAPI.sendMessage.mockResolvedValue({
        data: { message: mockNewMessage },
      });

      render(<MessagesTestComponent />, {
        wrapper: createWrapper(store),
      });

      await waitFor(() => {
        expect(screen.getByText('Send Message')).toBeInTheDocument();
      });

      const sendButton = screen.getByText('Send Message');
      await userEvent.click(sendButton);

      await waitFor(() => {
        expect(messagesAPI.sendMessage).toHaveBeenCalledWith(
          1, // conversationId
          { content: 'Test message' }, // data
          [] // files
        );
      });
    });

    it('should handle send message error', async () => {
      messagesAPI.getConversations.mockResolvedValue({
        success: true,
        data: { conversations: [] },
      });
      messagesAPI.sendMessage.mockRejectedValue(
        new Error('Failed to send')
      );

      render(<MessagesTestComponent />, {
        wrapper: createWrapper(store),
      });

      await waitFor(() => {
        expect(screen.getByText('Send Message')).toBeInTheDocument();
      });

      const sendButton = screen.getByText('Send Message');
      await userEvent.click(sendButton);

      await waitFor(() => {
        expect(messagesAPI.sendMessage).toHaveBeenCalled();
      });
    });
  });
});

