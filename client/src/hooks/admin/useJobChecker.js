import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import * as jobCheckerApi from '../../api/admin/jobCheckerApi';

/**
 * Hook to get jobs with filters
 */
export const useJobs = (filters) => {
  return useQuery({
    queryKey: ['admin-jobs', filters],
    queryFn: () => jobCheckerApi.getJobs(filters),
    keepPreviousData: true,
  });
};

/**
 * Hook to get job by ID
 */
export const useJob = (jobId) => {
  return useQuery({
    queryKey: ['admin-job', jobId],
    queryFn: () => jobCheckerApi.getJobById(jobId),
    enabled: !!jobId,
  });
};

/**
 * Hook to approve job
 */
export const useApproveJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: jobCheckerApi.approveJob,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-jobs']);
      queryClient.invalidateQueries(['admin-job']);
      toast.success('Job approved successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to approve job');
    },
  });
};

/**
 * Hook to reject job
 */
export const useRejectJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, reason }) => jobCheckerApi.rejectJob(jobId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-jobs']);
      queryClient.invalidateQueries(['admin-job']);
      toast.success('Job rejected successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to reject job');
    },
  });
};

/**
 * Hook to flag job
 */
export const useFlagJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, flagData }) => jobCheckerApi.flagJob(jobId, flagData),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-jobs']);
      queryClient.invalidateQueries(['admin-job']);
      toast.success('Job flagged successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to flag job');
    },
  });
};

/**
 * Hook to toggle featured status
 */
export const useToggleFeature = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: jobCheckerApi.toggleFeature,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['admin-jobs']);
      queryClient.invalidateQueries(['admin-job']);
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update featured status');
    },
  });
};

/**
 * Hook to delete job
 */
export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: jobCheckerApi.deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-jobs']);
      toast.success('Job deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete job');
    },
  });
};

/**
 * Hook to get job statistics
 */
export const useJobStats = () => {
  return useQuery({
    queryKey: ['admin-job-stats'],
    queryFn: jobCheckerApi.getJobStats,
  });
};
