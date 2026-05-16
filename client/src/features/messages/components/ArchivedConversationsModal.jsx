import { useState } from 'react';
import { X, ArchiveRestore } from 'lucide-react';
import { Avatar } from '../../../components/ui/Avatar';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../../../lib/utils';
import { useUnarchiveConversation } from '../../../hooks/api/useMessages';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { messageKeys } from '../../../hooks/api/useMessages';

export const ArchivedConversationsModal = ({ isOpen, onClose, conversations = [], currentUserId, onUnarchive, isLoading = false }) => {
  const [isUnarchiving, setIsUnarchiving] = useState({});
  const unarchiveMutation = useUnarchiveConversation();
  const queryClient = useQueryClient();

  if (!isOpen) return null;
  
  // Debug logging
  console.log('[ArchivedModal] Conversations received:', conversations);
  console.log('[ArchivedModal] Conversations count:', conversations?.length);
  console.log('[ArchivedModal] Is loading:', isLoading);

  const handleUnarchive = async (conversationId) => {
    setIsUnarchiving(prev => ({ ...prev, [conversationId]: true }));
    try {
      await unarchiveMutation.mutateAsync(conversationId);
      toast.success('Conversation unarchived');
      // Invalidate all conversation queries to refresh both regular and archived lists
      queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });
      // Call onUnarchive callback if provided
      if (onUnarchive) {
        onUnarchive();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to unarchive conversation');
    } finally {
      setIsUnarchiving(prev => ({ ...prev, [conversationId]: false }));
    }
  };

  const normalizeId = (id) => {
    if (!id) return '';
    if (typeof id === 'string') return id;
    if (typeof id === 'object') return String(id._id || id.id || '');
    return String(id);
  };

  const getOtherParticipant = (conversation) => {
    if (!conversation.participants || !currentUserId) return null;
    const otherUser = conversation.participants.find(
      (p) => normalizeId(p._id || p.id || p) !== normalizeId(currentUserId)
    );
    return otherUser || conversation.participants[0];
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between z-10">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Archived Conversations</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {conversations?.length || 0} archived conversation{conversations?.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand dark:border-brand-light mb-4" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading archived conversations...</p>
            </div>
          ) : !conversations || conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ArchiveRestore className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No archived conversations
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                Conversations you archive will appear here. You can unarchive them anytime.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conversation) => {
                const otherUser = getOtherParticipant(conversation);
                const lastMessage = conversation.lastMessage;
                const isUnarchivingConv = isUnarchiving[conversation._id];

                return (
                  <div
                    key={conversation._id}
                    className="group p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={otherUser?.avatar}
                        alt={otherUser?.name || 'User'}
                        className="w-12 h-12 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {otherUser?.name || 'Unknown User'}
                          </h4>
                          {conversation.lastMessageAt && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                              {formatDistanceToNow(new Date(conversation.lastMessageAt), { addSuffix: true })}
                            </span>
                          )}
                        </div>
                        {lastMessage?.content && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {lastMessage.content}
                          </p>
                        )}
                        {conversation.metadata?.jobTitle && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {conversation.metadata.jobTitle}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleUnarchive(conversation._id)}
                        disabled={isUnarchivingConv}
                        className={cn(
                          "p-2 rounded-lg transition-colors flex-shrink-0",
                          "hover:bg-brand-light/20 dark:hover:bg-brand-dark/20",
                          "text-brand dark:text-brand-light",
                          isUnarchivingConv && "opacity-50 cursor-not-allowed"
                        )}
                        title="Unarchive conversation"
                      >
                        {isUnarchivingConv ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand dark:border-brand-light" />
                        ) : (
                          <ArchiveRestore className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

