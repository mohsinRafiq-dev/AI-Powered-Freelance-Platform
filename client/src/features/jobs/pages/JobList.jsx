import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Grid, List, Inbox } from 'lucide-react';
import { useJobFilters } from '../hooks';
import { useJobs } from '@/hooks/api';
import { JobCard, JobFilters, JobSearchBar } from '../components';
import { Button } from '../../../components/ui/button';
import EmptyState from '../../dashboard/shared/EmptyState';
import { InlineLoader } from '../../../components/common/Loader';
import LazyLoadItem from '../../../components/common/LazyLoadItem';
import logger from '@/utils/logger';

export const JobList = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  
  const { filters, queryParams, updateFilter, updateFilters, resetFilters, activeFilterCount } = useJobFilters();
  const { data, isLoading, isError, error } = useJobs(queryParams);

  logger.debug('JobList queryParams:', queryParams);
  logger.debug('JobList data:', data);
  
  // paginatedResponse returns { success, data: [...jobs], pagination }
  const jobs = data?.data || [];
  const pagination = data?.pagination || {};
  
  logger.debug('JobList jobs count:', jobs.length);

  const handleSearch = (searchTerm) => {
    updateFilter('search', searchTerm);
  };

  const handlePageChange = (newPage) => {
    updateFilter('page', newPage, false); // Don't reset page when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 lg:pt-28 pb-24 md:pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Browse Jobs
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find the perfect project that matches your skills
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="mb-6">
          <JobSearchBar value={filters.search} onChange={handleSearch} />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden border-brand text-brand hover:bg-brand/10 dark:border-brand-light dark:text-brand-light dark:hover:bg-brand-light/10"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-brand text-white text-xs rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            {pagination?.total && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {pagination.total} jobs found
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-brand text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-brand text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Filters Sidebar - Desktop */}
          <div className={`hidden lg:block lg:w-80 flex-shrink-0`}>
            <JobFilters
              filters={filters}
              updateFilter={updateFilter}
              resetFilters={resetFilters}
              activeFilterCount={activeFilterCount}
            />
          </div>

          {/* Filters Sidebar - Mobile */}
          {showFilters && (
            <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setShowFilters(false)}>
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                className="absolute left-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-900 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <JobFilters
                  filters={filters}
                  updateFilter={updateFilter}
                  resetFilters={resetFilters}
                  activeFilterCount={activeFilterCount}
                  onClose={() => setShowFilters(false)}
                />
              </motion.div>
            </div>
          )}

          {/* Jobs Grid/List */}
          <div className="flex-1">
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <InlineLoader text="Loading Jobs" />
              </div>
            )}

            {isError && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 text-center rounded-xl shadow-lg">
                <p className="text-red-500 dark:text-red-400 mb-4">{error?.message || 'Failed to load jobs'}</p>
                <Button onClick={() => window.location.reload()} className="bg-brand hover:bg-brand-dark text-white">
                  Retry
                </Button>
              </div>
            )}

            {!isLoading && !isError && jobs.length === 0 && (
              <EmptyState
                title="No jobs found"
                message="Try adjusting your filters or search query"
                icon={Inbox}
                actionLabel={activeFilterCount > 0 ? 'Clear Filters' : undefined}
                onAction={activeFilterCount > 0 ? resetFilters : undefined}
              />
            )}

            {!isLoading && !isError && jobs.length > 0 && (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 xl:grid-cols-2 gap-6' : 'space-y-4'}>
                {jobs.map((job, index) => (
                  <LazyLoadItem 
                    key={job.id || job._id} 
                    threshold={0.1}
                    rootMargin="100px"
                    animateOnLoad={true}
                  >
                    <JobCard job={job} />
                  </LazyLoadItem>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination?.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="border-brand text-brand hover:bg-brand hover:text-white dark:border-brand-light dark:text-brand-light dark:hover:bg-brand-light dark:hover:text-gray-900 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-brand dark:disabled:hover:text-brand-light"
                >
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    let pageNumber;
                    if (pagination.pages <= 5) {
                      pageNumber = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNumber = i + 1;
                    } else if (pagination.page >= pagination.pages - 2) {
                      pageNumber = pagination.pages - 4 + i;
                    } else {
                      pageNumber = pagination.page - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNumber}
                        variant={pagination.page === pageNumber ? 'default' : 'outline'}
                        onClick={() => handlePageChange(pageNumber)}
                        className={pagination.page === pageNumber 
                          ? 'bg-brand hover:bg-brand-dark text-white'
                          : 'border-brand text-brand hover:bg-brand hover:text-white dark:border-brand-light dark:text-brand-light dark:hover:bg-brand-light dark:hover:text-gray-900'
                        }
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="border-brand text-brand hover:bg-brand hover:text-white dark:border-brand-light dark:text-brand-light dark:hover:bg-brand-light dark:hover:text-gray-900 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-brand dark:disabled:hover:text-brand-light"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
