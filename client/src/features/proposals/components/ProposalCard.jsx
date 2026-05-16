import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { DollarSign, Clock, Calendar, Eye, Edit2, X, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { formatDate } from "@/utils/formatters";

const statusConfig = {
  pending: {
    variant: "default",
    label: "Pending",
    color: "bg-yellow-500",
  },
  accepted: {
    variant: "success",
    label: "Accepted",
    color: "bg-green-500",
  },
  rejected: {
    variant: "destructive",
    label: "Rejected",
    color: "bg-red-500",
  },
  withdrawn: {
    variant: "secondary",
    label: "Withdrawn",
    color: "bg-gray-500",
  },
};

export const ProposalCard = ({ proposal, onWithdraw }) => {
  const [showFullCoverLetter, setShowFullCoverLetter] = useState(false);
  const job = proposal.jobId;
  const canEdit = proposal.status === "pending";
  const status = statusConfig[proposal.status] || statusConfig.pending;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Status indicator bar */}
      <div className={`h-1 ${status.color}`} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <Link
              to={`/jobs/${job?._id}`}
              className="text-2xl font-bold text-gray-900 dark:text-white hover:text-brand dark:hover:text-brand-light transition-colors inline-flex items-center gap-2 group/link"
            >
              {job?.title || "Job Title"}
              <ExternalLink className="w-5 h-5 opacity-0 group-hover/link:opacity-100 transition-opacity" />
            </Link>
            <div className="mt-2">
              <Badge variant={status.variant} className="capitalize font-medium">
                {status.label}
              </Badge>
            </div>
          </div>
        </div>

        {/* Proposal Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-green-500">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Proposed Price</p>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              PKR {proposal.bidAmount?.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Final payment via milestones
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-blue-500">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Delivery Time</p>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {proposal.deliveryTime} days
            </p>
          </div>
        </div>

        {/* Cover Letter Preview */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-4 h-4 text-brand dark:text-brand-light" />
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Cover Letter</h4>
          </div>
          <div className="relative">
            <p className={`text-gray-700 dark:text-gray-300 leading-relaxed break-words whitespace-pre-wrap ${!showFullCoverLetter ? 'line-clamp-3' : ''}`}>
              {proposal.coverLetter}
            </p>
            {proposal.coverLetter && proposal.coverLetter.length > 100 && (
              <button
                onClick={() => setShowFullCoverLetter(!showFullCoverLetter)}
                className="mt-2 text-brand hover:text-brand-dark dark:text-brand-light dark:hover:text-brand text-sm font-medium inline-flex items-center gap-1 transition-colors"
              >
                {showFullCoverLetter ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    View More
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>Submitted: {formatDate(proposal.createdAt)}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Link to={`/freelancer/proposals/${proposal._id}`}>
              <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
            </Link>
            {canEdit && (
              <>
                <Link to={`/freelancer/proposals/${proposal._id}/edit`}>
                  <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </Link>
                <Button
                  size="sm"
                  onClick={() => onWithdraw && onWithdraw(proposal._id)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <X className="w-4 h-4 mr-1" />
                  Withdraw
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalCard;
