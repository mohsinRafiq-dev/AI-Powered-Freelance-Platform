import { useState } from 'react';
import { TransactionItem } from './TransactionItem';
import EmptyState from '../../dashboard/shared/EmptyState';
import { ButtonLoader } from '@/components/common/Loader';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const TransactionList = ({ transactions, isLoading, onRefresh, pagination }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <EmptyState
        icon={RefreshCw}
        title="No Transactions"
        message="You haven't made any transactions yet."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Transaction History
        </h3>
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={isLoading ? 'animate-spin' : ''} />
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {transactions.map((transaction) => (
          <TransactionItem key={transaction._id} transaction={transaction} />
        ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            disabled={pagination.page === 1}
            onClick={() => onRefresh?.({ page: pagination.page - 1 })}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => onRefresh?.({ page: pagination.page + 1 })}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

