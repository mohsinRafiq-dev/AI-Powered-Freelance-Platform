import { useState } from 'react';
import { DollarSign, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DepositModal } from '../../payments/components/DepositModal';
import contractsApi from '@/api/contractsApi';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/utils/formatters';

export const FundMilestoneButton = ({ contractId, milestoneId, milestoneAmount, onSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFund = async (paymentData) => {
    setIsLoading(true);
    try {
      const response = await contractsApi.fundMilestoneEscrow(contractId, milestoneId, paymentData);
      
      if (response.data?.paymentUrl && !response.data?.requiresManualVerification) {
        // Redirect to payment gateway
        window.location.href = response.data.paymentUrl;
      } else if (response.data?.requiresManualVerification) {
        // Bank transfer - show instructions
        toast.success('Bank transfer instructions sent. Please complete the transfer.');
        setShowModal(false);
        onSuccess?.();
      } else {
        toast.success('Payment initialized successfully');
        setShowModal(false);
        onSuccess?.();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fund milestone');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        size="sm"
        onClick={() => setShowModal(true)}
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        <Lock className="w-4 h-4" />
        Fund {formatCurrency(milestoneAmount)}
      </Button>

      {showModal && (
        <DepositModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            onSuccess?.();
          }}
          onSubmit={handleFund}
          initialAmount={milestoneAmount}
        />
      )}
    </>
  );
};

