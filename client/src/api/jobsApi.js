
import axiosInstance from './axiosInstance';
import JOBS_ENDPOINTS from './endpoints/jobs';


export const getAllJobs = async (params = {}) => {
  const response = await axiosInstance.get(JOBS_ENDPOINTS.getAllJobs, { params });
  return response.data;
};


export const getJobById = async (id) => {
  const response = await axiosInstance.get(JOBS_ENDPOINTS.getJobById(id));
  return response.data;
};


export const createJob = async (jobData) => {
  const response = await axiosInstance.post(JOBS_ENDPOINTS.createJob, jobData);
  return response.data;
};

export const updateJob = async (id, updateData) => {
  const response = await axiosInstance.put(JOBS_ENDPOINTS.updateJob(id), updateData);
  return response.data;
};

export const deleteJob = async (id) => {
  const response = await axiosInstance.delete(JOBS_ENDPOINTS.deleteJob(id));
  return response.data;
};

export const getMyJobs = async (params = {}) => {
  const response = await axiosInstance.get(JOBS_ENDPOINTS.getMyJobs, { params });
  return response.data;
};

export const closeJob = async (id) => {
  const response = await axiosInstance.patch(JOBS_ENDPOINTS.closeJob(id));
  return response.data;
};

export const getJobStats = async () => {
  const response = await axiosInstance.get(JOBS_ENDPOINTS.getJobStats);
  return response.data;
};

/**
 * Get AI-recommended jobs for freelancer
 */
export const getRecommendedJobs = async () => {
  const response = await axiosInstance.get(JOBS_ENDPOINTS.getRecommendedJobs);
  return response.data;
};

/**
 * Get recommended freelancers for a job
 */
export const getRecommendedFreelancers = async (jobId, params = {}) => {
  const response = await axiosInstance.get(JOBS_ENDPOINTS.getRecommendedFreelancers(jobId), { params });
  return response.data;
};

export default {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
  closeJob,
  getJobStats,
  getRecommendedJobs,
  getRecommendedFreelancers,
};
