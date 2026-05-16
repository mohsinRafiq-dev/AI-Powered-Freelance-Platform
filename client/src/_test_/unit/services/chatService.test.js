import chatService from '@/services/chatService';
import { io } from 'socket.io-client';
import envConfig from '@/app/config/envConfig';
import { getToken } from '@/store/slices/authSlice';
import logger from '@/utils/logger';

jest.mock('socket.io-client');
jest.mock('@/app/config/envConfig');
jest.mock('@/store/slices/authSlice');
jest.mock('@/utils/logger');

describe('chatService', () => {
  let mockSocket;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset socket state
    chatService.disconnect();
    mockSocket = {
      on: jest.fn(),
      emit: jest.fn(),
      disconnect: jest.fn(),
      removeAllListeners: jest.fn(),
    };
    io.mockReturnValue(mockSocket);
    envConfig.features = { messaging: true };
    envConfig.socketUrl = 'http://localhost:5000';
    getToken.mockReturnValue('test-token');
  });

  describe('connect', () => {
    it('should connect socket when messaging is enabled', () => {
      chatService.connect();
      expect(io).toHaveBeenCalledWith(envConfig.socketUrl, expect.objectContaining({
        auth: { token: 'test-token' },
      }));
    });

    it('should not connect if already connected', () => {
      // First connect
      chatService.connect();
      // Simulate socket connection by manually setting the socket and calling connect handler
      const connectCall = mockSocket.on.mock.calls.find(call => call[0] === 'connect');
      if (connectCall && connectCall[1]) {
        connectCall[1](); // Trigger connect event to set isConnected = true
      }
      // Clear io mock to count only the second call
      io.mockClear();
      // Second connect should not call io again because socket && isConnected
      chatService.connect();
      expect(io).not.toHaveBeenCalled();
    });

    it('should not connect if messaging is disabled', () => {
      envConfig.features.messaging = false;
      chatService.connect();
      expect(io).not.toHaveBeenCalled();
    });

    it('should set up event listeners', () => {
      chatService.connect();
      expect(mockSocket.on).toHaveBeenCalledWith('connect', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('error', expect.any(Function));
    });

    it('should handle io throwing and log error', () => {
      const origImpl = io.getMockImplementation();
      io.mockImplementation(() => { throw new Error('boom'); });
      chatService.disconnect();
      chatService.connect();
      expect(logger.error).toHaveBeenCalledWith('Socket connection error:', expect.any(Error));
      // restore
      io.mockImplementation(origImpl || (() => mockSocket));
    });

    it('should call io even when token is null', () => {
      const auth = require('@/store/slices/authSlice');
      auth.getToken.mockReturnValueOnce(null);
      chatService.disconnect();
      chatService.connect();
      expect(io).toHaveBeenCalledWith(envConfig.socketUrl, expect.objectContaining({ auth: { token: null } }));
    });
  });

  describe('disconnect', () => {
    it('should disconnect socket', () => {
      chatService.connect();
      chatService.disconnect();
      expect(mockSocket.disconnect).toHaveBeenCalled();
    });
  });

  describe('joinConversation', () => {
    it('should join conversation', () => {
      chatService.connect();
      chatService.joinConversation('conv1');
      expect(mockSocket.emit).toHaveBeenCalledWith('join_conversation', 'conv1');
    });

    it('should handle error if socket not connected', () => {
      chatService.joinConversation('conv1');
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('sendMessage', () => {
    it('should send message', () => {
      chatService.connect();
      chatService.sendMessage('conv1', { text: 'Hello' });
      expect(mockSocket.emit).toHaveBeenCalledWith('send_message', {
        conversationId: 'conv1',
        text: 'Hello',
      });
    });
  });

  describe('onMessage', () => {
    it('should register message listener', () => {
      const callback = jest.fn();
      chatService.connect();
      chatService.onMessage(callback);
      expect(mockSocket.on).toHaveBeenCalledWith('new_message', callback);
    });
  });

  describe('markAsRead', () => {
    it('should mark messages as read', () => {
      chatService.connect();
      chatService.markAsRead('conv1', ['msg1', 'msg2']);
      expect(mockSocket.emit).toHaveBeenCalledWith('message:read', {
        conversationId: 'conv1',
        messageIds: ['msg1', 'msg2'],
      });
    });
  });

  describe('other socket helpers', () => {
    it('should leave conversation', () => {
      chatService.connect();
      chatService.leaveConversation('convX');
      expect(mockSocket.emit).toHaveBeenCalledWith('leave_conversation', 'convX');
    });

    it('should handle typing events and presence', () => {
      chatService.connect();
      chatService.onTyping(() => {});
      chatService.emitTyping('conv1');
      chatService.stopTyping('conv1');
      chatService.updatePresence('online');
      expect(mockSocket.on).toHaveBeenCalledWith('user_typing', expect.any(Function));
      expect(mockSocket.emit).toHaveBeenCalledWith('typing:start', { conversationId: 'conv1' });
      expect(mockSocket.emit).toHaveBeenCalledWith('typing:stop', { conversationId: 'conv1' });
      expect(mockSocket.emit).toHaveBeenCalledWith('presence:update', { status: 'online' });
    });

    it('should support more listeners and remove listeners', () => {
      chatService.connect();
      const cb = jest.fn();
      chatService.onMessageReceived(cb);
      chatService.onMessageEdited(cb);
      chatService.onMessageDeleted(cb);
      chatService.onUserPresence(cb);
      chatService.onContractEvent(cb);
      expect(mockSocket.on).toHaveBeenCalledWith('message:new', cb);
      expect(mockSocket.on).toHaveBeenCalledWith('message:edited', cb);
      expect(mockSocket.on).toHaveBeenCalledWith('message:deleted', cb);
      expect(mockSocket.on).toHaveBeenCalledWith('presence:update', cb);
      expect(mockSocket.on).toHaveBeenCalledWith('contract:update', cb);

      chatService.removeAllListeners();
      expect(mockSocket.removeAllListeners).toHaveBeenCalled();
    });

    it('getters reflect socket state', () => {
      expect(chatService.socket).toBeNull();
      expect(chatService.isConnected).toBe(false);
      chatService.connect();
      // After connect, socket should be set (via io mock)
      expect(chatService.socket).toBeDefined();
    });
  });
});


