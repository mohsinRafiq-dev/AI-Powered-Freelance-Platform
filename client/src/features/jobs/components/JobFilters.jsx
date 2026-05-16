

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, RotateCcw, ChevronDown } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

const CATEGORIES = [
  { label: 'Web Development', value: 'web-development' },
  { label: 'Mobile Development', value: 'mobile-development' },
  { label: 'Design', value: 'design' },
  { label: 'Writing', value: 'writing' },
  { label: 'Digital Marketing', value: 'marketing' },
  { label: 'Video Editing', value: 'video-editing' },
  { label: 'Data Entry', value: 'data-entry' },
  { label: 'Customer Service', value: 'customer-service' },
  { label: 'Virtual Assistant', value: 'virtual-assistant' },
  { label: 'Other', value: 'other' }
];

const EXPERIENCE_LEVELS = ['entry', 'intermediate', 'expert'];
const LOCATION_TYPES = ['remote', 'onsite', 'hybrid'];
const DURATIONS = ['less-than-1-month', '1-3-months', '3-6-months', '6-months-plus'];
const PROJECT_SIZES = ['small', 'medium', 'large'];

export const JobFilters = ({ filters, updateFilter, resetFilters, activeFilterCount, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);

  // Helper function to handle filter updates with proper value checking
  const handleFilterUpdate = (key, value) => {
    // Convert empty strings to empty string (will be filtered out by useJobFilters)
    updateFilter(key, value === null || value === undefined ? '' : value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg sticky top-28 overflow-hidden flex flex-col"
      style={{ maxHeight: 'calc(100vh - 8rem)' }}
    >
      {/* Header with Dropdown Toggle */}
      <div className="p-6 pb-4 flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-brand" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Filters
            </h3>
            {activeFilterCount > 0 && (
              <Badge className="bg-brand text-white ml-1">
                {activeFilterCount}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <ChevronDown
                className={`w-5 h-5 text-gray-700 dark:text-gray-300 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-xs text-brand hover:text-brand-dark dark:text-brand-light dark:hover:text-brand flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset All Filters
          </button>
        )}

        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          </button>
        )}
      </div>

      {/* Collapsible Filter Content with Scroll */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-y-auto overflow-x-hidden flex-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
          >
            <div className="px-6 pb-6 space-y-6">
              {/* Budget Type */}
              <div>
                <label className="text-sm font-semibold text-gray-900 dark:text-white mb-3 block">
                  Budget Type
                </label>
                <div className="flex gap-2">
                  {['fixed', 'hourly'].map((type) => (
                    <button
                      key={type}
                      onClick={() => handleFilterUpdate('budgetType', filters.budgetType === type ? '' : type)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        filters.budgetType === type
                          ? 'bg-brand text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Range */}
              <div>
                <label className="text-sm font-semibold text-gray-900 dark:text-white mb-3 block">
                  Budget Range ($)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minBudget || ''}
                    onChange={(e) => handleFilterUpdate('minBudget', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-brand dark:focus:border-brand-light transition-colors placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxBudget || ''}
                    onChange={(e) => handleFilterUpdate('maxBudget', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-brand dark:focus:border-brand-light transition-colors placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-semibold text-gray-900 dark:text-white mb-3 block">
                  Category
                </label>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <label key={cat.value} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === cat.value}
                        onChange={() => handleFilterUpdate('category', filters.category === cat.value ? '' : cat.value)}
                        className="w-4 h-4 text-brand focus:ring-brand border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-brand dark:group-hover:text-brand-light transition-colors">
                        {cat.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="text-sm font-semibold text-gray-900 dark:text-white mb-3 block">
                  Experience Level
                </label>
                <div className="space-y-2">
                  {EXPERIENCE_LEVELS.map((level) => (
                    <label key={level} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="experienceLevel"
                        checked={filters.experienceLevel === level}
                        onChange={() => handleFilterUpdate('experienceLevel', filters.experienceLevel === level ? '' : level)}
                        className="w-4 h-4 text-brand focus:ring-brand border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 capitalize group-hover:text-brand dark:group-hover:text-brand-light transition-colors">
                        {level}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Type */}
              <div>
                <label className="text-sm font-semibold text-gray-900 dark:text-white mb-3 block">
                  Location Type
                </label>
                <div className="space-y-2">
                  {LOCATION_TYPES.map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="locationType"
                        checked={filters.locationType === type}
                        onChange={() => handleFilterUpdate('locationType', filters.locationType === type ? '' : type)}
                        className="w-4 h-4 text-brand focus:ring-brand border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 capitalize group-hover:text-brand dark:group-hover:text-brand-light transition-colors">
                        {type}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Project Duration */}
              <div>
                <label className="text-sm font-semibold text-gray-900 dark:text-white mb-3 block">
                  Duration
                </label>
                <div className="space-y-2">
                  {DURATIONS.map((duration) => (
                    <label key={duration} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="duration"
                        checked={filters.duration === duration}
                        onChange={() => handleFilterUpdate('duration', filters.duration === duration ? '' : duration)}
                        className="w-4 h-4 text-brand focus:ring-brand border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-brand dark:group-hover:text-brand-light transition-colors">
                        {duration.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Project Size */}
              <div>
                <label className="text-sm font-semibold text-gray-900 dark:text-white mb-3 block">
                  Project Size
                </label>
                <div className="space-y-2">
                  {PROJECT_SIZES.map((size) => (
                    <label key={size} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="projectSize"
                        checked={filters.projectSize === size}
                        onChange={() => handleFilterUpdate('projectSize', filters.projectSize === size ? '' : size)}
                        className="w-4 h-4 text-brand focus:ring-brand border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 capitalize group-hover:text-brand dark:group-hover:text-brand-light transition-colors">
                        {size}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Apply Filters Button (Mobile) */}
              {onClose && (
                <Button
                  onClick={onClose}
                  className="w-full lg:hidden bg-gradient-to-r from-brand to-brand-dark text-white hover:from-brand-dark hover:to-brand-deeper mt-4"
                >
                  Apply Filters
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
