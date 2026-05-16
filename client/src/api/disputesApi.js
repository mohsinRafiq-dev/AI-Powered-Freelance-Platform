import axiosInstance from './axiosInstance';

const DISPUTE_ENDPOINTS = {
  list: '/disputes',
  create: '/disputes',
  byId: (disputeId) => `/disputes/${disputeId}`,
  byContract: (contractId) => `/disputes/contract/${contractId}`,
  resolve: (disputeId) => `/disputes/${disputeId}/resolve`,
  reject: (disputeId) => `/disputes/${disputeId}/reject`,
  addNote: (disputeId) => `/disputes/${disputeId}/notes`,
  updateStatus: (disputeId) => `/disputes/${disputeId}/status`,
  stats: '/disputes/stats',
};

/**
 * Get all disputes (admin only)
 */
export const getAllDisputes = async (params = {}) => {
  const response = await axiosInstance.get(DISPUTE_ENDPOINTS.list, { params });
  return response.data;
};

/**
 * Get dispute by ID
 */
export const getDisputeById = async (disputeId) => {
  const response = await axiosInstance.get(DISPUTE_ENDPOINTS.byId(disputeId));
  return response.data;
};

/**
 * Get disputes by contract ID
 */
export const getDisputesByContract = async (contractId) => {
  const response = await axiosInstance.get(DISPUTE_ENDPOINTS.byContract(contractId));
  return response.data;
};

/**
 * Create a new dispute
 */
export const createDispute = async (disputeData) => {
  const response = await axiosInstance.post(DISPUTE_ENDPOINTS.create, disputeData);
  return response.data;
};

/**
 * Resolve a dispute (admin only)
 */
export const resolveDispute = async (disputeId, resolution) => {
  const response = await axiosInstance.post(DISPUTE_ENDPOINTS.resolve(disputeId), {
    resolution,
  });
  return response.data;
};

/**
 * Reject a dispute (admin only)
 */
export const rejectDispute = async (disputeId, reason) => {
  const response = await axiosInstance.post(DISPUTE_ENDPOINTS.reject(disputeId), {
    reason,
  });
  return response.data;
};

/**
 * Add admin note to dispute
 */
export const addAdminNote = async (disputeId, note) => {
  const response = await axiosInstance.post(DISPUTE_ENDPOINTS.addNote(disputeId), {
    note,
  });
  return response.data;
};

/**
 * Update dispute status (admin only)
 */
export const updateDisputeStatus = async (disputeId, status, notes) => {
  const response = await axiosInstance.patch(DISPUTE_ENDPOINTS.updateStatus(disputeId), {
    status,
    notes,
  });
  return response.data;
};

/**
 * Get dispute statistics (admin only)
 */
export const getDisputeStats = async () => {
  const response = await axiosInstance.get(DISPUTE_ENDPOINTS.stats);
  return response.data;
};

export default {
  getAllDisputes,
  getDisputeById,
  getDisputesByContract,
  createDispute,
  resolveDispute,
  rejectDispute,
  addAdminNote,
  updateDisputeStatus,
  getDisputeStats,
};
