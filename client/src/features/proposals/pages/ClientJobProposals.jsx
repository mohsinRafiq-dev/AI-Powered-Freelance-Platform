import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, XCircle, AlertCircle, Filter, Star } from 'lucide-react';
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

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'bid_low', label: 'Bid: Low to High' },
  { value: 'bid_high', label: 'Bid: High to Low' },
  { value: 'delivery_fast', label: 'Delivery: Fastest' },
  { value: 'ai_score', label: 'AI Match Score' },
];

const ClientJobProposals = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useJobProposals(jobId);
  const { mutate: acceptProposal } = useAcceptProposal();
  const { mutate: rejectProposal } = useRejectProposal();

  const [statusFilter, setStatusFilter] = useState('all');
  const [minBid, setMinBid] = useState('');
  const [maxBid, setMaxBid] = useState('');
  const [maxDelivery, setMaxDelivery] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const proposals = Array.isArray(data?.data) ? data.data : (data?.data?.proposals || []);

  const filtered = useMemo(() => {
    let list = [...proposals];
    if (statusFilter !== 'all') list = list.filter((p) => p.status === statusFilter);
    if (minBid) list = list.filter((p) => (p.bidAmount || 0) >= Number(minBid));
    if (maxBid) list = list.filter((p) => (p.bidAmount || 0) <= Number(maxBid));
    if (maxDelivery) list = list.filter((p) => (p.deliveryTime || 0) <= Number(maxDelivery));
    if (minRating) list = list.filter((p) => (p.freelancerId?.rating || 0) >= Number(minRating));

    switch (sortBy) {
      case 'oldest':
        list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'bid_low':
        list.sort((a, b) => (a.bidAmount || 0) - (b.bidAmount || 0));
        break;
      case 'bid_high':
        list.sort((a, b) => (b.bidAmount || 0) - (a.bidAmount || 0));
        break;
      case 'delivery_fast':
        list.sort((a, b) => (a.deliveryTime || 9999) - (b.deliveryTime || 9999));
        break;
      case 'ai_score':
        list.sort((a, b) => (b.aiScore || b.matchScore || 0) - (a.aiScore || a.matchScore || 0));
        break;
      case 'newest':
      default:
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return list;
  }, [proposals, statusFilter, minBid, maxBid, maxDelivery, minRating, sortBy]);

  const resetFilters = () => {
    setStatusFilter('all');
    setMinBid('');
    setMaxBid('');
    setMaxDelivery('');
    setMinRating('');
    setSortBy('newest');
  };

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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 lg:pt-28 pb-24 md:pb-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Proposals for Job</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {proposals.length} total · showing {filtered.length} after filters
          </p>
        </motion.div>

        <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <Filter className="w-4 h-4" /> Compare bids
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400">Status</label>
              <select
                className="w-full mt-1 px-2 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400">Min Bid (PKR)</label>
              <input type="number" className="w-full mt-1 px-2 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm" value={minBid} onChange={(e) => setMinBid(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400">Max Bid (PKR)</label>
              <input type="number" className="w-full mt-1 px-2 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm" value={maxBid} onChange={(e) => setMaxBid(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400">Max Delivery (days)</label>
              <input type="number" className="w-full mt-1 px-2 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm" value={maxDelivery} onChange={(e) => setMaxDelivery(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400">Min Rating</label>
              <input type="number" min="0" max="5" step="0.5" className="w-full mt-1 px-2 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm" value={minRating} onChange={(e) => setMinRating(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400">Sort by</label>
              <select
                className="w-full mt-1 px-2 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <Button variant="outline" size="sm" onClick={resetFilters}>Reset filters</Button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">
              {proposals.length === 0 ? 'No proposals yet' : 'No proposals match the current filters'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((proposal) => {
              const cfg = statusConfig[proposal.status] || statusConfig.pending;
              const Icon = cfg.icon;
              const rating = proposal.freelancerId?.rating;
              const aiScore = proposal.aiScore ?? proposal.matchScore;
              return (
                <div key={proposal._id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white font-bold text-lg">
                      {proposal.freelancerId?.name?.charAt(0) || 'F'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{proposal.freelancerId?.name || 'Freelancer'}</h3>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex flex-wrap gap-4">
                        <span>PKR {proposal.bidAmount?.toLocaleString()}</span>
                        <span>{proposal.deliveryTime} days</span>
                        {rating ? (
                          <span className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-yellow-500" /> {rating}
                          </span>
                        ) : null}
                        {aiScore ? (
                          <span className="text-brand font-medium">AI: {aiScore}%</span>
                        ) : null}
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
