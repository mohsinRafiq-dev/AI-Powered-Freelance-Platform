import * as messagesApi from '@/api/messagesApi';
import axiosInstance from '@/api/axiosInstance';

jest.mock('@/api/axiosInstance');

describe('Messages API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getConversations', () => {
    it('should fetch conversations with params', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            conversations: [{ id: 1, lastMessage: 'Hello' }],
          },
        },
      };
      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await messagesApi.getConversations({ archived: false });

      expect(axiosInstance.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: { archived: false },
        })
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getConversationById', () => {
    it('should fetch conversation by id', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { conversation: { id: 1 } },
        },
      };
      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await messagesApi.getConversationById(1);

      expect(axiosInstance.get).toHaveBeenCalledWith(expect.any(String));
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('sendMessage', () => {
    it('should send message', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { message: { id: 1, content: 'Hello' } },
        },
      };
      axiosInstance.post.mockResolvedValue(mockResponse);

      const messageData = {
        content: 'Hello',
      };

      const result = await messagesApi.sendMessage(1, messageData);

      // sendMessage creates FormData, so we check for FormData and headers
      expect(axiosInstance.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(FormData),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'multipart/form-data',
          }),
        })
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getUnreadCount', () => {
    it('should fetch unread count', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { unreadCount: 5 },
        },
      };
      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await messagesApi.getUnreadCount();

      expect(axiosInstance.get).toHaveBeenCalledWith(expect.any(String));
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('createConversation', () => {
    it('should create conversation', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { conversation: { id: 1 } },
        },
      };
      axiosInstance.post.mockResolvedValue(mockResponse);

      const conversationData = {
        participantId: 2,
      };

      const result = await messagesApi.createConversation(conversationData);

      expect(axiosInstance.post).toHaveBeenCalledWith(
        expect.any(String),
        conversationData
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('archive and related actions', () => {
    it('should call archive/unarchive/pin/unpin/mute/unmute/delete', async () => {
      const ok = { data: { success: true } };
      axiosInstance.post.mockResolvedValue(ok);
      axiosInstance.delete.mockResolvedValue(ok);

      await messagesApi.archiveConversation(1);
      await messagesApi.unarchiveConversation(1);
      await messagesApi.pinConversation(1);
      await messagesApi.unpinConversation(1);
      await messagesApi.muteConversation(1);
      await messagesApi.unmuteConversation(1);
      await messagesApi.deleteConversation(1);

      expect(axiosInstance.post).toHaveBeenCalled();
      expect(axiosInstance.delete).toHaveBeenCalled();
    });

    it('should get and modify messages', async () => {
      axiosInstance.get.mockResolvedValue({ data: [{ id: 'm' }] });
      axiosInstance.post.mockResolvedValue({ data: {} });
      axiosInstance.patch.mockResolvedValue({ data: {} });
      axiosInstance.delete.mockResolvedValue({ data: {} });

      const gm = await messagesApi.getMessages(1, { limit: 10 });
      const mr = await messagesApi.markAsRead(1);
      const em = await messagesApi.editMessage(1, 2, 'hi');
      const dm = await messagesApi.deleteMessage(1, 2);
      const sm = await messagesApi.searchMessages(1, 'foo');

      expect(gm).toEqual([{ id: 'm' }]);
      expect(mr).toEqual({});
      expect(em).toEqual({});
      expect(dm).toEqual({});
      expect(sm).toEqual([{ id: 'm' }]);
    });
  });
});

