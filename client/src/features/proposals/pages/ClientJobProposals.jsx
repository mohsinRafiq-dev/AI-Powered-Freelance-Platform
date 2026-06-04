import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, XCircle, AlertCircle, Filter, Star, Radio, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useJobProposals, useAcceptProposal, useRejectProposal } from '@/hooks/api';
import chatService from '@/services/chatService';
import { useQueryClient } from '@tanstack/react-query';
import { getRecommendedFreelancers } from '@/api/jobsApi';
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
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useJobProposals(jobId);
  const { mutate: acceptProposal } = useAcceptProposal();
  const { mutate: rejectProposal } = useRejectProposal();
  const [liveUpdates, setLiveUpdates] = useState(false);
  const [aiScores, setAiScores] = useState({}); // proposalId -> { score, confidence, reasoning, strengths, concerns }
  const [aiLoading, setAiLoading] = useState(false);

  const runAIRanking = async () => {
    setAiLoading(true);
    try {
      const res = await getRecommendedFreelancers(jobId, { minScore: 0, limit: 50 });
      const list = res?.data?.freelancers || res?.data || [];
      const map = {};
      list.forEach((f) => {
        if (f.proposalId) {
          map[f.proposalId] = {
            score: f.matchScore || f.aiScore || 0,
            confidence: f.matchConfidence || 0,
            reasoning: f.matchReasoning,
            strengths: f.strengths || [],
            concerns: f.concerns || [],
          };
        }
      });
      setAiScores(map);
      toast.success(`AI ranked ${Object.keys(map).length} proposals`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'AI ranking failed');
    } finally {
      setAiLoading(false);
    }
  };

  // Subscribe to real-time proposal events for this job
  useEffect(() => {
    if (!jobId) return;
    let mounted = true;

    const setupSocket = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('token='))
          ?.split('=')[1] || localStorage.getItem('token');
        if (!chatService.isConnected && token) {
          await chatService.connect(token);
        }
        if (!mounted) return;

        chatService.subscribeToJob(jobId);

        const handler = (event) => {
          if (!event || String(event.jobId) !== String(jobId)) return;
          if (event.eventType === 'created') {
            toast.success('New proposal received', { icon: '📩' });
          } else if (event.eventType === 'accepted') {
            toast.success('A proposal was accepted');
          } else if (event.eventType === 'rejected') {
            toast('A proposal was rejected', { icon: '⛔' });
          }
          // Force a refetch of this job's proposals
          queryClient.invalidateQueries({ queryKey: ['jobProposals', jobId] });
          queryClient.invalidateQueries({ queryKey: ['proposals'] });
        };

        chatService.onProposalEvent(handler);
        setLiveUpdates(true);

        return () => {
          chatService.offProposalEvent(handler);
          chatService.unsubscribeFromJob(jobId);
          setLiveUpdates(false);
        };
      } catch (err) {
        console.warn('Could not connect socket for live proposal updates', err);
      }
    };

    const cleanupPromise = setupSocket();
    return () => {
      mounted = false;
      Promise.resolve(cleanupPromise).then((fn) => typeof fn === 'function' && fn());
    };
  }, [jobId, queryClient]);

  const [statusFilter, setStatusFilter] = useState('all');
  const [minBid, setMinBid] = useState('');
  const [maxBid, setMaxBid] = useState('');
  const [maxDelivery, setMaxDelivery] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const proposals = Array.isArray(data?.data) ? data.data : (data?.data?.proposals || []);

  // Merge AI scores onto proposals so filtering/sorting and badges can use them
  const proposalsWithAI = useMemo(() => {
    if (!Object.keys(aiScores).length) return proposals;
    return proposals.map((p) => {
      const ai = aiScores[String(p._id)];
      if (!ai) return p;
      return { ...p, aiScore: ai.score, aiConfidence: ai.confidence, aiReasoning: ai.reasoning, aiStrengths: ai.strengths, aiConcerns: ai.concerns };
    });
  }, [proposals, aiScores]);

  const filtered = useMemo(() => {
    let list = [...proposalsWithAI];
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
  }, [proposalsWithAI, statusFilter, minBid, maxBid, maxDelivery, minRating, sortBy]);

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
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Proposals for Job</h1>
            {liveUpdates && (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                <Radio className="w-3.5 h-3.5 animate-pulse" /> Live updates on
              </span>
            )}
          </div>
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
          <div className="mt-3 flex justify-between items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={runAIRanking}
              disabled={aiLoading}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-brand" />
              {aiLoading ? 'Scoring with AI...' : Object.keys(aiScores).length > 0 ? 'Re-run AI ranking' : 'Score with AI'}
            </Button>
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
                <div key={proposal._id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white font-bold text-lg">
                        {proposal.freelancerId?.name?.charAt(0) || 'F'}
                      </div>
                      <div className="min-w-0">
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
                            <span className="inline-flex items-center gap-1 text-brand font-medium" title={proposal.aiReasoning}>
                              <Sparkles className="w-3.5 h-3.5" />
                              AI: {aiScore}%
                              {proposal.aiConfidence ? (
                                <span className="text-xs text-gray-500">({Math.round((proposal.aiConfidence || 0) * 100)}% conf.)</span>
                              ) : null}
                            </span>
                          ) : null}
                          <span className="text-xs">{formatDate(proposal.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
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

                  {(proposal.aiStrengths?.length || proposal.aiConcerns?.length) ? (
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {proposal.aiStrengths?.length ? (
                        <div>
                          <div className="font-medium text-green-700 dark:text-green-400 mb-1">AI strengths</div>
                          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-0.5">
                            {proposal.aiStrengths.slice(0, 3).map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
                        </div>
                      ) : null}
                      {proposal.aiConcerns?.length ? (
                        <div>
                          <div className="font-medium text-amber-700 dark:text-amber-400 mb-1">AI concerns</div>
                          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-0.5">
                            {proposal.aiConcerns.slice(0, 3).map((c, i) => <li key={i}>{c}</li>)}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
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
