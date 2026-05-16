import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as proposalsAPI from '@/api/proposalsApi';
import logger from '@/utils/logger';

// Query keys for cache management
export const PROPOSALS_QUERY_KEYS = {
  all: ['proposals'],
  list: (filters) => ['proposals', 'list', filters],
  detail: (id) => ['proposals', 'detail', id],
  stats: ['proposals', 'stats'],
  checkApplied: (jobId) => ['proposals', 'applied', jobId],
  draft: (jobId) => ['proposals', 'draft', jobId],
};

export const useMyProposals = (filters = {}) => {
  return useQuery({
    queryKey: PROPOSALS_QUERY_KEYS.list(filters),
    queryFn: () => proposalsAPI.getMyProposals(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
    keepPreviousData: true,
    onError: (error) => {
      logger.error('Failed to fetch proposals:', error);
      toast.error('Failed to load proposals');
    },
  });
};

export const useProposal = (id, options = {}) => {
  return useQuery({
    queryKey: PROPOSALS_QUERY_KEYS.detail(id),
    queryFn: () => proposalsAPI.getProposalDetails(id),
    enabled: !!id && options.enabled !== false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (error) => {
      logger.error('Failed to fetch proposal details:', error);
      toast.error('Failed to load proposal details');
    },
  });
};

export const useProposalStats = () => {
  return useQuery({
    queryKey: PROPOSALS_QUERY_KEYS.stats,
    queryFn: () => proposalsAPI.getProposalStats(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    onError: (error) => {
      logger.error('Failed to fetch proposal stats:', error);
    },
  });
};

export const useCheckIfApplied = (jobId, options = {}) => {
  return useQuery({
    queryKey: PROPOSALS_QUERY_KEYS.checkApplied(jobId),
    queryFn: () => proposalsAPI.checkIfApplied(jobId),
    enabled: !!jobId && options.enabled !== false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => ({
      hasApplied: data?.data?.hasApplied || false,
      proposal: data?.data?.proposal || null,
    }),
    onError: (error) => {
      logger.error('Failed to check application status:', error);
    },
  });
};

export const useSubmitProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (proposalData) => proposalsAPI.submitProposal(proposalData),
    onSuccess: (data) => {
      // Invalidate proposals list
      queryClient.invalidateQueries({ queryKey: PROPOSALS_QUERY_KEYS.all });
      
      // Invalidate check applied for this job
      const jobId = data?.proposal?.jobId?._id || data?.proposal?.jobId;
      if (jobId) {
        queryClient.invalidateQueries({ queryKey: PROPOSALS_QUERY_KEYS.checkApplied(jobId) });
      }
      
      logger.info('Proposal submitted successfully:', data);
      toast.success('Proposal submitted successfully!');
    },
    onError: (error) => {
      logger.error('Failed to submit proposal:', error);
      toast.error(error.response?.data?.message || 'Failed to submit proposal');
    },
  });
};

export const useUpdateProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ proposalId, updateData }) => proposalsAPI.updateProposal(proposalId, updateData),
    onSuccess: (data, variables) => {
      // Invalidate specific proposal and list queries
      queryClient.invalidateQueries({ queryKey: PROPOSALS_QUERY_KEYS.detail(variables.proposalId) });
      queryClient.invalidateQueries({ queryKey: PROPOSALS_QUERY_KEYS.all });
      
      logger.info('Proposal updated successfully:', data);
      toast.success('Proposal updated successfully!');
    },
    onError: (error) => {
      logger.error('Failed to update proposal:', error);
      toast.error(error.response?.data?.message || 'Failed to update proposal');
    },
  });
};


export const useWithdrawProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (proposalId) => proposalsAPI.withdrawProposal(proposalId),
    onSuccess: (data, proposalId) => {
      // Invalidate specific proposal and list queries
      queryClient.invalidateQueries({ queryKey: PROPOSALS_QUERY_KEYS.detail(proposalId) });
      queryClient.invalidateQueries({ queryKey: PROPOSALS_QUERY_KEYS.all });
      
      // Invalidate all checkApplied queries to update job details pages
      queryClient.invalidateQueries({ queryKey: ['proposals', 'applied'] });
      
      logger.info('Proposal withdrawn successfully');
      toast.success('Proposal withdrawn successfully');
    },
    onError: (error) => {
      logger.error('Failed to withdraw proposal:', error);
      toast.error(error.response?.data?.message || 'Failed to withdraw proposal');
    },
  });
};

export const useJobProposals = (jobId, filters = {}) => {
  return useQuery({
    queryKey: [...PROPOSALS_QUERY_KEYS.list(filters), 'job', jobId],
    queryFn: () => proposalsAPI.getJobProposals(jobId, filters),
    enabled: !!jobId,
    staleTime: 1000 * 60 * 2, 
    keepPreviousData: true,
    onError: (error) => {
      logger.error('Failed to fetch job proposals:', error);
      toast.error('Failed to load proposals');
    },
  });
};

export const useAllClientProposals = (filters = {}) => {
  return useQuery({
    queryKey: [...PROPOSALS_QUERY_KEYS.list(filters), 'client-all'],
    queryFn: () => proposalsAPI.getAllClientProposals(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
    keepPreviousData: true,
    onError: (error) => {
      logger.error('Failed to fetch client proposals:', error);
      toast.error('Failed to load proposals');
    },
  });
};

export const useClientProposal = (id, options = {}) => {
  return useQuery({
    queryKey: ['proposals', 'client-detail', id],
    queryFn: () => proposalsAPI.getClientProposalDetails(id),
    enabled: !!id && options.enabled !== false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (error) => {
      logger.error('Failed to fetch proposal details:', error);
      toast.error('Failed to load proposal details');
    },
  });
};

export const useAcceptProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (proposalId) => proposalsAPI.acceptProposal(proposalId),
    onSuccess: (data) => {
      // Invalidate all proposal queries
      queryClient.invalidateQueries({ queryKey: PROPOSALS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['proposals', 'client-detail'] });
      queryClient.invalidateQueries({ queryKey: ['proposals', 'client-all'] });
      // Invalidate conversations to show new conversation
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      
      logger.info('Proposal accepted successfully:', data);
      toast.success('Proposal accepted successfully!');
    },
    onError: (error) => {
      logger.error('Failed to accept proposal:', error);
      toast.error(error.response?.data?.message || 'Failed to accept proposal');
    },
  });
};

export const useRejectProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ proposalId, reason }) => proposalsAPI.rejectProposal(proposalId, reason),
    onSuccess: (data) => {
      // Invalidate all proposal queries
      queryClient.invalidateQueries({ queryKey: PROPOSALS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['proposals', 'client-detail'] });
      queryClient.invalidateQueries({ queryKey: ['proposals', 'client-all'] });
      
      logger.info('Proposal rejected successfully:', data);
      toast.success('Proposal rejected');
    },
    onError: (error) => {
      logger.error('Failed to reject proposal:', error);
      toast.error(error.response?.data?.message || 'Failed to reject proposal');
    },
  });
};

/**
 * Generate AI proposal draft
 */
export const useGenerateProposalDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId) => proposalsAPI.generateProposalDraft(jobId),
    onSuccess: (data, jobId) => {
      // Cache the draft
      queryClient.setQueryData(PROPOSALS_QUERY_KEYS.draft(jobId), data);
      
      logger.info('Proposal draft generated successfully:', data);
      toast.success('AI proposal draft generated!');
    },
    onError: (error) => {
      logger.error('Failed to generate proposal draft:', error);
      const errorMessage = error.response?.data?.message || 'Failed to generate proposal draft';
      toast.error(errorMessage);
    },
  });
};

/**
 * Regenerate AI proposal draft
 */
export const useRegenerateProposalDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId) => proposalsAPI.regenerateProposalDraft(jobId),
    onSuccess: (data, jobId) => {
      // Update cached draft
      queryClient.setQueryData(PROPOSALS_QUERY_KEYS.draft(jobId), data);
      
      logger.info('Proposal draft regenerated successfully:', data);
      toast.success('Proposal draft regenerated!');
    },
    onError: (error) => {
      logger.error('Failed to regenerate proposal draft:', error);
      const errorMessage = error.response?.data?.message || 'Failed to regenerate proposal draft';
      toast.error(errorMessage);
    },
  });
};

export default {
  useMyProposals,
  useProposal,
  useProposalStats,
  useCheckIfApplied,
  useSubmitProposal,
  useUpdateProposal,
  useWithdrawProposal,
  useJobProposals,
  useAllClientProposals,
  useClientProposal,
  useAcceptProposal,
  useRejectProposal,
  useGenerateProposalDraft,
  useRegenerateProposalDraft,
};
