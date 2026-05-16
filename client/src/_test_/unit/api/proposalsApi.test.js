import axiosInstance from '@/api/axiosInstance';
import * as proposalsApi from '@/api/proposalsApi';
import PROPOSALS_ENDPOINTS from '@/api/endpoints/proposals';

jest.mock('@/api/axiosInstance');
jest.mock('@/api/endpoints/proposals', () => ({
  __esModule: true,
  default: {
    submitProposal: '/proposals',
    getMyProposals: '/proposals/me',
    getProposalDetails: (id) => `/proposals/freelancer/${id}`,
    updateProposal: (id) => `/proposals/${id}`,
    withdrawProposal: (id) => `/proposals/${id}`,
    getProposalStats: '/proposals/stats',
    checkIfApplied: (jobId) => `/proposals/check/${jobId}`,
    getJobProposals: (jobId) => `/proposals/job/${jobId}`,
    getClientProposalDetails: (id) => `/proposals/client/${id}`,
    acceptProposal: (id) => `/proposals/${id}/accept`,
    rejectProposal: (id) => `/proposals/${id}/reject`,
    getAllClientProposals: '/proposals/client/all',
    generateProposalDraft: (jobId) => `/proposals/draft/${jobId}`,
    regenerateProposalDraft: (jobId) => `/proposals/draft/${jobId}/regenerate`,
  },
}));

describe('proposalsApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('submitProposal', () => {
    it('should submit proposal', async () => {
      const proposalData = { jobId: '1', coverLetter: 'Test' };
      const mockResponse = { data: { proposal: { id: '1' } } };
      axiosInstance.post.mockResolvedValue(mockResponse);

      const result = await proposalsApi.submitProposal(proposalData);
      expect(axiosInstance.post).toHaveBeenCalledWith(PROPOSALS_ENDPOINTS.submitProposal, proposalData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getMyProposals', () => {
    it('should fetch user proposals', async () => {
      const mockResponse = { data: { proposals: [] } };
      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await proposalsApi.getMyProposals({ status: 'pending' });
      expect(axiosInstance.get).toHaveBeenCalledWith(PROPOSALS_ENDPOINTS.getMyProposals, { params: { status: 'pending' } });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getProposalDetails', () => {
    it('should fetch proposal details', async () => {
      const proposalId = '123';
      const mockResponse = { data: { proposal: { id: proposalId } } };
      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await proposalsApi.getProposalDetails(proposalId);
      expect(axiosInstance.get).toHaveBeenCalledWith(PROPOSALS_ENDPOINTS.getProposalDetails(proposalId));
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('updateProposal', () => {
    it('should update proposal', async () => {
      const proposalId = '123';
      const updateData = { coverLetter: 'Updated' };
      const mockResponse = { data: { proposal: { id: proposalId } } };
      axiosInstance.put.mockResolvedValue(mockResponse);

      const result = await proposalsApi.updateProposal(proposalId, updateData);
      expect(axiosInstance.put).toHaveBeenCalledWith(PROPOSALS_ENDPOINTS.updateProposal(proposalId), updateData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('withdrawProposal', () => {
    it('should withdraw proposal', async () => {
      const proposalId = '123';
      const mockResponse = { data: { message: 'Withdrawn' } };
      axiosInstance.delete.mockResolvedValue(mockResponse);

      const result = await proposalsApi.withdrawProposal(proposalId);
      expect(axiosInstance.delete).toHaveBeenCalledWith(PROPOSALS_ENDPOINTS.withdrawProposal(proposalId));
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getProposalStats', () => {
    it('should fetch proposal statistics', async () => {
      const mockResponse = { data: { stats: {} } };
      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await proposalsApi.getProposalStats();
      expect(axiosInstance.get).toHaveBeenCalledWith(PROPOSALS_ENDPOINTS.getProposalStats);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('checkIfApplied', () => {
    it('should check if user applied to job', async () => {
      const jobId = '123';
      const mockResponse = { data: { hasApplied: true } };
      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await proposalsApi.checkIfApplied(jobId);
      expect(axiosInstance.get).toHaveBeenCalledWith(PROPOSALS_ENDPOINTS.checkIfApplied(jobId));
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getJobProposals', () => {
    it('should fetch proposals for a job', async () => {
      const jobId = '123';
      const mockResponse = { data: { proposals: [] } };
      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await proposalsApi.getJobProposals(jobId, { status: 'pending' });
      expect(axiosInstance.get).toHaveBeenCalledWith(PROPOSALS_ENDPOINTS.getJobProposals(jobId), { params: { status: 'pending' } });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getClientProposalDetails', () => {
    it('should fetch client proposal details', async () => {
      const proposalId = '123';
      const mockResponse = { data: { proposal: { id: proposalId } } };
      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await proposalsApi.getClientProposalDetails(proposalId);
      expect(axiosInstance.get).toHaveBeenCalledWith(PROPOSALS_ENDPOINTS.getClientProposalDetails(proposalId));
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('acceptProposal', () => {
    it('should accept a proposal', async () => {
      const proposalId = '123';
      const mockResponse = { data: { proposal: { id: proposalId, status: 'accepted' } } };
      axiosInstance.post.mockResolvedValue(mockResponse);

      const result = await proposalsApi.acceptProposal(proposalId);
      expect(axiosInstance.post).toHaveBeenCalledWith(PROPOSALS_ENDPOINTS.acceptProposal(proposalId));
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('rejectProposal', () => {
    it('should reject a proposal', async () => {
      const proposalId = '123';
      const reason = 'Not suitable';
      const mockResponse = { data: { proposal: { id: proposalId, status: 'rejected' } } };
      axiosInstance.post.mockResolvedValue(mockResponse);

      const result = await proposalsApi.rejectProposal(proposalId, reason);
      expect(axiosInstance.post).toHaveBeenCalledWith(PROPOSALS_ENDPOINTS.rejectProposal(proposalId), { reason });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getAllClientProposals', () => {
    it('should fetch all client proposals', async () => {
      const mockResponse = { data: { proposals: [] } };
      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await proposalsApi.getAllClientProposals({ status: 'pending' });
      expect(axiosInstance.get).toHaveBeenCalledWith(PROPOSALS_ENDPOINTS.getAllClientProposals, { params: { status: 'pending' } });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('generateProposalDraft', () => {
    it('should generate AI proposal draft', async () => {
      const jobId = '123';
      const mockResponse = { data: { draft: 'Test draft' } };
      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await proposalsApi.generateProposalDraft(jobId);
      expect(axiosInstance.get).toHaveBeenCalledWith(PROPOSALS_ENDPOINTS.generateProposalDraft(jobId));
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('regenerateProposalDraft', () => {
    it('should regenerate AI proposal draft', async () => {
      const jobId = '123';
      const mockResponse = { data: { draft: 'New draft' } };
      axiosInstance.post.mockResolvedValue(mockResponse);

      const result = await proposalsApi.regenerateProposalDraft(jobId);
      expect(axiosInstance.post).toHaveBeenCalledWith(PROPOSALS_ENDPOINTS.regenerateProposalDraft(jobId));
      expect(result).toEqual(mockResponse.data);
    });
  });
});


