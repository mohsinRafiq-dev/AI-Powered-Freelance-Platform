import { useState, useEffect } from 'react';
import { RefreshCw, Filter } from 'lucide-react';
import { TransactionList } from '../components/TransactionList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import paymentService from '@/services/paymentService';
import toast from 'react-hot-toast';

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    paymentMethod: '',
    page: 1,
    limit: 20,
  });
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, [filters]);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await paymentService.getTransactions(filters);
      setTransactions(response.transactions || []);
      setPagination(response.pagination);
    } catch (error) {
      toast.error('Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filter changes
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 lg:pt-24">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Transaction History
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
              >
                <option value="">All Types</option>
                <option value="DEPOSIT">Deposit</option>
                <option value="WITHDRAWAL">Withdrawal</option>
                <option value="ESCROW_FUND">Escrow Fund</option>
                <option value="ESCROW_RELEASE">Escrow Release</option>
                <option value="REFUND">Refund</option>
              </select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
              >
                <option value="">All Statuses</option>
                <option value="SUCCESS">Success</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <select
                id="paymentMethod"
                value={filters.paymentMethod}
                onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
              >
                <option value="">All Methods</option>
                <option value="JAZZCASH">JazzCash</option>
                <option value="EASYPAISA">Easypaisa</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={loadTransactions}
                disabled={isLoading}
                className="w-full"
              >
                <RefreshCw className={isLoading ? 'animate-spin' : ''} />
              </Button>
            </div>
          </div>
        </div>

        <TransactionList
          transactions={transactions}
          isLoading={isLoading}
          onRefresh={loadTransactions}
          pagination={pagination}
        />
      </div>
    </div>
  );
}

