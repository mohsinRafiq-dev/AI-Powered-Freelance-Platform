import { X, CheckCircle, XCircle, Flag, Star } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJob, useApproveJob, useRejectJob, useFlagJob, useToggleFeature } from '../../../hooks/admin/useJobChecker';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { formatDate, formatCurrency } from '../../../utils/formatters';

const JobDetailsModal = ({ jobId, onClose }) => {
  const { data, isLoading } = useJob(jobId);
  const approveJobMutation = useApproveJob();
  const rejectJobMutation = useRejectJob();
  const flagJobMutation = useFlagJob();
  const toggleFeatureMutation = useToggleFeature();

  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showFlagDialog, setShowFlagDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [flagReason, setFlagReason] = useState('');
  const [flagType, setFlagType] = useState('inappropriate');

  const job = data?.data;

  const handleApprove = () => {
    approveJobMutation.mutate(jobId, {
      onSuccess: () => onClose(),
    });
  };

  const handleReject = () => {
    if (!rejectReason.trim() || rejectReason.length < 10) {
      return;
    }
    rejectJobMutation.mutate(
      { jobId, reason: rejectReason },
      {
        onSuccess: () => {
          setShowRejectDialog(false);
          onClose();
        },
      }
    );
  };

  const handleFlag = () => {
    if (!flagReason.trim() || flagReason.length < 10) {
      return;
    }
    flagJobMutation.mutate(
      { jobId, flagData: { reason: flagReason, flagType } },
      {
        onSuccess: () => {
          setShowFlagDialog(false);
          onClose();
        },
      }
    );
  };

  const handleToggleFeature = () => {
    toggleFeatureMutation.mutate(jobId);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-brand-deepest dark:text-white">
              Job Details
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={job.status === 'open' ? 'green' : 'gray'} size="sm">
                {job.status}
              </Badge>
              {job.isFlagged && <Badge variant="red" size="sm"><Flag className="w-3 h-3 mr-1" />Flagged</Badge>}
              {job.isFeatured && <Badge variant="yellow" size="sm"><Star className="w-3 h-3 mr-1" />Featured</Badge>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-xl font-semibold text-brand-deepest dark:text-white mb-4">
              {job.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">{job.description}</p>
          </div>

          {/* Job Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
              <p className="font-medium text-brand-deepest dark:text-white">
                {job.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Budget</p>
              <p className="font-medium text-brand-deepest dark:text-white">
                {job.budgetType === 'fixed'
                  ? formatCurrency(job.budgetAmount)
                  : `Rs. ${job.hourlyRate?.min}-${job.hourlyRate?.max}/hr`}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
              <p className="font-medium text-brand-deepest dark:text-white">{job.duration}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Experience</p>
              <p className="font-medium text-brand-deepest dark:text-white capitalize">{job.experienceLevel}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Proposals</p>
              <p className="font-medium text-brand-deepest dark:text-white">{job.proposalCount || job.proposalsCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Posted</p>
              <p className="font-medium text-brand-deepest dark:text-white">{formatDate(job.createdAt)}</p>
            </div>
          </div>

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <div>
              <h4 className="font-semibold text-brand-deepest dark:text-white mb-2">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" size="sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Client Info */}
          <div>
            <h4 className="font-semibold text-brand-deepest dark:text-white mb-2">Client Information</h4>
            <div className="flex items-center gap-3">
              {job.client?.avatar ? (
                <img src={job.client.avatar} alt={job.client.name} className="w-12 h-12 rounded-full" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center text-brand-deepest font-medium text-lg">
                  {job.client?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-medium text-brand-deepest dark:text-white">{job.client?.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{job.client?.email}</p>
              </div>
            </div>
          </div>

          {/* Flag Info if flagged */}
          {job.isFlagged && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <h4 className="font-semibold text-red-900 dark:text-red-200 mb-2">
                <Flag className="w-4 h-4 inline mr-2" />
                Flagged for Review
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300">
                <strong>Type:</strong> {job.flagType}
              </p>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                <strong>Reason:</strong> {job.flagReason}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6 flex flex-wrap gap-3">
          <Button variant="primary" onClick={handleApprove}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve
          </Button>
          <Button variant="outline" onClick={() => setShowRejectDialog(true)}>
            <XCircle className="w-4 h-4 mr-2" />
            Reject
          </Button>
          <Button variant="outline" onClick={() => setShowFlagDialog(true)}>
            <Flag className="w-4 h-4 mr-2" />
            Flag
          </Button>
          <Button variant="outline" onClick={handleToggleFeature}>
            <Star className="w-4 h-4 mr-2" />
            {job.isFeatured ? 'Unfeature' : 'Feature'}
          </Button>
        </div>
      </motion.div>

      {/* Reject Dialog */}
      <AnimatePresence>
        {showRejectDialog && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-bold text-brand-deepest dark:text-white mb-4">
                Reject Job
              </h3>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Provide a reason for rejection (min 10 characters)..."
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-brand-deepest dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-brand/50"
                rows={4}
              />
              <div className="flex gap-3 mt-4">
                <Button variant="danger" onClick={handleReject} disabled={rejectReason.length < 10}>
                  Reject Job
                </Button>
                <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Flag Dialog */}
      <AnimatePresence>
        {showFlagDialog && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-bold text-brand-deepest dark:text-white mb-4">
                Flag Job
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Flag Type
                </label>
                <select
                  value={flagType}
                  onChange={(e) => setFlagType(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-brand-deepest dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/50"
                >
                  <option value="inappropriate">Inappropriate Content</option>
                  <option value="spam">Spam</option>
                  <option value="misleading">Misleading Information</option>
                  <option value="duplicate">Duplicate Job</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <textarea
                value={flagReason}
                onChange={(e) => setFlagReason(e.target.value)}
                placeholder="Provide a reason for flagging (min 10 characters)..."
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-brand-deepest dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-brand/50"
                rows={4}
              />
              <div className="flex gap-3 mt-4">
                <Button variant="warning" onClick={handleFlag} disabled={flagReason.length < 10}>
                  Flag Job
                </Button>
                <Button variant="outline" onClick={() => setShowFlagDialog(false)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobDetailsModal;
