import React, { useEffect, useRef, useState } from 'react';
import { Video, Phone, Eye, ArrowLeft, Menu } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar } from '../../../components/ui/Avatar';
import { MessageBubble } from './MessageBubble';
import { MessageComposer } from './MessageComposer';
import { TypingIndicator } from './TypingIndicator';
import { ConversationMenu } from './ConversationMenu';
import { useMessages, useSendMessage, useMarkAsRead, useEditMessage, useDeleteMessage } from '../../../hooks/api/useMessages';
import { useMessageSocket } from '../../../hooks/useMessageSocket';
import { useSelector } from 'react-redux';
import usersApi from '../../../api/usersApi';

export const ChatArea = ({ conversation, onViewProposal, onBackToList, onToggleSidebar }) => {
  const { user } = useSelector((state) => state.auth);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [replyTo, setReplyTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUserId, setTypingUserId] = useState(null);

  // Initialize socket connection
  const { isConnected, emitTyping, stopTyping, handleTyping } = useMessageSocket(conversation?._id);

  const { data, fetchNextPage, hasNextPage, isLoading } = useMessages(conversation?._id);
  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkAsRead();
  const editMessageMutation = useEditMessage();
  const deleteMessageMutation = useDeleteMessage();

  const messages = data?.pages?.flatMap((page) => {
    // Handle paginated response (data is array directly) or nested response
    return Array.isArray(page.data) ? page.data : (page.data?.messages || []);
  }) || [];
  const currentUserId = user?._id ? String(user._id) : (user?.id ? String(user.id) : null);
  const [fetchedUsers, setFetchedUsers] = useState({});

  // Helpers for normalized id handling and resolving user objects
  const getId = (val) => {
    if (val === null || val === undefined) return null;
    if (typeof val === 'string') return val;
    if (typeof val === 'number') return String(val);
    if (typeof val === 'object') return String(val._id || val.id || '');
    return null;
  };

  const resolveUserObject = (field) => {
    if (!field) return null;
    if (typeof field === 'object') return field;
    const id = getId(field);
    if (!id) return null;
    return fetchedUsers[id] || null;
  };

  // Resolve other participant using client/freelancer fields if present, otherwise participants
  let otherUser = null;
  if (conversation?.client !== undefined && conversation?.freelancer !== undefined) {
    const clientId = getId(conversation.client);
    const freelancerId = getId(conversation.freelancer);
    const clientObj = resolveUserObject(conversation.client);
    const freelancerObj = resolveUserObject(conversation.freelancer);
    if (clientId === currentUserId) otherUser = freelancerObj;
    else if (freelancerId === currentUserId) otherUser = clientObj;
    else otherUser = clientObj || freelancerObj || (conversation.participants?.find((p) => getId(p) !== currentUserId) || null);
  } else {
    otherUser = conversation?.participants?.find((p) => getId(p) !== currentUserId) || null;
  }

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // Mark as read when opening conversation
  useEffect(() => {
    if (conversation?._id && conversation?.unreadCount > 0) {
      markAsReadMutation.mutate(conversation._id);
    }
  }, [conversation?._id]);

  // Handle typing indicators
  useEffect(() => {
    if (!conversation?._id) return;

    const cleanup = handleTyping((typing, userId) => {
      setIsTyping(typing);
      setTypingUserId(userId);
    });

    return cleanup;
  }, [conversation?._id, handleTyping]);

  // Lazy-fetch missing user objects (client/freelancer and message senders) and cache them
  useEffect(() => {
    if (!conversation && !messages) return;
    const idsToFetch = new Set();

    // check conversation fields
    ['client', 'freelancer'].forEach((role) => {
      const field = conversation?.[role];
      const id = getId(field);
      if (id && !resolveUserObject(field) && !fetchedUsers[id]) idsToFetch.add(id);
    });

    // check message sender ids
    messages.forEach((m) => {
      const sid = getId(m?.senderId || m?.sender?._id || m?.sender?.id);
      if (sid && !fetchedUsers[sid] && sid !== currentUserId) idsToFetch.add(sid);
    });

    if (idsToFetch.size === 0) return;

    let mounted = true;
    (async () => {
      const results = {};
      for (const id of idsToFetch) {
        try {
          let res = null;
          if (usersApi.getById) {
            res = await usersApi.getById(id);
          } else {
            res = await usersApi.getFreelancerById(id);
          }
          const payload = res?.data || res;
          results[id] = payload?.user || payload || null;
        } catch (err) {
          results[id] = null;
        }
      }
      if (mounted) setFetchedUsers((s) => ({ ...s, ...results }));
    })();

    return () => { mounted = false; };
  }, [conversation, messages, fetchedUsers]);

  const handleSendMessage = async ({ content, files, embeds }) => {
    console.log('💬 [ChatArea] handleSendMessage called with:', {
      content: content?.substring(0, 50) + '...',
      filesCount: files?.length || 0,
      embedsCount: embeds?.length || 0,
      embeds
    });

    if (!conversation?._id) return;

    const messageData = {
      content: content || (embeds?.length > 0 ? 'Shared a video' : ''),
      ...(replyTo && { replyTo: replyTo._id }),
      ...(embeds && { embeds }),
    };

    console.log('📤 [ChatArea] Final messageData:', messageData);

    if (editingMessage) {
      await editMessageMutation.mutateAsync({
        conversationId: conversation._id,
        messageId: editingMessage._id,
        content,
      });
      setEditingMessage(null);
    } else {
      await sendMessageMutation.mutateAsync({
        conversationId: conversation._id,
        data: messageData,
        files,
      });
      setReplyTo(null);
    }
  };

  const handleEditMessage = (message) => {
    setEditingMessage(message);
    setReplyTo(null);
    // Scroll to bottom to show the edit box
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleDeleteMessage = async (message) => {
    if (!confirm('Delete this message?')) return;
    await deleteMessageMutation.mutateAsync({
      conversationId: conversation._id,
      messageId: message._id,
    });
  };

  const handleReply = (message) => {
    setReplyTo(message);
    setEditingMessage(null);
  };

  const handleScroll = (e) => {
    const { scrollTop } = e.target;
    if (scrollTop === 0 && hasNextPage) {
      fetchNextPage();
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-950 text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">No conversation selected</h3>
          <p className="text-sm">Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="flex-shrink-0 px-4 md:px-6 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900">
        <div className="flex items-center gap-3">
          {/* Back / Sidebar toggle buttons */}
          {onBackToList && (
            <button
              onClick={onBackToList}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Back to list"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          )}

          {/* Sidebar toggle - visible on medium screens to collapse/open sidebar */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="hidden md:inline-flex lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle conversations sidebar"
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          )}
          <div className="relative">
            <Avatar
              src={otherUser?.avatar}
              alt={otherUser?.name}
              className="w-11 h-11"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-brand border-2 border-white dark:border-gray-900 rounded-full"></div>
          </div>
          <div>
            <h3 className="font-semibold text-base text-gray-900 dark:text-white leading-tight">{otherUser?.name}</h3>
            {conversation.metadata?.jobTitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{conversation.metadata.jobTitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {conversation.metadata?.jobTitle && onViewProposal && (
            <button
              onClick={onViewProposal}
              className="flex items-center gap-2 p-2 md:px-3 md:py-1.5 bg-brand hover:bg-brand-dark text-white rounded-lg transition-colors text-sm font-medium"
              title="View proposal"
            >
              <Eye className="w-4 h-4 md:w-4 md:h-4" />
              <span className="hidden md:inline">View proposal</span>
            </button>
          )}
          {/* <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-600 dark:text-gray-400">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-600 dark:text-gray-400">
            <Phone className="w-5 h-5" />
          </button> */}
          <ConversationMenu conversation={conversation} />
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto bg-white dark:bg-gray-950"
        style={{ minHeight: 0 }}
      >
        <div className="p-6 space-y-4 max-w-3xl w-full mx-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const prevMessage = messages[index - 1];
              const prevSenderId = getId(prevMessage?.sender?._id || prevMessage?.senderId || prevMessage?.sender?.id);
              const currSenderId = getId(message?.sender?._id || message?.senderId || message?.sender?.id);
              const showAvatar = !prevSenderId || prevSenderId !== currSenderId;

              // Determine ownership using explicit senderId when available
              const isOwn = (currSenderId && currSenderId === currentUserId) || (message?.sender && getId(message.sender) === currentUserId);

              // Resolve sender object: prefer message.sender object, then cached fetched user, then current user or otherUser
              let resolvedSender = null;
              if (message?.sender && typeof message.sender === 'object') resolvedSender = message.sender;
              else if (currSenderId && fetchedUsers[currSenderId]) resolvedSender = fetchedUsers[currSenderId];
              else resolvedSender = isOwn ? user : otherUser || { name: 'Unknown', avatar: null };

              // Check if we need to show a date separator
              const showDateSeparator = (() => {
                if (index === 0) return true; // Always show date for first message
                if (!prevMessage || !message.createdAt) return false;
                
                const prevDate = new Date(prevMessage.createdAt);
                const currDate = new Date(message.createdAt);
                
                // Check if messages are on different days
                return (
                  prevDate.getDate() !== currDate.getDate() ||
                  prevDate.getMonth() !== currDate.getMonth() ||
                  prevDate.getFullYear() !== currDate.getFullYear()
                );
              })();

              const formatDateSeparator = (date) => {
                const messageDate = new Date(date);
                const today = new Date();
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                
                // Reset time to compare dates only
                const messageDateOnly = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
                const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
                
                if (messageDateOnly.getTime() === todayOnly.getTime()) {
                  return 'Today';
                } else if (messageDateOnly.getTime() === yesterdayOnly.getTime()) {
                  return 'Yesterday';
                } else {
                  return format(messageDate, 'MMMM d, yyyy');
                }
              };

              return (
                <React.Fragment key={message._id}>
                  {showDateSeparator && (
                    <div className="flex items-center justify-center my-4">
                      <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          {formatDateSeparator(message.createdAt)}
                        </span>
                      </div>
                    </div>
                  )}
                  <MessageBubble
                    message={message}
                    sender={resolvedSender}
                    isOwn={isOwn}
                    showAvatar={showAvatar}
                    onEdit={handleEditMessage}
                    onDelete={handleDeleteMessage}
                    onReply={handleReply}
                  />
                </React.Fragment>
              );
            })}
            {isTyping && <TypingIndicator user={otherUser} />}
            <div ref={messagesEndRef} />
        </>
    
          
        )}
      </div>
      </div>

      {/* Composer */}
      <div className="flex-shrink-0">
        <MessageComposer
          onSend={handleSendMessage}
          isLoading={sendMessageMutation.isPending}
          replyTo={replyTo}
          onCancelReply={() => setReplyTo(null)}
          editingMessage={editingMessage}
          onCancelEdit={() => setEditingMessage(null)}
          onTyping={emitTyping}
          onStopTyping={stopTyping}
          isConnected={isConnected}
        />
      </div>
    </div>
  );
};
