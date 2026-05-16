import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Calendar,
  Shield,
  User,
  Briefcase,
  AlertCircle,
  CheckCircle,
  XCircle,
  Flag,
  Star,
  Ban,
  UserX,
  Clock,
  Filter,
} from 'lucide-react';
import { useAuditLogs, useAuditLogStats } from '../../../hooks/admin/useAuditLogs';
import { exportAuditLogs } from '../../../api/admin/auditLogsApi';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { formatDate } from '../../../utils/formatters';
import toast from 'react-hot-toast';
import { AdminPageHeader, AdminFilters, AdminTable, AdminPagination, AdminLoading } from '../components';
import { useHasPermission } from '../../../hooks/admin/usePermissions';
import { PERMISSIONS } from '../../../utils/permissions';

const ACTION_CONFIG = {
  ADMIN_LOGIN: { icon: Shield, label: 'Admin Login', color: 'blue' },
  ADMIN_LOGOUT: { icon: Shield, label: 'Admin Logout', color: 'gray' },
  USER_SUSPENDED: { icon: UserX, label: 'User Suspended', color: 'orange' },
  USER_UNSUSPENDED: { icon: CheckCircle, label: 'User Unsuspended', color: 'green' },
  USER_BANNED: { icon: Ban, label: 'User Banned', color: 'red' },
  USER_UNBANNED: { icon: CheckCircle, label: 'User Unbanned', color: 'green' },
  CNIC_APPROVED: { icon: CheckCircle, label: 'CNIC Approved', color: 'green' },
  CNIC_REJECTED: { icon: XCircle, label: 'CNIC Rejected', color: 'red' },
  JOB_FLAGGED: { icon: Flag, label: 'Job Flagged', color: 'orange' },
  JOB_APPROVED: { icon: CheckCircle, label: 'Job Approved', color: 'green' },
  JOB_REJECTED: { icon: XCircle, label: 'Job Rejected', color: 'red' },
  JOB_DELETED: { icon: XCircle, label: 'Job Deleted', color: 'red' },
  JOB_FEATURED: { icon: Star, label: 'Job Featured', color: 'yellow' },
  JOB_UNFEATURED: { icon: Star, label: 'Job Unfeatured', color: 'gray' },
  USER_DELETED: { icon: XCircle, label: 'User Deleted', color: 'red' },
  ROLE_CHANGED: { icon: User, label: 'Role Changed', color: 'blue' },
};

const AuditLogs = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    action: '',
    targetType: '',
    startDate: '',
    endDate: '',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Permission check
  const canManageAuditLogs = useHasPermission(PERMISSIONS.MANAGE_AUDIT_LOGS);

  const { data, isLoading, error } = useAuditLogs(filters);
  const { data: statsData } = useAuditLogStats({
    startDate: filters.startDate,
    endDate: filters.endDate,
  });

  const logs = data?.data?.logs || [];
  const pagination = data?.data || {};
  const stats = statsData?.data || {};

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleExport = async () => {
    try {
      const blob = await exportAuditLogs(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Audit logs exported successfully');
    } catch (error) {
      toast.error('Failed to export audit logs');
    }
  };

  const getActionIcon = (action) => {
    const config = ACTION_CONFIG[action];
    if (!config) return AlertCircle;
    return config.icon;
  };

  const getActionLabel = (action) => {
    return ACTION_CONFIG[action]?.label || action.replace(/_/g, ' ');
  };

  const getActionColor = (action) => {
    return ACTION_CONFIG[action]?.color || 'gray';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <AdminPageHeader 
          title="Audit Logs"
          description="Track all administrative actions and system events"
        >
          {canManageAuditLogs && (
            <Button onClick={handleExport} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          )}
        </AdminPageHeader>

        {/* Statistics Cards */}
        {stats.totalLogs !== undefined && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Logs</p>
                  <p className="text-3xl font-bold text-brand-deepest dark:text-white">
                    {stats.totalLogs?.toLocaleString()}
                  </p>
                </div>
                <div className="bg-brand/10 p-3 rounded-lg">
                  <FileText className="w-8 h-8 text-brand" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Top Action</p>
                  <p className="text-lg font-semibold text-brand-deepest dark:text-white">
                    {stats.byAction?.[0]?._id?.replace(/_/g, ' ') || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stats.byAction?.[0]?.count || 0} times
                  </p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Admins</p>
                  <p className="text-3xl font-bold text-brand-deepest dark:text-white">
                    {stats.topAdmins?.length || 0}
                  </p>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                  <User className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-6 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-brand-deepest dark:text-white flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide' : 'Show'}
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Action Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Action Type
                </label>
                <select
                  value={filters.action}
                  onChange={(e) => handleFilterChange('action', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-transparent"
                >
                  <option value="">All Actions</option>
                  {Object.keys(ACTION_CONFIG).map((action) => (
                    <option key={action} value={action}>
                      {ACTION_CONFIG[action].label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Type
                </label>
                <select
                  value={filters.targetType}
                  onChange={(e) => handleFilterChange('targetType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="User">User</option>
                  <option value="Job">Job</option>
                  <option value="System">System</option>
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  max={filters.endDate || new Date().toISOString().split('T')[0]}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-transparent"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  min={filters.startDate}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {isLoading ? (
            <AdminLoading message="Loading audit logs..." />
          ) : error ? (
            <div className="flex items-center justify-center py-12 text-red-600 dark:text-red-400">
              <AlertCircle className="w-6 h-6 mr-2" />
              Failed to load audit logs
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
              <FileText className="w-12 h-12 mb-3 opacity-50" />
              <p>No audit logs found</p>
            </div>
          ) : (
            <>
              <AdminTable>
                <AdminTable.Header>
                  <AdminTable.HeaderCell>Date & Time</AdminTable.HeaderCell>
                  <AdminTable.HeaderCell>Admin</AdminTable.HeaderCell>
                  <AdminTable.HeaderCell>Action</AdminTable.HeaderCell>
                  <AdminTable.HeaderCell>Target</AdminTable.HeaderCell>
                  <AdminTable.HeaderCell>Details</AdminTable.HeaderCell>
                </AdminTable.Header>
                <AdminTable.Body>
                  {logs.map((log, index) => {
                  const ActionIcon = getActionIcon(log.action);
                  return (
                    <AdminTable.Row
                      key={log._id}
                      index={index}
                    >
                      <AdminTable.Cell>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white font-medium">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {formatDate(log.createdAt, 'SHORT')}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                            {formatDate(log.createdAt, 'TIME_ONLY')}
                          </div>
                        </div>
                      </AdminTable.Cell>
                      <AdminTable.Cell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-brand" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {log.adminId?.name || 'Unknown'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {log.adminId?.email || ''}
                            </p>
                          </div>
                        </div>
                      </AdminTable.Cell>
                      <AdminTable.Cell>
                        <Badge variant={getActionColor(log.action)}>
                          <ActionIcon className="w-3 h-3 mr-1" />
                          {getActionLabel(log.action)}
                        </Badge>
                      </AdminTable.Cell>
                      <AdminTable.Cell>
                        <div>
                          {log.targetName ? (
                            <>
                              <p className="text-sm text-gray-900 dark:text-white">
                                {log.targetName}
                              </p>
                              {log.targetType && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {log.targetType}
                                </p>
                              )}
                            </>
                          ) : log.action === 'ADMIN_LOGIN' || log.action === 'ADMIN_LOGOUT' ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                              System
                            </p>
                          ) : (
                            <p className="text-sm text-gray-400">—</p>
                          )}
                        </div>
                      </AdminTable.Cell>
                      <AdminTable.Cell>
                        <div className="text-sm text-gray-600 dark:text-gray-300 max-w-xs">
                          {log.metadata?.reason ? (
                            <span className="block truncate">{log.metadata.reason}</span>
                          ) : log.metadata?.notes ? (
                            <span className="block truncate">{log.metadata.notes}</span>
                          ) : log.details?.email ? (
                            <span>Logged in as {log.details.email}</span>
                          ) : log.details?.jobId ? (
                            <span>Job ID: {log.details.jobId}</span>
                          ) : log.ipAddress ? (
                            <span className="text-xs">IP: {log.ipAddress}</span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </div>
                      </AdminTable.Cell>
                    </AdminTable.Row>
                    );
                  })}
                </AdminTable.Body>
              </AdminTable>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <AdminPagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.total}
                  itemsPerPage={filters.limit}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
