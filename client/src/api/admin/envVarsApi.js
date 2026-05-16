import axiosInstance from '../axiosInstance';
import ADMIN_ENDPOINTS from '../endpoints/admin';

/**
 * Get all environment variables
 */
export const getEnvVars = async () => {
  const response = await axiosInstance.get(ADMIN_ENDPOINTS.getEnvVars);
  return response.data;
};

/**
 * Get a single environment variable
 */
export const getEnvVar = async (key) => {
  const response = await axiosInstance.get(`${ADMIN_ENDPOINTS.getEnvVar}/${key}`);
  return response.data;
};

/**
 * Create or update an environment variable
 */
export const setEnvVar = async (data) => {
  const response = await axiosInstance.post(ADMIN_ENDPOINTS.setEnvVar, data);
  return response.data;
};

/**
 * Update an environment variable
 */
export const updateEnvVar = async (key, data) => {
  const response = await axiosInstance.put(`${ADMIN_ENDPOINTS.setEnvVar}/${key}`, data);
  return response.data;
};

/**
 * Delete an environment variable
 */
export const deleteEnvVar = async (key) => {
  const response = await axiosInstance.delete(`${ADMIN_ENDPOINTS.deleteEnvVar}/${key}`);
  return response.data;
};

/**
 * Bulk set environment variables
 */
export const setBulkEnvVars = async (variables) => {
  const response = await axiosInstance.post(ADMIN_ENDPOINTS.setBulkEnvVars, { variables });
  return response.data;
};

/**
 * Get public environment variables (for frontend)
 */
export const getPublicEnvVars = async () => {
  const response = await axiosInstance.get(ADMIN_ENDPOINTS.getPublicEnvVars);
  return response.data;
};

export default {
  getEnvVars,
  getEnvVar,
  setEnvVar,
  updateEnvVar,
  deleteEnvVar,
  setBulkEnvVars,
  getPublicEnvVars,
};

