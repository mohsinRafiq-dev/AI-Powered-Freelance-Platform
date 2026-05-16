import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as contractsApi from '../../api/contractsApi';
import { toast } from 'react-hot-toast';

// Query keys
export const contractKeys = {
  all: ['contracts'],
  lists: () => [...contractKeys.all, 'list'],
  list: (filters) => [...contractKeys.lists(), filters],
  details: () => [...contractKeys.all, 'detail'],
  detail: (id) => [...contractKeys.details(), id],
  stats: () => [...contractKeys.all, 'stats'],
};

// Get all contracts
export const useContracts = (params = {}) => {
  // [CONTRACTS][UI] Log hook parameters
  console.log('\n[CONTRACTS][UI][HOOK] useContracts called with params:', JSON.stringify(params));
  
  return useQuery({
    queryKey: contractKeys.list(params),
    queryFn: async () => {
      console.log('[CONTRACTS][UI][API] Calling getMyContracts...');
      const result = await contractsApi.getMyContracts(params);
      // API returns { success, data: [...contracts], pagination }
      console.log('[CONTRACTS][UI][API] Raw response:', result);
      console.log('[CONTRACTS][UI][API] Contracts array length:', result?.data?.length || 0);
      console.log('[CONTRACTS][UI][API] Contract IDs:', result?.data?.map(c => c._id) || []);
      return result;
    },
  });
};

// Get contract by ID
export const useContract = (id) => {
  return useQuery({
    queryKey: contractKeys.detail(id),
    queryFn: async () => {
      console.log('[CONTRACT][HOOK] Fetching contract, id:', id);
      const result = await contractsApi.getContractById(id);
      console.log('[CONTRACT][HOOK] API result:', result);
      console.log('[CONTRACT][HOOK] Contract object:', result?.data?.contract);
      return result;
    },
    enabled: !!id,
  });
};

// Get contract statistics
export const useContractStats = () => {
  return useQuery({
    queryKey: contractKeys.stats(),
    queryFn: contractsApi.getMyContractStats,
  });
};

// Create contract from proposal
export const useCreateContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contractsApi.createContractFromProposal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contractKeys.stats() });
      toast.success('Contract created successfully');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to create contract');
    },
  });
};

// Respond to contract (accept/decline)
export const useRespondToContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, action, reason }) =>
      contractsApi.respondToContract(id, action, reason),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: contractKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contractKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: contractKeys.stats() });
      toast.success(
        variables.action === 'accept'
          ? 'Contract accepted successfully'
          : 'Contract declined'
      );
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to respond to contract');
    },
  });
};

// Add milestone
export const useAddMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => contractsApi.addMilestone(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: contractKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: contractKeys.lists() });
      toast.success('Milestone added successfully');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to add milestone');
    },
  });
};

// Update milestone
export const useUpdateMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contractId, milestoneId, data }) =>
      contractsApi.updateMilestone(contractId, milestoneId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: contractKeys.detail(variables.contractId) });
      queryClient.invalidateQueries({ queryKey: contractKeys.lists() });
      toast.success('Milestone updated successfully');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update milestone');
    },
  });
};

// Complete contract
export const useCompleteContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contractsApi.completeContract,
    onSuccess: (data, contractId) => {
      queryClient.invalidateQueries({ queryKey: contractKeys.detail(contractId) });
      queryClient.invalidateQueries({ queryKey: contractKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contractKeys.stats() });
      toast.success('Contract completed successfully');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to complete contract');
    },
  });
};

// Cancel contract
export const useCancelContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }) => contractsApi.cancelContract(id, reason),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: contractKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: contractKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contractKeys.stats() });
      toast.success('Contract cancelled');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to cancel contract');
    },
  });
};
