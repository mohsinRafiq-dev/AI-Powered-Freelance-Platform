import axiosInstance from '../axiosInstance';

/**
 * Get audit logs with filters
 */
export const getAuditLogs = async (filters = {}) => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value);
    }
  });

  const response = await axiosInstance.get(`/admin/audit-logs?${params.toString()}`);
  return response.data;
};

/**
 * Get audit log by ID
 */
export const getAuditLogById = async (logId) => {
  const response = await axiosInstance.get(`/admin/audit-logs/${logId}`);
  return response.data;
};

/**
 * Create a new audit log entry
 */
export const createAuditLog = async (logData) => {
  const response = await axiosInstance.post('/admin/audit-logs', logData);
  return response.data;
};

/**
 * Get audit log statistics
 */
export const getAuditLogStats = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);

  const response = await axiosInstance.get(`/admin/audit-logs/stats?${params.toString()}`);
  return response.data;
};

/**
 * Export audit logs to CSV
 */
export const exportAuditLogs = async (filters = {}) => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value);
    }
  });

  const response = await axiosInstance.get(`/admin/audit-logs/export/csv?${params.toString()}`, {
    responseType: 'blob',
  });
  
  return response.data;
};
