import { useState } from 'react';
import { useJobs } from '../../../hooks/admin/useJobChecker';
import JobTable from './JobTable';
import JobDetailsModal from './JobDetailsModal';
import { AdminPageHeader, AdminFilters, AdminActions } from '../components';

const JobChecker = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    status: '',
    category: '',
    isFlagged: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  const { data, isLoading, refetch } = useJobs(filters);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value, // Reset to page 1 when filters change
    }));
  };

  const handleSearch = (value) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 20,
      status: '',
      category: '',
      isFlagged: '',
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const activeFiltersCount = [
    filters.status,
    filters.category,
    filters.isFlagged,
  ].filter(Boolean).length;

  const filterOptions = [
    {
      label: 'Status',
      value: filters.status,
      onChange: (value) => handleFilterChange('status', value),
      options: [
        { value: '', label: 'All Status' },
        { value: 'draft', label: 'Draft' },
        { value: 'open', label: 'Open' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'closed', label: 'Closed' },
      ],
    },
    {
      label: 'Category',
      value: filters.category,
      onChange: (value) => handleFilterChange('category', value),
      options: [
        { value: '', label: 'All Categories' },
        { value: 'web-development', label: 'Web Development' },
        { value: 'mobile-development', label: 'Mobile Development' },
        { value: 'design', label: 'Design' },
        { value: 'writing', label: 'Writing' },
        { value: 'marketing', label: 'Marketing' },
        { value: 'other', label: 'Other' },
      ],
    },
    {
      label: 'Flagged',
      value: filters.isFlagged,
      onChange: (value) => handleFilterChange('isFlagged', value),
      options: [
        { value: '', label: 'All Jobs' },
        { value: 'true', label: 'Flagged Only' },
        { value: 'false', label: 'Not Flagged' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Job Checker"
        description="Review and manage all jobs posted on the platform"
      >
        <AdminActions onRefresh={refetch} />
      </AdminPageHeader>

      <AdminFilters
        searchValue={filters.search}
        onSearchChange={handleSearch}
        searchPlaceholder="Search by title, description, or skills..."
        filterOptions={filterOptions}
        onClearFilters={clearFilters}
      />

      {/* Job Table */}
      <JobTable
        data={data?.data}
        isLoading={isLoading}
        pagination={data?.data?.pagination}
        onPageChange={handlePageChange}
        onViewDetails={(jobId) => setSelectedJobId(jobId)}
      />

      {/* Job Details Modal */}
      {selectedJobId && (
        <JobDetailsModal
          jobId={selectedJobId}
          onClose={() => setSelectedJobId(null)}
        />
      )}
    </div>
  );
};

export default JobChecker;
