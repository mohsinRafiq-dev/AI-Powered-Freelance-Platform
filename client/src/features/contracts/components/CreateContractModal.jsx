import { useState, useEffect } from 'react';
import { X, FileText, User, DollarSign, Calendar, CheckCircle2, Plus, Trash2, ArrowRight, ArrowLeft, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { useCreateContract } from '../../../hooks/api/useContracts';
import { toast } from 'react-hot-toast';
import contractsApi from '@/api/contractsApi';
import { DepositModal } from '../../payments/components/DepositModal';
import { formatCurrency } from '@/utils/formatters';

export const CreateContractModal = ({ isOpen, onClose, proposal, job, onSuccess }) => {
  const [step, setStep] = useState('details'); // 'details' | 'payment'
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    totalAmount: proposal?.bidAmount || proposal?.proposedBudget || 0,
    paymentType: 'fixed',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: '',
    milestones: [],
  });

  const [newMilestone, setNewMilestone] = useState({
    title: '',
    amount: '',
    description: '',
    dueDate: '',
  });

  const [contractResult, setContractResult] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const createContractMutation = useCreateContract();

  useEffect(() => {
    if (proposal && isOpen) {
      setFormData({
        title: job?.title || proposal?.jobId?.title || '',
        description: job?.description || proposal?.jobId?.description || '',
        totalAmount: proposal.bidAmount || proposal.proposedBudget || 0,
        paymentType: 'fixed',
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: '',
        milestones: [],
      });
      setStep('details');
      setContractResult(null);
    }
  }, [proposal, job, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddMilestone = () => {
    if (!newMilestone.title || !newMilestone.amount) {
      toast.error('Please fill in milestone title and amount');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      milestones: [
        ...prev.milestones,
        {
          title: newMilestone.title,
          amount: parseFloat(newMilestone.amount),
          description: newMilestone.description || '',
          dueDate: newMilestone.dueDate || null,
        },
      ],
    }));

    setNewMilestone({
      title: '',
      amount: '',
      description: '',
      dueDate: '',
    });
  };

  const handleRemoveMilestone = (index) => {
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index),
    }));
  };

  const handleContractDetailsSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.totalAmount) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Calculate total amount
    const totalAmount = formData.totalAmount || 
      (formData.milestones && formData.milestones.length > 0
        ? formData.milestones.reduce((sum, m) => sum + (m.amount || 0), 0)
        : proposal.bidAmount || 0);

    if (totalAmount <= 0) {
      toast.error('Total amount must be greater than zero');
      return;
    }

    // Move to payment step
    setStep('payment');
  };

  const handlePaymentSubmit = async (paymentData) => {
    try {
      const contractData = {
        proposalId: proposal._id,
        paymentData: {
          paymentMethod: paymentData.paymentMethod,
          customerData: {
            email: paymentData.customerData?.email || undefined,
            name: paymentData.customerData?.name || undefined,
            phone: paymentData.customerData?.phone || undefined,
          },
        },
      };

      if (formData.description && formData.description.length >= 10) {
        contractData.terms = formData.description;
      }
      if (formData.endDate) {
        contractData.deadline = formData.endDate;
      }
      if (formData.milestones && formData.milestones.length > 0) {
        contractData.milestones = formData.milestones;
      }

      const result = await contractsApi.createContractFromProposal(contractData);
      setContractResult(result);

      // If payment URL is provided, redirect to payment gateway
      if (result.data?.paymentUrl && !result.data?.requiresManualVerification) {
        window.location.href = result.data.paymentUrl;
      } else if (result.data?.requiresManualVerification) {
        // Bank transfer - show instructions
        toast.success('Contract created! Please complete bank transfer to finalize.');
        setShowPaymentModal(false);
        onSuccess?.();
        onClose();
      } else {
        // Payment might be instant or already processed
        toast.success('Contract created successfully!');
        setShowPaymentModal(false);
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create contract');
      setShowPaymentModal(false);
    }
  };

  const calculateTotalAmount = () => {
    return formData.totalAmount || 
      (formData.milestones && formData.milestones.length > 0
        ? formData.milestones.reduce((sum, m) => sum + (m.amount || 0), 0)
        : proposal?.bidAmount || proposal?.proposedBudget || 0);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-brand-light/30 to-blue-50 dark:from-gray-900 dark:to-gray-900">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-6 h-6 text-brand" />
                Create Contract
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {step === 'details' 
                  ? 'Set up the terms and conditions for this project'
                  : 'Complete payment to secure the contract'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${step === 'details' ? 'text-brand' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'details' ? 'bg-brand text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                  1
                </div>
                <span className="font-medium">Contract Details</span>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
              <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-brand' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-brand text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                  <Lock className="w-4 h-4" />
                </div>
                <span className="font-medium">Payment</span>
              </div>
            </div>
          </div>

          {/* Content */}
          {step === 'details' ? (
            <form onSubmit={handleContractDetailsSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-6">
                {/* Proposal Info */}
                <div className="bg-gradient-to-br from-brand-light/30 to-brand-light/50 dark:from-brand-dark/20 dark:to-brand-dark/30 border border-brand-light dark:border-brand-dark rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-brand dark:text-brand-light" />
                    <h3 className="font-semibold text-brand-deepest dark:text-brand-light">Accepted Proposal</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-brand dark:text-brand-light mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Freelancer</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {proposal.freelancerId?.name || 'Not specified'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-brand dark:text-brand-light mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Job Title</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {proposal.jobId?.title || 'Not specified'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <DollarSign className="w-5 h-5 text-brand dark:text-brand-light mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Proposed Budget</p>
                        <p className="font-medium text-brand dark:text-brand-light text-lg">
                          {formatCurrency(proposal.bidAmount || proposal.proposedBudget || 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contract Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contract Details</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contract Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                      placeholder="Enter contract title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent resize-none transition-all"
                      placeholder="Describe the contract terms and conditions"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Total Amount <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand" />
                        <input
                          type="number"
                          name="totalAmount"
                          value={formData.totalAmount}
                          onChange={handleInputChange}
                          required
                          min="0"
                          step="0.01"
                          className="w-full pl-16 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Payment Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="paymentType"
                        value={formData.paymentType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all appearance-none cursor-pointer"
                      >
                        <option value="fixed">Fixed Price</option>
                        <option value="hourly">Hourly Rate</option>
                        <option value="milestone">Milestone-based</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        required
                        min={format(new Date(), 'yyyy-MM-dd')}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        min={formData.startDate}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Milestones Section */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Milestones</h3>
                    <button
                      type="button"
                      onClick={handleAddMilestone}
                      className="flex items-center gap-2 px-3 py-1.5 bg-brand hover:bg-brand-dark text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Milestone
                    </button>
                  </div>

                  {formData.milestones.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {formData.milestones.map((milestone, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">{milestone.title}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {formatCurrency(milestone.amount)}
                              {milestone.dueDate && ` • Due: ${format(new Date(milestone.dueDate), 'MMM d, yyyy')}`}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveMilestone(index)}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Milestone title"
                        value={newMilestone.title}
                        onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                        className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                      <input
                        type="number"
                        placeholder="Amount"
                        value={newMilestone.amount}
                        onChange={(e) => setNewMilestone({ ...newMilestone, amount: e.target.value })}
                        min="0"
                        step="0.01"
                        className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <textarea
                        placeholder="Description (optional)"
                        value={newMilestone.description}
                        onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                        rows={2}
                        className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand resize-none"
                      />
                      <input
                        type="date"
                        value={newMilestone.dueDate}
                        onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
                        min={format(new Date(), 'yyyy-MM-dd')}
                        className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors border border-gray-300 dark:border-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 bg-gradient-brand hover:opacity-90 text-white rounded-lg transition-all font-semibold shadow-lg shadow-brand/20 flex items-center gap-2"
                >
                  Continue to Payment
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6">
              <div className="bg-gradient-to-br from-brand-light/30 to-brand-light/50 dark:from-brand-dark/20 dark:to-brand-dark/30 border border-brand-light dark:border-brand-dark rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Required</h3>
                  <Lock className="w-5 h-5 text-brand" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  To create this contract, you need to fund the escrow with the total contract amount. 
                  The funds will be held securely until the contract is completed.
                </p>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Amount:</span>
                    <span className="text-2xl font-bold text-brand">{formatCurrency(calculateTotalAmount())}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="px-6 py-2.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors border border-gray-300 dark:border-gray-700 font-medium flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(true)}
                  className="px-8 py-2.5 bg-gradient-brand hover:opacity-90 text-white rounded-lg transition-all font-semibold shadow-lg shadow-brand/20 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Pay & Create Contract
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <DepositModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false);
            onSuccess?.();
            onClose();
          }}
          onSubmit={handlePaymentSubmit}
          initialAmount={calculateTotalAmount()}
        />
      )}
    </>
  );
};
