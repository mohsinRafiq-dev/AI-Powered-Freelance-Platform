const JOBS_ENDPOINTS = {
  // Public endpoints - Anyone can view jobs
  getAllJobs: '/jobs',
  getJobById: (id) => `/jobs/${id}`,
  
  // Client-only endpoints
  createJob: '/jobs',
  updateJob: (id) => `/jobs/${id}`,
  deleteJob: (id) => `/jobs/${id}`,
  getMyJobs: '/jobs/client/my-jobs',
  closeJob: (id) => `/jobs/${id}/close`,
  getJobStats: '/jobs/client/stats',
  
  // AI-enhanced endpoints
  getRecommendedJobs: '/jobs/freelancer/recommended',
  getRecommendedFreelancers: (jobId) => `/jobs/${jobId}/recommended-freelancers`,
};

export default JOBS_ENDPOINTS;
