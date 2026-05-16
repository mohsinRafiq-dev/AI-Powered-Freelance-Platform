import axiosInstance from '../axiosInstance';

const HEALTH_ENDPOINTS = {
  dashboard: '/admin/health/dashboard',
  system: '/admin/health/system',
  ai: '/admin/health/ai',
  circuitBreaker: '/admin/health/circuit-breaker',
  resetCircuitBreaker: '/admin/health/circuit-breaker/reset',
};

/**
 * Get comprehensive health dashboard
 */
export const getHealthDashboard = async () => {
  const response = await axiosInstance.get(HEALTH_ENDPOINTS.dashboard);
  return response.data;
};

/**
 * Get system health
 */
export const getSystemHealth = async () => {
  const response = await axiosInstance.get(HEALTH_ENDPOINTS.system);
  return response.data;
};

/**
 * Get AI health
 */
export const getAIHealth = async () => {
  const response = await axiosInstance.get(HEALTH_ENDPOINTS.ai);
  return response.data;
};

/**
 * Get circuit breaker stats
 */
export const getCircuitBreakerStats = async () => {
  const response = await axiosInstance.get(HEALTH_ENDPOINTS.circuitBreaker);
  return response.data;
};

/**
 * Reset circuit breaker
 */
export const resetCircuitBreaker = async () => {
  const response = await axiosInstance.post(HEALTH_ENDPOINTS.resetCircuitBreaker);
  return response.data;
};

export default {
  getHealthDashboard,
  getSystemHealth,
  getAIHealth,
  getCircuitBreakerStats,
  resetCircuitBreaker,
};
