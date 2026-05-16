import axiosInstance from '@/api/axiosInstance';
import * as jobsApi from '@/api/jobsApi';
import JOBS_ENDPOINTS from '@/api/endpoints/jobs';

jest.mock('@/api/axiosInstance');
jest.mock('@/api/endpoints/jobs', () => ({
  getAllJobs: '/api/jobs',
  getJobById: (id) => `/api/jobs/${id}`,
  createJob: '/api/jobs',
  updateJob: (id) => `/api/jobs/${id}`,
  deleteJob: (id) => `/api/jobs/${id}`,
  getMyJobs: '/api/jobs/my-jobs',
  closeJob: (id) => `/api/jobs/${id}/close`,
  getJobStats: '/api/jobs/stats',
  getRecommendedJobs: '/api/jobs/recommended',
  getRecommendedFreelancers: (jobId) => `/api/jobs/${jobId}/recommended-freelancers`,
}));

describe('jobsApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllJobs', () => {
    it('should fetch all jobs with params', async () => {
      const params = { page: 1, limit: 10 };
      const mockResponse = { data: { jobs: [] } };
      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await jobsApi.getAllJobs(params);
      expect(axiosInstance.get).toHaveBeenCalledWith(JOBS_ENDPOINTS.getAllJobs, { params });
      expect(result).toEqual(mockResponse.data);
    });

    it('should fetch all jobs without params', async () => {
      const mockResponse = { data: { jobs: [] } };
      axiosInstance.get.mockResolvedValue(mockResponse);

      await jobsApi.getAllJobs();
      expect(axiosInstance.get).toHaveBeenCalledWith(JOBS_ENDPOINTS.getAllJobs, { params: {} });
    });
  });

  describe('getJobById', () => {
    it('should fetch job by id', async () => {
      const jobId = '123';
      const mockResponse = { data: { job: { id: jobId } } };
      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await jobsApi.getJobById(jobId);
      expect(axiosInstance.get).toHaveBeenCalledWith(JOBS_ENDPOINTS.getJobById(jobId));
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('createJob', () => {
    it('should create a new job', async () => {
      const jobData = { title: 'Test Job', description: 'Test Description' };
      const mockResponse = { data: { job: { id: '123', ...jobData } } };
      axiosInstance.post.mockResolvedValue(mockResponse);

      const result = await jobsApi.createJob(jobData);
      expect(axiosInstance.post).toHaveBeenCalledWith(JOBS_ENDPOINTS.createJob, jobData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('updateJob', () => {
    it('should update a job', async () => {
      const jobId = '123';
      const updateData = { title: 'Updated Title' };
      const mockResponse = { data: { job: { id: jobId, ...updateData } } };
      axiosInstance.put.mockResolvedValue(mockResponse);

      const result = await jobsApi.updateJob(jobId, updateData);
      expect(axiosInstance.put).toHaveBeenCalledWith(JOBS_ENDPOINTS.updateJob(jobId), updateData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('deleteJob', () => {
    it('should delete a job', async () => {
      const jobId = '123';
      const mockResponse = { data: { success: true } };
      axiosInstance.delete.mockResolvedValue(mockResponse);

      const result = await jobsApi.deleteJob(jobId);
      expect(axiosInstance.delete).toHaveBeenCalledWith(JOBS_ENDPOINTS.deleteJob(jobId));
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getMyJobs', () => {
    it('should fetch user jobs', async () => {
      const params = { status: 'open' };
      const mockResponse = { data: { jobs: [] } };
      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await jobsApi.getMyJobs(params);
      expect(axiosInstance.get).toHaveBeenCalledWith(JOBS_ENDPOINTS.getMyJobs, { params });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('closeJob', () => {
    it('should close a job', async () => {
      const jobId = '123';
      const mockResponse = { data: { job: { id: jobId, status: 'closed' } } };
      axiosInstance.patch.mockResolvedValue(mockResponse);

      const result = await jobsApi.closeJob(jobId);
      expect(axiosInstance.patch).toHaveBeenCalledWith(JOBS_ENDPOINTS.closeJob(jobId));
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getJobStats', () => {
    it('should fetch job statistics', async () => {
      const mockResponse = { data: { stats: {} } };
      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await jobsApi.getJobStats();
      expect(axiosInstance.get).toHaveBeenCalledWith(JOBS_ENDPOINTS.getJobStats);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getRecommendedJobs', () => {
    it('should fetch recommended jobs', async () => {
      const mockResponse = { data: { jobs: [] } };
      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await jobsApi.getRecommendedJobs();
      expect(axiosInstance.get).toHaveBeenCalledWith(JOBS_ENDPOINTS.getRecommendedJobs);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getRecommendedFreelancers', () => {
    it('should fetch recommended freelancers for a job', async () => {
      const jobId = '123';
      const params = { limit: 10 };
      const mockResponse = { data: { freelancers: [] } };
      axiosInstance.get.mockResolvedValue(mockResponse);

      const result = await jobsApi.getRecommendedFreelancers(jobId, params);
      expect(axiosInstance.get).toHaveBeenCalledWith(
        JOBS_ENDPOINTS.getRecommendedFreelancers(jobId),
        { params }
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
});


