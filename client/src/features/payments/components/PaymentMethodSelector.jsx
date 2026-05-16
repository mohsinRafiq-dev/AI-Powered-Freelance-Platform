import { CreditCard, Smartphone, Building2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const METHOD_ICONS = {
  JAZZCASH: Smartphone,
  EASYPAISA: Smartphone,
  BANK_TRANSFER: Building2,
};

const METHOD_LABELS = {
  JAZZCASH: 'JazzCash',
  EASYPAISA: 'Easypaisa',
  BANK_TRANSFER: 'Bank Transfer',
};

export const PaymentMethodSelector = ({ methods, selected, onSelect }) => {
  return (
    <div>
      <Label>Payment Method</Label>
      <div className="grid grid-cols-3 gap-3 mt-2">
        {methods.map((method) => {
          const Icon = METHOD_ICONS[method.value] || CreditCard;
          const isSelected = selected === method.value;
          
          return (
            <button
              key={method.value}
              type="button"
              onClick={() => onSelect(method.value)}
              className={cn(
                'p-4 border-2 rounded-lg transition-all',
                isSelected
                  ? 'border-brand bg-brand/10 dark:bg-brand/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              )}
            >
              <Icon className="w-6 h-6 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {METHOD_LABELS[method.value] || method.label}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

