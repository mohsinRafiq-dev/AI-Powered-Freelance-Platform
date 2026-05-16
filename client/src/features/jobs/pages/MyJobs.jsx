

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, XCircle, Briefcase } from 'lucide-react';
import { useMyJobs, useDeleteJob } from '@/hooks/api';
import { JobCard } from '../components';
import { Button } from '../../../components/ui/button';
import EmptyState from '../../dashboard/shared/EmptyState';
import { InlineLoader } from '../../../components/common/Loader';
import LazyLoadItem from '../../../components/common/LazyLoadItem';
import logger from '@/utils/logger';

const TABS = [
  { id: 'all', label: 'All Jobs', status: '' },
  { id: 'open', label: 'Open', status: 'open' },
  { id: 'in-progress', label: 'In Progress', status: 'in-progress' },
  { id: 'completed', label: 'Completed', status: 'completed' },
  { id: 'closed', label: 'Closed', status: 'closed' },
];

export const MyJobs = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const deleteJobMutation = useDeleteJob();

  const statusFilter = TABS.find(t => t.id === activeTab)?.status;
  const params = {};
  if (statusFilter) {
    params.status = statusFilter;
  }
  
  logger.debug('Fetching myJobs with params:', params);
  const { data, isLoading, isError, refetch } = useMyJobs(params);

  logger.debug('MyJobs data:', data);
  
  // paginatedResponse returns { success, data: [...jobs], pagination }
  const jobs = data?.data || [];
  const pagination = data?.pagination || {};
  
  logger.debug('Jobs count:', jobs.length);
  logger.debug('Jobs array:', jobs);

  const handleDelete = async (job) => {
    const jobId = job.id || job._id;
    if (!window.confirm(`Are you sure you want to delete "${job.title}"?`)) return;
    
    try {
      await deleteJobMutation.mutateAsync(jobId);
      refetch();
    } catch (error) {
      logger.error('Failed to delete job:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 lg:pt-28 pb-24 md:pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              My Jobs
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your posted jobs
            </p>
          </div>

          <Button 
            onClick={() => navigate('/jobs/create')}
            className="bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-deeper text-white shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            Post New Job
          </Button>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {TABS.map((tab) => {
            const tabJobs = tab.id === 'all' ? jobs : jobs.filter(job => job.status === tab.status);
            const count = tabJobs.length;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-brand text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {tab.label}
                {!isLoading && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Jobs List */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <InlineLoader text="Loading Your Jobs" />
          </div>
        )}

        {isError && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 text-center rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
            </div>
            <p className="text-red-500 dark:text-red-400 mb-4 text-lg font-semibold">Failed to load jobs</p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Something went wrong while fetching your jobs</p>
            <Button onClick={() => refetch()} className="bg-brand hover:bg-brand-dark text-white">
              Try Again
            </Button>
          </div>
        )}

        {!isLoading && !isError && jobs.length === 0 && (
          <EmptyState
            title="No jobs found"
            message={activeTab === 'all' ? "You haven't posted any jobs yet" : `No ${activeTab} jobs`}
            icon={Briefcase}
            actionLabel="Post Your First Job"
            onAction={() => navigate('/jobs/create')}
          />
        )}

        {!isLoading && !isError && jobs.length > 0 && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {jobs.map((job) => {
                const jobId = job.id || job._id;
                return (
                  <LazyLoadItem
                    key={jobId}
                    threshold={0.1}
                    rootMargin="100px"
                    animateOnLoad={true}
                  >
                    <JobCard
                      job={job}
                      onEdit={(job) => {
                        const id = job.id || job._id;
                        window.location.href = `/jobs/${id}/edit`;
                      }}
                      onDelete={handleDelete}
                      showActions={true}
                    />
                  </LazyLoadItem>
                );
              })}
            </div>

            {pagination?.total > 0 && (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 text-center">
                <p className="text-gray-700 dark:text-gray-300">
                  Showing <span className="font-semibold text-brand">{jobs.length}</span> of <span className="font-semibold text-brand">{pagination.total}</span> jobs
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
