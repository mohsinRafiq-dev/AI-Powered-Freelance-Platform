import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import * as cnicApi from '../api/cnicApi';

/**
 * Hook to get my CNIC status
 */
export const useMyCNICStatus = () => {
  return useQuery({
    queryKey: ['my-cnic-status'],
    queryFn: cnicApi.getMyCNICStatus,
    staleTime: 60000, // 1 minute
  });
};

/**
 * Hook to submit CNIC
 */
export const useSubmitCNIC = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cnicApi.submitCNIC,
    onSuccess: () => {
      queryClient.invalidateQueries(['my-cnic-status']);
      toast.success('CNIC submitted successfully and is pending admin review');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to submit CNIC');
    },
  });
};
