import axiosInstance from "./axiosInstance";
import PROPOSALS_ENDPOINTS from "./endpoints/proposals";

export const submitProposal = async (proposalData) => {
  const response = await axiosInstance.post(PROPOSALS_ENDPOINTS.submitProposal, proposalData);
  return response.data;
};

export const getMyProposals = async (params = {}) => {
  const response = await axiosInstance.get(PROPOSALS_ENDPOINTS.getMyProposals, { params });
  return response.data;
};

export const getProposalDetails = async (id) => {
  const response = await axiosInstance.get(PROPOSALS_ENDPOINTS.getProposalDetails(id));
  return response.data;
};

export const updateProposal = async (id, updateData) => {
  const response = await axiosInstance.put(PROPOSALS_ENDPOINTS.updateProposal(id), updateData);
  return response.data;
};

export const withdrawProposal = async (id) => {
  const response = await axiosInstance.delete(PROPOSALS_ENDPOINTS.withdrawProposal(id));
  return response.data;
};

export const getProposalStats = async () => {
  const response = await axiosInstance.get(PROPOSALS_ENDPOINTS.getProposalStats);
  return response.data;
};

export const checkIfApplied = async (jobId) => {
  const response = await axiosInstance.get(PROPOSALS_ENDPOINTS.checkIfApplied(jobId));
  return response.data;
};

export const getJobProposals = async (jobId, params = {}) => {
  const response = await axiosInstance.get(PROPOSALS_ENDPOINTS.getJobProposals(jobId), { params });
  return response.data;
};

export const getClientProposalDetails = async (id) => {
  const response = await axiosInstance.get(PROPOSALS_ENDPOINTS.getClientProposalDetails(id));
  return response.data;
};

export const acceptProposal = async (id) => {
  const response = await axiosInstance.post(PROPOSALS_ENDPOINTS.acceptProposal(id));
  return response.data;
};

export const rejectProposal = async (id, reason = null) => {
  const response = await axiosInstance.post(PROPOSALS_ENDPOINTS.rejectProposal(id), { reason });
  return response.data;
};

export const getAllClientProposals = async (params = {}) => {
  const response = await axiosInstance.get(PROPOSALS_ENDPOINTS.getAllClientProposals, { params });
  return response.data;
};

/**
 * Generate AI proposal draft
 */
export const generateProposalDraft = async (jobId) => {
  const response = await axiosInstance.get(PROPOSALS_ENDPOINTS.generateProposalDraft(jobId));
  return response.data;
};

/**
 * Regenerate AI proposal draft
 */
export const regenerateProposalDraft = async (jobId) => {
  const response = await axiosInstance.post(PROPOSALS_ENDPOINTS.regenerateProposalDraft(jobId));
  return response.data;
};

/**
 * NLP-based proposal relevance scoring
 */
export const scoreProposal = async (jobId, coverLetter) => {
  const response = await axiosInstance.post(PROPOSALS_ENDPOINTS.scoreProposal(jobId), { coverLetter });
  return response.data;
};

/**
 * Get keyword optimization hints for a job
 */
export const getJobKeywords = async (jobId) => {
  const response = await axiosInstance.get(PROPOSALS_ENDPOINTS.getJobKeywords(jobId));
  return response.data;
};

export default {
  submitProposal,
  getMyProposals,
  getProposalDetails,
  updateProposal,
  withdrawProposal,
  getProposalStats,
  checkIfApplied,
  getJobProposals,
  getClientProposalDetails,
  acceptProposal,
  rejectProposal,
  getAllClientProposals,
  generateProposalDraft,
  regenerateProposalDraft,
};
