import { useState } from 'react';
import { CheckCircle, XCircle, Clock, FileText, Handshake, Play, Plus, DollarSign, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '../../../lib/utils';
import { CreateContractModal } from '../../contracts/components/CreateContractModal';
import { DeclineContractModal } from './DeclineContractModal';
import { Button } from '../../../components/ui/button';
import { respondToContract } from '../../../api/contractsApi';
import { toast } from 'react-hot-toast';
import { CONTRACT_STATUS } from '../../contracts/constants';

export const ActivityTimeline = ({ conversation, contract }) => {
  const { user } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();
  const [showCreateContract, setShowCreateContract] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);

  // Normalize input early: support both `conversation` (messages) and `contract` (contract page)
  const conv = conversation || (contract ? {
    contract,
    metadata: contract.metadata || {},
    participants: [
      (contract.client && (typeof contract.client === 'object' ? contract.client : { _id: contract.client, name: 'Client' })),
      (contract.freelancer && (typeof contract.freelancer === 'object' ? contract.freelancer : { _id: contract.freelancer, name: 'Freelancer' })),
    ].filter(Boolean),
  } : null);

  const isStandalone = !!contract && !conversation;

  // Helper Functions for Business Logic (FYP: Role-based authorization)
  const isClient = user?.role === 'client';
  const isFreelancer = user?.role === 'freelancer';
  
  // FYP: Check if contract is in pending state and user can respond
  const canRespondToContract = () => {
    return isFreelancer &&
           conv?.contract?.status === CONTRACT_STATUS.PENDING;
  };
  
  // FYP: Check if contract is in terminal state (closed, cannot interact)
  const isContractClosed = () => {
    const status = conv?.contract?.status;
    return status === CONTRACT_STATUS.CANCELLED ||
           status === CONTRACT_STATUS.COMPLETED ||
           status === CONTRACT_STATUS.TERMINATED;
  };
  
  // FYP: Safe getter for contract description with fallback
  const getContractDescription = () => {
    const description = conv?.contract?.description;
    // Prevent API errors from leaking into UI
    if (!description || description.includes('Error') || description.includes('500')) {
      return 'No description provided';
    }
    return description;
  };

  // Contract response mutations
  const acceptContractMutation = useMutation({
    mutationFn: (contractId) => respondToContract(contractId, 'accept'),
    onSuccess: () => {
      toast.success('Contract accepted successfully!');
      // Invalidate queries to refresh data
      queryClient.invalidateQueries(['conversations']);
      queryClient.invalidateQueries(['conversation', conv?._id || conv?.contract?._id]);
      queryClient.invalidateQueries(['contracts']);
      // Refresh the page to update all components
      setTimeout(() => window.location.reload(), 1000);
    },
    onError: (error) => {
      // FYP: Never expose raw backend errors to user
      const message = error.response?.data?.message;
      const userMessage = (message && !message.includes('500') && !message.includes('Error')) 
        ? message 
        : 'Unable to accept contract. Please try again.';
      toast.error(userMessage);
    },
  });

  const declineContractMutation = useMutation({
    mutationFn: ({ contractId, reason }) => 
      respondToContract(contractId, 'decline', reason),
    onSuccess: () => {
      toast.success('Contract declined');
      setShowDeclineModal(false);
      // Invalidate queries to refresh data
      queryClient.invalidateQueries(['conversations']);
      queryClient.invalidateQueries(['conversation', conv?._id || conv?.contract?._id]);
      queryClient.invalidateQueries(['contracts']);
      // Refresh the page to update all components
      setTimeout(() => window.location.reload(), 1000);
    },
    onError: (error) => {
      // FYP: Never expose raw backend errors to user
      const message = error.response?.data?.message;
      const userMessage = (message && !message.includes('500') && !message.includes('Error')) 
        ? message 
        : 'Unable to decline contract. Please try again.';
      toast.error(userMessage);
    },
  });

  const handleAcceptContract = () => {
    // FYP: Validate contract ID exists before API call
    if (!conv?.contract?._id) {
      toast.error('Contract information is missing. Please refresh the page.');
      return;
    }
    
    if (confirm('Are you sure you want to accept this contract?')) {
      acceptContractMutation.mutate(conv.contract._id);
    }
  };

  const handleDeclineContract = (reason) => {
    // FYP: Validate contract ID exists before API call
    if (!conv?.contract?._id) {
      toast.error('Contract information is missing. Please refresh the page.');
      return;
    }
    
      declineContractMutation.mutate({
      contractId: conv.contract._id,
      reason,
    });
  };
  // Extract timeline data from conversation metadata
  // Normalize input: support either a full `conversation` object (used by Messages page)
  // or a `contract` object (used by ContractDetailPage). Build a lightweight
  // conversation-shaped object when only `contract` is provided so the timeline
  // rendering logic can remain unchanged.
  // conv is computed above now

  const getTimelineEvents = () => {
    if (!conv?.metadata) return [];

    const events = [];

    // Proposal submitted
    if (conv.metadata.proposalSubmittedAt) {
      events.push({
        id: 'proposal-submitted',
        title: 'Proposal submitted',
        date: conv.metadata.proposalSubmittedAt,
        status: 'completed',
        icon: FileText,
      });
    }

    // Contract offer
    if (conv.contract) {
    const contractStatus = conv.contract.status;
    const isPending = contractStatus === CONTRACT_STATUS.PENDING;
    const isActive = contractStatus === CONTRACT_STATUS.ACTIVE;
    const isCancelled = contractStatus === CONTRACT_STATUS.CANCELLED;
      
      events.push({
        id: 'contract-offer',
        title: 'Contract offer',
        description: isActive 
          ? 'Offer accepted' 
          : isPending 
          ? (isFreelancer ? 'Awaiting your response' : 'Awaiting freelancer response')
          : isCancelled
          ? 'Offer declined'
          : 'Awaiting offer from client',
        date: conv.contract.createdAt,
        status: isActive ? 'completed' : isPending ? 'pending' : 'rejected',
        icon: Handshake,
      });

      // Offer acceptance
      if (isActive) {
        events.push({
          id: 'offer-acceptance',
          title: 'Offer acceptance',
          description: 'Contract accepted by freelancer',
          date: conv.contract.acceptedAt || conv.contract.startDate,
          status: 'completed',
          icon: CheckCircle,
        });
      }

      // Offer declined (if cancelled and has cancellation reason from freelancer)
      if (isCancelled && conv.contract.cancellationReason) {
        events.push({
          id: 'offer-declined',
          title: 'Offer declined',
          description: `Reason: ${conv.contract.cancellationReason}`,
          date: conv.contract.updatedAt,
          status: 'rejected',
          icon: XCircle,
        });
      }

      // Contract starts
        if (isActive && conv.contract.startDate) {
        const hasStarted = new Date(conv.contract.startDate) <= new Date();
        events.push({
          id: 'contract-starts',
          title: 'Contract starts',
          description: hasStarted ? 'Work in progress' : 'Starting soon',
          date: conv.contract.startDate,
          status: hasStarted ? 'completed' : 'pending',
          icon: Play,
        });
      }

      // Contract completion
      if (contractStatus === 'completed') {
        events.push({
          id: 'contract-completed',
          title: 'Contract completed',
          description: 'Project successfully finished',
          date: conv.contract.completedAt,
          status: 'completed',
          icon: CheckCircle,
        });
      }
    } else if (conv.proposal?.status === 'accepted') {
      // Show pending contract if proposal is accepted but no contract yet
      events.push({
        id: 'contract-offer',
        title: 'Contract offer',
        description: isClient ? 'Create contract to proceed' : 'Awaiting contract from client',
        status: 'pending',
        icon: Handshake,
      });
    }

    return events;
  };

  const events = getTimelineEvents();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'rejected':
        return XCircle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-brand dark:text-brand-light';
      case 'pending':
        return 'text-yellow-500 dark:text-yellow-400';
      case 'rejected':
        return 'text-red-500 dark:text-red-400';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  const handleContractCreated = () => {
    setShowCreateContract(false);
    // Optionally refresh conversation data
    window.location.reload(); // Refresh to get updated conversation data
  };

  // Check if proposal is accepted but no contract exists
  // Support both populated proposal object and proposal ID
  const hasAcceptedProposal =
    conv?.proposal?.status === 'accepted' ||
    conv?.metadata?.proposalStatus === 'accepted';

  const hasContract =
    conv?.contract ||
    conv?.metadata?.contractStatus;
  
  // Must be client, have accepted proposal, and no contract yet
  const canCreateContract = isClient && hasAcceptedProposal && !hasContract;

  // Debug logging (can be removed in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('Activity Timeline Debug:', {
      isClient,
      hasAcceptedProposal,
      hasContract,
      canCreateContract,
      proposalStatus: conv?.proposal?.status,
      metadataProposalStatus: conv?.metadata?.proposalStatus,
      contractExists: !!conv?.contract,
      metadataContractStatus: conv?.metadata?.contractStatus
    });
  }

  return (
    <>
      <div className={cn(
        isStandalone
          ? 'max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 mt-8'
          : 'w-80 h-full flex-shrink-0 border-l border-gray-200 dark:border-gray-800 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 p-5 overflow-y-auto'
      )}>
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-5 h-5 text-brand dark:text-brand-light" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Activity Timeline
            </h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 ml-7">Track your project progress</p>
          <div className="mt-4 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />

          {/* Create Contract Button for Client */}
          {canCreateContract && (
            <Button
              onClick={() => setShowCreateContract(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-lg transition-colors font-medium shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Create Contract
            </Button>
          )}

          {/* FYP: Freelancer Contract Actions - Only show when pending and contract ID exists */}
          {canRespondToContract() && conv?.contract?._id && (
            <div className="bg-gradient-to-br from-brand-light/30 to-brand-light/50 dark:from-brand-dark/20 dark:to-brand-dark/30 border-2 border-brand-light dark:border-brand-dark rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-2 mb-2">
                <Handshake className="w-5 h-5 text-brand dark:text-brand-light mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-brand-deepest dark:text-brand-light">Action Required</h4>
                  <p className="text-xs text-brand-dark dark:text-brand-light/80 mt-0.5">Please review and respond to this contract offer</p>
                </div>
              </div>
              <Button
                onClick={handleAcceptContract}
                disabled={acceptContractMutation.isPending || !conversation?.contract?._id}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand hover:bg-brand-dark text-white rounded-lg transition-all font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-5 h-5" />
                {acceptContractMutation.isPending ? 'Accepting...' : 'Accept Contract'}
              </Button>
              <Button
                onClick={() => setShowDeclineModal(true)}
                disabled={declineContractMutation.isPending || !conversation?.contract?._id}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-gray-900 border-2 border-red-400 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <XCircle className="w-5 h-5" />
                {declineContractMutation.isPending ? 'Declining...' : 'Decline Contract'}
              </Button>
            </div>
          )}
        </div>

      {/* Timeline */}
      <div className="relative">
          {events.length > 0 ? (
          <>
            {/* Vertical line */}
            <div className="absolute left-5 top-8 bottom-8 w-px bg-gray-200 dark:bg-gray-700" />

            {/* Events */}
            <div className="space-y-8">
              {events.map((event, index) => {
            const StatusIcon = getStatusIcon(event.status);
            const isLast = index === events.length - 1;
            const EventIcon = event.icon || StatusIcon;

            return (
              <div key={event.id} className="relative flex gap-4">
                {/* Icon with custom styling per status */}
                <div className={cn(
                  'relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all shadow-sm',
                  event.status === 'completed' 
                    ? 'bg-brand-light/30 dark:bg-brand-dark/20 border-brand shadow-brand/20 dark:shadow-brand-dark/20' 
                    : event.status === 'pending'
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400 dark:border-yellow-600 shadow-yellow-100 dark:shadow-yellow-900/20'
                    : event.status === 'rejected'
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-500 shadow-red-100 dark:shadow-red-900/20'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                )}>
                  <EventIcon className={cn(
                    'w-5 h-5',
                    event.status === 'completed' ? 'text-brand dark:text-brand-light' : 
                    event.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' :
                    event.status === 'rejected' ? 'text-red-600 dark:text-red-400' :
                    getStatusColor(event.status)
                  )} />
                </div>

                {/* Content Card */}
                <div className={cn('flex-1 pb-2', !isLast && 'pb-6')}>
                  <div className={cn(
                    'rounded-lg p-3 border transition-all',
                    event.status === 'completed'
                      ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                      : event.status === 'pending'
                      ? 'bg-yellow-50/50 dark:bg-yellow-900/5 border-yellow-200 dark:border-yellow-800/50'
                      : event.status === 'rejected'
                      ? 'bg-red-50/50 dark:bg-red-900/5 border-red-200 dark:border-red-800/50'
                      : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                  )}>
                    <h4 className={cn(
                      'font-semibold mb-1 text-sm',
                      event.status === 'completed'
                        ? 'text-gray-900 dark:text-white'
                        : event.status === 'pending'
                        ? 'text-yellow-900 dark:text-yellow-300'
                        : event.status === 'rejected'
                        ? 'text-red-900 dark:text-red-300'
                        : 'text-gray-600 dark:text-gray-400'
                    )}>
                      {event.title}
                    </h4>
                    
                    {event.description && (
                      <p className={cn(
                        'text-xs mb-2',
                        event.status === 'completed'
                          ? 'text-gray-600 dark:text-gray-400'
                          : event.status === 'pending'
                          ? 'text-yellow-700 dark:text-yellow-400'
                          : event.status === 'rejected'
                          ? 'text-red-700 dark:text-red-400'
                          : 'text-gray-500 dark:text-gray-500'
                      )}>
                        {event.description}
                      </p>
                    )}

                    {event.date && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(event.date), 'MMMM d, yyyy')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
            </div>
          </>
        ) : (
          /* Empty state when no events */
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
              <Clock className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              No activity yet
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[200px] mx-auto">
              Your project timeline will appear here as you progress through the workflow
            </p>
          </div>
        )}
      </div>

      {/* Job Details (if available) */}
      {conv?.metadata?.jobTitle && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            About this job
          </h4>
          <div className="space-y-2">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {conv.metadata.jobTitle}
            </p>
            {conv.metadata.budget && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Budget: PKR {conv.metadata.budget.toLocaleString()}
              </p>
            )}
          </div>
        </div>
      )}

      {/* FYP: Contract Details Panel - Professional Card Design */}
      {conv?.contract && (
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              Contract Summary
            </h4>
          </div>

          {/* Status Badge - Prominent */}
          <div className="mb-4">
            <span className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold border-2",
              conv.contract.status === 'active' 
                ? "bg-brand-light/30 dark:bg-brand-dark/20 text-brand-dark dark:text-brand-light border-brand-light dark:border-brand-dark"
                : conv.contract.status === 'pending'
                ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
                : conv.contract.status === 'completed'
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                : "bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800"
            )}>
              {conv.contract.status === 'active' && <CheckCircle className="w-4 h-4" />}
              {conv.contract.status === 'pending' && <Clock className="w-4 h-4" />}
              {conv.contract.status === 'completed' && <CheckCircle className="w-4 h-4" />}
              <span className="capitalize">{conv.contract.status}</span>
            </span>
          </div>

          {/* Contract Info Card */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-850 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3">
            {/* Job Title */}
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Job Title</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {conv.contract.title || conv.metadata?.jobTitle || 'Untitled Project'}
              </p>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-2.5">
              {/* Amount */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Contract Amount</span>
                <span className="text-base font-bold text-brand dark:text-brand-light">
                  PKR {conv.contract.totalAmount?.toLocaleString() || '0'}
                </span>
              </div>

              {/* Payment Type */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Payment Type</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                  {conv.contract.paymentType || 'Fixed'}
                </span>
              </div>

              {/* Milestones */}
              {conv.contract.milestones?.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {conv.contract.milestones.filter(m => m.status === 'completed').length} / {conv.contract.milestones.length} milestones
                  </span>
                </div>
              )}

              {/* Partner Info */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {isClient ? 'Freelancer' : 'Client'}
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {conv.participants?.find(p => p._id !== user?._id)?.name || (isClient ? 'Freelancer' : 'Client')}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          {conv.contract.paymentStatus && (
            <div className={`mt-4 rounded-lg p-3 border ${
              conv.contract.paymentStatus === 'COMPLETED'
                ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                : conv.contract.paymentStatus === 'PENDING'
                ? 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800'
                : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
            }`}>
              <div className="flex items-start gap-2">
                <DollarSign className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                  conv.contract.paymentStatus === 'COMPLETED'
                    ? 'text-green-600 dark:text-green-400'
                    : conv.contract.paymentStatus === 'PENDING'
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-red-600 dark:text-red-400'
                }`} />
                <div>
                  <p className={`text-xs font-semibold ${
                    conv.contract.paymentStatus === 'COMPLETED'
                      ? 'text-green-900 dark:text-green-300'
                      : conv.contract.paymentStatus === 'PENDING'
                      ? 'text-yellow-900 dark:text-yellow-300'
                      : 'text-red-900 dark:text-red-300'
                  }`}>
                    Payment: {conv.contract.paymentStatus === 'COMPLETED' ? 'Completed' : conv.contract.paymentStatus === 'PENDING' ? 'Pending' : 'Failed'}
                  </p>
                  <p className={`text-xs mt-0.5 ${
                    conv.contract.paymentStatus === 'COMPLETED'
                      ? 'text-green-700 dark:text-green-400'
                      : conv.contract.paymentStatus === 'PENDING'
                      ? 'text-yellow-700 dark:text-yellow-400'
                      : 'text-red-700 dark:text-red-400'
                  }`}>
                    {conv.contract.paymentStatus === 'COMPLETED'
                      ? 'Funds secured in escrow'
                      : conv.contract.paymentStatus === 'PENDING'
                      ? 'Awaiting payment verification'
                      : 'Payment verification failed'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Closed Contract Notice */}
          {isContractClosed() && (
            <div className="mt-4 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center">
                This contract is closed and cannot be modified
              </p>
            </div>
          )}
        </div>
      )}
    </div>

      {/* Create Contract Modal */}
      {showCreateContract && conversation?.proposal && (
        <CreateContractModal
          isOpen={true}
          proposal={conversation.proposal}
          job={conversation.job}
          onClose={() => setShowCreateContract(false)}
          onSuccess={handleContractCreated}
        />
      )}

      {/* Decline Contract Modal */}
      <DeclineContractModal
        isOpen={showDeclineModal}
        onClose={() => setShowDeclineModal(false)}
        onConfirm={handleDeclineContract}
        isLoading={declineContractMutation.isPending}
      />
    </>
  );
};
