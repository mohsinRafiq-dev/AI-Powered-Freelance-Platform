import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Users, 
  FileText, 
  DollarSign, 
  Clock, 
  ChevronRight,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { useJobProposals } from "@/hooks/api";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { formatDate } from "@/utils/formatters";

const statusConfig = {
  pending: {
    variant: "default",
    label: "Pending",
    icon: AlertCircle,
    color: "text-yellow-600",
  },
  accepted: {
    variant: "success",
    label: "Accepted",
    icon: CheckCircle,
    color: "text-green-600",
  },
  rejected: {
    variant: "destructive",
    label: "Rejected",
    icon: XCircle,
    color: "text-red-600",
  },
};

export const JobProposalsList = ({ jobId }) => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState(null);
  const { data, isLoading, isError, error } = useJobProposals(jobId, { status: statusFilter });

  // Better data extraction - handle different response structures
  const responseData = data?.data;
  const proposals = Array.isArray(responseData) ? responseData : (responseData?.proposals || responseData || []);
  const total = data?.pagination?.total || proposals.length || 0;


  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-brand dark:text-brand-light" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Proposals
          </h2>
        </div>
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
        </div>
      </motion.div>
    );
  }

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-brand dark:text-brand-light" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Proposals
          </h2>
        </div>
        <div className="text-center py-8 text-red-600 dark:text-red-400">
          <p className="font-semibold mb-2">Failed to load proposals</p>
          <p className="text-sm">{error?.response?.data?.message || error?.message || 'Unknown error'}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-brand dark:text-brand-light" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Proposals ({total})
          </h2>
        </div>
        <Button
          onClick={() => navigate(`/client/jobs/${jobId}/proposals`)}
          variant="outline"
          className="border-brand text-brand hover:bg-brand/10 dark:border-brand-light dark:text-brand-light"
        >
          View All
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <div className="flex gap-2">
          <Button
            variant={statusFilter === null ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(null)}
            className={statusFilter === null ? 'bg-brand hover:bg-brand-dark text-white' : ''}
          >
            All
          </Button>
          <Button
            variant={statusFilter === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("pending")}
            className={statusFilter === "pending" ? 'bg-brand hover:bg-brand-dark text-white' : ''}
          >
            Pending
          </Button>
          <Button
            variant={statusFilter === "accepted" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("accepted")}
            className={statusFilter === "accepted" ? 'bg-brand hover:bg-brand-dark text-white' : ''}
          >
            Accepted
          </Button>
          <Button
            variant={statusFilter === "rejected" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("rejected")}
            className={statusFilter === "rejected" ? 'bg-brand hover:bg-brand-dark text-white' : ''}
          >
            Rejected
          </Button>
        </div>
      </div>

      {/* Proposals List */}
      {proposals.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">
            {statusFilter ? `No ${statusFilter} proposals yet` : 'No proposals yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {proposals.slice(0, 5).map((proposal) => {
            const status = statusConfig[proposal.status] || statusConfig.pending;
            const StatusIcon = status.icon;
            
            return (
              <div
                key={proposal._id}
                onClick={() => navigate(`/client/proposals/${proposal._id}`)}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-brand dark:hover:border-brand-light transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {proposal.freelancerId?.name?.charAt(0) || 'F'}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-brand dark:group-hover:text-brand-light transition-colors">
                      {proposal.freelancerId?.name || 'Freelancer'}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        <span>PKR {proposal.bidAmount?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{proposal.deliveryTime} days</span>
                      </div>
                      <span className="text-xs">
                        {formatDate(proposal.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-3">
                  <Badge variant={status.variant} className="flex items-center gap-1">
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </Badge>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-brand dark:group-hover:text-brand-light transition-colors" />
                </div>
              </div>
            );
          })}

          {proposals.length > 5 && (
            <Button
              onClick={() => navigate(`/client/jobs/${jobId}/proposals`)}
              variant="ghost"
              className="w-full text-brand hover:text-brand-dark dark:text-brand-light"
            >
              View all {total} proposals
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default JobProposalsList;
