import axiosInstance from '../axiosInstance';

/**
 * Get all jobs with filters
 */
export const getJobs = async (filters = {}) => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value);
    }
  });

  const response = await axiosInstance.get(`/admin/jobs?${params.toString()}`);
  return response.data;
};

/**
 * Get job by ID
 */
export const getJobById = async (jobId) => {
  const response = await axiosInstance.get(`/admin/jobs/${jobId}`);
  return response.data;
};

/**
 * Approve a job
 */
export const approveJob = async (jobId) => {
  const response = await axiosInstance.put(`/admin/jobs/${jobId}/approve`);
  return response.data;
};

/**
 * Reject a job
 */
export const rejectJob = async (jobId, reason) => {
  const response = await axiosInstance.put(`/admin/jobs/${jobId}/reject`, { reason });
  return response.data;
};

/**
 * Flag a job
 */
export const flagJob = async (jobId, flagData) => {
  const response = await axiosInstance.put(`/admin/jobs/${jobId}/flag`, flagData);
  return response.data;
};

/**
 * Toggle featured status
 */
export const toggleFeature = async (jobId) => {
  const response = await axiosInstance.put(`/admin/jobs/${jobId}/feature`);
  return response.data;
};

/**
 * Delete a job
 */
export const deleteJob = async (jobId) => {
  const response = await axiosInstance.delete(`/admin/jobs/${jobId}`);
  return response.data;
};

/**
 * Get job statistics
 */
export const getJobStats = async () => {
  const response = await axiosInstance.get('/admin/jobs/stats/overview');
  return response.data;
};
