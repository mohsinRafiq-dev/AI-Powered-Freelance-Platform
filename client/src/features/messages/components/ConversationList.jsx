import { useState, useEffect, useRef } from 'react';
import { Search, Pin, BellOff } from 'lucide-react';
import { Avatar } from '../../../components/ui/Avatar';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../../../lib/utils';
import { useSelector } from 'react-redux';
import usersApi from '../../../api/usersApi';
import { ConversationMenu } from './ConversationMenu';
import { MessagesHeaderMenu } from './MessagesHeaderMenu';

export const ConversationList = ({ conversations, selectedId, onSelect, isLoading, onShowFilter, onShowSettings, onViewArchived }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useSelector((state) => state.auth);
  const currentUserId = user ? String(user._id || user.id || '') : '';
  const [fetchedUsers, setFetchedUsers] = useState({});
  const fetchedUsersRef = useRef(fetchedUsers);

  // Update ref when state changes
  useEffect(() => {
    fetchedUsersRef.current = fetchedUsers;
  }, [fetchedUsers]);

  // helper to normalize IDs and fields
  const getId = (val) => {
    if (val === null || val === undefined) return null;
    if (typeof val === 'string') return val;
    if (typeof val === 'number') return String(val);
    if (typeof val === 'object') return String(val._id || val.id || '');
    return null;
  };

  const resolveFieldToObject = (field) => {
    if (!field) return null;
    if (typeof field === 'object') return field;
    const id = getId(field);
    if (!id) return null;
    return fetchedUsers[id] || null;
  };

  const filteredConversations = conversations?.filter((conv) => {
    // Resolve other participant for search using normalized ids
    let otherUser = null;
    if (conv.client !== undefined && conv.freelancer !== undefined) {
      const clientId = getId(conv.client);
      const freelancerId = getId(conv.freelancer);
      const clientObj = resolveFieldToObject(conv.client) || (typeof conv.client === 'object' ? conv.client : null);
      const freelancerObj = resolveFieldToObject(conv.freelancer) || (typeof conv.freelancer === 'object' ? conv.freelancer : null);

      if (clientId === currentUserId) otherUser = freelancerObj;
      else if (freelancerId === currentUserId) otherUser = clientObj;
      else otherUser = clientObj || freelancerObj || conv.participants?.find((p) => getId(p) !== currentUserId) || null;
    } else {
      otherUser = conv.participants?.find((p) => getId(p) !== currentUserId) || null;
    }

    const searchLower = searchQuery.toLowerCase();
    return (
      (otherUser?.name || '').toLowerCase().includes(searchLower) ||
      (conv.metadata?.jobTitle || '').toLowerCase().includes(searchLower)
    );
  });

  // Lazy-fetch any missing user objects (client/freelancer/participants) and cache them
  useEffect(() => {
    if (!filteredConversations?.length) return;

    const toFetch = new Set();
    filteredConversations.forEach((conv) => {
      ['client', 'freelancer'].forEach((role) => {
        const field = conv[role];
        const id = getId(field);
        const hasObj = field && typeof field === 'object' && (field._id || field.id);
        if (!hasObj && id && fetchedUsersRef.current[id] === undefined) toFetch.add(id);
      });

      (conv.participants || []).forEach((p) => {
        const pid = getId(p);
        if (pid && fetchedUsersRef.current[pid] === undefined) toFetch.add(pid);
      });
    });

    if (toFetch.size === 0) return;

    let mounted = true;
    (async () => {
      const results = {};
      for (const id of Array.from(toFetch)) {
        try {
          let res = null;
          // prefer a generic getById if available, otherwise try freelancer endpoint
          if (usersApi.getById) res = await usersApi.getById(id);
          else res = await usersApi.getFreelancerById(id);
          const payload = res?.data || res;
          results[id] = payload?.user || payload || null;
        } catch (err) {
          console.error(`Failed to fetch user ${id}:`, err);
          results[id] = null;
        }
      }
      if (mounted) setFetchedUsers((s) => ({ ...s, ...results }));
    })();

    return () => { mounted = false; };
  }, [filteredConversations]);

  const formatTime = (date) => {
    if (!date) return '';
    return formatDistanceToNow(new Date(date), { addSuffix: false });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 min-w-0">
      {/* Header */}
      <div className="flex-shrink-0 p-4 md:p-5 lg:p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Messages</h2>
          <MessagesHeaderMenu 
            onViewArchived={onViewArchived}
            onShowFilter={onShowFilter}
            onShowSettings={onShowSettings}
          />
        </div>

        {/* Search */}
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand" />
          </div>
        ) : filteredConversations?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-400">
            <p>No conversations found</p>
          </div>
        ) : (
          filteredConversations?.map((conversation) => {
            // Resolve other participant for display
            let otherUser = null;
            if (conversation.client !== undefined && conversation.freelancer !== undefined) {
              const clientId = typeof conversation.client === 'string' || typeof conversation.client === 'number'
                ? String(conversation.client)
                : (conversation.client._id || conversation.client.id);
              const freelancerId = typeof conversation.freelancer === 'string' || typeof conversation.freelancer === 'number'
                ? String(conversation.freelancer)
                : (conversation.freelancer._id || conversation.freelancer.id);

              if (clientId === currentUserId) {
                otherUser = (typeof conversation.freelancer === 'object' ? conversation.freelancer : fetchedUsers[freelancerId]) || null;
              } else if (freelancerId === currentUserId) {
                otherUser = (typeof conversation.client === 'object' ? conversation.client : fetchedUsers[clientId]) || null;
              } else {
                otherUser = (typeof conversation.client === 'object' ? conversation.client : fetchedUsers[clientId]) || (typeof conversation.freelancer === 'object' ? conversation.freelancer : fetchedUsers[freelancerId]) || null;
              }
            } else {
              otherUser = conversation.participants?.find((p) => p._id !== currentUserId) || conversation.participants?.[0];
            }

            // If still missing, try to fall back to any cached fetched user for freelancer/client
            if (!otherUser) {
              const fallbackId = (conversation.freelancer && (typeof conversation.freelancer === 'string' ? conversation.freelancer : (conversation.freelancer._id || conversation.freelancer.id))) || (conversation.client && (typeof conversation.client === 'string' ? conversation.client : (conversation.client._id || conversation.client.id)));
              if (fallbackId && fetchedUsers[fallbackId]) otherUser = fetchedUsers[fallbackId];
            }
            const isSelected = conversation._id === selectedId;
            const hasUnread = conversation.unreadCount > 0;
            const isPinned = conversation?.pinnedBy?.some(
              (id) => String(id) === currentUserId || (typeof id === 'object' && String(id._id || id.id) === currentUserId)
            );
            const isMuted = conversation?.mutedBy?.some(
              (id) => String(id) === currentUserId || (typeof id === 'object' && String(id._id || id.id) === currentUserId)
            );

            return (
              <div
                key={conversation._id}
                className={cn(
                  'w-full p-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors min-w-0 group',
                  isSelected 
                    ? 'bg-gradient-to-r from-brand-light/30 to-brand-light/50 dark:from-gray-800 dark:to-gray-700/60 border-l-4 border-brand' 
                    : ''
                )}
              >
                <button
                  onClick={() => onSelect(conversation)}
                  className="flex-1 flex items-center gap-3 text-left min-w-0"
                >
                <div className="relative flex-shrink-0">
                  <Avatar
                    src={otherUser?.avatar}
                    alt={otherUser?.name}
                    className="w-11 h-11"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-brand border-2 border-white dark:border-gray-900 rounded-full"></div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between mb-0.5">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      {isPinned && (
                        <Pin className="w-3.5 h-3.5 text-brand dark:text-brand-light flex-shrink-0" />
                      )}
                      {isMuted && (
                        <BellOff className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                      )}
                      <h3 className={cn(
                        'font-semibold text-sm truncate',
                        hasUnread ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                      )}>
                        {otherUser?.name || 'Unknown User'}
                      </h3>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                      {formatTime(conversation.lastMessageAt)}
                    </span>
                  </div>

                  {conversation.metadata?.jobTitle && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-1 truncate">
                      {conversation.metadata.jobTitle}
                    </p>
                  )}

                  <div className="flex items-center gap-2">
                    <p className={cn(
                      'text-xs truncate flex-1',
                      hasUnread ? 'text-gray-700 dark:text-gray-300 font-medium' : 'text-gray-500 dark:text-gray-400'
                    )}>
                        {(conversation.lastMessage && ((conversation.lastMessage.senderId && conversation.lastMessage.senderId === currentUserId) || (conversation.lastMessage.sender && conversation.lastMessage.sender._id === currentUserId))) && 'You: '}
                        {conversation.lastMessage?.content || 'No messages yet'}
                    </p>
                    {hasUnread && (
                      <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 bg-brand rounded-full flex items-center justify-center text-xs font-bold text-white">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
                </button>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ConversationMenu conversation={conversation} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
