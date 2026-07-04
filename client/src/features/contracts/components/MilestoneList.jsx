import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../../lib/utils';
import {
  MILESTONE_STATUS,
  MILESTONE_STATUS_CONFIG,
  canUpdateMilestone,
} from '../constants';
import { MilestonePayment } from './MilestonePayment';

export const MilestoneList = ({ milestones, onUpdate, contractStatus, contract, contractId }) => {
  // Business Rule: Check if milestone can be updated based on milestone and contract status
  const handleStatusChange = (milestone, newStatus) => {
    if (onUpdate && canUpdateMilestone(milestone, contractStatus)) {
      onUpdate(milestone._id, { status: newStatus });
    }
  };

  if (!milestones || milestones.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No milestones defined for this contract</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {milestones.map((milestone, index) => {
        const config = MILESTONE_STATUS_CONFIG[milestone.status] || MILESTONE_STATUS_CONFIG[MILESTONE_STATUS.PENDING];
        
        // Business Rule: Check if this specific milestone can be updated
        const milestoneCanBeUpdated = canUpdateMilestone(milestone, contractStatus);
        const isCompleted = milestone.status === MILESTONE_STATUS.COMPLETED;

        return (
          <div
            key={milestone._id || index}
            className={cn(
              'bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border transition-colors',
              isCompleted 
                ? 'border-brand-light dark:border-brand-dark/30 bg-brand-light/30 dark:bg-brand-dark/10' 
                : 'border-gray-200 dark:border-gray-700'
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{milestone.title}</h4>
                  <span
                    className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-semibold shrink-0',
                      config.color
                    )}
                  >
                    {config.label}
                  </span>
                </div>
                {milestone.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{milestone.description}</p>
                )}
              </div>
              <div className="text-right ml-4 shrink-0">
                <p className="font-bold text-lg text-brand dark:text-brand-light">
                  Rs. {milestone.amount?.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm flex-wrap gap-2">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                {milestone.dueDate && (
                  <>
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">Due: {format(new Date(milestone.dueDate), 'MMM d, yyyy')}</span>
                  </>
                )}
              </div>

              {/* Business Rule: Show action buttons only if milestone can be updated */}
              {milestoneCanBeUpdated && (
                <div className="flex gap-2">
                  {milestone.status === MILESTONE_STATUS.PENDING && (
                    <button
                      onClick={() => handleStatusChange(milestone, MILESTONE_STATUS.IN_PROGRESS)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold transition-colors shadow-sm"
                      title="Start working on this milestone"
                    >
                      Start
                    </button>
                  )}
                  {milestone.status === MILESTONE_STATUS.IN_PROGRESS && (
                    <button
                      onClick={() => handleStatusChange(milestone, MILESTONE_STATUS.COMPLETED)}
                      className="px-3 py-1.5 bg-brand hover:bg-brand-dark text-white rounded-md text-xs font-semibold transition-colors shadow-sm"
                      title="Mark this milestone as completed"
                    >
                      Complete
                    </button>
                  )}
                </div>
              )}

              {/* Business Rule: Show completedAt timestamp when milestone is completed */}
              {isCompleted && milestone.completedAt && (
                <span className="text-xs text-brand dark:text-brand-light flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  Completed {format(new Date(milestone.completedAt), 'MMM d, yyyy')}
                </span>
              )}
            </div>

            {milestone.notes && (
              <div className="mt-3 pt-3 border-t border-gray-700">
                <p className="text-sm text-gray-400">
                  <span className="font-medium text-gray-300">Notes:</span> {milestone.notes}
                </p>
              </div>
            )}

            {/* Payment Integration */}
            {(contract?._id || contractId) && (
              <MilestonePayment
                contractId={contract?._id || contractId}
                milestoneId={milestone._id}
                milestoneAmount={milestone.amount}
                milestoneStatus={milestone.status}
                contractStatus={contractStatus}
                onUpdate={onUpdate}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
