export default {
  // Contract endpoints
  CONTRACTS: {
    BASE: '/contracts',
    CREATE_FROM_PROPOSAL: '/contracts/from-proposal',
    GET_MY_CONTRACTS: '/contracts',
    GET_CONTRACT: (id) => `/contracts/${id}`,
    RESPOND_TO_CONTRACT: (id) => `/contracts/${id}/respond`,
    ADD_MILESTONE: (id) => `/contracts/${id}/milestones`,
    UPDATE_MILESTONE: (id, milestoneId) =>
      `/contracts/${id}/milestones/${milestoneId}`,
    COMPLETE_CONTRACT: (id) => `/contracts/${id}/complete`,
    CANCEL_CONTRACT: (id) => `/contracts/${id}/cancel`,
    GET_MY_STATS: '/contracts/stats/me',
  },

  // Message endpoints
  MESSAGES: {
    BASE: '/messages',
    GET_UNREAD_COUNT: '/messages/unread-count',
    
    // Conversations
    CREATE_CONVERSATION: '/messages/conversations',
    GET_CONVERSATIONS: '/messages/conversations',
    GET_CONVERSATION: (id) => `/messages/conversations/${id}`,
    ARCHIVE_CONVERSATION: (id) => `/messages/conversations/${id}/archive`,
    UNARCHIVE_CONVERSATION: (id) => `/messages/conversations/${id}/unarchive`,
    PIN_CONVERSATION: (id) => `/messages/conversations/${id}/pin`,
    UNPIN_CONVERSATION: (id) => `/messages/conversations/${id}/unpin`,
    MUTE_CONVERSATION: (id) => `/messages/conversations/${id}/mute`,
    UNMUTE_CONVERSATION: (id) => `/messages/conversations/${id}/unmute`,
    DELETE_CONVERSATION: (id) => `/messages/conversations/${id}`,
    
    // Messages
    SEND_MESSAGE: (conversationId) =>
      `/messages/conversations/${conversationId}/messages`,
    GET_MESSAGES: (conversationId) =>
      `/messages/conversations/${conversationId}/messages`,
    MARK_AS_READ: (conversationId) =>
      `/messages/conversations/${conversationId}/read`,
    EDIT_MESSAGE: (conversationId, messageId) =>
      `/messages/conversations/${conversationId}/messages/${messageId}`,
    DELETE_MESSAGE: (conversationId, messageId) =>
      `/messages/conversations/${conversationId}/messages/${messageId}`,
    SEARCH_MESSAGES: (conversationId) =>
      `/messages/conversations/${conversationId}/search`,
  },
};
