import envConfig from '../app/config/envConfig';
import paymentsApi from '../api/paymentsApi';
import { formatCurrency } from '@/utils/formatters';
import logger from '@/utils/logger';

/**
 * Payment Service
 * Handles payment gateway integrations (JazzCash, Easypaisa, Bank Transfer)
 * and wallet operations
 */

/**
 * Initialize JazzCash payment
 * @param {Object} paymentData - Payment details
 * @returns {Promise<Object>} Payment initialization response
 */
const initializeJazzCash = async (paymentData) => {
  try {
    const response = await paymentsApi.initJazzCash(paymentData);
    
    // Redirect to JazzCash gateway if URL provided
    if (response.data?.paymentUrl) {
      window.location.href = response.data.paymentUrl;
    }

    return response;
  } catch (error) {
    logger.error('JazzCash initialization error:', error);
    throw error;
  }
};

/**
 * Initialize Easypaisa payment
 * @param {Object} paymentData - Payment details
 * @returns {Promise<Object>} Payment initialization response
 */
const initializeEasypaisa = async (paymentData) => {
  try {
    const response = await paymentsApi.initEasypaisa(paymentData);
    
    // Redirect to Easypaisa gateway if URL provided
    if (response.data?.paymentUrl) {
      window.location.href = response.data.paymentUrl;
    }

    return response;
  } catch (error) {
    logger.error('Easypaisa initialization error:', error);
    throw error;
  }
};

/**
 * Initialize deposit payment
 * @param {Object} paymentData - Payment details
 * @returns {Promise<Object>} Payment initialization response
 */
const initializeDeposit = async (paymentData) => {
  try {
    const response = await paymentsApi.initDeposit(paymentData);
    return response;
  } catch (error) {
    logger.error('Deposit initialization error:', error);
    throw error;
  }
};

/**
 * Verify deposit payment callback
 * @param {Object} callbackData - Callback data from gateway
 * @returns {Promise<Object>} Verification result
 */
const verifyDeposit = async (callbackData) => {
  try {
    const response = await paymentsApi.verifyDeposit(callbackData);
    return response;
  } catch (error) {
    logger.error('Payment callback error:', error);
    throw error;
  }
};

/**
 * Process payment callback (legacy support)
 * @param {string} gateway - Payment gateway name
 * @param {Object} callbackData - Callback data
 * @returns {Promise<Object>} Verification result
 */
const processCallback = async (gateway, callbackData) => {
  try {
    const paymentMethod = gateway.toUpperCase();
    const transactionId = callbackData.transactionId || callbackData.orderId;
    
    const response = await paymentsApi.verifyDeposit({
      transactionId,
      callbackData,
      paymentMethod,
    });
    
    return response;
  } catch (error) {
    logger.error('Payment callback error:', error);
    throw error;
  }
};

/**
 * Get wallet balance
 * @returns {Promise<Object>} Wallet balance
 */
const getWallet = async () => {
  try {
    const response = await paymentsApi.getWallet();
    return response.data;
  } catch (error) {
    logger.error('Get wallet error:', error);
    throw error;
  }
};

/**
 * Get transaction history
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Transaction history
 */
const getTransactions = async (filters = {}) => {
  try {
    const response = await paymentsApi.getTransactions(filters);
    return response.data;
  } catch (error) {
    logger.error('Get transactions error:', error);
    throw error;
  }
};

/**
 * Get payment methods
 * @returns {Promise<Object>} Available payment methods
 */
const getPaymentMethods = async () => {
  try {
    const response = await paymentsApi.getPaymentMethods();
    return response.data;
  } catch (error) {
    logger.error('Get payment methods error:', error);
    throw error;
  }
};

/**
 * Create withdrawal request
 * @param {Object} withdrawalData - Withdrawal details
 * @returns {Promise<Object>} Withdrawal request
 */
const createWithdrawal = async (withdrawalData) => {
  try {
    const response = await paymentsApi.createWithdrawal(withdrawalData);
    return response.data;
  } catch (error) {
    logger.error('Create withdrawal error:', error);
    throw error;
  }
};

/**
 * Get withdrawal history
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} Withdrawal history
 */
const getWithdrawals = async (filters = {}) => {
  try {
    const response = await paymentsApi.getWithdrawals(filters);
    return response.data;
  } catch (error) {
    logger.error('Get withdrawals error:', error);
    throw error;
  }
};

/**
 * Cancel withdrawal
 * @param {string} withdrawalId - Withdrawal ID
 * @returns {Promise<Object>} Cancelled withdrawal
 */
const cancelWithdrawal = async (withdrawalId) => {
  try {
    const response = await paymentsApi.cancelWithdrawal(withdrawalId);
    return response.data;
  } catch (error) {
    logger.error('Cancel withdrawal error:', error);
    throw error;
  }
};

/**
 * Get escrows for contract
 * @param {string} contractId - Contract ID
 * @returns {Promise<Array>} Escrows
 */
const getContractEscrows = async (contractId) => {
  try {
    const response = await paymentsApi.getContractEscrows(contractId);
    return response.data;
  } catch (error) {
    logger.error('Get contract escrows error:', error);
    throw error;
  }
};

/**
 * Get escrow for milestone
 * @param {string} contractId - Contract ID
 * @param {string} milestoneId - Milestone ID
 * @returns {Promise<Object>} Escrow
 */
const getMilestoneEscrow = async (contractId, milestoneId) => {
  try {
    const response = await paymentsApi.getMilestoneEscrow(contractId, milestoneId);
    return response.data;
  } catch (error) {
    logger.error('Get milestone escrow error:', error);
    throw error;
  }
};

/**
 * Validate amount
 * @param {number} amount - Amount to validate
 * @param {string} type - 'deposit' or 'withdrawal'
 * @returns {Object} Validation result
 */
const validateAmount = (amount, type = 'deposit') => {
  const limits = {
    deposit: { min: 100, max: 500000 },
    withdrawal: { min: 1000, max: 100000 },
  };

  const { min, max } = limits[type] || limits.deposit;

  if (amount < min) {
    return {
      valid: false,
      message: `Minimum amount is ${formatCurrency(min)}`,
    };
  }

  if (amount > max) {
    return {
      valid: false,
      message: `Maximum amount is ${formatCurrency(max)}`,
    };
  }

  return { valid: true };
};

const paymentService = {
  initializeJazzCash,
  initializeEasypaisa,
  initializeDeposit,
  verifyDeposit,
  processCallback,
  getWallet,
  getTransactions,
  getPaymentMethods,
  createWithdrawal,
  getWithdrawals,
  cancelWithdrawal,
  getContractEscrows,
  getMilestoneEscrow,
  validateAmount,
};

export default paymentService;
