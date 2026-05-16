import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { cn } from '../../../lib/utils';

export const ConversationFilter = ({ isOpen, onClose, filters, onFilterChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Filter Conversations</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
              Show
            </label>
            <div className="space-y-2">
              <button
                onClick={() => onFilterChange({ ...filters, show: filters.show === 'all' ? null : 'all' })}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-2.5 rounded-lg border transition-colors',
                  filters.show === 'all'
                    ? 'bg-brand-light/30 dark:bg-brand-dark/20 border-brand text-brand-dark dark:text-brand-light'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
              >
                <span>All conversations</span>
                {filters.show === 'all' && <Check className="w-4 h-4" />}
              </button>

              <button
                onClick={() => onFilterChange({ ...filters, show: filters.show === 'unread' ? null : 'unread' })}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-2.5 rounded-lg border transition-colors',
                  filters.show === 'unread'
                    ? 'bg-brand-light/30 dark:bg-brand-dark/20 border-brand text-brand-dark dark:text-brand-light'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
              >
                <span>Unread only</span>
                {filters.show === 'unread' && <Check className="w-4 h-4" />}
              </button>

              <button
                onClick={() => onFilterChange({ ...filters, show: filters.show === 'pinned' ? null : 'pinned' })}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-2.5 rounded-lg border transition-colors',
                  filters.show === 'pinned'
                    ? 'bg-brand-light/30 dark:bg-brand-dark/20 border-brand text-brand-dark dark:text-brand-light'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
              >
                <span>Pinned only</span>
                {filters.show === 'pinned' && <Check className="w-4 h-4" />}
              </button>

              <button
                onClick={() => onFilterChange({ ...filters, show: filters.show === 'archived' ? null : 'archived' })}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-2.5 rounded-lg border transition-colors',
                  filters.show === 'archived'
                    ? 'bg-brand-light/30 dark:bg-brand-dark/20 border-brand text-brand-dark dark:text-brand-light'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
              >
                <span>Archived</span>
                {filters.show === 'archived' && <Check className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <button
              onClick={() => {
                onFilterChange({ show: null });
                onClose();
              }}
              className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

