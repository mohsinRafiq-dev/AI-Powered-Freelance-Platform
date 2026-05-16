import { useState, useEffect } from 'react';
import { Lock, Unlock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import axiosInstance from '@/api/axiosInstance';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/utils/formatters';
import { format } from 'date-fns';

export default function EscrowManagement() {
  const [escrows, setEscrows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [contractId, setContractId] = useState('');

  const loadEscrows = async () => {
    if (!contractId) return;
    
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/admin/payments/contracts/${contractId}/escrows`);
      setEscrows(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load escrows');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRelease = async (id, partialAmount = null) => {
    const amount = partialAmount ? prompt('Enter partial amount:') : null;
    if (partialAmount && !amount) return;

    try {
      await axiosInstance.post(`/admin/payments/escrows/${id}/release`, {
        partialAmount: amount ? parseFloat(amount) : undefined,
      });
      toast.success('Escrow released successfully');
      loadEscrows();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to release escrow');
    }
  };

  const handleRefund = async (id) => {
    const reason = prompt('Enter refund reason:');
    if (!reason) return;

    try {
      await axiosInstance.post(`/admin/payments/escrows/${id}/refund`, { reason });
      toast.success('Escrow refunded successfully');
      loadEscrows();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to refund escrow');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Enter Contract ID"
          value={contractId}
          onChange={(e) => setContractId(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md"
        />
        <Button onClick={loadEscrows}>Load Escrows</Button>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {escrows.map((escrow) => (
            <Card key={escrow._id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Milestone: {escrow.milestoneId}</p>
                    <p className="text-sm text-gray-500">
                      Amount: {formatCurrency(escrow.amount)} | Status: {escrow.status}
                    </p>
                    <p className="text-sm text-gray-500">
                      Client: {escrow.client?.name} | Freelancer: {escrow.freelancer?.name}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {['LOCKED', 'FUNDED', 'DISPUTED'].includes(escrow.status) && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleRelease(escrow._id)}
                          className="flex items-center gap-2"
                        >
                          <Unlock className="w-4 h-4" />
                          Release
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRefund(escrow._id)}
                          className="flex items-center gap-2"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Refund
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

