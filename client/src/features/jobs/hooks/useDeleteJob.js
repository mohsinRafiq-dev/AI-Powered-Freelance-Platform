
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteJob } from '../../../api/jobsApi';
import { toast } from 'react-hot-toast';

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      // Invalidate job lists
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['myJobs'] });
      
      toast.success('Job deleted successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to delete job';
      toast.error(message);
    },
  });
};
