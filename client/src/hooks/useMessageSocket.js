import { useEffect, useCallback, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import chatService from '../services/chatService';
import { messageKeys } from './api/useMessages';
import logger from '../utils/logger';

export const useMessageSocket = (conversationId) => {
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);
  const typingTimeoutRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  // Connect socket on mount
  useEffect(() => {
    if (!user) return;

    logger.info('Initializing message socket connection');
    chatService.connect();

    // Listen for connection status changes
    const socket = chatService.socket;
    if (socket) {
      const handleConnect = () => {
        logger.info('Socket connected in hook');
        setIsConnected(true);
      };

      const handleDisconnect = () => {
        logger.info('Socket disconnected in hook');
        setIsConnected(false);
      };

      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);

      // Set initial state
      setIsConnected(socket.connected);

      return () => {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        chatService.removeAllListeners();
      };
    }

    return () => {
      chatService.removeAllListeners();
    };
  }, [user]);

  // Join conversation
  useEffect(() => {
    if (!conversationId || !isConnected) {
      logger.info('Cannot join conversation - conversationId:', conversationId, 'isConnected:', isConnected);
      return;
    }

    logger.info('Joining conversation:', conversationId);
    chatService.joinConversation(conversationId);

    return () => {
      logger.info('Leaving conversation:', conversationId);
      chatService.leaveConversation(conversationId);
    };
  }, [conversationId, isConnected]);

  // Handle new messages
  useEffect(() => {
    if (!conversationId) return;

    const handleNewMessage = (message) => {
      console.log('📨 [CLIENT] New message received:', message);
      logger.info('New message received:', message);

      // Update messages list
      queryClient.setQueryData(messageKeys.messages(conversationId), (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page, index) => {
            // Add to last page
            if (index === old.pages.length - 1) {
              const messages = Array.isArray(page.data) ? page.data : page.data?.messages || [];
              return {
                ...page,
                data: Array.isArray(page.data) 
                  ? [...messages, message]
                  : { ...page.data, messages: [...messages, message] }
              };
            }
            return page;
          }),
        };
      });

      // Update conversations list
      queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });
      queryClient.invalidateQueries({ queryKey: messageKeys.conversation(conversationId) });
    };

    chatService.onMessageReceived(handleNewMessage);

    return () => {
      chatService.socket?.off('message:new', handleNewMessage);
    };
  }, [conversationId, queryClient]);

  // Handle message edits
  useEffect(() => {
    if (!conversationId) return;

    const handleEditedMessage = ({ messageId, content, editedAt }) => {
      logger.info('Message edited:', messageId);

      queryClient.setQueryData(messageKeys.messages(conversationId), (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => {
            const messages = Array.isArray(page.data) ? page.data : page.data?.messages || [];
            const updatedMessages = messages.map((msg) =>
              msg._id === messageId ? { ...msg, content, editedAt, isEdited: true } : msg
            );

            return {
              ...page,
              data: Array.isArray(page.data) ? updatedMessages : { ...page.data, messages: updatedMessages }
            };
          }),
        };
      });
    };

    chatService.onMessageEdited(handleEditedMessage);

    return () => {
      chatService.socket?.off('message:edited', handleEditedMessage);
    };
  }, [conversationId, queryClient]);

  // Handle message deletions
  useEffect(() => {
    if (!conversationId) return;

    const handleDeletedMessage = ({ messageId, conversationId: convId }) => {
      logger.info('Message deleted:', messageId);

      // Only update if it's for the current conversation
      if (convId && convId !== conversationId) return;

      // Invalidate queries to refetch with proper deletedBy filtering
      queryClient.invalidateQueries({ queryKey: messageKeys.messages(conversationId) });
      queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });
    };

    chatService.onMessageDeleted(handleDeletedMessage);

    return () => {
      chatService.socket?.off('message:deleted', handleDeletedMessage);
    };
  }, [conversationId, queryClient]);

  // Typing indicator handler
  const handleTyping = useCallback((callback) => {
    if (!conversationId) return;

    const handleUserTyping = ({ userId, conversationId: convId }) => {
      if (convId === conversationId && userId !== user?._id) {
        callback(true, userId);

        // Clear existing timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        // Auto-clear typing after 3 seconds
        typingTimeoutRef.current = setTimeout(() => {
          callback(false, userId);
        }, 3000);
      }
    };

    chatService.onTyping(handleUserTyping);

    return () => {
      chatService.socket?.off('user_typing', handleUserTyping);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [conversationId, user?._id]);

  // Emit typing event
  const emitTyping = useCallback(() => {
    if (!conversationId) return;
    chatService.emitTyping(conversationId);
  }, [conversationId]);

  // Stop typing event
  const stopTyping = useCallback(() => {
    if (!conversationId) return;
    chatService.stopTyping(conversationId);
  }, [conversationId]);

  return {
    isConnected,
    emitTyping,
    stopTyping,
    handleTyping,
  };
};
