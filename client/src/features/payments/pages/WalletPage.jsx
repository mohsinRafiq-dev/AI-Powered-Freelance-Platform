import { useState, useEffect } from 'react';
import { Wallet, Plus, ArrowUpRight } from 'lucide-react';
import { WalletBalance } from '../components/WalletBalance';
import { WalletStats } from '../components/WalletStats';
import { DepositModal } from '../components/DepositModal';
import { WithdrawalModal } from '../components/WithdrawalModal';
import { TestingModeBanner } from '@/components/payments/TestingModeBanner';
import { Button } from '@/components/ui/button';
import paymentService from '@/services/paymentService';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

export default function WalletPage() {
  const { user } = useSelector((state) => state.auth);
  const [wallet, setWallet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(false);
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

  const isFreelancer = user?.role === 'freelancer';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 lg:pt-24">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <TestingModeBanner />
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Wallet className="w-8 h-8 text-brand" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Wallet</h1>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowDepositModal(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Deposit
              </Button>
              {isFreelancer && (
                <Button
                  variant="outline"
                  onClick={() => setShowWithdrawalModal(true)}
                  className="flex items-center gap-2"
                  disabled={!wallet || wallet.availableBalance < 1000}
                >
                  <ArrowUpRight className="w-4 h-4" />
                  Withdraw
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <WalletBalance wallet={wallet} isLoading={isLoading} />
          </div>
          <div>
            <WalletStats wallet={wallet} isLoading={isLoading} />
          </div>
        </div>
      </div>

      {showDepositModal && (
        <DepositModal
          isOpen={showDepositModal}
          onClose={() => setShowDepositModal(false)}
          onSuccess={loadWallet}
        />
      )}

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

