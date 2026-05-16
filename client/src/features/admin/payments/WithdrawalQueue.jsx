import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import axiosInstance from '@/api/axiosInstance';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/utils/formatters';
import { format } from 'date-fns';

export default function WithdrawalQueue() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPendingWithdrawals();
  }, []);

  const loadPendingWithdrawals = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/admin/payments/withdrawals/pending');
      setWithdrawals(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load pending withdrawals');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcess = async (id) => {
    try {
      await axiosInstance.post(`/admin/payments/withdrawals/${id}/process`);
      toast.success('Withdrawal processed successfully');
      loadPendingWithdrawals();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process withdrawal');
    }
  };

  const handleReject = async (id, reason) => {
    const rejectionReason = prompt('Enter rejection reason:');
    if (!rejectionReason) return;

    try {
      await axiosInstance.post(`/admin/payments/withdrawals/${id}/reject`, {
        reason: rejectionReason,
      });
      toast.success('Withdrawal rejected');
      loadPendingWithdrawals();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject withdrawal');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (withdrawals.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No pending withdrawals</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {withdrawals.map((withdrawal) => (
        <Card key={withdrawal._id}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <p className="font-semibold text-lg">{withdrawal.user?.name}</p>
                  <span className="text-sm text-gray-500">{withdrawal.user?.email}</span>
                </div>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <p>Amount: <span className="font-semibold">{formatCurrency(withdrawal.amount)}</span></p>
                  <p>Method: {withdrawal.paymentMethod}</p>
                  <p>Requested: {format(new Date(withdrawal.createdAt), 'MMM dd, yyyy h:mm a')}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleProcess(withdrawal._id)}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Process
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleReject(withdrawal._id)}
                  className="flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

