import { useState } from 'react';
import { Card } from '../../../components/ui/card';
import {
  Shield,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  Clock,
  AlertCircle,
  Filter,
  Search,
} from 'lucide-react';
import { usePendingCNICs, useCNICStats } from '../../../hooks/admin/useCNICVerification';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { formatDate } from '../../../utils/formatters';
import CNICDetailsModal from './CNICDetailsModal';
import { AdminPageHeader, AdminFilters, AdminTable, AdminPagination, AdminLoading, AdminActions } from '../components';

const STATUS_CONFIG = {
  not_submitted: { label: 'Not Submitted', color: 'gray', icon: AlertCircle },
  pending: { label: 'Pending', color: 'yellow', icon: Clock },
  under_review: { label: 'Under Review', color: 'blue', icon: Eye },
  verified: { label: 'Verified', color: 'green', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'red', icon: XCircle },
  reupload_requested: { label: 'Re-upload Requested', color: 'orange', icon: RefreshCw },
};

const CNICVerification = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    status: 'pending',
    search: '',
  });

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, error } = usePendingCNICs(filters);
  const { data: statsData } = useCNICStats();

  const users = data?.data?.users || [];
  const pagination = data?.data?.pagination || {};
  const stats = statsData?.data || {};

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        title="CNIC Verification"
        description="Review and verify user CNIC submissions"
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(STATUS_CONFIG).map(([status, config]) => {
          const Icon = config.icon;
          const count = stats[status] || 0;
          // Standardize colors: brand for success, yellow for pending/warning, red for rejected
          const iconColorClass = 
            status === 'verified' ? 'text-brand' :
            status === 'pending' || status === 'under_review' || status === 'reupload_requested' ? 'text-yellow-600 dark:text-yellow-400' :
            status === 'rejected' ? 'text-red-600 dark:text-red-400' :
            'text-gray-600 dark:text-gray-400';
          
          return (
            <Card
              key={status}
              glass
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleFilterChange('status', status)}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${iconColorClass}`} />
                <span className="text-2xl font-bold text-brand-deepest dark:text-white">
                  {count}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">{config.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card glass className="p-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Search by name, email, or CNIC..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand focus:border-transparent"
                >
                  {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                    <option key={status} value={status}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </Card>

      {/* CNIC List */}
      <Card glass className="overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12 text-red-600 dark:text-red-400">
              <AlertCircle className="w-6 h-6 mr-2" />
              Failed to load CNIC submissions
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
              <Shield className="w-12 h-12 mb-3 opacity-50" />
              <p>No CNIC submissions found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((user) => {
                      const statusConfig = STATUS_CONFIG[user.cnic?.status || 'not_submitted'];
                      const StatusIcon = statusConfig.icon;
                      
                      return (
                        <tr
                          key={user._id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {user.email}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={statusConfig.color}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusConfig.label}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                            {user.cnic?.submittedAt ? formatDate(user.cnic.submittedAt) : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button
                              size="sm"
                              onClick={() => setSelectedUserId(user._id)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Review
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>

      {/* CNIC Details Modal */}
      {selectedUserId && (
        <CNICDetailsModal
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </div>
  );
};

export default CNICVerification;
