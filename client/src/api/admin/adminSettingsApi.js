import axiosInstance from '../axiosInstance';
import ADMIN_ENDPOINTS from '../endpoints/admin';

/**
 * Get admin settings
 */
export const getAdminSettings = async () => {
  const response = await axiosInstance.get(ADMIN_ENDPOINTS.getAdminSettings);
  return response.data;
};

/**
 * Update admin settings
 */
export const updateAdminSettings = async (updates) => {
  const response = await axiosInstance.put(ADMIN_ENDPOINTS.updateAdminSettings, updates);
  return response.data;
};

/**
 * Get AI feature status (public endpoint)
 */
export const getAIFeatureStatus = async () => {
  const response = await axiosInstance.get(ADMIN_ENDPOINTS.getAIFeatureStatus);
  return response.data;
};

export default {
  getAdminSettings,
  updateAdminSettings,
  getAIFeatureStatus,
};





