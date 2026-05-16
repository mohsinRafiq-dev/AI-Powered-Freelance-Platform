import { useState } from 'react';
import { useUsers, useExportUsers } from '../../../hooks/admin/useUserManagement';
import UserTable from './UserTable';
import UserDetailsModal from './UserDetailsModal';
import { Card } from '../../../components/ui/card';
import { 
  AdminPageHeader, 
  AdminActions, 
  AdminFilters, 
  FilterSelect,
  AdminLoading 
} from '../components';

const UserManagement = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    role: '',
    status: '',
    isVerified: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { data, isLoading, refetch } = useUsers(filters);
  const exportMutation = useExportUsers();

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      role: '',
      status: '',
      isVerified: '',
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const handleExport = (format = 'excel') => {
    exportMutation.mutate({
      filters: {
        role: filters.role,
        status: filters.status,
        isVerified: filters.isVerified,
        search: filters.search,
      },
      format,
    });
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const activeFiltersCount = [
    filters.role,
    filters.status,
    filters.isVerified,
    filters.search,
  ].filter(Boolean).length;

  if (isLoading) {
    return <AdminLoading message="Loading users..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        title="User Management"
        description="Manage and monitor all platform users"
        actions={
          <AdminActions
            onRefresh={refetch}
            onExport={() => handleExport('excel')}
            isRefreshing={isLoading}
            isExporting={exportMutation.isLoading}
          />
        }
      />

      {/* Filters Card */}
      <Card glass className="p-6">
        <AdminFilters
          searchValue={filters.search}
          onSearchChange={(value) => setFilters((prev) => ({ ...prev, search: value, page: 1 }))}
          activeFiltersCount={activeFiltersCount}
          onResetFilters={handleResetFilters}
          filters={[
            { key: 'role', label: 'Role' },
            { key: 'status', label: 'Status' },
            { key: 'isVerified', label: 'Verification' }
          ]}
        >
          <FilterSelect
            label="Role"
            value={filters.role}
            onChange={(value) => handleFilterChange('role', value)}
            options={[
              { value: 'freelancer', label: 'Freelancer' },
              { value: 'client', label: 'Client' },
              { value: 'admin', label: 'Admin' }
            ]}
          />

          <FilterSelect
            label="Status"
            value={filters.status}
            onChange={(value) => handleFilterChange('status', value)}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'suspended', label: 'Suspended' },
              { value: 'banned', label: 'Banned' }
            ]}
          />

          <FilterSelect
            label="Verification"
            value={filters.isVerified}
            onChange={(value) => handleFilterChange('isVerified', value)}
            options={[
              { value: 'true', label: 'Verified' },
              { value: 'false', label: 'Not Verified' }
            ]}
          />
        </AdminFilters>
      </Card>

      {/* Users Table */}
      <UserTable
        users={data?.data?.users || []}
        pagination={data?.data?.pagination}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        onUserClick={setSelectedUser}
        onRefresh={refetch}
      />

      {/* User Details Modal */}
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdate={refetch}
        />
      )}
    </div>
  );
};

export default UserManagement;
