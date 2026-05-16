import { format } from 'date-fns';
import { ArrowDown, ArrowUp, Lock, Unlock, RefreshCw, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const TRANSACTION_ICONS = {
  DEPOSIT: ArrowDown,
  WITHDRAWAL: ArrowUp,
  ESCROW_FUND: Lock,
  ESCROW_RELEASE: Unlock,
  REFUND: RefreshCw,
  FEE: DollarSign,
};

const TRANSACTION_COLORS = {
  DEPOSIT: 'text-green-600 dark:text-green-400',
  WITHDRAWAL: 'text-blue-600 dark:text-blue-400',
  ESCROW_FUND: 'text-amber-600 dark:text-amber-400',
  ESCROW_RELEASE: 'text-green-600 dark:text-green-400',
  REFUND: 'text-red-600 dark:text-red-400',
  FEE: 'text-gray-600 dark:text-gray-400',
};

const STATUS_COLORS = {
  SUCCESS: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  FAILED: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  CANCELLED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
};

export const TransactionItem = ({ transaction }) => {
  if (!transaction) return null;

  const { type, amount, status, description, createdAt, paymentMethod } = transaction;
  const Icon = TRANSACTION_ICONS[type] || DollarSign;
  const colorClass = TRANSACTION_COLORS[type] || 'text-gray-600 dark:text-gray-400';

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className={cn('p-2 rounded-full bg-gray-100 dark:bg-gray-700', colorClass)}>
          <Icon className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-medium text-gray-900 dark:text-white truncate">
              {description || type}
            </p>
            <Badge className={cn('text-xs', STATUS_COLORS[status] || STATUS_COLORS.PENDING)}>
              {status}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>{format(new Date(createdAt), 'MMM dd, yyyy h:mm a')}</span>
            {paymentMethod && (
              <>
                <span>•</span>
                <span>{paymentMethod}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className={cn('text-lg font-semibold ml-4', colorClass)}>
        {type === 'DEPOSIT' || type === 'ESCROW_RELEASE' ? '+' : '-'}
        {formatCurrency(amount)}
      </div>
    </div>
  );
};

