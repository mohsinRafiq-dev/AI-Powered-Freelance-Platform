import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ArrowUpRight, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import paymentService from '@/services/paymentService';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const STATUS_CONFIG = {
  REQUESTED: { icon: Clock, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/20' },
  PROCESSING: { icon: Clock, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/20' },
  SUCCESS: { icon: CheckCircle, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/20' },
  FAILED: { icon: XCircle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/20' },
  CANCELLED: { icon: AlertCircle, color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-900/20' },
};

export const WithdrawalHistory = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWithdrawals();
  }, []);

  const loadWithdrawals = async () => {
    setIsLoading(true);
    try {
      const response = await paymentService.getWithdrawals();
      setWithdrawals(response.data || []);
    } catch (error) {
      toast.error('Failed to load withdrawal history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this withdrawal request?')) {
      return;
    }

    try {
      await paymentService.cancelWithdrawal(id);
      toast.success('Withdrawal cancelled successfully');
      loadWithdrawals();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel withdrawal');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (withdrawals.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <ArrowUpRight className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No withdrawal requests yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {withdrawals.map((withdrawal) => {
        const config = STATUS_CONFIG[withdrawal.status] || STATUS_CONFIG.REQUESTED;
        const Icon = config.icon;

        return (
          <div
            key={withdrawal._id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={cn('p-2 rounded-full', config.bg)}>
                  <Icon className={cn('w-5 h-5', config.color)} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(withdrawal.amount)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {withdrawal.paymentMethod}
                  </p>
                </div>
              </div>
              <Badge className={cn(config.bg, config.color)}>
                {withdrawal.status}
              </Badge>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>{format(new Date(withdrawal.createdAt), 'MMM dd, yyyy h:mm a')}</span>
              {withdrawal.status === 'REQUESTED' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCancel(withdrawal._id)}
                >
                  Cancel
                </Button>
              )}
            </div>

            {withdrawal.failureReason && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                {withdrawal.failureReason}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

