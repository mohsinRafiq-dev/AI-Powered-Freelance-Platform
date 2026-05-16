/**
 * API Hooks Central Export
 * Import all hooks from here for consistency
 * 
 * Usage: import { useJobs, useCreateJob, useMyProposals } from '@/hooks/api';
 */

// Jobs hooks
export {
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
  JOBS_QUERY_KEYS,
} from './useJobs';

// Proposals hooks
export {
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
  PROPOSALS_QUERY_KEYS,
} from './useProposals';

// Admin Settings hooks
export {
  useAdminSettings,
  useUpdateAdminSettings,
  useAIFeatureStatus,
  ADMIN_SETTINGS_QUERY_KEYS,
} from './useAdminSettings';

// Notifications hooks
export { useNotifications } from './useNotifications';

// Import for default export
import * as jobHooks from './useJobs';
import * as proposalHooks from './useProposals';
import * as adminSettingsHooks from './useAdminSettings';
import { useNotifications } from './useNotifications';

// Export default object for convenience
export default {
  jobs: {
    useJobs: jobHooks.useJobs,
    useJob: jobHooks.useJob,
    useMyJobs: jobHooks.useMyJobs,
    useJobStats: jobHooks.useJobStats,
    useCreateJob: jobHooks.useCreateJob,
    useUpdateJob: jobHooks.useUpdateJob,
    useDeleteJob: jobHooks.useDeleteJob,
    useCloseJob: jobHooks.useCloseJob,
    useRecommendedJobs: jobHooks.useRecommendedJobs,
    useRecommendedFreelancers: jobHooks.useRecommendedFreelancers,
  },
  proposals: {
    useMyProposals: proposalHooks.useMyProposals,
    useProposal: proposalHooks.useProposal,
    useProposalStats: proposalHooks.useProposalStats,
    useCheckIfApplied: proposalHooks.useCheckIfApplied,
    useSubmitProposal: proposalHooks.useSubmitProposal,
    useUpdateProposal: proposalHooks.useUpdateProposal,
    useWithdrawProposal: proposalHooks.useWithdrawProposal,
    useJobProposals: proposalHooks.useJobProposals,
    useAllClientProposals: proposalHooks.useAllClientProposals,
    useClientProposal: proposalHooks.useClientProposal,
    useAcceptProposal: proposalHooks.useAcceptProposal,
    useRejectProposal: proposalHooks.useRejectProposal,
    useGenerateProposalDraft: proposalHooks.useGenerateProposalDraft,
    useRegenerateProposalDraft: proposalHooks.useRegenerateProposalDraft,
  },
  adminSettings: {
    useAdminSettings: adminSettingsHooks.useAdminSettings,
    useUpdateAdminSettings: adminSettingsHooks.useUpdateAdminSettings,
    useAIFeatureStatus: adminSettingsHooks.useAIFeatureStatus,
  },
  notifications: {
    useNotifications,
  },
};
