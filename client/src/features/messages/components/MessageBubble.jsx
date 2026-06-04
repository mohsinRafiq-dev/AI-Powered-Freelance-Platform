import { useState } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { MoreVertical, Edit2, Trash2, Reply, Star, CornerUpLeft, Check, CheckCheck, MessageSquare } from 'lucide-react';
import { Avatar } from '../../../components/ui/Avatar';
import { cn } from '../../../lib/utils';

export const MessageBubble = ({
  message,
  sender,
  isOwn,
  showAvatar = true,
  onEdit,
  onDelete,
  onReply,
  onOpenThread,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const { user: currentUser } = useSelector((state) => state.auth);

  const formatMessageTime = (date) => {
    return format(new Date(date), 'h:mm a');
  };

  const handleDownload = (attachment) => {
    window.open(attachment.fileUrl, '_blank');
  };

  const currentUserId = currentUser?._id || currentUser?.id;
  const isReadByOther = message.readBy?.some((r) => {
    const readerId = r.user?._id || r.user;
    return readerId && currentUserId && String(readerId) !== String(currentUserId);
  });

  const bubbleBase = 'inline-block rounded-2xl px-4 py-2 text-sm break-words max-w-[85%]';
  const incomingBubble = `${bubbleBase} bg-gray-800 text-gray-100 border border-gray-700 shadow-sm`;
  const outgoingBubble = `${bubbleBase} bg-brand hover:bg-brand-dark text-white shadow-lg`;

  return (
    <div className={cn('group transition-colors px-4 md:px-6 py-2')}> 
      <div className={cn('flex gap-3', isOwn && "") }>
        {/* Avatar */}
        {showAvatar ? (
          <div className="relative flex-shrink-0">
            <Avatar
              src={(isOwn ? (currentUser?.avatar) : (sender?.avatar || message.sender?.avatar))}
              alt={(isOwn ? (currentUser?.name) : (sender?.name || message.sender?.name))}
              className="w-9 h-9"
            />
            <div className="absolute bottom-0 right0 w-2.5 h-2.5 bg-brand border-2 border-white dark:border-gray-950 rounded-full"></div>
          </div>
        ) : (
          <div className="w-9 flex-shrink-0" />
        )}

        <div className="flex-1 min-w-0">
          {/* Sender name and time - inline */}
          {showAvatar && (
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {isOwn ? (currentUser?.name) : (sender?.name || message.sender?.name)}
              </span>
            </div>
          )}

          {/* Message content */}
          <div className="relative">
            <div className={isOwn ? outgoingBubble : incomingBubble}>
              <div className="text-sm break-words">
              {message.isDeleted ? (
                <p className="italic text-gray-500 dark:text-gray-400">This message has been deleted</p>
              ) : (
                <>
                  {/* Reply to message */}
                  {message.replyTo && (
                    <div className="mb-2 p-2 pl-3 bg-gray-100 dark:bg-gray-800 rounded border-l-2 border-gray-400 dark:border-gray-600">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Replying to {message.replyTo.sender?.name}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{message.replyTo.content}</p>
                    </div>
                  )}

                  {/* Message text */}
                  <div className="flex flex-col">
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>

                  {/* Attachments */}
                  {message.attachments?.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map((attachment, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleDownload(attachment)}
                          className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors w-full text-left"
                        >
                          {attachment.fileType?.startsWith('image/') ? (
                            <img
                              src={attachment.fileUrl}
                              alt={attachment.fileName}
                              className="max-w-full max-h-64 rounded"
                            />
                          ) : (
                            <>
                              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                              <span className="text-xs font-bold">
                                {attachment.fileName?.split('.').pop()?.toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm truncate">{attachment.fileName}</p>
                              <p className="text-xs opacity-60">
                                {(attachment.fileSize / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                  {/* Embeds: prefer explicit embeds, otherwise infer Loom links from content */}
                  {(() => {
                    const explicit = message.embeds || [];
                    let embedsToShow = explicit;

                    if ((!explicit || explicit.length === 0) && typeof message.content === 'string') {
                      const match = message.content.match(/loom\.com\/share\/([a-zA-Z0-9_-]+)/i);
                      if (match) {
                        embedsToShow = [{ type: 'loom', url: `https://www.loom.com/embed/${match[1]}`, title: 'Loom Video' }];
                      }
                    }

                    if (!embedsToShow || embedsToShow.length === 0) return null;

                    return (
                      <div className="mt-2 space-y-2">
                        {embedsToShow.map((embed, idx) => (
                          <div key={idx} className="rounded-lg overflow-hidden">
                            {embed.type === 'loom' && (
                              <iframe
                                src={embed.url}
                                width="100%"
                                height="315"
                                frameBorder="0"
                                allow="autoplay; fullscreen"
                                allowFullScreen
                                className="rounded"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })()}

                  {/* Thread reply count indicator */}
                  {message.replyCount > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenThread?.(message);
                      }}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 dark:bg-gray-700/50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <MessageSquare className="w-3 h-3" />
                      {message.replyCount} {message.replyCount === 1 ? 'reply' : 'replies'} · View thread
                    </button>
                  )}

                  {/* Time and Read Receipts */}
                  <div className="flex justify-end items-center gap-1 mt-1 -mb-1 -mr-1">
                    {message.isEdited && (
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 mr-1">(edited)</span>
                    )}
                    <span className="text-[10px] opacity-70">
                      {formatMessageTime(message.createdAt)}
                    </span>
                    {isOwn && (
                      isReadByOther ? (
                        <CheckCheck className="w-3.5 h-3.5 text-blue-200" />
                      ) : (
                        <Check className="w-3.5 h-3.5 opacity-70" />
                      )
                    )}
                  </div>
                </>
                )}
              </div>

            {/* Hover action buttons */}
            {!message.isDeleted && (
              <div className="absolute -top-3 right-0 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <div className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-1">
                  <button
                    onClick={() => onReply?.(message)}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    title="Reply"
                  >
                    <CornerUpLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    title="Star message"
                  >
                    <Star className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  {isOwn && !message.isDeleted && (
                    <button
                      onClick={() => onEdit?.(message)}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  )}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(!showMenu);
                      }}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      title="More options"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    
                    {/* Dropdown menu for more options */}
                    {showMenu && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setShowMenu(false)}
                        />
                        <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenThread?.(message);
                              setShowMenu(false);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 rounded-t-lg"
                          >
                            <MessageSquare className="w-4 h-4" />
                            Open in thread
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete?.(message);
                              setShowMenu(false);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 rounded-b-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete message
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};
