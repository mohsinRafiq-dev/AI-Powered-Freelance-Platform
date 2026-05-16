import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../../lib/utils';

const statusConfig = {
  'Proposal submitted': { icon: CheckCircle2, color: 'text-brand' },
  'Contract offer': { icon: Clock, color: 'text-yellow-500' },
  'Offer acceptance': { icon: CheckCircle2, color: 'text-brand' },
  'Contract starts': { icon: CheckCircle2, color: 'text-blue-500' },
  'Milestone completed': { icon: CheckCircle2, color: 'text-brand' },
  'Contract completed': { icon: CheckCircle2, color: 'text-brand' },
  default: { icon: Circle, color: 'text-gray-400' },
};

export const ActivityTimeline = ({ contract }) => {
  // [TIMELINE][DEBUG] Log contract data
  console.log('[TIMELINE] Received contract:', contract);
  
  // If no contract data, show empty state
  if (!contract) {
    return (
      <div className="w-full md:w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Activity timeline</h3>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Loading contract activity...</p>
      </div>
    );
  }
  
  const activities = [];

  // Build activity timeline from contract data
  if (contract?.proposal?.createdAt) {
    activities.push({
      title: 'Proposal submitted',
      date: contract.proposal.createdAt,
      description: 'August 31',
    });
  }

  if (contract?.createdAt) {
    activities.push({
      title: 'Contract offer',
      date: contract.createdAt,
      description: 'Awaiting offer from client',
      status: contract.status === 'pending' ? 'pending' : 'completed',
    });
  }

  if (contract?.status === 'active' || contract?.status === 'completed') {
    activities.push({
      title: 'Offer acceptance',
      date: contract.startDate,
      description: '',
    });

    activities.push({
      title: 'Contract starts',
      date: contract.startDate,
      description: '',
    });
  }

  // Add milestones
  contract?.milestones
    ?.filter((m) => m.status === 'completed')
    .forEach((milestone) => {
      activities.push({
        title: 'Milestone completed',
        date: milestone.completedAt,
        description: milestone.title,
      });
    });

  if (contract?.status === 'completed') {
    activities.push({
      title: 'Contract completed',
      date: contract.completedAt,
      description: '',
    });
  }

  // Sort by date
  activities.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Show empty state if no activities
  if (activities.length === 0) {
    return (
      <div className="w-full md:w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Activity timeline</h3>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">No activity yet</p>
      </div>
    );
  }

  return (
    <div className="w-full md:w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <Clock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Activity timeline</h3>
      </div>

      <div className="space-y-6">
        {activities.map((activity, index) => {
          const config = statusConfig[activity.title] || statusConfig.default;
          const Icon = config.icon;
          const isLast = index === activities.length - 1;

          return (
            <div key={index} className="relative">
              {/* Line connector */}
              {!isLast && (
                <div className="absolute left-6 top-10 w-0.5 h-full bg-gray-200 dark:bg-gray-700" />
              )}

              {/* Icon and Content - Centered for last item */}
              <div className={cn(
                'flex gap-3 items-start',
                isLast && 'flex-col items-center justify-center'
              )}>
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 shadow-sm',
                    activity.status === 'pending'
                      ? 'bg-yellow-50 dark:bg-yellow-900/10'
                      : 'bg-white dark:bg-gray-900',
                    isLast && 'mx-auto'
                  )}
                >
                  {activity.status === 'pending' ? (
                    <Circle className={cn('w-4 h-4', config.color)} />
                  ) : (
                    <Icon className={cn('w-4 h-4', config.color)} />
                  )}
                </div>

                {/* Content */}
                <div className={cn(
                  'flex-1 pb-2',
                  isLast && 'text-center w-full mt-2 max-w-xs mx-auto'
                )}>
                  <h4 className={cn(
                    'font-semibold text-gray-900 dark:text-white text-sm',
                    isLast && 'text-center'
                  )}>{activity.title}</h4>
                  {activity.description && (
                    <p className={cn(
                      'text-sm text-gray-600 dark:text-gray-400 mt-1',
                      isLast && 'text-center'
                    )}>{activity.description}</p>
                  )}
                  {activity.date && (
                    <p className={cn(
                      'text-xs text-gray-500 dark:text-gray-500 mt-1',
                      isLast && 'text-center'
                    )}>
                      {format(new Date(activity.date), 'MMMM d, yyyy')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
