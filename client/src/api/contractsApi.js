import axiosInstance from './axiosInstance';
import ENDPOINTS from './endpoints/contracts';

// Create contract from proposal
export const createContractFromProposal = async (data) => {
  const response = await axiosInstance.post(
    ENDPOINTS.CONTRACTS.CREATE_FROM_PROPOSAL,
    data
  );
  return response.data;
};

// Get all contracts for current user
export const getMyContracts = async (params = {}) => {
  // [CONTRACTS][UI] Log API call details
  console.log('\n========================================');
  console.log('[CONTRACTS][UI][API] getMyContracts called');
  console.log('[CONTRACTS][UI][API] Raw params:', JSON.stringify(params));
  
  // Filter out empty/undefined values to avoid validation errors
  const cleanParams = {};
  Object.keys(params).forEach(key => {
    if (params[key] !== '' && params[key] !== undefined && params[key] !== null) {
      cleanParams[key] = params[key];
    }
  });
  
  console.log('[CONTRACTS][UI][API] Clean params:', JSON.stringify(cleanParams));
  console.log('[CONTRACTS][UI][API] URL:', ENDPOINTS.CONTRACTS.GET_MY_CONTRACTS);
  console.log('========================================\n');
  
  const response = await axiosInstance.get(ENDPOINTS.CONTRACTS.GET_MY_CONTRACTS, {
    params: cleanParams,
  });
  
  console.log('[CONTRACTS][UI][API] Response received, status:', response.status);
  console.log('[CONTRACTS][UI][API] Contracts in response:', response.data?.data?.contracts?.length || 0);
  
  return response.data;
};

// Get contract by ID
export const getContractById = async (id) => {
  console.log('[CONTRACT][DETAIL][API] Fetching contract by ID:', id);
  const response = await axiosInstance.get(ENDPOINTS.CONTRACTS.GET_CONTRACT(id));
  console.log('[CONTRACT][DETAIL][API] Response status:', response.status);
  console.log('[CONTRACT][DETAIL][API] Response data:', response.data);
  console.log('[CONTRACT][DETAIL][API] Contract object:', response.data?.data?.contract);
  return response.data;
};

// Accept or decline contract
export const respondToContract = async (id, action, reason) => {
  // Validate required parameters
  if (!id) {
    throw new Error('Contract ID is required');
  }
  if (!action || !['accept', 'decline'].includes(action)) {
    throw new Error('Valid action (accept/decline) is required');
  }
  if (action === 'decline' && !reason) {
    throw new Error('Reason is required when declining a contract');
  }
  
  const response = await axiosInstance.post(
    ENDPOINTS.CONTRACTS.RESPOND_TO_CONTRACT(id),
    { action, reason }
  );
  return response.data;
};

// Add milestone to contract
export const addMilestone = async (id, milestoneData) => {
  const response = await axiosInstance.post(
    ENDPOINTS.CONTRACTS.ADD_MILESTONE(id),
    milestoneData
  );
  return response.data;
};

// Update milestone
export const updateMilestone = async (id, milestoneId, updateData) => {
  const response = await axiosInstance.patch(
    ENDPOINTS.CONTRACTS.UPDATE_MILESTONE(id, milestoneId),
    updateData
  );
  return response.data;
};

// Complete contract
export const completeContract = async (id) => {
  const response = await axiosInstance.post(
    ENDPOINTS.CONTRACTS.COMPLETE_CONTRACT(id)
  );
  return response.data;
};

// Cancel contract
export const cancelContract = async (id, reason) => {
  const response = await axiosInstance.post(
    ENDPOINTS.CONTRACTS.CANCEL_CONTRACT(id),
    { reason }
  );
  return response.data;
};

// Get contract statistics
export const getMyContractStats = async () => {
  const response = await axiosInstance.get(ENDPOINTS.CONTRACTS.GET_MY_STATS);
  return response.data;
};

// Fund milestone escrow
export const fundMilestoneEscrow = async (contractId, milestoneId, paymentData) => {
  const response = await axiosInstance.post(
    `/api/contracts/${contractId}/milestones/${milestoneId}/fund`,
    paymentData
  );
  return response.data;
};

// Approve milestone and release escrow
export const approveMilestone = async (contractId, milestoneId) => {
  const response = await axiosInstance.post(
    `/api/contracts/${contractId}/milestones/${milestoneId}/approve`
  );
  return response.data;
};

// Verify contract payment
export const verifyContractPayment = async (contractId, callbackData, paymentMethod) => {
  const response = await axiosInstance.post(
    `/api/contracts/${contractId}/verify-payment`,
    { callbackData, paymentMethod }
  );
  return response.data;
};

// Default export - object with all contract API methods
const contractsApi = {
  createContractFromProposal,
  getMyContracts,
  getContractById,
  respondToContract,
  addMilestone,
  updateMilestone,
  completeContract,
  cancelContract,
  getMyContractStats,
  fundMilestoneEscrow,
  approveMilestone,
  verifyContractPayment,
};

export default contractsApi;