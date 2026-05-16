import { configureStore } from '@reduxjs/toolkit';
import proposalReducer, {
  submitProposal,
  fetchMyProposals,
  fetchProposalDetails,
  updateProposal,
  withdrawProposal,
  fetchProposalStats,
  checkIfApplied,
  clearError,
  clearSuccess,
  setFilters,
  resetFilters,
  clearCurrentProposal,
} from '@/store/slices/proposalSlice';
import * as proposalsAPI from '@/api/proposalsApi';

jest.mock('@/api/proposalsApi');

describe('proposalSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        proposals: proposalReducer,
      },
    });
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState().proposals;
      expect(state).toEqual({
        proposals: [],
        currentProposal: null,
        stats: null,
        appliedJobs: {},
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          pages: 0,
        },
        filters: {
          status: null,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        },
        loading: false,
        error: null,
        submitSuccess: false,
        updateSuccess: false,
        withdrawSuccess: false,
      });
    });
  });

  describe('submitProposal', () => {
    it('should handle successful proposal submission', async () => {
      const mockProposal = {
        _id: '1',
        jobId: { _id: 'job1' },
        coverLetter: 'Test proposal',
      };
      proposalsAPI.submitProposal.mockResolvedValue({
        data: { proposal: mockProposal },
      });

      await store.dispatch(submitProposal({ jobId: 'job1', coverLetter: 'Test' }));

      const state = store.getState().proposals;
      expect(state.submitSuccess).toBe(true);
      expect(state.proposals).toContainEqual(mockProposal);
      expect(state.appliedJobs['job1']).toBe(true);
    });

    it('should handle proposal submission error', async () => {
      proposalsAPI.submitProposal.mockRejectedValue({
        response: { data: { message: 'Error' } },
      });

      await store.dispatch(submitProposal({ jobId: 'job1' }));

      const state = store.getState().proposals;
      expect(state.error).toBe('Error');
      expect(state.submitSuccess).toBe(false);
    });
  });

  describe('fetchMyProposals', () => {
    it('should fetch proposals successfully', async () => {
      const mockProposals = [
        { _id: '1', jobId: { _id: 'job1' } },
        { _id: '2', jobId: { _id: 'job2' } },
      ];
      proposalsAPI.getMyProposals.mockResolvedValue({
        data: { proposals: mockProposals },
      });

      await store.dispatch(fetchMyProposals());

      const state = store.getState().proposals;
      expect(state.proposals).toEqual(mockProposals);
      expect(state.appliedJobs['job1']).toBe(true);
      expect(state.appliedJobs['job2']).toBe(true);
    });
  });

  describe('fetchProposalDetails', () => {
    it('should fetch proposal details successfully', async () => {
      const mockProposal = { _id: '1', jobId: { _id: 'job1' }, coverLetter: 'Test' };
      proposalsAPI.getProposalDetails.mockResolvedValue({
        data: { proposal: mockProposal },
      });

      await store.dispatch(fetchProposalDetails('1'));

      const state = store.getState().proposals;
      expect(state.currentProposal).toEqual(mockProposal);
    });

    it('should handle fetch proposal details error', async () => {
      proposalsAPI.getProposalDetails.mockRejectedValue({
        response: { data: { message: 'Error' } },
      });

      await store.dispatch(fetchProposalDetails('1'));

      const state = store.getState().proposals;
      expect(state.error).toBe('Error');
    });
  });

  describe('updateProposal', () => {
    it('should update proposal successfully', async () => {
      const mockProposal = { _id: '1', coverLetter: 'Updated' };
      proposalsAPI.updateProposal.mockResolvedValue({
        data: { proposal: mockProposal },
      });

      await store.dispatch(updateProposal({ proposalId: '1', updateData: { coverLetter: 'Updated' } }));

      const state = store.getState().proposals;
      expect(state.updateSuccess).toBe(true);
      expect(state.currentProposal).toEqual(mockProposal);
    });

    it('should handle update proposal error', async () => {
      proposalsAPI.updateProposal.mockRejectedValue({
        response: { data: { message: 'Error' } },
      });

      await store.dispatch(updateProposal({ proposalId: '1', updateData: {} }));

      const state = store.getState().proposals;
      expect(state.error).toBe('Error');
      expect(state.updateSuccess).toBe(false);
    });
  });

  describe('withdrawProposal', () => {
    it('should withdraw proposal successfully', async () => {
      proposalsAPI.withdrawProposal.mockResolvedValue({
        message: 'Withdrawn',
      });

      await store.dispatch(withdrawProposal('1'));

      const state = store.getState().proposals;
      expect(state.withdrawSuccess).toBe(true);
    });

    it('should handle withdraw proposal error', async () => {
      proposalsAPI.withdrawProposal.mockRejectedValue({
        response: { data: { message: 'Error' } },
      });

      await store.dispatch(withdrawProposal('1'));

      const state = store.getState().proposals;
      expect(state.error).toBe('Error');
      expect(state.withdrawSuccess).toBe(false);
    });
  });

  describe('fetchProposalStats', () => {
    it('should fetch proposal stats successfully', async () => {
      const mockStats = { total: 10, pending: 5 };
      proposalsAPI.getProposalStats.mockResolvedValue({
        data: { stats: mockStats },
      });

      await store.dispatch(fetchProposalStats());

      const state = store.getState().proposals;
      expect(state.stats).toEqual(mockStats);
    });

    it('should handle fetch proposal stats error', async () => {
      proposalsAPI.getProposalStats.mockRejectedValue({
        response: { data: { message: 'Error' } },
      });

      await store.dispatch(fetchProposalStats());

      const state = store.getState().proposals;
      expect(state.error).toBe('Error');
    });
  });

  describe('checkIfApplied', () => {
    it('should check if applied successfully', async () => {
      proposalsAPI.checkIfApplied.mockResolvedValue({
        data: { hasApplied: true },
      });

      await store.dispatch(checkIfApplied('job1'));

      const state = store.getState().proposals;
      expect(state.appliedJobs['job1']).toBe(true);
    });

    it('should handle check if applied error', async () => {
      proposalsAPI.checkIfApplied.mockRejectedValue({
        response: { data: { message: 'Error' } },
      });

      await store.dispatch(checkIfApplied('job1'));

      const state = store.getState().proposals;
      expect(state.error).toBe('Error');
    });
  });

  describe('clearSuccess', () => {
    it('should clear all success flags', () => {
      store.dispatch(clearSuccess());
      const state = store.getState().proposals;
      expect(state.submitSuccess).toBe(false);
      expect(state.updateSuccess).toBe(false);
      expect(state.withdrawSuccess).toBe(false);
    });
  });

  describe('reducers', () => {
    it('should clear error', () => {
      store.dispatch(clearError());
      expect(store.getState().proposals.error).toBeNull();
    });

    it('should set filters', () => {
      store.dispatch(setFilters({ status: 'pending' }));
      expect(store.getState().proposals.filters.status).toBe('pending');
    });

    it('should reset filters', () => {
      store.dispatch(setFilters({ status: 'pending' }));
      store.dispatch(resetFilters());
      expect(store.getState().proposals.filters.status).toBeNull();
    });

    it('should clear current proposal', () => {
      store.dispatch(clearCurrentProposal());
      expect(store.getState().proposals.currentProposal).toBeNull();
    });
  });
});


