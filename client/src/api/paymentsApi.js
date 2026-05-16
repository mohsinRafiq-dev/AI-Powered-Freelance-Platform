import axiosInstance from './axiosInstance.js';

/**
 * Payments API
 * Handles all payment-related API calls
 */

const paymentsApi = {
  /**
   * Initialize deposit payment
   */
  initDeposit: async (data) => {
    const response = await axiosInstance.post('/payments/deposit/initialize', data);
    return response.data;
  },

  /**
   * Verify deposit payment callback
   */
  verifyDeposit: async (data) => {
    const response = await axiosInstance.post('/payments/deposit/verify', data);
    return response.data;
  },

  /**
   * Get wallet balance
   */
  getWallet: async () => {
    const response = await axiosInstance.get('/payments/wallet');
    return response.data;
  },

  /**
   * Get transaction history
   */
  getTransactions: async (filters = {}) => {
    // Filter out empty values to avoid validation errors
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    const params = new URLSearchParams(cleanFilters).toString();
    const queryString = params ? `?${params}` : '';
    const response = await axiosInstance.get(`/payments/transactions${queryString}`);
    return response.data;
  },

  /**
   * Get payment methods
   */
  getPaymentMethods: async () => {
    const response = await axiosInstance.get('/payments/methods');
    return response.data;
  },

  /**
   * Create withdrawal request
   */
  createWithdrawal: async (data) => {
    const response = await axiosInstance.post('/payments/withdrawals', data);
    return response.data;
  },

  /**
   * Get withdrawal history
   */
  getWithdrawals: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await axiosInstance.get(`/payments/withdrawals?${params}`);
    return response.data;
  },

  /**
   * Get withdrawal by ID
   */
  getWithdrawal: async (id) => {
    const response = await axiosInstance.get(`/payments/withdrawals/${id}`);
    return response.data;
  },

  /**
   * Cancel withdrawal
   */
  cancelWithdrawal: async (id) => {
    const response = await axiosInstance.delete(`/payments/withdrawals/${id}`);
    return response.data;
  },

  /**
   * Get escrows for contract
   */
  getContractEscrows: async (contractId) => {
    const response = await axiosInstance.get(`/payments/contracts/${contractId}/escrows`);
    return response.data;
  },

  /**
   * Get escrow for milestone
   */
  getMilestoneEscrow: async (contractId, milestoneId) => {
    const response = await axiosInstance.get(
      `/payments/contracts/${contractId}/milestones/${milestoneId}/escrow`
    );
    return response.data;
  },

  /**
   * Initialize JazzCash payment (legacy support)
   */
  initJazzCash: async (paymentData) => {
    return paymentsApi.initDeposit({
      ...paymentData,
      paymentMethod: 'JAZZCASH',
    });
  },

  /**
   * Initialize Easypaisa payment (legacy support)
   */
  initEasypaisa: async (paymentData) => {
    return paymentsApi.initDeposit({
      ...paymentData,
      paymentMethod: 'EASYPAISA',
    });
  },
};

export default paymentsApi;

