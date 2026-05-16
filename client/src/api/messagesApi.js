import axiosInstance from './axiosInstance';
import ENDPOINTS from './endpoints/contracts';

// Get unread count
export const getUnreadCount = async () => {
  const response = await axiosInstance.get(ENDPOINTS.MESSAGES.GET_UNREAD_COUNT);
  return response.data;
};

// Create or get conversation
export const createConversation = async (data) => {
  const response = await axiosInstance.post(
    ENDPOINTS.MESSAGES.CREATE_CONVERSATION,
    data
  );
  return response.data;
};

// Get all conversations
export const getConversations = async (params = {}) => {
  const response = await axiosInstance.get(
    ENDPOINTS.MESSAGES.GET_CONVERSATIONS,
    { params }
  );
  return response.data;
};

// Get conversation by ID
export const getConversationById = async (id) => {
  const response = await axiosInstance.get(
    ENDPOINTS.MESSAGES.GET_CONVERSATION(id)
  );
  return response.data;
};

// Archive conversation
export const archiveConversation = async (id) => {
  const response = await axiosInstance.post(
    ENDPOINTS.MESSAGES.ARCHIVE_CONVERSATION(id)
  );
  return response.data;
};

// Unarchive conversation
export const unarchiveConversation = async (id) => {
  const response = await axiosInstance.post(
    ENDPOINTS.MESSAGES.UNARCHIVE_CONVERSATION(id)
  );
  return response.data;
};

// Pin conversation
export const pinConversation = async (id) => {
  const response = await axiosInstance.post(
    ENDPOINTS.MESSAGES.PIN_CONVERSATION(id)
  );
  return response.data;
};

// Unpin conversation
export const unpinConversation = async (id) => {
  const response = await axiosInstance.post(
    ENDPOINTS.MESSAGES.UNPIN_CONVERSATION(id)
  );
  return response.data;
};

// Mute conversation
export const muteConversation = async (id) => {
  const response = await axiosInstance.post(
    ENDPOINTS.MESSAGES.MUTE_CONVERSATION(id)
  );
  return response.data;
};

// Unmute conversation
export const unmuteConversation = async (id) => {
  const response = await axiosInstance.post(
    ENDPOINTS.MESSAGES.UNMUTE_CONVERSATION(id)
  );
  return response.data;
};

// Delete conversation
export const deleteConversation = async (id) => {
  const response = await axiosInstance.delete(
    ENDPOINTS.MESSAGES.DELETE_CONVERSATION(id)
  );
  return response.data;
};

// Send message
export const sendMessage = async (conversationId, data, files = []) => {
  console.log('📤 [sendMessage API] Sending message:', {
    conversationId,
    data: { ...data, content: data.content?.substring(0, 50) + '...' },
    filesCount: files.length,
    embeds: data.embeds
  });

  const formData = new FormData();
  formData.append('content', data.content);
  if (data.replyTo) {
    formData.append('replyTo', data.replyTo);
  }
  if (data.embeds && data.embeds.length > 0) {
    const embedsString = JSON.stringify(data.embeds);
    console.log('🔗 [sendMessage API] Embedding embeds as string:', embedsString);
    formData.append('embeds', embedsString);
  }
  
  files.forEach((file) => {
    formData.append('attachments', file);
  });

  const response = await axiosInstance.post(
    ENDPOINTS.MESSAGES.SEND_MESSAGE(conversationId),
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

// Get messages in conversation
export const getMessages = async (conversationId, params = {}) => {
  const response = await axiosInstance.get(
    ENDPOINTS.MESSAGES.GET_MESSAGES(conversationId),
    { params }
  );
  return response.data;
};

// Mark messages as read
export const markAsRead = async (conversationId) => {
  const response = await axiosInstance.post(
    ENDPOINTS.MESSAGES.MARK_AS_READ(conversationId)
  );
  return response.data;
};

// Edit message
export const editMessage = async (conversationId, messageId, content) => {
  const response = await axiosInstance.patch(
    ENDPOINTS.MESSAGES.EDIT_MESSAGE(conversationId, messageId),
    { content }
  );
  return response.data;
};

// Delete message
export const deleteMessage = async (conversationId, messageId) => {
  const response = await axiosInstance.delete(
    ENDPOINTS.MESSAGES.DELETE_MESSAGE(conversationId, messageId)
  );
  return response.data;
};

// Search messages
export const searchMessages = async (conversationId, query) => {
  const response = await axiosInstance.get(
    ENDPOINTS.MESSAGES.SEARCH_MESSAGES(conversationId),
    { params: { query } }
  );
  return response.data;
};
