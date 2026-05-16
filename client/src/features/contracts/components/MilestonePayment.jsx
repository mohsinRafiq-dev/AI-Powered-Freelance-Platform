import { useState, useEffect } from 'react';
import { DollarSign, CheckCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FundMilestoneButton } from './FundMilestoneButton';
import { EscrowStatus } from './EscrowStatus';
import paymentService from '@/services/paymentService';
import contractsApi from '@/api/contractsApi';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { formatCurrency } from '@/utils/formatters';

export const MilestonePayment = ({ contractId, milestoneId, milestoneAmount, milestoneStatus, contractStatus, onUpdate }) => {
  const { user } = useSelector((state) => state.auth);
  const [escrow, setEscrow] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);

  const isClient = user?.role === 'client';
  const isFreelancer = user?.role === 'freelancer';
  const canFund = isClient && escrow?.status === 'CREATED' && contractStatus === 'active';
  const canApprove = isClient && milestoneStatus === 'completed' && escrow?.status === 'LOCKED';

  useEffect(() => {
    loadEscrow();
  }, [contractId, milestoneId]);

  const loadEscrow = async () => {
    setIsLoading(true);
    try {
      const escrowData = await paymentService.getMilestoneEscrow(contractId, milestoneId);
      setEscrow(escrowData.data || null);
    } catch (error) {
      // Escrow might not exist yet
      setEscrow(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!confirm('Are you sure you want to approve this milestone and release the escrow?')) {
      return;
    }

    setIsApproving(true);
    try {
      await contractsApi.approveMilestone(contractId, milestoneId);
      toast.success('Milestone approved and escrow released');
      loadEscrow();
      onUpdate?.();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve milestone');
    } finally {
      setIsApproving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
      <EscrowStatus escrow={escrow} milestoneAmount={milestoneAmount} />

      <div className="flex items-center gap-2">
        {canFund && (
          <FundMilestoneButton
            contractId={contractId}
            milestoneId={milestoneId}
            milestoneAmount={milestoneAmount}
            onSuccess={loadEscrow}
          />
        )}

        {canApprove && (
          <Button
            size="sm"
            onClick={handleApprove}
            disabled={isApproving}
            className="flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            {isApproving ? 'Approving...' : 'Approve & Release'}
          </Button>
        )}
      </div>
    </div>
  );
};

