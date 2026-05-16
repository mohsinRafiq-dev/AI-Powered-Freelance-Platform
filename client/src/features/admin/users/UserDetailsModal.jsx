import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  DollarSign,
  Award,
  Building,
  Globe,
  Shield,
  AlertCircle,
  CheckCircle,
  Ban,
  Play,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { formatDate, formatCurrency } from '../../../utils/formatters';
import { useUserActivity, useSuspendUser, useBanUser, useActivateUser } from '../../../hooks/admin/useUserManagement';
import ConfirmDialog from './ConfirmDialog';
import { useHasPermission } from '../../../hooks/admin/usePermissions';
import { PERMISSIONS } from '../../../utils/permissions';

const UserDetailsModal = ({ user, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [confirmDialog, setConfirmDialog] = useState(null);

  const { data: activityData, isLoading: isLoadingActivity } = useUserActivity(user._id);
  const suspendMutation = useSuspendUser();
  const banMutation = useBanUser();
  const activateMutation = useActivateUser();

  // Permission checks
  const canManageUsers = useHasPermission(PERMISSIONS.MANAGE_USERS);
  const canDeleteUsers = useHasPermission(PERMISSIONS.DELETE_USERS);

  const handleAction = (action) => {
    if (action === 'suspend' || action === 'ban') {
      setConfirmDialog({ action, user });
    } else if (action === 'activate') {
      activateMutation.mutate(user._id, {
        onSuccess: () => {
          onUpdate();
          onClose();
        },
      });
    }
  };

  const handleConfirmAction = (reason) => {
    const { action } = confirmDialog;
    console.log('[UserDetailsModal] handleConfirmAction:', { action, userId: user._id, reason });

    if (action === 'suspend') {
      console.log('[UserDetailsModal] Calling suspend mutation...');
      suspendMutation.mutate(
        { userId: user._id, reason },
        { 
          onSuccess: () => {
            console.log('[UserDetailsModal] Suspend successful');
            onUpdate();
            onClose();
          },
          onError: (error) => {
            console.error('[UserDetailsModal] Suspend failed:', error);
          }
        }
      );
    } else if (action === 'ban') {
      console.log('[UserDetailsModal] Calling ban mutation...');
      banMutation.mutate(
        { userId: user._id, reason },
        { 
          onSuccess: () => {
            console.log('[UserDetailsModal] Ban successful');
            onUpdate();
            onClose();
          },
          onError: (error) => {
            console.error('[UserDetailsModal] Ban failed:', error);
          }
        }
      );
    }

    setConfirmDialog(null);
  };

  const getRoleColor = (role) => {
    const colors = {
      freelancer: 'text-green-600 bg-green-100 dark:bg-green-900/20',
      client: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
      admin: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20',
    };
    return colors[role] || 'text-gray-600 bg-gray-100';
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border border-brand-light/50 dark:border-gray-700/50 rounded-2xl shadow-soft-lg max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-brand to-brand-dark p-6 text-white">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
                  <div className="flex items-center gap-2">
                    <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                    {user.isEmailVerified && (
                      <Badge className="bg-white/20 text-white">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Status Banner */}
          {(user.isBanned || !user.isActive) && (
            <div className={`px-6 py-3 ${user.isBanned ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200' : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'}`}>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <div>
                  <p className="font-semibold">
                    {user.isBanned ? 'This user is banned' : 'This user is suspended'}
                  </p>
                  {(user.banReason || user.suspensionReason) && (
                    <p className="text-sm mt-1">
                      Reason: {user.banReason || user.suspensionReason}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-brand-light/30 dark:border-gray-700/30 px-6">
            <div className="flex gap-6">
              {['profile', 'activity', 'stats'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-4 font-medium capitalize transition-colors relative ${
                    activeTab === tab
                      ? 'text-brand dark:text-brand'
                      : 'text-gray-600 dark:text-gray-400 hover:text-brand-dark'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-brand-deepest dark:text-white mb-4">
                    Basic Information
                  </h3>

                  <InfoItem icon={Mail} label="Email" value={user.email} />
                  <InfoItem icon={Phone} label="Phone" value={user.phone || 'Not provided'} />
                  <InfoItem icon={MapPin} label="Location" value={user.location || 'Not provided'} />
                  <InfoItem icon={Globe} label="Website" value={user.website || 'Not provided'} />
                  <InfoItem
                    icon={Calendar}
                    label="Joined"
                    value={formatDate(user.createdAt, 'LONG')}
                  />
                </div>

                {/* Role-Specific Info */}
                <div className="space-y-4">
                  {user.role === 'freelancer' && (
                    <>
                      <h3 className="text-lg font-semibold text-brand-deepest dark:text-white mb-4">
                        Freelancer Details
                      </h3>
                      <InfoItem
                        icon={DollarSign}
                        label="Hourly Rate"
                        value={user.hourlyRate ? `Rs. ${user.hourlyRate}/hr` : 'Not set'}
                      />
                      <InfoItem
                        icon={Award}
                        label="Experience"
                        value={user.experience || 'Not specified'}
                      />
                      <InfoItem
                        icon={Briefcase}
                        label="Skills"
                        value={
                          user.skills && user.skills.length > 0
                            ? user.skills.join(', ')
                            : 'No skills added'
                        }
                      />
                    </>
                  )}

                  {user.role === 'client' && (
                    <>
                      <h3 className="text-lg font-semibold text-brand-deepest dark:text-white mb-4">
                        Client Details
                      </h3>
                      <InfoItem
                        icon={Building}
                        label="Company"
                        value={user.companyName || 'Not provided'}
                      />
                      <InfoItem
                        icon={User}
                        label="Company Size"
                        value={user.companySize || 'Not specified'}
                      />
                      <InfoItem
                        icon={Briefcase}
                        label="Industry"
                        value={user.industry || 'Not specified'}
                      />
                    </>
                  )}
                </div>

                {/* Bio */}
                {user.bio && (
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-brand-deepest dark:text-white mb-2">
                      Bio
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 p-4 rounded-lg bg-brand-light/20 dark:bg-gray-800/50">
                      {user.bio}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-brand-deepest dark:text-white">
                  Recent Activity
                </h3>

                {isLoadingActivity ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="skeleton h-20 w-full rounded"></div>
                    ))}
                  </div>
                ) : activityData?.data ? (
                  <>
                    {activityData.data.recentJobs?.length > 0 && (
                      <div>
                        <h4 className="font-medium text-brand-deepest dark:text-white mb-3">
                          Recent Jobs
                        </h4>
                        <div className="space-y-2">
                          {activityData.data.recentJobs.map((job) => (
                            <div
                              key={job._id}
                              className="p-4 rounded-lg bg-brand-light/20 dark:bg-gray-800/50"
                            >
                              <p className="font-medium text-brand-deepest dark:text-white">
                                {job.title}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {formatDate(job.createdAt, 'SHORT')}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activityData.data.recentProposals?.length > 0 && (
                      <div>
                        <h4 className="font-medium text-brand-deepest dark:text-white mb-3">
                          Recent Proposals
                        </h4>
                        <div className="space-y-2">
                          {activityData.data.recentProposals.map((proposal) => (
                            <div
                              key={proposal._id}
                              className="p-4 rounded-lg bg-brand-light/20 dark:bg-gray-800/50"
                            >
                              <p className="font-medium text-brand-deepest dark:text-white">
                                {proposal.job?.title || 'Unknown Job'}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {formatCurrency(proposal.bidAmount)} • {formatDate(proposal.createdAt, 'SHORT')}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!activityData.data.recentJobs?.length && !activityData.data.recentProposals?.length && (
                      <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                        No recent activity found
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                    Unable to load activity
                  </p>
                )}
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {user.role === 'freelancer' && (
                  <>
                    <StatCard label="Total Earnings" value={formatCurrency(user.totalEarnings || 0)} />
                    <StatCard label="Completed Jobs" value={user.completedJobsCount || 0} />
                    <StatCard label="Active Proposals" value={user.activeProposalsCount || 0} />
                    <StatCard label="Applied Jobs" value={user.appliedJobsCount || 0} />
                  </>
                )}

                {user.role === 'client' && (
                  <>
                    <StatCard label="Total Spent" value={formatCurrency(user.totalSpent || 0)} />
                    <StatCard label="Posted Jobs" value={user.postedJobsCount || 0} />
                    <StatCard label="Active Jobs" value={user.activeJobsCount || 0} />
                    <StatCard label="Profile Complete" value={user.isProfileComplete ? 'Yes' : 'No'} />
                  </>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="sticky bottom-0 bg-gradient-to-r from-brand-light/60 to-brand/30 dark:from-gray-800/60 dark:to-gray-700/60 p-6 flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose} glass>
              Close
            </Button>

            {canManageUsers && !user.isBanned && user.isActive && (
              <Button
                variant="warning"
                onClick={() => handleAction('suspend')}
                disabled={suspendMutation.isLoading}
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Suspend User
              </Button>
            )}

            {canDeleteUsers && !user.isBanned && (
              <Button
                variant="destructive"
                onClick={() => handleAction('ban')}
                disabled={banMutation.isLoading}
              >
                <Ban className="w-4 h-4 mr-2" />
                Ban User
              </Button>
            )}

            {canManageUsers && !user.isActive && (
              <Button
                variant="success"
                onClick={() => handleAction('activate')}
                disabled={activateMutation.isLoading}
              >
                <Play className="w-4 h-4 mr-2" />
                Activate User
              </Button>
            )}
          </div>
        </motion.div>

        {/* Confirm Dialog */}
        {confirmDialog && (
          <ConfirmDialog
            isOpen={true}
            title={confirmDialog.action === 'suspend' ? 'Suspend User' : 'Ban User Permanently'}
            message={
              confirmDialog.action === 'suspend'
                ? `Are you sure you want to suspend ${user.name}?`
                : `Are you sure you want to permanently ban ${user.name}?`
            }
            confirmText={confirmDialog.action === 'suspend' ? 'Suspend' : 'Ban'}
            requireReason={true}
            variant={confirmDialog.action === 'ban' ? 'destructive' : 'warning'}
            onConfirm={handleConfirmAction}
            onCancel={() => setConfirmDialog(null)}
          />
        )}
      </div>
    </AnimatePresence>
  );
};

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
      <Icon className="w-4 h-4 text-brand" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
      <p className="font-medium text-brand-deepest dark:text-white truncate">{value}</p>
    </div>
  </div>
);

const StatCard = ({ label, value }) => (
  <div className="p-4 rounded-xl bg-brand-light/20 dark:bg-gray-800/50 text-center">
    <p className="text-2xl font-bold text-brand-deepest dark:text-white">{value}</p>
    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{label}</p>
  </div>
);

export default UserDetailsModal;
