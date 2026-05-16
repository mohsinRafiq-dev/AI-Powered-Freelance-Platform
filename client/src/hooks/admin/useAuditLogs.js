import { useQuery } from '@tanstack/react-query';
import * as auditLogsApi from '../../api/admin/auditLogsApi';

/**
 * Hook to get audit logs with filters
 */
export const useAuditLogs = (filters) => {
  return useQuery({
    queryKey: ['audit-logs', filters],
    queryFn: () => auditLogsApi.getAuditLogs(filters),
    keepPreviousData: true,
    staleTime: 30000, // 30 seconds
  });
};

/**
 * Hook to get audit log by ID
 */
export const useAuditLog = (logId) => {
  return useQuery({
    queryKey: ['audit-log', logId],
    queryFn: () => auditLogsApi.getAuditLogById(logId),
    enabled: !!logId,
  });
};

/**
 * Hook to get audit log statistics
 */
export const useAuditLogStats = (filters = {}) => {
  return useQuery({
    queryKey: ['audit-log-stats', filters],
    queryFn: () => auditLogsApi.getAuditLogStats(filters),
    staleTime: 60000, // 1 minute
  });
};
