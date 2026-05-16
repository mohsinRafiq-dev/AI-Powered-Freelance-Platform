import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, FileText, DollarSign, Clock, ChevronRight, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useJobProposals, useAcceptProposal, useRejectProposal } from '@/hooks/api';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { formatDate } from '@/utils/formatters';
import { InlineLoader } from '../../../components/common/Loader';

const statusConfig = {
  pending: { variant: 'default', label: 'Pending', icon: AlertCircle },
  accepted: { variant: 'success', label: 'Accepted', icon: CheckCircle },
  rejected: { variant: 'destructive', label: 'Rejected', icon: XCircle },
};

const ClientJobProposals = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useJobProposals(jobId);
  const { mutate: acceptProposal, isLoading: isAccepting } = useAcceptProposal();
  const { mutate: rejectProposal, isLoading: isRejecting } = useRejectProposal();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 lg:pt-28 pb-24 md:pb-8 flex items-center justify-center">
        <InlineLoader size="large" text="Loading proposals" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 lg:pt-28 pb-24 md:pb-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Failed to load proposals</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">{error?.response?.data?.message || error?.message}</p>
          <Button className="mt-4" onClick={() => navigate(-1)}>Back</Button>
        </div>
      </div>
    );
  }

  const proposals = Array.isArray(data?.data) ? data.data : (data?.data?.proposals || []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 lg:pt-28 pb-24 md:pb-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Proposals for Job</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Review and manage proposals submitted for this job</p>
        </motion.div>

        {proposals.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">No proposals yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.map((proposal) => {
              const cfg = statusConfig[proposal.status] || statusConfig.pending;
              const Icon = cfg.icon;
              return (
                <div key={proposal._id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white font-bold text-lg">
                      {proposal.freelancerId?.name?.charAt(0) || 'F'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{proposal.freelancerId?.name || 'Freelancer'}</h3>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex gap-4">
                        <span>PKR {proposal.bidAmount?.toLocaleString()}</span>
                        <span>{proposal.deliveryTime} days</span>
                        <span className="text-xs">{formatDate(proposal.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={cfg.variant} className="capitalize flex items-center gap-2">
                      <Icon className="w-4 h-4" /> {cfg.label}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/client/proposals/${proposal._id}`)}>View</Button>
                    {proposal.status === 'pending' && (
                      <>
                        <Button size="sm" className="bg-green-600 text-white" onClick={() => acceptProposal(proposal._id)}>Accept</Button>
                        <Button size="sm" variant="destructive" onClick={() => rejectProposal({ proposalId: proposal._id, reason: 'Not suitable' })}>Reject</Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientJobProposals;
