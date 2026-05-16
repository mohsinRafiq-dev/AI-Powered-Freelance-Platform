import { TestTube, AlertCircle } from 'lucide-react';
import { usePaymentMode } from '@/hooks/api/usePaymentMode';

export const TestingModeBanner = () => {
  const { data: paymentModeData, isLoading } = usePaymentMode();
  
  if (isLoading) return null;
  
  const isTesting = paymentModeData?.data?.isTesting !== false; // Default to testing
  
  if (!isTesting) return null;

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-400 dark:border-yellow-600 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <TestTube className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-yellow-900 dark:text-yellow-300">
              Testing Mode Active
            </span>
            <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs font-medium rounded">
              TEST
            </span>
          </div>
          <p className="text-sm text-yellow-800 dark:text-yellow-400">
            All payments are simulated. No real transactions occur. This is perfect for testing the payment system without merchant accounts.
          </p>
        </div>
      </div>
    </div>
  );
};

