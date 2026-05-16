

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as jobsAPI from '@/api/jobsApi';
import logger from '@/utils/logger';

// Query keys for cache management
export const JOBS_QUERY_KEYS = {
  all: ['jobs'],
  list: (filters) => ['jobs', 'list', filters],
  detail: (id) => ['jobs', 'detail', id],
  myJobs: (filters) => ['jobs', 'my-jobs', filters],
  stats: ['jobs', 'stats'],
  recommended: ['jobs', 'recommended'],
  recommendedFreelancers: (jobId) => ['jobs', 'recommended-freelancers', jobId],
};


export const useJobs = (filters = {}) => {
  return useQuery({
    queryKey: JOBS_QUERY_KEYS.list(filters),
    queryFn: () => jobsAPI.getAllJobs(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    keepPreviousData: true,
    onError: (error) => {
      logger.error('Failed to fetch jobs:', error);
      toast.error('Failed to load jobs');
    },
  });
};


export const useJob = (id, options = {}) => {
  return useQuery({
    queryKey: JOBS_QUERY_KEYS.detail(id),
    queryFn: () => jobsAPI.getJobById(id),
    enabled: !!id && options.enabled !== false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (error) => {
      logger.error('Failed to fetch job details:', error);
      toast.error('Failed to load job details');
    },
  });
};


export const useMyJobs = (filters = {}) => {
  return useQuery({
    queryKey: JOBS_QUERY_KEYS.myJobs(filters),
    queryFn: () => jobsAPI.getMyJobs(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
    keepPreviousData: true,
    onError: (error) => {
      logger.error('Failed to fetch my jobs:', error);
      toast.error('Failed to load your jobs');
    },
  });
};

export const useJobStats = () => {
  return useQuery({
    queryKey: JOBS_QUERY_KEYS.stats,
    queryFn: () => jobsAPI.getJobStats(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    onError: (error) => {
      logger.error('Failed to fetch job stats:', error);
    },
  });
};


export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobData) => jobsAPI.createJob(jobData),
    onSuccess: (data) => {
      // Invalidate and refetch jobs queries
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEYS.all });
      
      logger.info('Job created successfully:', data);
      toast.success('Job posted successfully!');
    },
    onError: (error) => {
      logger.error('Failed to create job:', error);
      toast.error(error.response?.data?.message || 'Failed to create job');
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => jobsAPI.updateJob(id, data),
    onSuccess: (data, variables) => {
      // Invalidate specific job and list queries
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEYS.all });
      
      logger.info('Job updated successfully:', data);
      toast.success('Job updated successfully!');
    },
    onError: (error) => {
      logger.error('Failed to update job:', error);
      toast.error(error.response?.data?.message || 'Failed to update job');
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => jobsAPI.deleteJob(id),
    onSuccess: (data, id) => {
      // Remove from cache and invalidate list
      queryClient.removeQueries({ queryKey: JOBS_QUERY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEYS.all });
      
      logger.info('Job deleted successfully');
      toast.success('Job deleted successfully!');
    },
    onError: (error) => {
      logger.error('Failed to delete job:', error);
      toast.error(error.response?.data?.message || 'Failed to delete job');
    },
  });
};

export const useCloseJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => jobsAPI.closeJob(id),
    onSuccess: (data, id) => {
      // Invalidate specific job and list queries
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEYS.all });
      
      logger.info('Job closed successfully');
      toast.success('Job closed to new proposals');
    },
    onError: (error) => {
      logger.error('Failed to close job:', error);
      toast.error(error.response?.data?.message || 'Failed to close job');
    },
  });
};

/**
 * Get AI-recommended jobs for freelancer
 */
export const useRecommendedJobs = (options = {}) => {
  return useQuery({
    queryKey: JOBS_QUERY_KEYS.recommended,
    queryFn: () => jobsAPI.getRecommendedJobs(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: options.enabled !== false,
    onError: (error) => {
      logger.error('Failed to fetch recommended jobs:', error);
      if (options.showErrorToast !== false) {
        toast.error('Failed to load recommended jobs');
      }
    },
  });
};

/**
 * Get recommended freelancers for a job
 */
export const useRecommendedFreelancers = (jobId, options = {}) => {
  const { limit = 10, minScore = 30, ...queryOptions } = options;
  
  return useQuery({
    queryKey: JOBS_QUERY_KEYS.recommendedFreelancers(jobId),
    queryFn: async () => {
      try {
        const response = await jobsAPI.getRecommendedFreelancers(jobId, { limit, minScore });
        return response;
      } catch (error) {
          logger.error('Error in getRecommendedFreelancers API call:', error);
          throw error;
        }
    },
    enabled: !!jobId && queryOptions.enabled !== false,
    staleTime: 0, // Always refetch when manually triggered (no stale time)
    cacheTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1, // Only retry once on failure
    onError: (error) => {
      logger.error('Failed to fetch recommended freelancers:', error);
      if (queryOptions.showErrorToast !== false) {
        toast.error('Failed to load recommended freelancers. Please try again.');
      }
    },
    onSuccess: (data) => {
      const freelancerCount = data?.data?.freelancers?.length || 0;
      if (queryOptions.showSuccessToast && freelancerCount > 0) {
        toast.success(`Found ${freelancerCount} recommended freelancer${freelancerCount > 1 ? 's' : ''}`);
      }
    },
  });
};

export default {
  useJobs,
  useJob,
  useMyJobs,
  useJobStats,
  useCreateJob,
  useUpdateJob,
  useDeleteJob,
  useCloseJob,
  useRecommendedJobs,
  useRecommendedFreelancers,
};
