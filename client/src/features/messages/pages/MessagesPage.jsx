import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ConversationList } from '../components/ConversationList';
import { ChatArea } from '../components/ChatArea';
import { ActivityTimeline } from '../components/ActivityTimeline';
import { ConversationFilter } from '../components/ConversationFilter';
import { MessageSettings } from '../components/MessageSettings';
import { ArchivedConversationsModal } from '../components/ArchivedConversationsModal';
import { useConversations, useConversation } from '../../../hooks/api/useMessages';
import { useSelector } from 'react-redux';
import { Clock, X } from 'lucide-react';

export const MessagesPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showActivityTimeline, setShowActivityTimeline] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [filters, setFilters] = useState({ show: null });
  
  // Fetch archived conversations - use separate query with includeArchived: true
  // This creates a separate cache entry from the regular conversations query
  // Only fetch when modal is open or about to open
  const { data: archivedConversationsData, refetch: refetchArchived, isLoading: isLoadingArchived } = useConversations({
    includeArchived: true
  });
  
  // Refetch archived conversations when modal opens
  useEffect(() => {
    if (showArchived) {
      // Refetch to ensure we have the latest archived conversations
      refetchArchived();
    }
  }, [showArchived, refetchArchived]);
  
  // Backend now filters to only archived conversations when includeArchived: true
  const archivedConversations = useMemo(() => {
    console.log('[MessagesPage] Archived conversations data:', archivedConversationsData);
    console.log('[MessagesPage] Archived conversations raw:', archivedConversationsData?.data?.conversations);
    
    if (!archivedConversationsData?.data?.conversations) {
      console.log('[MessagesPage] No archived conversations data');
      return [];
    }
    
    // Backend should return only archived conversations, use them directly
    const conversations = archivedConversationsData.data.conversations || [];
    console.log('[MessagesPage] Processed archived conversations count:', conversations.length);
    
    return conversations;
  }, [archivedConversationsData]);

  const { data: conversationsData, isLoading, refetch: refetchConversations } = useConversations({
    includeArchived: filters.show === 'archived'
  });
  const conversationsList = conversationsData?.data?.conversations || [];
  
  // Fetch specific conversation if we have an ID in URL
  const { data: specificConvData } = useConversation(conversationId);
  const specificConversation = specificConvData?.data?.conversation;

  // Merge conversations list with specific conversation, filter, and sort (pinned first)
  const conversations = useMemo(() => {
    let list = conversationsList.map(conv => ({
      ...conv,
      currentUserId: user?._id
    }));
    
    // If we have a specific conversation that's not in the list, add it
    if (specificConversation && !list.find(c => c._id === specificConversation._id)) {
      list.unshift({ ...specificConversation, currentUserId: user?._id });
    }
    
    // Apply filters
    const currentUserIdStr = user?._id ? String(user._id) : '';
    const normalizeId = (id) => {
      if (!id) return '';
      if (typeof id === 'string') return id;
      if (typeof id === 'object') return String(id._id || id.id || '');
      return String(id);
    };
    
    if (filters.show) {
      list = list.filter(conv => {
        const isPinned = conv?.pinnedBy?.some(
          (id) => normalizeId(id) === currentUserIdStr
        ) || false;
        const isArchived = conv?.archivedBy?.some(
          (id) => normalizeId(id) === currentUserIdStr
        ) || false;
        const unreadCount = conv?.unreadCount || 0;
        
        switch (filters.show) {
          case 'unread':
            return unreadCount > 0;
          case 'pinned':
            return isPinned;
          case 'archived':
            return isArchived;
          default:
            return true;
        }
      });
    }
    
    // Sort: pinned conversations first, then by lastMessageAt
    return list.sort((a, b) => {
      const aPinned = a?.pinnedBy?.some(
        (id) => normalizeId(id) === currentUserIdStr
      ) || false;
      const bPinned = b?.pinnedBy?.some(
        (id) => normalizeId(id) === currentUserIdStr
      ) || false;
      
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      
      const aDate = new Date(a.lastMessageAt || 0);
      const bDate = new Date(b.lastMessageAt || 0);
      return bDate.getTime() - aDate.getTime();
    });
  }, [conversationsList, specificConversation, user?._id, filters]);

  // Set selected conversation from URL or first in list
  useEffect(() => {
    if (conversationId) {
      const conv = conversations.find((c) => c._id === conversationId);
      if (conv) {
        setSelectedConversation(conv);
      }
    } else if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0]);
      navigate(`/messages/${conversations[0]._id}`, { replace: true });
    }
  }, [conversationId, conversations, selectedConversation, navigate]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    navigate(`/messages/${conversation._id}`);
  };

  const handleViewProposal = () => {
    if (!selectedConversation) return;
    
    // Navigate to contract if available
    if (selectedConversation.contract) {
      const contractId = typeof selectedConversation.contract === 'object' 
        ? selectedConversation.contract._id 
        : selectedConversation.contract;
      navigate(`/contracts/${contractId}`);
      return;
    }
    
    // Navigate to proposal based on user role
    if (selectedConversation.proposal) {
      const proposalId = typeof selectedConversation.proposal === 'object' 
        ? selectedConversation.proposal._id 
        : selectedConversation.proposal;
      
      // Determine route based on user role
      const userRole = user?.role;
      if (userRole === 'freelancer') {
        navigate(`/freelancer/proposals/${proposalId}`);
      } else if (userRole === 'client') {
        navigate(`/client/proposals/${proposalId}`);
      } else {
        // Fallback to freelancer route if role is unclear
        navigate(`/freelancer/proposals/${proposalId}`);
      }
    }
  };

  const handleBackToList = () => {
    navigate('/messages');
    setSelectedConversation(null);
  };

  return (
    <div className={`fixed inset-0 bg-white dark:bg-gray-950 ${conversationId ? 'pt- md:pt-20 lg:pt-24' : 'pt- md:pt-20 lg:pt-24'}`}>
      {/* Main messaging container */}
      <div className="h-full w-full flex overflow-hidden md:gap-4 lg:gap-6">
        {/* Conversations Sidebar - collapsible on medium screens */}
        <div className={`${isSidebarOpen ? '' : 'md:hidden'} ${
          conversationId ? 'hidden md:flex' : 'flex'
        } w-full md:w-72 lg:w-96 flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-full md:rounded-r-lg`}>
          <ConversationList
            conversations={conversations}
            selectedId={selectedConversation?._id}
            onSelect={handleSelectConversation}
            isLoading={isLoading}
            onShowFilter={() => setShowFilter(true)}
            onShowSettings={() => setShowSettings(true)}
            onViewArchived={() => setShowArchived(true)}
          />
        </div>

        {/* Chat Area - Full width on mobile when conversation selected */}
        <div className={`${
          conversationId ? 'flex' : 'hidden md:flex'
        } flex-1 bg-white dark:bg-gray-950 h-full overflow-hidden min-w-0 relative md:rounded-l-lg`}>
          <ChatArea
            conversation={selectedConversation}
            onViewProposal={handleViewProposal}
            onBackToList={handleBackToList}
            onToggleSidebar={() => setIsSidebarOpen((s) => !s)}
            isSidebarOpen={isSidebarOpen}
          />
          
          {/* Mobile: Toggle Button - Positioned in chat area header to avoid send button */}
          {selectedConversation && (
            <button
              onClick={() => setShowActivityTimeline(!showActivityTimeline)}
              className="xl:hidden absolute top-16 right-4 z-40 bg-brand hover:bg-brand-dark text-white p-2.5 rounded-lg shadow-lg flex items-center justify-center transition-all"
              aria-label="Toggle Activity Timeline"
            >
              <Clock className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Activity Timeline - Desktop: always visible on xl+, Mobile: toggleable overlay */}
        {selectedConversation && (
          <>
            {/* Desktop: Sidebar */}
            <div className="hidden xl:flex h-full">
              <ActivityTimeline conversation={selectedConversation} />
            </div>

            {/* Mobile: Activity Timeline Overlay */}
            {showActivityTimeline && (
              <div className="xl:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setShowActivityTimeline(false)}>
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl max-h-[80vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between z-10">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Activity Timeline</h3>
                    <button
                      onClick={() => setShowActivityTimeline(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                  <div className="p-4">
                    <ActivityTimeline conversation={selectedConversation} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Filter Modal */}
      <ConversationFilter
        isOpen={showFilter}
        onClose={() => setShowFilter(false)}
        filters={filters}
        onFilterChange={setFilters}
      />

      {/* Settings Modal */}
      <MessageSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      {/* Archived Conversations Modal */}
      <ArchivedConversationsModal
        isOpen={showArchived}
        onClose={() => setShowArchived(false)}
        conversations={archivedConversations}
        currentUserId={user?._id}
        onUnarchive={refetchArchived}
        isLoading={isLoadingArchived}
      />
    </div>
  );
};

export default MessagesPage;
