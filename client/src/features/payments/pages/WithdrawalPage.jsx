import { useState, useEffect } from 'react';
import { ArrowUpRight, Plus } from 'lucide-react';
import { WithdrawalHistory } from '../components/WithdrawalHistory';
import { WithdrawalModal } from '../components/WithdrawalModal';
import { WalletBalance } from '../components/WalletBalance';
import { Button } from '@/components/ui/button';
import paymentService from '@/services/paymentService';
import toast from 'react-hot-toast';

export default function WithdrawalPage() {
  const [wallet, setWallet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = async () => {
    setIsLoading(true);
    try {
      const response = await paymentService.getWallet();
      setWallet(response.wallet);
    } catch (error) {
      toast.error('Failed to load wallet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 lg:pt-24">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <ArrowUpRight className="w-8 h-8 text-brand" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Withdrawals</h1>
            </div>
            <Button
              onClick={() => setShowWithdrawalModal(true)}
              className="flex items-center gap-2"
              disabled={!wallet || wallet.availableBalance < 1000}
            >
              <Plus className="w-4 h-4" />
              Request Withdrawal
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1">
            <WalletBalance wallet={wallet} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-2">
            <WithdrawalHistory />
          </div>
        </div>
      </div>

      {showWithdrawalModal && (
        <WithdrawalModal
          isOpen={showWithdrawalModal}
          onClose={() => setShowWithdrawalModal(false)}
          onSuccess={loadWallet}
          wallet={wallet}
        />
      )}
    </div>
  );
}

