import { useState, useEffect } from 'react';
import { X, Wallet } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import paymentService from '@/services/paymentService';
import { TestingModeBanner } from '@/components/payments/TestingModeBanner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { JazzCashForm } from './JazzCashForm';
import { EasypaisaForm } from './EasypaisaForm';
import { BankTransferForm } from './BankTransferForm';

export const DepositModal = ({ isOpen, onClose, onSuccess, onSubmit: customOnSubmit, initialAmount }) => {
  const [paymentMethod, setPaymentMethod] = useState('JAZZCASH');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: {
      amount: initialAmount || '',
      paymentMethod: 'JAZZCASH',
    },
  });

  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        const response = await paymentService.getPaymentMethods();
        setPaymentMethods(response.methods || []);
      } catch (error) {
        console.error('Failed to load payment methods:', error);
      }
    };
    loadPaymentMethods();
  }, []);

  const onSubmit = async (data) => {
    const amount = parseFloat(data.amount);
    const validation = paymentService.validateAmount(amount, 'deposit');
    
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }

    setIsLoading(true);
    try {
      // If onSubmit prop is provided (for milestone funding), use it
      if (customOnSubmit) {
        await customOnSubmit({
          amount,
          paymentMethod: paymentMethod,
          customerData: {
            email: data.email,
            name: data.name,
            phone: data.phone,
          },
        });
        return;
      }

      // Otherwise, use standard deposit flow
      const result = await paymentService.initializeDeposit({
        amount,
        paymentMethod: paymentMethod,
        customerData: {
          email: data.email,
          name: data.name,
          phone: data.phone,
        },
      });

      if (result.data?.paymentUrl && !result.data?.requiresManualVerification) {
        // Redirect to payment gateway
        window.location.href = result.data.paymentUrl;
      } else if (result.data?.requiresManualVerification) {
        // Bank transfer - show instructions
        toast.success('Bank transfer instructions sent. Please complete the transfer.');
        onSuccess?.();
        onClose();
      } else {
        toast.success('Payment initialized successfully');
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      // Show detailed error message
      const errorMessage = error.response?.data?.message || error.message || 'Failed to initialize payment';
      const validationErrors = error.response?.data?.errors;
      
      if (validationErrors && Array.isArray(validationErrors)) {
        // Show first validation error
        const firstError = validationErrors[0];
        toast.error(firstError.message || firstError.field || errorMessage);
      } else {
        toast.error(errorMessage);
      }
      
      console.error('Payment initialization error:', error.response?.data || error);
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
            <Wallet className="w-5 h-5" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Deposit Funds</h2>
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
              min="100"
              max="500000"
              {...register('amount', {
                required: 'Amount is required',
                min: { value: 100, message: 'Minimum amount is PKR 100' },
                max: { value: 500000, message: 'Maximum amount is PKR 500,000' },
              })}
            />
            {errors.amount && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          <PaymentMethodSelector
            methods={paymentMethods}
            selected={paymentMethod}
            onSelect={setPaymentMethod}
          />

          {paymentMethod === 'JAZZCASH' && (
            <JazzCashForm register={register} errors={errors} />
          )}

          {paymentMethod === 'EASYPAISA' && (
            <EasypaisaForm register={register} errors={errors} />
          )}

          {paymentMethod === 'BANK_TRANSFER' && (
            <BankTransferForm register={register} errors={errors} />
          )}

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
              {isLoading ? 'Processing...' : 'Continue to Payment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

