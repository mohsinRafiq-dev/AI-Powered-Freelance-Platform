

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateJob } from '../../../api/jobsApi';
import { toast } from 'react-hot-toast';

export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateJob(id, data),
    onSuccess: (data, variables) => {
      // Invalidate specific job and job lists
      queryClient.invalidateQueries({ queryKey: ['job', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['myJobs'] });
      
      toast.success('Job updated successfully! ✨');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update job';
      toast.error(message);
    },
  });
};
