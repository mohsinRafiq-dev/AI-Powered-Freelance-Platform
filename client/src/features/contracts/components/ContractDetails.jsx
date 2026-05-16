import { Calendar, DollarSign, Clock, User, FileText, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../../lib/utils';
import {
  STATUS_CONFIG,
  isClient,
  isFreelancer,
  canRespondToContract,
  canCompleteContract,
  canCancelContract,
  isTerminalStatus,
  getStatusMessage,
  calculateProgress,
} from '../constants';

export const ContractDetails = ({ contract, onAccept, onDecline, onComplete, onCancel, currentUserId }) => {
  // [CONTRACT][DETAILS][DEBUG] Log received contract
  console.log('[CONTRACT][DETAILS] Received contract:', contract);
  console.log('[CONTRACT][DETAILS] currentUserId:', currentUserId);
  
  // Business Rule: Determine user role using helpers
  const userIsClient = isClient(contract, currentUserId);
  const userIsFreelancer = isFreelancer(contract, currentUserId);
  
  // Get status configuration with safe fallback
  const config = STATUS_CONFIG[contract?.status] || STATUS_CONFIG.pending;
  
  // Business Rule: Check if contract is in terminal state
  const contractIsTerminal = isTerminalStatus(contract?.status);

  // Calculate milestone progress using helper
  const progress = calculateProgress(contract?.milestones);
  const completedMilestones = contract?.milestones?.filter((m) => m.status === 'completed').length || 0;
  const totalMilestones = contract?.milestones?.length || 0;
  
  // Defensive data extraction
  const totalAmount = contract?.totalAmount ?? 0;
  const startDate = contract?.startDate;
  const deadline = contract?.deadline;
  const paymentType = contract?.paymentType || 'Fixed';
  const clientName = contract?.client?.name || contract?.client?.fullName || 'Unknown Client';
  const clientEmail = contract?.client?.email || '';
  const clientAvatar = contract?.client?.avatar || '/default-avatar.png';
  const freelancerName = contract?.freelancer?.name || contract?.freelancer?.fullName || 'Unknown Freelancer';
  const freelancerEmail = contract?.freelancer?.email || '';
  const freelancerAvatar = contract?.freelancer?.avatar || '/default-avatar.png';

  return (
    <div className="space-y-6">
      {/* Status Badge & Progress Card */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Contract Status</h2>
          <span
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-semibold border',
              config.color
            )}
          >
            {config.label}
          </span>
        </div>

        {/* Progress Bar */}
        {totalMilestones > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Progress</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {completedMilestones} / {totalMilestones} milestones
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5">
              <div
                className="bg-brand h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">{Math.round(progress)}% complete</p>
          </div>
        )}
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-brand-light/30 dark:bg-brand/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5 text-brand dark:text-brand-light" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Amount</p>
              <p className="font-bold text-lg text-gray-900 dark:text-white truncate">
                ${totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Start Date</p>
              <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                {startDate
                  ? format(new Date(startDate), 'MMM d, yyyy')
                  : 'Not started'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-purple-600 dark:text-purple-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Deadline</p>
              <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                {deadline
                  ? format(new Date(deadline), 'MMM d, yyyy')
                  : 'No deadline'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-50 dark:bg-yellow-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Payment Type</p>
              <p className="font-semibold text-sm text-gray-900 dark:text-white capitalize truncate">
                {paymentType}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Participants Section */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">Participants</h2>
        
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700/50">
            <img
              src={clientAvatar}
              alt={clientName}
              className="w-14 h-14 rounded-full object-cover flex-shrink-0 border-2 border-white dark:border-gray-700"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Client</span>
              </div>
              <p className="font-semibold text-gray-900 dark:text-white truncate">{clientName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{clientEmail}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700/50">
            <img
              src={freelancerAvatar}
              alt={freelancerName}
              className="w-14 h-14 rounded-full object-cover flex-shrink-0 border-2 border-white dark:border-gray-700"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Freelancer</span>
              </div>
              <p className="font-semibold text-gray-900 dark:text-white truncate">{freelancerName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{freelancerEmail}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Terms */}
      {contract?.terms && (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contract Terms</h3>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{contract.terms}</p>
        </div>
      )}

      {/* Payments: Coming Soon - Non-interactive indicator */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800/30 rounded-xl p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">Payments: Coming Soon</h3>
            <p className="text-sm text-blue-700 dark:text-blue-200/70 leading-relaxed">
              Payment processing and escrow features will be available in the next release. 
              For now, please coordinate payments directly with your {userIsClient ? 'freelancer' : 'client'}.
            </p>
          </div>
        </div>
      </div>

      {/* Status Message */}
      {!contractIsTerminal && (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold text-gray-900 dark:text-white">Status:</span>{' '}
            {getStatusMessage(contract, currentUserId)}
          </p>
        </div>
      )}

      {/* Terminal State Message */}
      {contractIsTerminal && (
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-5 border border-amber-200 dark:border-amber-800/30 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 dark:text-amber-300 mb-1">This contract is closed</h3>
              <p className="text-sm text-amber-700 dark:text-amber-200/70">
                No further actions can be taken on this contract.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions - Business Rules Enforced */}
      {/* Business Rule: Only freelancer can respond to pending contracts */}
      {canRespondToContract(contract, currentUserId) && (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onAccept}
            className="flex-1 px-6 py-3 bg-brand hover:bg-brand-dark text-white rounded-lg font-semibold transition-all hover:shadow-lg shadow-sm flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            Accept Contract
          </button>
          <button
            onClick={onDecline}
            className="flex-1 px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg font-semibold transition-all shadow-sm"
          >
            Decline
          </button>
        </div>
      )}

      {/* Business Rule: Only client can complete or cancel active contracts */}
      {canCompleteContract(contract, currentUserId) && (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onComplete}
            className="flex-1 px-6 py-3 bg-brand hover:bg-brand-dark text-white rounded-lg font-semibold transition-all hover:shadow-lg shadow-sm flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            Mark as Complete
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg font-semibold transition-all shadow-sm"
          >
            Cancel Contract
          </button>
        </div>
      )}

      {/* Business Rule: Client can cancel pending contracts */}
      {contract?.status === 'pending' && userIsClient && !canRespondToContract(contract, currentUserId) && (
        <div className="flex justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg font-semibold transition-all shadow-sm"
          >
            Cancel Contract
          </button>
        </div>
      )}
    </div>
  );
};
