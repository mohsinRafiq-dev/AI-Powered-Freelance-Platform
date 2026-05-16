import { Lock, Unlock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';

const ESCROW_STATUS_CONFIG = {
  CREATED: { icon: AlertCircle, label: 'Not Funded', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' },
  FUNDED: { icon: Lock, label: 'Funded', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
  LOCKED: { icon: Lock, label: 'Locked', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400' },
  RELEASED: { icon: Unlock, label: 'Released', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
  REFUNDED: { icon: XCircle, label: 'Refunded', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
  DISPUTED: { icon: AlertCircle, label: 'Disputed', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' },
};

export const EscrowStatus = ({ escrow, milestoneAmount }) => {
  if (!escrow) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <AlertCircle className="w-4 h-4" />
        <span>Escrow not created</span>
      </div>
    );
  }

  const config = ESCROW_STATUS_CONFIG[escrow.status] || ESCROW_STATUS_CONFIG.CREATED;
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2">
      <Badge className={cn('flex items-center gap-1', config.color)}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
      {escrow.amount && (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatCurrency(escrow.amount)}
        </span>
      )}
    </div>
  );
};

