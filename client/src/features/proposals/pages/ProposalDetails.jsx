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
  Edit2,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { useProposal, useWithdrawProposal } from "@/hooks/api";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { format } from "date-fns";
import { InlineLoader } from "../../../components/common/Loader";

const statusConfig = {
  pending: {
    variant: "default",
    label: "Pending Review",
    icon: AlertCircle,
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    description: "Your proposal is under review by the client",
  },
  accepted: {
    variant: "success",
    label: "Accepted",
    icon: CheckCircle,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
    description: "Congratulations! Your proposal has been accepted",
  },
  rejected: {
    variant: "destructive",
    label: "Rejected",
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
    description: "Unfortunately, your proposal was not selected",
  },
  withdrawn: {
    variant: "secondary",
    label: "Withdrawn",
    icon: X,
    color: "text-gray-600 dark:text-gray-400",
    bgColor: "bg-gray-50 dark:bg-gray-900/20",
    borderColor: "border-gray-200 dark:border-gray-800",
    description: "You have withdrawn this proposal",
  },
};

export const ProposalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useProposal(id);
  const { mutate: withdrawProposal, isLoading: isWithdrawing } = useWithdrawProposal();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const proposal = data?.data?.proposal;
  const job = proposal?.jobId;
  const status = statusConfig[proposal?.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  const handleWithdraw = () => {
    withdrawProposal(id, {
      onSuccess: () => {
        setShowWithdrawModal(false);
        navigate("/freelancer/proposals");
      },
    });
  };

  const handleMessage = () => {
    if (proposal?.conversation) {
      navigate(`/messages/${proposal.conversation}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 lg:pt-28 pb-24 md:pb-8 flex items-center justify-center">
        <InlineLoader size="large" text="Loading proposal details" />
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
              The proposal you're looking for doesn't exist or has been removed.
            </p>
            <Button
              onClick={() => navigate("/freelancer/proposals")}
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

  const canEdit = proposal.status === "pending";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 lg:pt-28 pb-24 md:pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/freelancer/proposals")}
            className="text-gray-700 dark:text-gray-300 hover:text-brand dark:hover:text-brand-light"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Proposals
          </Button>
        </motion.div>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Proposal Details
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage your proposal
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
                {status.description}
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
            {/* Job Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
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
                className="group block mb-4"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-brand dark:group-hover:text-brand-light transition-colors inline-flex items-center gap-2">
                  {job?.title}
                  <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
              </Link>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {job?.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {job?.location && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                )}
                {job?.client && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <User className="w-4 h-4" />
                    <span>Posted by {job.client.name || "Client"}</span>
                  </div>
                )}
              </div>

              {job?.skills && job.skills.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Required Skills:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
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

            {/* Attachments (if any) */}
            {proposal.attachments && proposal.attachments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-brand dark:text-brand-light" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Attachments
                  </h2>
                </div>
                <div className="space-y-2">
                  {proposal.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <span className="text-gray-700 dark:text-gray-300">{attachment}</span>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
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
                {proposal.updatedAt && proposal.updatedAt !== proposal.createdAt && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {formatDate(proposal.updatedAt)}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Message Button for Accepted Proposals */}
                {proposal?.status === 'accepted' && proposal?.conversation && (
                  <Button
                    onClick={handleMessage}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message Client
                  </Button>
                )}
                
                {canEdit && (
                  <>
                    <Link to={`/freelancer/proposals/${proposal._id}/edit`}>
                      <Button
                        className="w-full bg-brand hover:bg-brand-dark text-white"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit Proposal
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => setShowWithdrawModal(true)}
                      className="w-full border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Withdraw Proposal
                    </Button>
                  </>
                )}
                <Link to={`/jobs/${job?._id}`}>
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Job Posting
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Withdraw Confirmation Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Confirm Withdrawal
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to withdraw this proposal? This action cannot be undone and you won't be able to resubmit.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowWithdrawModal(false)}
                  disabled={isWithdrawing}
                  className="flex-1 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleWithdraw}
                  disabled={isWithdrawing}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {isWithdrawing ? "Withdrawing..." : "Withdraw"}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProposalDetails;
