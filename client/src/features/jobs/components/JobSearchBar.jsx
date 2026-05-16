

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';

export const JobSearchBar = ({ value, onChange, placeholder = "Search jobs by title, skills, or keywords..." }) => {
  const [searchTerm, setSearchTerm] = useState(value || '');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, onChange]);

  const handleClear = () => {
    setSearchTerm('');
    onChange('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full"
    >
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-3 px-4 py-3">
          <Search className="w-5 h-5 text-brand flex-shrink-0" />
          
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none text-sm"
          />
          
          {searchTerm && (
            <button
              onClick={handleClear}
              className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Search hint */}
      {searchTerm && searchTerm.length < 3 && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 ml-2">
          Type at least 3 characters to search
        </p>
      )}
    </motion.div>
  );
};
