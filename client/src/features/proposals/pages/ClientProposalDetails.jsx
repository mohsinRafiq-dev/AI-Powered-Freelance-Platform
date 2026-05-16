import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  DollarSign,
  Clock,
  Calendar,
  FileText,
  Briefcase,
  MapPin,
  User,
  Mail,
  Award,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { useClientProposal, useAcceptProposal, useRejectProposal } from "@/hooks/api";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { formatDate } from "@/utils/formatters";
import { InlineLoader } from "../../../components/common/Loader";

const statusConfig = {
  pending: {
    variant: "default",
    label: "Pending Review",
    icon: AlertCircle,
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
  },
  accepted: {
    variant: "success",
    label: "Accepted",
    icon: CheckCircle,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
  },
  rejected: {
    variant: "destructive",
    label: "Rejected",
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
  },
};

export const ClientProposalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useClientProposal(id);
  const { mutate: acceptProposal, isLoading: isAccepting } = useAcceptProposal();
  const { mutate: rejectProposal, isLoading: isRejecting } = useRejectProposal();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const proposal = data?.data?.proposal;
  const freelancer = proposal?.freelancerId;
  const job = proposal?.jobId;
  const status = statusConfig[proposal?.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  const handleAccept = () => {
    acceptProposal(id, {
      onSuccess: (response) => {
        // Navigate to the conversation if created
        if (response?.data?.conversation?._id) {
          navigate(`/messages/${response.data.conversation._id}`);
        } else {
          navigate(`/jobs/${job?._id}`);
        }
      },
    });
  };

  const handleMessage = () => {
    if (proposal?.conversation) {
      navigate(`/messages/${proposal.conversation}`);
    }
  };

  const handleReject = () => {
    // Only send reason if it has content
    const payload = {
      proposalId: id,
      reason: rejectionReason?.trim() || ''
    };
    
    rejectProposal(
      payload,
      {
        onSuccess: () => {
          setShowRejectModal(false);
          setRejectionReason('');
          navigate(`/jobs/${job?._id}`);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 lg:pt-28 pb-24 md:pb-8 flex items-center justify-center">
        <InlineLoader size="large" text="Loading proposal" />
      </div>
    );
  }

  if (isError || !proposal) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 lg:pt-28 pb-24 md:pb-8 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 max-w-md">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Proposal Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The proposal you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button
              onClick={() => navigate("/client/proposals")}
              className="bg-brand hover:bg-brand-dark text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Proposals
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isPending = proposal.status === "pending";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 lg:pt-28 pb-24 md:pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => navigate(`/jobs/${job?._id}`)}
            className="text-gray-700 dark:text-gray-300 hover:text-brand dark:hover:text-brand-light"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Job
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Proposal Details
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review and manage this proposal
          </p>
        </motion.div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`${status.bgColor} ${status.borderColor} border rounded-xl p-6 mb-6`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${status.bgColor}`}>
              <StatusIcon className={`w-6 h-6 ${status.color}`} />
            </div>
            <div className="flex-1">
              <h3 className={`text-xl font-bold ${status.color} mb-1`}>
                {status.label}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {isPending
                  ? "This proposal is awaiting your decision"
                  : proposal.status === "accepted"
                  ? "You have accepted this proposal"
                  : "You have rejected this proposal"}
              </p>
            </div>
            <Badge variant={status.variant} className="capitalize font-medium px-4 py-2">
              {proposal.status}
            </Badge>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Freelancer Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-brand dark:text-brand-light" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Freelancer Information
                </h2>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
                  {freelancer?.name?.charAt(0) || 'F'}
                </div>

                <div className="flex-1">
                  <Link
                    to={`/profile/${freelancer?._id}`}
                    className="text-2xl font-bold text-gray-900 dark:text-white hover:text-brand dark:hover:text-brand-light transition-colors inline-flex items-center gap-2 group"
                  >
                    {freelancer?.name}
                    <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{freelancer?.email}</span>
                    </div>
                    {freelancer?.location && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{freelancer.location}</span>
                      </div>
                    )}
                    {freelancer?.hourlyRate && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm">PKR {freelancer.hourlyRate}/hr</span>
                      </div>
                    )}
                    {freelancer?.experience && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Award className="w-4 h-4" />
                        <span className="text-sm">{freelancer.experience}</span>
                      </div>
                    )}
                  </div>

                  {freelancer?.bio && (
                    <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                      {freelancer.bio}
                    </p>
                  )}

                  {freelancer?.skills && freelancer.skills.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Skills:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {freelancer.skills.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="border-brand text-brand dark:border-brand-light dark:text-brand-light"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Cover Letter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-brand dark:text-brand-light" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Cover Letter
                </h2>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {proposal.coverLetter}
                </p>
              </div>
            </motion.div>

            {/* Job Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-brand dark:text-brand-light" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Job Information
                </h2>
              </div>

              <Link
                to={`/jobs/${job?._id}`}
                className="text-xl font-bold text-gray-900 dark:text-white hover:text-brand dark:hover:text-brand-light transition-colors inline-flex items-center gap-2 group"
              >
                {job?.title}
                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <p className="mt-2 text-gray-700 dark:text-gray-300 line-clamp-3">
                {job?.description}
              </p>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Proposal Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-28"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Proposal Summary
              </h3>

              {/* Proposed Price */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-green-500">
                    <DollarSign className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Proposed Price
                  </p>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  PKR {proposal.bidAmount?.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Final payment via milestones
                </p>
              </div>

              {/* Delivery Time */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-blue-500">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Delivery Time
                  </p>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {proposal.deliveryTime} days
                </p>
              </div>

              {/* Dates */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Submitted</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {formatDate(proposal.createdAt)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              {isPending && (
                <div className="space-y-3">
                  <Button
                    onClick={handleAccept}
                    disabled={isAccepting}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {isAccepting ? "Accepting..." : "Accept Proposal"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowRejectModal(true)}
                    disabled={isRejecting}
                    className="w-full border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Proposal
                  </Button>
                </div>
              )}
              
              {/* Message Button for Accepted Proposals */}
              {proposal?.status === 'accepted' && proposal?.conversation && (
                <Button
                  onClick={handleMessage}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message Freelancer
                </Button>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
                  <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Reject Proposal
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Are you sure you want to reject this proposal? You can optionally provide a reason.
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Reason for rejection (optional)"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-brand dark:focus:ring-brand-light focus:border-transparent outline-none resize-none"
                rows="4"
              />
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowRejectModal(false)}
                  disabled={isRejecting}
                  className="flex-1 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={isRejecting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {isRejecting ? "Rejecting..." : "Reject"}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ClientProposalDetails;
