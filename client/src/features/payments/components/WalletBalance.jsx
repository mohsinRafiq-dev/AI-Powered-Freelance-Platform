import { Wallet, Lock, TrendingUp, ArrowDown } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const WalletBalance = ({ wallet, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wallet Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!wallet) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wallet Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400">No wallet data available</p>
        </CardContent>
      </Card>
    );
  }

  const { availableBalance = 0, lockedBalance = 0, totalBalance = 0, currency = 'PKR' } = wallet;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Wallet Balance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalBalance)}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Balance</p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <ArrowDown className="w-4 h-4" />
              <span className="text-lg font-semibold">{formatCurrency(availableBalance)}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Available</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <Lock className="w-4 h-4" />
              <span className="text-lg font-semibold">{formatCurrency(lockedBalance)}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Locked (Escrow)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

