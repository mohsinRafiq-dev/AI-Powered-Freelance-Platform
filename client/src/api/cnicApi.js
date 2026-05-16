import axiosInstance from './axiosInstance';

/**
 * Submit CNIC for verification
 */
export const submitCNIC = async (formData) => {
  const response = await axiosInstance.post('/cnic/submit', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Get my CNIC status
 */
export const getMyCNICStatus = async () => {
  const response = await axiosInstance.get('/cnic/status');
  return response.data;
};

/**
 * Get pending CNICs (Admin)
 */
export const getPendingCNICs = async (filters = {}) => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value);
    }
  });

  const response = await axiosInstance.get(`/cnic/admin/pending?${params.toString()}`);
  return response.data;
};

/**
 * Get CNIC details by user ID (Admin)
 */
export const getCNICDetails = async (userId) => {
  const response = await axiosInstance.get(`/cnic/admin/${userId}`);
  return response.data;
};

/**
 * Approve CNIC (Admin)
 */
export const approveCNIC = async (userId, cnicData) => {
  const response = await axiosInstance.put(`/cnic/admin/${userId}/approve`, cnicData);
  return response.data;
};

/**
 * Reject CNIC (Admin)
 */
export const rejectCNIC = async (userId, reason) => {
  const response = await axiosInstance.put(`/cnic/admin/${userId}/reject`, { reason });
  return response.data;
};

/**
 * Request re-upload (Admin)
 */
export const requestReupload = async (userId, reason) => {
  const response = await axiosInstance.put(`/cnic/admin/${userId}/reupload`, { reason });
  return response.data;
};

/**
 * Get CNIC statistics (Admin)
 */
export const getCNICStats = async () => {
  const response = await axiosInstance.get('/cnic/admin/stats');
  return response.data;
};
