import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import * as cnicApi from '../../api/cnicApi';

/**
 * Hook to get pending CNICs
 */
export const usePendingCNICs = (filters) => {
  return useQuery({
    queryKey: ['pending-cnics', filters],
    queryFn: () => cnicApi.getPendingCNICs(filters),
    keepPreviousData: true,
    staleTime: 30000, // 30 seconds
  });
};

/**
 * Hook to get CNIC details
 */
export const useCNICDetails = (userId) => {
  return useQuery({
    queryKey: ['cnic-details', userId],
    queryFn: () => cnicApi.getCNICDetails(userId),
    enabled: !!userId,
  });
};

/**
 * Hook to approve CNIC
 */
export const useApproveCNIC = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, cnicData }) => cnicApi.approveCNIC(userId, cnicData),
    onSuccess: () => {
      queryClient.invalidateQueries(['pending-cnics']);
      queryClient.invalidateQueries(['cnic-details']);
      queryClient.invalidateQueries(['cnic-stats']);
      toast.success('CNIC verified successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to approve CNIC');
    },
  });
};

/**
 * Hook to reject CNIC
 */
export const useRejectCNIC = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, reason }) => cnicApi.rejectCNIC(userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['pending-cnics']);
      queryClient.invalidateQueries(['cnic-details']);
      queryClient.invalidateQueries(['cnic-stats']);
      toast.success('CNIC rejected');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to reject CNIC');
    },
  });
};

/**
 * Hook to request re-upload
 */
export const useRequestReupload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, reason }) => cnicApi.requestReupload(userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['pending-cnics']);
      queryClient.invalidateQueries(['cnic-details']);
      queryClient.invalidateQueries(['cnic-stats']);
      toast.success('Re-upload requested');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to request re-upload');
    },
  });
};

/**
 * Hook to get CNIC stats
 */
export const useCNICStats = () => {
  return useQuery({
    queryKey: ['cnic-stats'],
    queryFn: cnicApi.getCNICStats,
    staleTime: 60000, // 1 minute
  });
};
