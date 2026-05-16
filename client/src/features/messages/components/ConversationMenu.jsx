import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  MoreVertical, 
  Pin, 
  PinOff, 
  Archive, 
  ArchiveRestore, 
  Bell, 
  BellOff, 
  Trash2
} from 'lucide-react';
import {
  usePinConversation,
  useUnpinConversation,
  useArchiveConversation,
  useUnarchiveConversation,
  useMuteConversation,
  useUnmuteConversation,
  useDeleteConversation,
} from '../../../hooks/api/useMessages';

export const ConversationMenu = ({ conversation, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const currentUserId = user ? String(user._id || user.id || '') : '';

  const pinMutation = usePinConversation();
  const unpinMutation = useUnpinConversation();
  const archiveMutation = useArchiveConversation();
  const unarchiveMutation = useUnarchiveConversation();
  const muteMutation = useMuteConversation();
  const unmuteMutation = useUnmuteConversation();
  const deleteMutation = useDeleteConversation();

  // Check if conversation is pinned, archived, or muted by current user
  const isPinned = conversation?.pinnedBy?.some(
    (id) => String(id) === currentUserId || (typeof id === 'object' && String(id._id || id.id) === currentUserId)
  );
  const isArchived = conversation?.archivedBy?.some(
    (id) => String(id) === currentUserId || (typeof id === 'object' && String(id._id || id.id) === currentUserId)
  );
  const isMuted = conversation?.mutedBy?.some(
    (id) => String(id) === currentUserId || (typeof id === 'object' && String(id._id || id.id) === currentUserId)
  );

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
        if (onClose) onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const handlePin = async () => {
    try {
      if (isPinned) {
        await unpinMutation.mutateAsync(conversation._id);
      } else {
        await pinMutation.mutateAsync(conversation._id);
      }
      setIsOpen(false);
      if (onClose) onClose();
    } catch (error) {
      // Error toast is handled by the mutation
    }
  };

  const handleArchive = async () => {
    try {
      if (isArchived) {
        await unarchiveMutation.mutateAsync(conversation._id);
      } else {
        await archiveMutation.mutateAsync(conversation._id);
      }
      setIsOpen(false);
      if (onClose) onClose();
    } catch (error) {
      // Error toast is handled by the mutation
    }
  };

  const handleMute = async () => {
    try {
      if (isMuted) {
        await unmuteMutation.mutateAsync(conversation._id);
      } else {
        await muteMutation.mutateAsync(conversation._id);
      }
      setIsOpen(false);
      if (onClose) onClose();
    } catch (error) {
      // Error toast is handled by the mutation
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      return;
    }
    try {
      await deleteMutation.mutateAsync(conversation._id);
      setIsOpen(false);
      if (onClose) onClose();
    } catch (error) {
      // Error toast is handled by the mutation
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        aria-label="Conversation options"
      >
        <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-[100] overflow-hidden">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePin();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {isPinned ? (
              <>
                <PinOff className="w-4 h-4" />
                <span>Unpin</span>
              </>
            ) : (
              <>
                <Pin className="w-4 h-4" />
                <span>Pin</span>
              </>
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleArchive();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {isArchived ? (
              <>
                <ArchiveRestore className="w-4 h-4" />
                <span>Unarchive</span>
              </>
            ) : (
              <>
                <Archive className="w-4 h-4" />
                <span>Archive</span>
              </>
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMute();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {isMuted ? (
              <>
                <Bell className="w-4 h-4" />
                <span>Unmute</span>
              </>
            ) : (
              <>
                <BellOff className="w-4 h-4" />
                <span>Mute</span>
              </>
            )}
          </button>

          <div className="border-t border-gray-200 dark:border-gray-700 my-1" />

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

