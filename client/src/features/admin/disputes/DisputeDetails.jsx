import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useDispute,
  useResolveDispute,
  useRejectDispute,
  useAddAdminNote,
} from '../../../hooks/api/useDisputes';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  User,
  Calendar,
  FileText,
  MessageSquare,
  Save,
  X,
  Clock,
  Shield,
  Link as LinkIcon,
} from 'lucide-react';
import { toast } from 'sonner';

const DisputeDetails = () => {
  const { disputeId } = useParams();
  const navigate = useNavigate();
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [resolutionText, setResolutionText] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [noteText, setNoteText] = useState('');

  const { data, isLoading, error } = useDispute(disputeId);
  const resolveDispute = useResolveDispute();
  const rejectDispute = useRejectDispute();
  const addNote = useAddAdminNote();

  const dispute = data?.data;

  const handleResolve = async () => {
    if (!resolutionText.trim()) {
      toast.error('Please provide a resolution');
      return;
    }

    await resolveDispute.mutateAsync(
      { disputeId, resolution: resolutionText },
      {
        onSuccess: () => {
          setShowResolveModal(false);
          setResolutionText('');
        },
      }
    );
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    await rejectDispute.mutateAsync(
      { disputeId, reason: rejectionReason },
      {
        onSuccess: () => {
          setShowRejectModal(false);
          setRejectionReason('');
        },
      }
    );
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) {
      toast.error('Please provide a note');
      return;
    }

    await addNote.mutateAsync(
      { disputeId, note: noteText },
      {
        onSuccess: () => {
          setShowNoteModal(false);
          setNoteText('');
        },
      }
    );
  };

  const getStatusBadge = (status) => {
    const badges = {
      OPEN: {
        icon: AlertCircle,
        className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        label: 'Open',
      },
      RESOLVED: {
        icon: CheckCircle,
        className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        label: 'Resolved',
      },
      REJECTED: {
        icon: XCircle,
        className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        label: 'Rejected',
      },
    };
    return badges[status] || badges.OPEN;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
            <p className="text-red-800 dark:text-red-200">
              {error?.response?.data?.message || 'Failed to load dispute'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !dispute) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dispute details...</p>
          </div>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(dispute.status);
  const StatusIcon = statusBadge.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/disputes')}
              className="p-2 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Dispute Details
              </h1>
              <p className="text-gray-600 dark:text-gray-400">#{dispute.disputeId}</p>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${statusBadge.className}`}
          >
            <StatusIcon className="w-5 h-5" />
            {statusBadge.label}
          </span>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Dispute Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dispute Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Dispute Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Reason
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white font-medium">
                    {dispute.reason}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Description
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white whitespace-pre-wrap">
                    {dispute.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Contract ID
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-white font-mono text-sm">
                      {dispute.contractId}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Raised By
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-white capitalize">
                      {dispute.raisedBy}
                      {dispute.raisedByUser && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                          ({dispute.raisedByUser.name})
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Created At
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {formatDate(dispute.createdAt)}
                    </p>
                  </div>
                  {dispute.resolvedAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Resolved At
                      </label>
                      <p className="mt-1 text-gray-900 dark:text-white">
                        {formatDate(dispute.resolvedAt)}
                      </p>
                    </div>
                  )}
                </div>

                {dispute.resolution && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <label className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Resolution / Rejection Reason
                    </label>
                    <p className="mt-2 text-gray-900 dark:text-white whitespace-pre-wrap">
                      {dispute.resolution}
                    </p>
                    {dispute.resolvedBy && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Resolved by admin
                      </p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Evidence */}
            {dispute.evidence && dispute.evidence.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <LinkIcon className="w-5 h-5" />
                  Evidence
                </h2>
                <div className="space-y-3">
                  {dispute.evidence.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Type: {item.type}
                      </p>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand hover:underline break-all"
                      >
                        {item.url}
                      </a>
                      {item.description && (
                        <p className="mt-2 text-sm text-gray-900 dark:text-white">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Admin Notes */}
            {dispute.adminNotes && dispute.adminNotes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Admin Notes
                </h2>
                <div className="space-y-3">
                  {dispute.adminNotes.map((note, index) => (
                    <div
                      key={index}
                      className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800"
                    >
                      <p className="text-gray-900 dark:text-white">{note.note}</p>
                      <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                        {formatDate(note.addedAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {dispute.status === 'OPEN' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Admin Actions
                </h2>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowResolveModal(true)}
                    className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Resolve Dispute
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject Dispute
                  </button>
                  <button
                    onClick={() => setShowNoteModal(true)}
                    className="w-full px-4 py-3 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Add Note
                  </button>
                </div>
              </motion.div>
            )}

            {/* Contract Info */}
            {dispute.contract && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Contract Info
                </h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                    <span className="ml-2 text-gray-900 dark:text-white font-medium capitalize">
                      {dispute.contract.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Start Date:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {new Date(dispute.contract.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  {dispute.contract.endDate && (
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">End Date:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">
                        {new Date(dispute.contract.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Resolve Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-xl"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Resolve Dispute
            </h3>
            <textarea
              value={resolutionText}
              onChange={(e) => setResolutionText(e.target.value)}
              placeholder="Enter resolution details..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none"
              rows={5}
            />
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleResolve}
                disabled={resolveDispute.isPending}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all disabled:opacity-50"
              >
                {resolveDispute.isPending ? 'Resolving...' : 'Resolve'}
              </button>
              <button
                onClick={() => setShowResolveModal(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-xl"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <XCircle className="w-6 h-6 text-red-600" />
              Reject Dispute
            </h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none"
              rows={5}
            />
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleReject}
                disabled={rejectDispute.isPending}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all disabled:opacity-50"
              >
                {rejectDispute.isPending ? 'Rejecting...' : 'Reject'}
              </button>
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-xl"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-brand" />
              Add Admin Note
            </h3>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Enter admin note..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none"
              rows={5}
            />
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleAddNote}
                disabled={addNote.isPending}
                className="flex-1 px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium transition-all disabled:opacity-50"
              >
                {addNote.isPending ? 'Adding...' : 'Add Note'}
              </button>
              <button
                onClick={() => setShowNoteModal(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DisputeDetails;
