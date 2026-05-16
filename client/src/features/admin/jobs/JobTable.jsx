import { Eye, Flag, Star, Trash2, CheckCircle, XCircle, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../../../components/ui/badge';
import { useApproveJob, useRejectJob, useFlagJob, useToggleFeature, useDeleteJob } from '../../../hooks/admin/useJobChecker';
import ConfirmDialog from '../users/ConfirmDialog';
import { formatDate, formatCurrency } from '../../../utils/formatters';
import { AdminTable, AdminPagination, AdminLoading } from '../components';
import { useHasPermission } from '../../../hooks/admin/usePermissions';
import { PERMISSIONS } from '../../../utils/permissions';

const JobTable = ({ data, isLoading, pagination, onPageChange, onViewDetails }) => {
  const [showActions, setShowActions] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ show: false, type: '', jobId: null });
  const [rejectDialog, setRejectDialog] = useState({ show: false, jobId: null });
  const [flagDialog, setFlagDialog] = useState({ show: false, jobId: null });

  const approveJobMutation = useApproveJob();
  const rejectJobMutation = useRejectJob();
  const flagJobMutation = useFlagJob();
  const toggleFeatureMutation = useToggleFeature();
  const deleteJobMutation = useDeleteJob();

  // Permission checks
  const canManageJobs = useHasPermission(PERMISSIONS.MANAGE_JOBS);
  const canDeleteJobs = useHasPermission(PERMISSIONS.DELETE_JOBS);

  const handleApprove = (jobId) => {
    approveJobMutation.mutate(jobId);
    setShowActions(null);
  };

  const handleToggleFeature = (jobId) => {
    toggleFeatureMutation.mutate(jobId);
    setShowActions(null);
  };

  const handleReject = (reason) => {
    rejectJobMutation.mutate(
      { jobId: rejectDialog.jobId, reason },
      {
        onSuccess: () => {
          setRejectDialog({ show: false, jobId: null });
        },
      }
    );
  };

  const handleFlag = (reason) => {
    flagJobMutation.mutate(
      { jobId: flagDialog.jobId, flagData: { reason, flagType: 'inappropriate' } },
      {
        onSuccess: () => {
          setFlagDialog({ show: false, jobId: null });
        },
      }
    );
  };

  const handleDelete = () => {
    deleteJobMutation.mutate(confirmDialog.jobId, {
      onSuccess: () => {
        setConfirmDialog({ show: false, type: '', jobId: null });
      },
    });
  };

  const getStatusColor = (status) => {
    // Standardize: brand for active/open, yellow for in-progress, red for cancelled, gray for draft/closed
    const colors = {
      draft: 'gray',
      open: 'success', // Use success variant (brand green)
      'in-progress': 'yellow',
      completed: 'success', // Use success variant (brand green)
      cancelled: 'red',
      closed: 'gray',
    };
    return colors[status] || 'gray';
  };

  const getCategoryLabel = (category) => {
    return category
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (isLoading) {
    return <AdminLoading message="Loading jobs..." />;
  }

  if (!data?.jobs || data.jobs.length === 0) {
    return <AdminLoading message="No jobs found" />;
  }

  return (
    <>
      <div className="pb-48">
        <AdminTable>
        <AdminTable.Header>
          <AdminTable.HeaderCell>Job</AdminTable.HeaderCell>
          <AdminTable.HeaderCell>Client</AdminTable.HeaderCell>
          <AdminTable.HeaderCell>Category</AdminTable.HeaderCell>
          <AdminTable.HeaderCell>Budget</AdminTable.HeaderCell>
          <AdminTable.HeaderCell>Status</AdminTable.HeaderCell>
          <AdminTable.HeaderCell>Proposals</AdminTable.HeaderCell>
          <AdminTable.HeaderCell>Posted</AdminTable.HeaderCell>
          <AdminTable.HeaderCell>Actions</AdminTable.HeaderCell>
        </AdminTable.Header>
        <AdminTable.Body>
          {data.jobs.map((job, jobIndex) => (
            <AdminTable.Row
              key={job._id}
            >
              {/* Job Title */}
              <AdminTable.Cell>
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="font-medium text-brand-deepest dark:text-white">
                          {job.title}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                          {job.isFlagged && (
                            <Flag className="w-3 h-3 text-red-500" />
                          )}
                          {job.isFeatured && (
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                      </div>
                    </div>
              </AdminTable.Cell>

              {/* Client */}
              <AdminTable.Cell>
                    <div className="flex items-center gap-2">
                      {job.client?.avatar ? (
                        <img
                          src={job.client.avatar}
                          alt={job.client.name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand-deepest font-medium">
                          {job.client?.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {job.client?.name}
                      </div>
                    </div>
              </AdminTable.Cell>

              {/* Category */}
              <AdminTable.Cell>
                    <Badge variant="outline" size="sm">
                      {getCategoryLabel(job.category)}
                    </Badge>
              </AdminTable.Cell>

              {/* Budget */}
              <AdminTable.Cell>
                    <div className="text-sm font-medium text-brand-deepest dark:text-white">
                      {job.budgetType === 'fixed'
                        ? `Rs. ${formatCurrency(job.budgetAmount)}`
                        : `Rs. ${job.hourlyRate?.min}-${job.hourlyRate?.max}/hr`}
                    </div>
              </AdminTable.Cell>

              {/* Status */}
              <AdminTable.Cell>
                    <Badge variant={getStatusColor(job.status)} size="sm">
                      {job.status}
                    </Badge>
              </AdminTable.Cell>

              {/* Proposals */}
              <AdminTable.Cell>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {job.proposalsCount}
                    </div>
              </AdminTable.Cell>

              {/* Posted Date */}
              <AdminTable.Cell>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(job.createdAt)}
                    </div>
              </AdminTable.Cell>

              {/* Actions */}
              <AdminTable.Cell>
                    <div className="relative" style={{ overflow: 'visible', position: 'relative' }}>
                      {/* Show action button only if there is at least one action available */}
                      {(canManageJobs || canDeleteJobs) && (
                        <>
                          <button
                            onClick={() => setShowActions(showActions === job._id ? null : job._id)}
                            className="p-1 hover:bg-brand-light/30 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          </button>

                          {/* Actions Dropdown */}
                          {showActions === job._id && (
                        <>
                          <div
                            className="fixed inset-0 z-[9998]"
                            onClick={() => setShowActions(null)}
                          />
                          <AnimatePresence>
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute right-0 w-48 backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 border border-brand-light/50 dark:border-gray-700 rounded-xl shadow-2xl z-[9999] overflow-hidden"
                              style={{
                                top: jobIndex >= data.jobs.length - 3 ? 'auto' : '100%',
                                bottom: jobIndex >= data.jobs.length - 3 ? '100%' : 'auto',
                                marginTop: jobIndex >= data.jobs.length - 3 ? '0' : '0.5rem',
                                marginBottom: jobIndex >= data.jobs.length - 3 ? '0.5rem' : '0'
                              }}
                            >
                              <button
                                onClick={() => onViewDetails(job._id)}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-brand-light/20 dark:hover:bg-gray-800/50 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>
                              
                              {canManageJobs && (
                                <button
                                  onClick={() => {
                                    handleApprove(job._id);
                                    setShowActions(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Approve
                                </button>
                              )}

                              {canManageJobs && (
                                <button
                                  onClick={() => {
                                    setRejectDialog({ show: true, jobId: job._id });
                                    setShowActions(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Reject
                                </button>
                              )}

                              {canManageJobs && (
                                <button
                                  onClick={() => {
                                    setFlagDialog({ show: true, jobId: job._id });
                                    setShowActions(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                                >
                                  <Flag className="w-4 h-4" />
                                  Flag
                                </button>
                              )}

                              {canManageJobs && (
                                <button
                                  onClick={() => {
                                    handleToggleFeature(job._id);
                                    setShowActions(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
                                >
                                  <Star className="w-4 h-4" />
                                  {job.isFeatured ? 'Unfeature' : 'Feature'}
                                </button>
                              )}

                              {canDeleteJobs && (
                                <button
                                  onClick={() => {
                                    setConfirmDialog({ show: true, type: 'delete', jobId: job._id });
                                    setShowActions(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-t border-gray-200 dark:border-gray-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              )}
                            </motion.div>
                          </AnimatePresence>
                          </>
                        )}
                        </>
                      )}
                    </div>
              </AdminTable.Cell>
            </AdminTable.Row>
          ))}
        </AdminTable.Body>
      </AdminTable>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <AdminPagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={onPageChange}
        />
      )}
      </div>

      {/* Reject Dialog */}
      <ConfirmDialog
        isOpen={rejectDialog.show}
        title="Reject Job"
        message="Please provide a reason for rejecting this job."
        confirmText="Reject"
        cancelText="Cancel"
        variant="destructive"
        requireReason={true}
        onConfirm={handleReject}
        onCancel={() => setRejectDialog({ show: false, jobId: null })}
      />

      {/* Flag Dialog */}
      <ConfirmDialog
        isOpen={flagDialog.show}
        title="Flag Job"
        message="Please provide a reason for flagging this job."
        confirmText="Flag"
        cancelText="Cancel"
        variant="warning"
        requireReason={true}
        onConfirm={handleFlag}
        onCancel={() => setFlagDialog({ show: false, jobId: null })}
      />

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.show}
        title="Delete Job"
        message="Are you sure you want to delete this job? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDialog({ show: false, type: '', jobId: null })}
      />
    </>
  );
};

export default JobTable;
