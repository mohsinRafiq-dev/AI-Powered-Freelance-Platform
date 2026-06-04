import { io } from 'socket.io-client';
import envConfig from '../app/config/envConfig';
import { getToken } from '@/store/slices/authSlice';
import logger from '@/utils/logger';

let socket = null;
let isConnected = false;

const connect = () => {
  if (socket && isConnected) {
    logger.warn('Socket already connected');
    return;
  }

  if (!envConfig.features.messaging) {
    logger.warn('Messaging feature is disabled');
    return;
  }

  try {
    const token = getToken();
    
    socket = io(envConfig.socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      logger.info('Socket connected');
      isConnected = true;
    });

    socket.on('disconnect', () => {
      logger.info('Socket disconnected');
      isConnected = false;
    });

    socket.on('error', (error) => {
      logger.error('Socket error:', error);
    });

  } catch (error) {
    logger.error('Socket connection error:', error);
  }
};

const disconnect = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    isConnected = false;
  }
};

const joinConversation = (conversationId) => {
  if (!socket) {
    logger.error('Socket not connected');
    return;
  }

  console.log('🚪 [ChatService] Emitting join_conversation for:', conversationId);
  socket.emit('join_conversation', conversationId);
};

const leaveConversation = (conversationId) => {
  if (!socket) {
    logger.error('Socket not connected');
    return;
  }

  socket.emit('leave_conversation', conversationId);
};

const sendMessage = (conversationId, messageData) => {
  if (!socket) {
    logger.error('Socket not connected');
    return;
  }

  socket.emit('send_message', {
    conversationId,
    ...messageData,
  });
};

const onMessage = (callback) => {
  if (!socket) {
    logger.error('Socket not connected');
    return;
  }

  socket.on('new_message', callback);
};

const onTyping = (callback) => {
  if (!socket) {
    logger.error('Socket not connected');
    return;
  }

  socket.on('user_typing', callback);
};

const emitTyping = (conversationId) => {
  if (!socket) {
    logger.error('Socket not connected');
    return;
  }

  socket.emit('typing:start', { conversationId });
};

const stopTyping = (conversationId) => {
  if (!socket) {
    logger.error('Socket not connected');
    return;
  }

  socket.emit('typing:stop', { conversationId });
};

const markAsRead = (conversationId, messageIds) => {
  if (!socket) {
    logger.error('Socket not connected');
    return;
  }

  socket.emit('message:read', { conversationId, messageIds });
};

const updatePresence = (status) => {
  if (!socket) {
    logger.error('Socket not connected');
    return;
  }

  socket.emit('presence:update', { status });
};

const onMessageReceived = (callback) => {
  if (!socket) {
    logger.error('Socket not connected');
    return;
  }

  console.log('👂 [ChatService] Registering listener for message:new event');
  socket.on('message:new', callback);
};

const onMessageEdited = (callback) => {
  if (!socket) {
    logger.error('Socket not connected');
    return;
  }

  socket.on('message:edited', callback);
};

const onMessageDeleted = (callback) => {
  if (!socket) {
    logger.error('Socket not connected');
    return;
  }

  socket.on('message:deleted', callback);
};

const onUserPresence = (callback) => {
  if (!socket) {
    logger.error('Socket not connected');
    return;
  }

  socket.on('presence:update', callback);
};

const onContractEvent = (callback) => {
  if (!socket) {
    logger.error('Socket not connected');
    return;
  }

  socket.on('contract:update', callback);
};

const onProposalEvent = (callback) => {
  if (!socket) {
    logger.error('Socket not connected');
    return;
  }
  socket.on('proposal:event', callback);
};

const offProposalEvent = (callback) => {
  if (!socket) return;
  socket.off('proposal:event', callback);
};

const subscribeToJob = (jobId) => {
  if (!socket) return;
  socket.emit('subscribe:job', jobId);
};

const unsubscribeFromJob = (jobId) => {
  if (!socket) return;
  socket.emit('unsubscribe:job', jobId);
};

const removeAllListeners = () => {
  if (socket) {
    socket.removeAllListeners();
  }
};

const chatService = {
  connect,
  disconnect,
  joinConversation,
  leaveConversation,
  sendMessage,
  onMessage,
  onTyping,
  emitTyping,
  stopTyping,
  markAsRead,
  updatePresence,
  onMessageReceived,
  onMessageEdited,
  onMessageDeleted,
  onUserPresence,
  onContractEvent,
  onProposalEvent,
  offProposalEvent,
  subscribeToJob,
  unsubscribeFromJob,
  removeAllListeners,
  get socket() { return socket; },
  get isConnected() { return isConnected; },
};

export default chatService;
