import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, MessageCircle, Plus, FileText } from 'lucide-react';
import { ContractDetails } from '../components/ContractDetails';
import { MilestoneList } from '../components/MilestoneList';
import { ActivityTimeline } from '../components/ActivityTimeline';
import ReviewForm from '../../reviews/components/ReviewForm';
import ContractReviews from '../../reviews/components/ContractReviews';
import api from '../../../api/axiosInstance';
import {
  useContract,
  useRespondToContract,
  useCompleteContract,
  useCancelContract,
  useUpdateMilestone,
  useAddMilestone,
} from '../../../hooks/api/useContracts';
import { useSelector } from 'react-redux';
import { Loader } from '../../../components/common/Loader';
import { toast } from 'react-hot-toast';
import { useEffect } from 'react';
import {
  isClient,
  canAddMilestones,
  mapErrorMessage,
} from '../constants';

export const ContractDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [contractReviews, setContractReviews] = useState([]);
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    amount: '',
    dueDate: '',
  });

  const { data: contractData, isLoading } = useContract(id);
  const respondMutation = useRespondToContract();
  const completeMutation = useCompleteContract();
  const cancelMutation = useCancelContract();
  const updateMilestoneMutation = useUpdateMilestone();
  const addMilestoneMutation = useAddMilestone();

  const contract = contractData?.data?.contract;
  
  const fetchContractReviews = async () => {
    if (!contract || contract.status !== 'completed') return;
    try {
      const res = await api.get(`/reviews/contract/${id}`);
      setContractReviews(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    }
  };

  useEffect(() => {
    fetchContractReviews();
  }, [contract?.status, id]);

  const hasSubmittedReview = contractReviews.some(
    r => String(r.reviewer?._id || r.reviewer) === String(user?._id || user?.id)
  );

  // [CONTRACT][DETAIL][DEBUG] Log raw API response
  console.log('[CONTRACT][DETAIL][RAW API RESPONSE]', contractData);
  
  // FIX: API returns { success, data: { contract: {...} } }
  // Correct extraction: contractData.data.contract
  
  console.log('[CONTRACT][DETAIL][EXTRACTED CONTRACT]', contract);
  console.log('[CONTRACT][DETAIL][AMOUNT]', contract?.totalAmount);
  console.log('[CONTRACT][DETAIL][STATUS]', contract?.status);
  console.log('[CONTRACT][DETAIL][CLIENT]', contract?.client);
  console.log('[CONTRACT][DETAIL][FREELANCER]', contract?.freelancer);
  
  // Business Rule: Check if user can add milestones
  const userCanAddMilestones = contract && isClient(contract, user?._id || user?.id) && canAddMilestones(contract.status);

  const handleAccept = async () => {
    try {
      await respondMutation.mutateAsync({
        id,
        action: 'accept',
      });
      toast.success('Contract accepted successfully');
    } catch (error) {
      toast.error(mapErrorMessage(error));
    }
  };

  const handleDecline = async () => {
    const reason = prompt('Please provide a reason for declining (min 10 characters):');
    if (reason && reason.trim().length >= 10) {
      try {
        await respondMutation.mutateAsync({
          id,
          action: 'decline',
          reason,
        });
        toast.success('Contract declined');
        navigate('/contracts');
      } catch (error) {
        toast.error(mapErrorMessage(error));
      }
    } else if (reason) {
      toast.error('Reason must be at least 10 characters');
    }
  };

  const handleComplete = async () => {
    if (confirm('Are you sure you want to mark this contract as complete? This action cannot be undone.')) {
      try {
        await completeMutation.mutateAsync(id);
        toast.success('Contract completed successfully');
      } catch (error) {
        toast.error(mapErrorMessage(error));
      }
    }
  };

  const handleCancelSubmit = async () => {
    // Business Rule: Cancellation reason must be at least 10 characters
    if (!cancelReason.trim() || cancelReason.trim().length < 10) {
      toast.error('Cancellation reason must be at least 10 characters');
      return;
    }
    
    try {
      await cancelMutation.mutateAsync({ id, reason: cancelReason });
      toast.success('Contract cancelled');
      setShowCancelModal(false);
      navigate('/contracts');
    } catch (error) {
      toast.error(mapErrorMessage(error));
    }
  };

  const handleMilestoneUpdate = async (milestoneId, updateData) => {
    try {
      await updateMilestoneMutation.mutateAsync({
        contractId: id,
        milestoneId,
        data: updateData,
      });
      toast.success('Milestone updated successfully');
    } catch (error) {
      toast.error(mapErrorMessage(error));
    }
  };

  const handleAddMilestone = async () => {
    // Business Rule: Validate milestone data
    if (!newMilestone.title.trim() || newMilestone.title.length < 3) {
      toast.error('Milestone title must be at least 3 characters');
      return;
    }
    
    if (!newMilestone.amount || parseFloat(newMilestone.amount) <= 0) {
      toast.error('Milestone amount must be greater than 0');
      return;
    }

    // Business Rule: Due date must be in the future
    if (newMilestone.dueDate) {
      const dueDate = new Date(newMilestone.dueDate);
      if (dueDate < new Date()) {
        toast.error('Milestone due date must be in the future');
        return;
      }
      
      // Business Rule: Due date cannot exceed contract deadline
      if (contract.deadline && dueDate > new Date(contract.deadline)) {
        toast.error('Milestone due date cannot exceed contract deadline');
        return;
      }
    }

    try {
      await addMilestoneMutation.mutateAsync({
        id: id,
        data: {
          ...newMilestone,
          amount: parseFloat(newMilestone.amount),
        },
      });
      toast.success('Milestone added successfully');
      setShowAddMilestoneModal(false);
      setNewMilestone({ title: '', description: '', amount: '', dueDate: '' });
    } catch (error) {
      toast.error(mapErrorMessage(error));
    }
  };

  const handleMessage = () => {
    // Navigate to messages with this contract's conversation
    navigate('/messages');
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-gray-400 dark:text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Contract not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The contract you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/contracts')}
            className="px-6 py-3 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            Go back to contracts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 lg:pt-24">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/contracts')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to Contracts</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {contract?.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                {contract?.description}
              </p>
            </div>

            <button
              onClick={handleMessage}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-lg transition-colors font-medium shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Message {isClient(contract, user?._id || user?.id) ? 'Freelancer' : 'Client'}</span>
            </button>
          </div>
        </div>

        {/* Contract Details */}
        <ContractDetails
          contract={contract}
          currentUserId={user?._id || user?.id}
          onAccept={handleAccept}
          onDecline={handleDecline}
          onComplete={handleComplete}
          onCancel={() => setShowCancelModal(true)}
        />

        {/* Milestones Section */}
        <div className="mt-6 bg-white dark:bg-gray-900 rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Milestones</h2>
            
            {/* Business Rule: Only client can add milestones to pending/active contracts */}
            {userCanAddMilestones && (
              <button
                onClick={() => setShowAddMilestoneModal(true)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg transition-colors text-sm font-medium shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Milestone</span>
                <span className="sm:hidden">Add</span>
              </button>
            )}
          </div>

          {contract?.milestones?.length > 0 ? (
            <MilestoneList
              milestones={contract.milestones}
              onUpdate={handleMilestoneUpdate}
              contractStatus={contract?.status}
              contract={contract}
              contractId={id}
            />
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400 dark:text-gray-600" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">No milestones defined yet</p>
              {userCanAddMilestones && (
                <button
                  onClick={() => setShowAddMilestoneModal(true)}
                  className="mt-2 text-brand dark:text-brand-light hover:text-brand-dark dark:hover:text-brand-light/80 text-sm font-medium"
                >
                  Add your first milestone
                </button>
              )}
            </div>
          )}
        </div>

          {/* Activity Timeline */}
          <div className="mt-6">
            <ActivityTimeline contract={contract} />
          </div>

          {/* Feedback Section (only for completed contracts) */}
          {contract?.status === 'completed' && (
            <div className="mt-6 space-y-6">
              <ContractReviews 
                reviews={contractReviews}
                currentUserId={user?._id || user?.id}
                onReviewReported={fetchContractReviews}
              />
              
              {!hasSubmittedReview && (
                <ReviewForm 
                  jobId={typeof contract.job === 'object' ? contract.job._id : contract.job}
                  contractId={contract._id}
                  revieweeId={isClient(contract, user?._id || user?.id) ? (typeof contract.freelancer === 'object' ? contract.freelancer._id : contract.freelancer) : (typeof contract.client === 'object' ? contract.client._id : contract.client)}
                  onSuccess={() => {
                    toast.success('Your review was submitted successfully!');
                    fetchContractReviews();
                  }}
                />
              )}
            </div>
          )}

        </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-800 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Cancel Contract</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              Please provide a reason for cancelling this contract (minimum 10 characters):
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Explain why you're cancelling this contract..."
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand mb-2 resize-none"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              {cancelReason.length}/10 characters minimum
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                }}
                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg transition-colors font-medium"
              >
                Keep Contract
              </button>
              <button
                onClick={handleCancelSubmit}
                disabled={cancelReason.trim().length < 10}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
              >
                Cancel Contract
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Milestone Modal */}
      {showAddMilestoneModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Add Milestone</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                  placeholder="e.g., Initial Design Mockups"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">{newMilestone.title.length}/3 characters minimum</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newMilestone.description}
                  onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                  placeholder="Describe what this milestone includes..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">$</span>
                  <input
                    type="number"
                    value={newMilestone.amount}
                    onChange={(e) => setNewMilestone({ ...newMilestone, amount: e.target.value })}
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newMilestone.dueDate}
                  onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  max={contract.deadline ? new Date(contract.deadline).toISOString().split('T')[0] : undefined}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                />
                {contract.deadline && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                    Cannot exceed contract deadline: {new Date(contract.deadline).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddMilestoneModal(false);
                  setNewMilestone({ title: '', description: '', amount: '', dueDate: '' });
                }}
                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMilestone}
                disabled={!newMilestone.title.trim() || !newMilestone.amount || parseFloat(newMilestone.amount) <= 0}
                className="flex-1 px-4 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
              >
                Add Milestone
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractDetailPage;
