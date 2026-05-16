import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, X, Settings, Check } from 'lucide-react';
import LoomIcon from '../../../components/icons/LoomIcon';
import { format } from 'date-fns';
import { Avatar } from '../../../components/ui/Avatar';
import { cn } from '../../../lib/utils';

// Common emojis
const EMOJI_LIST = [
  '😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘',
  '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒',
  '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡',
  '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '👏', '🙌', '👐',
  '🤝', '🙏', '✍️', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💔', '❣️', '💕', '💞', '💓', '💗', '💖',
  '🔥', '✨', '💫', '⭐', '🌟', '💥', '💯', '✔️', '✅', '❌', '⚠️', '🚀', '🎉', '🎊', '🎈', '🎁'
];

export const MessageComposer = ({ 
  onSend, 
  isLoading = false,
  replyTo,
  onCancelReply,
  editingMessage,
  onCancelEdit,
  onTyping,
  onStopTyping,
  isConnected = false
}) => {
  const [content, setContent] = useState('');
  
  // Update content when editingMessage changes
  useEffect(() => {
    if (editingMessage) {
      setContent(editingMessage.content || '');
      setEmbeds(editingMessage.embeds || []);
    } else {
      setContent('');
      setEmbeds([]);
    }
  }, [editingMessage]);
  const [files, setFiles] = useState([]);
  const [embeds, setEmbeds] = useState(editingMessage?.embeds || []);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLoomInput, setShowLoomInput] = useState(false);
  const [loomUrl, setLoomUrl] = useState('');
  const [sendOnEnter, setSendOnEnter] = useState(true);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const settingsRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!content.trim() && files.length === 0 && embeds.length === 0) return;

    // Stop typing indicator
    if (onStopTyping) {
      onStopTyping();
    }

    onSend({ content: content.trim(), files, embeds });
    setContent('');
    setFiles([]);
    setEmbeds([]);
  };

  // Handle typing with debounce
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);

    // Emit typing event
    if (isConnected && onTyping && newContent.trim()) {
      onTyping();

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        if (onStopTyping) {
          onStopTyping();
        }
      }, 2000);
    }
  };

  // Cleanup typing timeout
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (onStopTyping) {
        onStopTyping();
      }
    };
  }, [onStopTyping]);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length + files.length > 5) {
      alert('Maximum 5 files allowed');
      return;
    }
    setFiles([...files, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleLoomEmbed = () => {
    console.log('🎥 [MessageComposer] handleLoomEmbed called with URL:', loomUrl);
    const match = loomUrl.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);
    if (!match) {
      console.log('❌ [MessageComposer] Invalid Loom URL');
      alert("Invalid Loom URL");
      return;
    }
    const embedUrl = `https://www.loom.com/embed/${match[1]}`;
    console.log('✅ [MessageComposer] Converted to embed URL:', embedUrl);
    setEmbeds([...embeds, { type: 'loom', url: embedUrl, title: 'Loom Video' }]);
    console.log('📎 [MessageComposer] Current embeds:', [...embeds, { type: 'loom', url: embedUrl, title: 'Loom Video' }]);
    setLoomUrl('');
    setShowLoomInput(false);
  };

  const removeEmbed = (index) => {
    setEmbeds(embeds.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && sendOnEnter) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setContent(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const formatDateTime = (date) => {
    if (!date) return '';
    return format(new Date(date), 'MMM d, yyyy | h:mm a');
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load send preference from localStorage
  useEffect(() => {
    const savedPreference = localStorage.getItem('messageSendOnEnter');
    if (savedPreference !== null) {
      setSendOnEnter(savedPreference === 'true');
    }
  }, []);

  // Save send preference to localStorage
  const toggleSendOnEnter = (value) => {
    setSendOnEnter(value);
    localStorage.setItem('messageSendOnEnter', value.toString());
  };

  return (
    <div className="sticky bottom-0 z-20 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 md:p-4 pb-4 md:pb-6" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))' }}>
      {/* Reply indicator with message preview */}
      {replyTo && (
        <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-3">
            <Avatar
              src={replyTo.sender?.avatar}
              alt={replyTo.sender?.name}
              className="w-8 h-8 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {replyTo.sender?.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDateTime(replyTo.createdAt)}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                {replyTo.content}
              </p>
            </div>
            <button
              onClick={onCancelReply}
              className="flex-shrink-0 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
      )}

      {/* Edit indicator */}
      {editingMessage && (
        <div className="mb-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center justify-between">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
              Editing message
            </p>
            <button
              onClick={onCancelEdit}
              className="p-1 hover:bg-yellow-100 dark:hover:bg-yellow-800/30 rounded transition-colors"
            >
              <X className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            </button>
          </div>
        </div>
      )}

      {/* File previews */}
      {files.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="relative group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 pr-8 max-w-xs"
            >
              <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{file.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {(file.size / 1024).toFixed(1)} KB
              </p>
              <button
                onClick={() => removeFile(index)}
                className="absolute top-2 right-2 p-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
              >
                <X className="w-3 h-3 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Embed previews */}
      {embeds.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {embeds.map((embed, index) => (
            <div
              key={index}
              className="relative group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 pr-8 max-w-xs"
            >
              <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{embed.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">{embed.type}</p>
              <button
                onClick={() => removeEmbed(index)}
                className="absolute top-2 right-2 p-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
              >
                <X className="w-3 h-3 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input area */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        {/* Left side buttons */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-gray-600 dark:text-gray-400"
          disabled={isLoading}
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Loom embed button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLoomInput(!showLoomInput)}
            className={cn(
              "p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400",
              showLoomInput && "bg-gray-100 dark:bg-gray-800 text-purple-600 dark:text-purple-400"
            )}
            aria-pressed={showLoomInput}
            aria-label="Embed Loom video"
            disabled={isLoading}
          >
            {/* Inline Loom icon for crisp styling */}
            <LoomIcon className="w-5 h-5" />
          </button>

          {showLoomInput && (
            <div className="absolute bottom-full left-0 mb-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 p-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Embed Loom Video</h3>
              <input
                type="text"
                placeholder="Paste Loom share link"
                value={loomUrl}
                onChange={(e) => setLoomUrl(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm mb-2"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleLoomEmbed}
                  className="px-3 py-1 bg-brand text-white rounded text-sm hover:bg-brand-dark"
                >
                  Embed
                </button>
                <button
                  onClick={() => setShowLoomInput(false)}
                  className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Text input */}
        <div className="flex-1">
          <input
            type="text"
            value={content}
            onChange={handleContentChange}
            onKeyPress={handleKeyPress}
            placeholder={isConnected ? "Send a message..." : "Connecting..."}
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand transition-all"
            disabled={!isConnected || isLoading}
          />
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-1">
          {/* Emoji Picker */}
          <div className="relative" ref={emojiPickerRef}>
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={cn(
                "p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-gray-600 dark:text-gray-400",
                showEmojiPicker && "bg-gray-100 dark:bg-gray-800"
              )}
            >
              <Smile className="w-5 h-5" />
            </button>

            {showEmojiPicker && (
              <div className="absolute bottom-full right-0 mb-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Emoji</h3>
                </div>
                <div className="p-3 max-h-64 overflow-y-auto">
                  <div className="grid grid-cols-8 gap-2">
                    {EMOJI_LIST.map((emoji, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleEmojiSelect(emoji)}
                        className="text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1 transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Settings Menu */}
          <div className="relative" ref={settingsRef}>
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className={cn(
                "p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-gray-600 dark:text-gray-400",
                showSettings && "bg-gray-100 dark:bg-gray-800"
              )}
            >
              <Settings className="w-5 h-5" />
            </button>

            {showSettings && (
              <div className="absolute bottom-full right-0 mb-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50">
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Pressing Enter key will always:
                  </h3>
                  
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => toggleSendOnEnter(true)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                        sendOnEnter 
                          ? "border-brand bg-brand" 
                          : "border-gray-300 dark:border-gray-600"
                      )}>
                        {sendOnEnter && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white font-medium">
                        Send message
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleSendOnEnter(false)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                        !sendOnEnter 
                          ? "border-brand bg-brand" 
                          : "border-gray-300 dark:border-gray-600"
                      )}>
                        {!sendOnEnter && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white font-medium">
                        Add a line break
                      </span>
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                    You can use Shift+Enter or Ctrl+Enter to type multi-line messages.
                  </p>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || (!content.trim() && files.length === 0 && embeds.length === 0)}
            className={cn(
              'p-2 rounded transition-all',
              content.trim() || files.length > 0 || embeds.length > 0
                ? 'text-brand dark:text-brand-light hover:bg-brand-light/20 dark:hover:bg-brand-dark/20'
                : 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
            )}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
