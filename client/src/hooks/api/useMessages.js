import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import * as messagesApi from '../../api/messagesApi';
import { toast } from 'react-hot-toast';

// Query keys
export const messageKeys = {
  all: ['messages'],
  conversations: () => [...messageKeys.all, 'conversations'],
  conversation: (id) => [...messageKeys.conversations(), id],
  messages: (conversationId) => [...messageKeys.all, 'messages', conversationId],
  unreadCount: () => [...messageKeys.all, 'unreadCount'],
};

// Get unread count
export const useUnreadCount = () => {
  return useQuery({
    queryKey: messageKeys.unreadCount(),
    queryFn: messagesApi.getUnreadCount,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

// Get all conversations
export const useConversations = (params = {}) => {
  return useQuery({
    queryKey: [...messageKeys.conversations(), params],
    queryFn: () => messagesApi.getConversations(params),
  });
};

// Get conversation by ID
export const useConversation = (id) => {
  return useQuery({
    queryKey: messageKeys.conversation(id),
    queryFn: () => messagesApi.getConversationById(id),
    enabled: !!id,
  });
};

// Get messages with infinite scroll
export const useMessages = (conversationId) => {
  return useInfiniteQuery({
    queryKey: messageKeys.messages(conversationId),
    queryFn: ({ pageParam = 1 }) =>
      messagesApi.getMessages(conversationId, {
        page: pageParam,
        limit: 50,
        order: 'asc',
      }),
    getNextPageParam: (lastPage) => {
      // Handle both paginated and non-paginated responses
      if (lastPage?.pagination) {
        // Paginated response
        if (lastPage.pagination.hasNext) {
          return lastPage.pagination.page + 1;
        }
      }
      return undefined;
    },
    enabled: !!conversationId,
  });
};

// Create or get conversation
export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: messagesApi.createConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to create conversation');
    },
  });
};

// Send message
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, data, files }) =>
      messagesApi.sendMessage(conversationId, data, files),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: messageKeys.messages(variables.conversationId),
      });
      queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });
      queryClient.invalidateQueries({
        queryKey: messageKeys.conversation(variables.conversationId),
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to send message');
    },
  });
};

// Mark as read
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: messagesApi.markAsRead,
    onSuccess: (data, conversationId) => {
      queryClient.invalidateQueries({
        queryKey: messageKeys.conversation(conversationId),
      });
      queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });
      queryClient.invalidateQueries({ queryKey: messageKeys.unreadCount() });
    },
  });
};

// Edit message
export const useEditMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, messageId, content }) =>
      messagesApi.editMessage(conversationId, messageId, content),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: messageKeys.messages(variables.conversationId),
      });
      toast.success('Message edited');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to edit message');
    },
  });
};

// Delete message
export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, messageId }) =>
      messagesApi.deleteMessage(conversationId, messageId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: messageKeys.messages(variables.conversationId),
      });
      toast.success('Message deleted');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to delete message');
    },
  });
};

// Archive conversation
export const useArchiveConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: messagesApi.archiveConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });
      toast.success('Conversation archived');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to archive conversation');
    },
  });
};

// Unarchive conversation
export const useUnarchiveConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: messagesApi.unarchiveConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });
      toast.success('Conversation unarchived');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to unarchive conversation');
    },
  });
};

// Search messages
export const useSearchMessages = (conversationId, query) => {
  return useQuery({
    queryKey: [...messageKeys.messages(conversationId), 'search', query],
    queryFn: () => messagesApi.searchMessages(conversationId, query),
    enabled: !!conversationId && !!query && query.length > 2,
  });
};

// Pin conversation
export const usePinConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: messagesApi.pinConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });
      toast.success('Conversation pinned');
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || 'Failed to pin conversation';
      toast.error(errorMessage);
    },
  });
};

// Unpin conversation
export const useUnpinConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: messagesApi.unpinConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });
      toast.success('Conversation unpinned');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to unpin conversation');
    },
  });
};

// Mute conversation
export const useMuteConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: messagesApi.muteConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });
      toast.success('Conversation muted');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to mute conversation');
    },
  });
};

// Unmute conversation
export const useUnmuteConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: messagesApi.unmuteConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });
      toast.success('Conversation unmuted');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to unmute conversation');
    },
  });
};

// Delete conversation
export const useDeleteConversation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: messagesApi.deleteConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });
      toast.success('Conversation deleted');
      navigate('/messages');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to delete conversation');
    },
  });
};