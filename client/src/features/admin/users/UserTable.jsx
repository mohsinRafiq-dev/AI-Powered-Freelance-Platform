import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Calendar,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  Ban,
  Play,
  Eye,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../../../components/ui/badge';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { formatDate } from '../../../utils/formatters';
import { useSuspendUser, useBanUser, useActivateUser } from '../../../hooks/admin/useUserManagement';
import ConfirmDialog from './ConfirmDialog';
import { AdminTable, AdminPagination, AdminLoading } from '../components';
import { useHasPermission } from '../../../hooks/admin/usePermissions';
import { PERMISSIONS } from '../../../utils/permissions';

const UserTable = ({ users, pagination, isLoading, onPageChange, onUserClick, onRefresh }) => {
  const [actionMenu, setActionMenu] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const suspendMutation = useSuspendUser();
  const banMutation = useBanUser();
  const activateMutation = useActivateUser();

  // Permission checks
  const canManageUsers = useHasPermission(PERMISSIONS.MANAGE_USERS);
  const canDeleteUsers = useHasPermission(PERMISSIONS.DELETE_USERS);

  const getRoleBadge = (user) => {
    const role = user.role;
    const adminRole = user.adminRole;
    
    // For admin users, show their specific admin role
    if (role === 'admin' && adminRole) {
      const adminLabels = {
        super_admin: 'Super Admin',
        admin: 'Admin',
        moderator: 'Moderator',
      };
      // Use brand colors for all admin roles - keep it simple and functional
      return <Badge variant="default" className="bg-brand/10 text-brand border-brand/20">{adminLabels[adminRole] || role}</Badge>;
    }
    
    // For regular users - use brand colors for consistency
    const labels = {
      freelancer: 'Freelancer',
      client: 'Client',
      admin: 'Admin',
    };
    return <Badge variant="default" className="bg-brand/10 text-brand border-brand/20">{labels[role] || role}</Badge>;
  };

  const getStatusBadge = (user) => {
    if (user.isBanned) {
      return <Badge variant="destructive">Banned</Badge>;
    }
    if (!user.isActive) {
      return <Badge variant="yellow">Suspended</Badge>;
    }
    return <Badge variant="success">Active</Badge>;
  };

  const handleAction = (action, user) => {
    setActionMenu(null);

    if (action === 'view') {
      onUserClick(user);
    } else if (action === 'suspend' || action === 'ban') {
      setConfirmDialog({ action, user });
    } else if (action === 'activate') {
      activateMutation.mutate(user._id, {
        onSuccess: () => onRefresh(),
      });
    }
  };

  const handleConfirmAction = (reason) => {
    const { action, user } = confirmDialog;

    console.log('handleConfirmAction called:', { action, userId: user._id, reason });

    if (action === 'suspend') {
      console.log('Calling suspend mutation...');
      suspendMutation.mutate(
        { userId: user._id, reason },
        { 
          onSuccess: () => {
            console.log('Suspend successful');
            onRefresh();
            setConfirmDialog(null);
          },
          onError: (error) => {
            console.error('Suspend failed:', error);
            setConfirmDialog(null);
          }
        }
      );
    } else if (action === 'ban') {
      console.log('Calling ban mutation...');
      banMutation.mutate(
        { userId: user._id, reason },
        { 
          onSuccess: () => {
            console.log('Ban successful');
            onRefresh();
            setConfirmDialog(null);
          },
          onError: (error) => {
            console.error('Ban failed:', error);
            setConfirmDialog(null);
          }
        }
      );
    } else {
      setConfirmDialog(null);
    }
  };

  if (isLoading) {
    return <AdminLoading message="Loading users..." />;
  }

  if (!users || users.length === 0) {
    return (
      <Card glass className="p-12 text-center">
        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-brand-deepest dark:text-white mb-2">
          No Users Found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try adjusting your filters or search criteria
        </p>
      </Card>
    );
  }

  return (
    <div className="pb-48">
      <AdminTable>
        <AdminTable.Header>
          <AdminTable.HeaderCell>User</AdminTable.HeaderCell>
          <AdminTable.HeaderCell>Email</AdminTable.HeaderCell>
          <AdminTable.HeaderCell>Role</AdminTable.HeaderCell>
          <AdminTable.HeaderCell>Status</AdminTable.HeaderCell>
          <AdminTable.HeaderCell>Verified</AdminTable.HeaderCell>
          <AdminTable.HeaderCell>Joined</AdminTable.HeaderCell>
          <AdminTable.HeaderCell align="center">Actions</AdminTable.HeaderCell>
        </AdminTable.Header>
        <AdminTable.Body>
          {users.map((user, index) => (
            <AdminTable.Row 
              key={user._id}
            >
              {/* User Info */}
              <AdminTable.Cell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center overflow-hidden">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-brand-deepest dark:text-white">
                          {user.name}
                        </p>
                        {user.location && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.location}
                          </p>
                        )}
                      </div>
                    </div>
              </AdminTable.Cell>

              {/* Email */}
              <AdminTable.Cell>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {user.email}
                      </span>
                    </div>
              </AdminTable.Cell>

              {/* Role */}
              <AdminTable.Cell>{getRoleBadge(user)}</AdminTable.Cell>

              {/* Status */}
              <AdminTable.Cell>{getStatusBadge(user)}</AdminTable.Cell>

              {/* Verified */}
              <AdminTable.Cell>
                    {user.isEmailVerified ? (
                      <CheckCircle className="w-5 h-5 text-brand" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
              </AdminTable.Cell>

              {/* Joined Date */}
              <AdminTable.Cell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {formatDate(user.createdAt, 'SHORT')}
                      </span>
                    </div>
              </AdminTable.Cell>

              {/* Actions */}
              <AdminTable.Cell align="center">
                    <div className="flex items-center justify-center gap-2 static">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onUserClick(user)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      {/* Only show action menu if user has any management permissions */}
                      {(canManageUsers || canDeleteUsers) && (
                        <div className="relative">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              setActionMenu(actionMenu === user._id ? null : user._id)
                            }
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>

                        {/* Action Menu */}
                        {actionMenu === user._id && (
                          <>
                            <div
                              className="fixed inset-0 z-[9998]"
                              onClick={() => setActionMenu(null)}
                            />
                            <div className="absolute right-0 bottom-auto mt-2 w-48 backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border border-brand-light/50 dark:border-gray-700/50 rounded-lg shadow-soft-lg z-[9999] overflow-hidden" style={{
                              top: '100%',
                              transform: index > users.length - 3 ? 'translateY(-100%) translateY(-2.5rem)' : 'none'
                            }}>
                              <button
                                onClick={() => handleAction('view', user)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-brand-light/30 dark:hover:bg-gray-800/50 flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>

                              {canManageUsers && !user.isBanned && user.isActive && (
                                <button
                                  onClick={() => handleAction('suspend', user)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-brand-light/30 dark:hover:bg-gray-800/50 flex items-center gap-2 text-yellow-600"
                                >
                                  <AlertCircle className="w-4 h-4" />
                                  Suspend User
                                </button>
                              )}

                              {canDeleteUsers && !user.isBanned && (
                                <button
                                  onClick={() => handleAction('ban', user)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 text-red-600"
                                >
                                  <Ban className="w-4 h-4" />
                                  Ban User
                                </button>
                              )}

                              {canManageUsers && !user.isActive && (
                                <button
                                  onClick={() => handleAction('activate', user)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-2 text-green-600"
                                >
                                  <Play className="w-4 h-4" />
                                  Activate User
                                </button>
                              )}
                            </div>
                          </>
                        )}
                        </div>
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

      {/* Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          isOpen={true}
          title={
            confirmDialog.action === 'suspend'
              ? 'Suspend User'
              : 'Ban User Permanently'
          }
          message={
            confirmDialog.action === 'suspend'
              ? `Are you sure you want to suspend ${confirmDialog.user.name}? This will temporarily disable their account.`
              : `Are you sure you want to permanently ban ${confirmDialog.user.name}? This action will disable their account permanently.`
          }
          confirmText={confirmDialog.action === 'suspend' ? 'Suspend' : 'Ban'}
          requireReason={true}
          variant={confirmDialog.action === 'ban' ? 'destructive' : 'warning'}
          onConfirm={handleConfirmAction}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
    </div>
  );
};

export default UserTable;
