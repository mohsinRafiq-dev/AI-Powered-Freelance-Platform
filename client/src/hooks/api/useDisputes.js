import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllDisputes,
  getDisputeById,
  getDisputesByContract,
  createDispute,
  resolveDispute,
  rejectDispute,
  addAdminNote,
  updateDisputeStatus,
  getDisputeStats,
} from '../../api/disputesApi';
import { toast } from 'sonner';

// Query keys
export const disputeKeys = {
  all: ['disputes'],
  lists: () => [...disputeKeys.all, 'list'],
  list: (filters) => [...disputeKeys.lists(), { filters }],
  details: () => [...disputeKeys.all, 'detail'],
  detail: (id) => [...disputeKeys.details(), id],
  byContract: (contractId) => [...disputeKeys.all, 'contract', contractId],
  stats: () => [...disputeKeys.all, 'stats'],
};

/**
 * Get all disputes (admin only)
 */
export const useDisputes = (params = {}, options = {}) => {
  return useQuery({
    queryKey: disputeKeys.list(params),
    queryFn: () => getAllDisputes(params),
    staleTime: 30000, // 30 seconds
    ...options,
  });
};

/**
 * Get dispute by ID
 */
export const useDispute = (disputeId, options = {}) => {
  return useQuery({
    queryKey: disputeKeys.detail(disputeId),
    queryFn: () => getDisputeById(disputeId),
    enabled: !!disputeId,
    staleTime: 10000, // 10 seconds
    ...options,
  });
};

/**
 * Get disputes by contract ID
 */
export const useContractDisputes = (contractId, options = {}) => {
  return useQuery({
    queryKey: disputeKeys.byContract(contractId),
    queryFn: () => getDisputesByContract(contractId),
    enabled: !!contractId,
    staleTime: 30000,
    ...options,
  });
};

/**
 * Get dispute statistics
 */
export const useDisputeStats = (options = {}) => {
  return useQuery({
    queryKey: disputeKeys.stats(),
    queryFn: getDisputeStats,
    staleTime: 60000, // 1 minute
    ...options,
  });
};

/**
 * Create a new dispute
 */
export const useCreateDispute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDispute,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: disputeKeys.all });
      toast.success('Dispute created successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to create dispute';
      toast.error(message);
      console.error('Error creating dispute:', error);
    },
  });
};

/**
 * Resolve a dispute (admin only)
 */
export const useResolveDispute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ disputeId, resolution }) => resolveDispute(disputeId, resolution),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: disputeKeys.all });
      queryClient.invalidateQueries({ queryKey: disputeKeys.detail(variables.disputeId) });
      toast.success('Dispute resolved successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to resolve dispute';
      toast.error(message);
      console.error('Error resolving dispute:', error);
    },
  });
};

/**
 * Reject a dispute (admin only)
 */
export const useRejectDispute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ disputeId, reason }) => rejectDispute(disputeId, reason),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: disputeKeys.all });
      queryClient.invalidateQueries({ queryKey: disputeKeys.detail(variables.disputeId) });
      toast.success('Dispute rejected successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to reject dispute';
      toast.error(message);
      console.error('Error rejecting dispute:', error);
    },
  });
};

/**
 * Add admin note to dispute
 */
export const useAddAdminNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ disputeId, note }) => addAdminNote(disputeId, note),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: disputeKeys.detail(variables.disputeId) });
      toast.success('Admin note added successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to add note';
      toast.error(message);
      console.error('Error adding admin note:', error);
    },
  });
};

/**
 * Update dispute status (admin only)
 */
export const useUpdateDisputeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ disputeId, status, notes }) =>
      updateDisputeStatus(disputeId, status, notes),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: disputeKeys.all });
      queryClient.invalidateQueries({ queryKey: disputeKeys.detail(variables.disputeId) });
      toast.success('Dispute status updated successfully');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update status';
      toast.error(message);
      console.error('Error updating dispute status:', error);
    },
  });
};
