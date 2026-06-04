import axiosInstance from '../axiosInstance';

/**
 * Get dashboard metrics
 */
export const getDashboardMetrics = async () => {
  const response = await axiosInstance.get('/admin/analytics/dashboard');
  return response.data;
};

/**
 * Get user growth report
 */
export const getUserGrowthReport = async (startDate, endDate, interval = 'day') => {
  const params = new URLSearchParams({ startDate, endDate, interval });
  const response = await axiosInstance.get(`/admin/analytics/user-growth?${params.toString()}`);
  return response.data;
};

/**
 * Get revenue report
 */
export const getRevenueReport = async (startDate, endDate) => {
  const params = new URLSearchParams({ startDate, endDate });
  const response = await axiosInstance.get(`/admin/analytics/revenue?${params.toString()}`);
  return response.data;
};

/**
 * Get category distribution
 */
export const getCategoryDistribution = async () => {
  const response = await axiosInstance.get('/admin/analytics/categories');
  return response.data;
};

/**
 * Get flagged jobs report
 */
export const getFlaggedJobsReport = async (startDate, endDate) => {
  const params = new URLSearchParams({ startDate, endDate });
  const response = await axiosInstance.get(`/admin/analytics/flagged-jobs?${params.toString()}`);
  return response.data;
};

/**
 * Export to PDF
 */
export const exportToPDF = async (startDate, endDate) => {
  const params = new URLSearchParams({ startDate, endDate });
  const response = await axiosInstance.get(`/admin/analytics/export/pdf?${params.toString()}`, {
    responseType: 'blob'
  });
  return response.data;
};

/**
 * Export to Excel
 */
export const exportToExcel = async (startDate, endDate) => {
  const params = new URLSearchParams({ startDate, endDate });
  const response = await axiosInstance.get(`/admin/analytics/export/excel?${params.toString()}`, {
    responseType: 'blob'
  });
  return response.data;
};

/**
 * Export to CSV
 */
export const exportToCSV = async (startDate, endDate) => {
  const params = new URLSearchParams({ startDate, endDate });
  const response = await axiosInstance.get(`/admin/analytics/export/csv?${params.toString()}`, {
    responseType: 'blob'
  });
  return response.data;
};

// ---- ML trend forecasting ----
export const getUserGrowthForecast = async (horizon = 14, lookback = 60) => {
  const res = await axiosInstance.get('/admin/analytics/forecast/users', { params: { horizon, lookback } });
  return res.data;
};

export const getRevenueForecast = async (horizon = 14, lookback = 60) => {
  const res = await axiosInstance.get('/admin/analytics/forecast/revenue', { params: { horizon, lookback } });
  return res.data;
};

export const getJobPostingsForecast = async (horizon = 14, lookback = 60) => {
  const res = await axiosInstance.get('/admin/analytics/forecast/jobs', { params: { horizon, lookback } });
  return res.data;
};

export const getSkillDemandTrends = async (lookback = 90, top = 15) => {
  const res = await axiosInstance.get('/admin/analytics/skill-demand', { params: { lookback, top } });
  return res.data;
};
