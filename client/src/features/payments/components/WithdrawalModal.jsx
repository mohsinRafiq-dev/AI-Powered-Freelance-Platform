import { useState } from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import paymentService from '@/services/paymentService';
import { TestingModeBanner } from '@/components/payments/TestingModeBanner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WithdrawalForm } from './WithdrawalForm';

export const WithdrawalModal = ({ isOpen, onClose, onSuccess, wallet }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('JAZZCASH');

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      amount: '',
      paymentMethod: 'JAZZCASH',
    },
  });

  const onSubmit = async (data) => {
    const amount = parseFloat(data.amount);
    const validation = paymentService.validateAmount(amount, 'withdrawal');
    
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }

    if (wallet && wallet.availableBalance < amount) {
      toast.error('Insufficient available balance');
      return;
    }

    setIsLoading(true);
    try {
      // Build accountDetails based on payment method
      let accountDetails = {};
      
      if (paymentMethod === 'JAZZCASH' || paymentMethod === 'EASYPAISA') {
        // For mobile wallets: only phoneNumber and optional CNIC
        accountDetails = {
          phoneNumber: data.phoneNumber,
          ...(data.cnic && { cnic: data.cnic }),
        };
      } else if (paymentMethod === 'BANK_TRANSFER') {
        // For bank transfers: accountNumber, accountName, bankName are required
        accountDetails = {
          accountNumber: data.accountNumber,
          accountName: data.accountName,
          bankName: data.bankName,
          ...(data.branchName && { branchName: data.branchName }),
          ...(data.iban && { iban: data.iban }),
          ...(data.swiftCode && { swiftCode: data.swiftCode }),
        };
      }

      const withdrawalData = {
        amount,
        paymentMethod: paymentMethod,
        accountDetails,
      };

      await paymentService.createWithdrawal(withdrawalData);
      toast.success('Withdrawal request created successfully');
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create withdrawal request');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Withdraw Funds</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <TestingModeBanner />
          <div>
            <Label htmlFor="amount">Amount (PKR)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="1000"
              max="100000"
              {...register('amount', {
                required: 'Amount is required',
                min: { value: 1000, message: 'Minimum withdrawal is PKR 1,000' },
                max: { value: 100000, message: 'Maximum withdrawal is PKR 100,000' },
              })}
            />
            {errors.amount && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.amount.message}
              </p>
            )}
            {wallet && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Available: {wallet.availableBalance?.toLocaleString()} PKR
              </p>
            )}
          </div>

          <WithdrawalForm
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
            register={register}
            errors={errors}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Processing...' : 'Request Withdrawal'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

