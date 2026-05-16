
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createJob } from '../../../api/jobsApi';
import { toast } from 'react-hot-toast';
import logger from '@/utils/logger';

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJob,
    onSuccess: (data) => {
      logger.info('Job created successfully:', data);
      
      // Invalidate all job-related queries
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['myJobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobStats'] });
      
      // Refetch immediately
      queryClient.refetchQueries({ queryKey: ['myJobs'] });
      
      toast.success('Job posted successfully! 🎉');
    },
    onError: (error) => {
      logger.error('Job creation error:', error.response?.data);
      const message = error.response?.data?.message || 'Failed to create job';
      toast.error(message);
    },
  });
};
