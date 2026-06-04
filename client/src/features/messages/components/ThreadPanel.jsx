import React, { useEffect, useRef, useState } from 'react';
import { X, MessageSquare, Send } from 'lucide-react';
import { format } from 'date-fns';
import axiosInstance from '@/api/axiosInstance';
import { Avatar } from '../../../components/ui/Avatar';
import { Button } from '../../../components/ui/button';
import { InlineLoader } from '../../../components/common/Loader';

/**
 * Side panel showing a single thread (root message + all its replies).
 * Used for both manual "open in thread" actions and milestone-scoped threads.
 *
 * Props:
 *  - conversationId
 *  - rootMessage         (when opening an existing thread)
 *  - milestoneId         (when opening a per-milestone task thread; rootMessage optional)
 *  - milestoneTitle      (display name when in milestone mode)
 *  - onClose
 *  - onReply(content)    (parent posts the reply through its own send pipeline so that
 *                         socket emits + optimistic updates stay consistent)
 */
const ThreadPanel = ({
  conversationId,
  rootMessage,
  milestoneId,
  milestoneTitle,
  onClose,
  onReply,
}) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  const isMilestoneMode = !!milestoneId && !rootMessage;

  const fetchThread = async () => {
    setLoading(true);
    try {
      let url;
      if (isMilestoneMode) {
        url = `/messages/conversations/${conversationId}/milestones/${milestoneId}/messages`;
      } else {
        const rootId = rootMessage?._id;
        url = `/messages/conversations/${conversationId}/threads/${rootId}`;
      }
      const res = await axiosInstance.get(url);
      const list = res?.data?.data?.messages || res?.data?.messages || [];
      setMessages(list);
    } catch (err) {
      console.error('Failed to load thread', err);
    } finally {
      setLoading(false);
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }, 50);
    }
  };

  useEffect(() => { fetchThread(); /* eslint-disable-next-line */ }, [conversationId, rootMessage?._id, milestoneId]);

  const handleSend = async () => {
    if (!draft.trim()) return;
    setSending(true);
    try {
      if (onReply) {
        await onReply({
          content: draft,
          replyTo: rootMessage?._id,
          threadId: rootMessage?._id || rootMessage?.threadId,
          milestoneId,
        });
      } else {
        // Fallback: post directly if parent did not supply a handler
        const fd = new FormData();
        fd.append('content', draft);
        if (rootMessage?._id) fd.append('replyTo', rootMessage._id);
        if (rootMessage?._id) fd.append('threadId', rootMessage._id);
        if (milestoneId) fd.append('milestoneId', milestoneId);
        await axiosInstance.post(`/messages/conversations/${conversationId}/messages`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      setDraft('');
      fetchThread();
    } finally {
      setSending(false);
    }
  };

  return (
    <aside className="w-full md:w-[420px] flex-shrink-0 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col h-full">
      <header className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-brand" />
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {isMilestoneMode ? `Task thread${milestoneTitle ? ` · ${milestoneTitle}` : ''}` : 'Thread'}
            </h3>
            <p className="text-xs text-gray-500">
              {messages.length} {messages.length === 1 ? 'message' : 'messages'}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
          <X className="w-4 h-4" />
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <InlineLoader text="Loading thread" />
        ) : messages.length === 0 ? (
          <div className="text-center py-12 text-sm text-gray-500">
            No messages in this thread yet. Be the first to reply.
          </div>
        ) : (
          messages.map((m) => (
            <ThreadMessage key={m._id} message={m} />
          ))
        )}
      </div>

      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={isMilestoneMode ? 'Reply in this task thread...' : 'Reply in thread...'}
            rows={2}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="flex-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm resize-none"
          />
          <Button onClick={handleSend} disabled={sending || !draft.trim()} size="sm">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
};

const ThreadMessage = ({ message }) => (
  <div className="flex gap-2">
    <Avatar src={message.sender?.avatar} alt={message.sender?.name} className="w-7 h-7 flex-shrink-0" />
    <div className="flex-1 min-w-0">
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-semibold text-gray-900 dark:text-white">{message.sender?.name}</span>
        <span className="text-[10px] text-gray-500">{format(new Date(message.createdAt), 'MMM d, h:mm a')}</span>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap mt-0.5">{message.content}</p>
      {message.attachments?.length > 0 && (
        <div className="mt-1 space-y-1">
          {message.attachments.map((att, i) => (
            <a key={i} href={att.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-brand underline truncate block">
              {att.fileName}
            </a>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default ThreadPanel;
