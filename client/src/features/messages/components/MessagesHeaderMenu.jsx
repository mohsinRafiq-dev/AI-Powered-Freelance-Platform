import { useState, useRef, useEffect } from 'react';
import { 
  MoreVertical, 
  Archive,
  Settings,
  Filter
} from 'lucide-react';

export const MessagesHeaderMenu = ({ onViewArchived, onShowFilter, onShowSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        aria-label="Messages options"
      >
        <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-[100] overflow-hidden">
          {onViewArchived && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewArchived();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Archive className="w-4 h-4" />
              <span>View Archived</span>
            </button>
          )}
          
          {onShowFilter && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                onShowFilter();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          )}

          <div className="border-t border-gray-200 dark:border-gray-700 my-1" />

          {onShowSettings && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                onShowSettings();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

