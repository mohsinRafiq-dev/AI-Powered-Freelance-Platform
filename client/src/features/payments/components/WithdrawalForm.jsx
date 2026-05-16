import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PaymentMethodSelector } from './PaymentMethodSelector';

export const WithdrawalForm = ({ paymentMethod, onPaymentMethodChange, register, errors }) => {
  const paymentMethods = [
    { value: 'JAZZCASH', label: 'JazzCash' },
    { value: 'EASYPAISA', label: 'Easypaisa' },
    { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
  ];

  return (
    <div className="space-y-4">
      <PaymentMethodSelector
        methods={paymentMethods}
        selected={paymentMethod}
        onSelect={onPaymentMethodChange}
      />

      {(paymentMethod === 'JAZZCASH' || paymentMethod === 'EASYPAISA') && (
        <>
          <div>
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="03001234567"
              {...register('phoneNumber', {
                required: 'Phone number is required',
                pattern: {
                  value: /^03\d{9}$/,
                  message: 'Please enter a valid phone number (format: 03XXXXXXXXX)',
                },
              })}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.phoneNumber.message}
              </p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Enter your {paymentMethod === 'JAZZCASH' ? 'JazzCash' : 'Easypaisa'} registered phone number
            </p>
          </div>

          <div>
            <Label htmlFor="cnic">CNIC (Optional)</Label>
            <Input
              id="cnic"
              type="text"
              placeholder="12345-1234567-1"
              {...register('cnic')}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Optional: CNIC linked to your mobile wallet account
            </p>
          </div>
        </>
      )}

      {paymentMethod === 'BANK_TRANSFER' && (
        <>
          <div>
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              type="text"
              {...register('accountNumber', {
                required: 'Account number is required',
              })}
            />
            {errors.accountNumber && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.accountNumber.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="accountName">Account Name</Label>
            <Input
              id="accountName"
              type="text"
              {...register('accountName', {
                required: 'Account name is required',
              })}
            />
            {errors.accountName && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.accountName.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="bankName">Bank Name</Label>
            <Input
              id="bankName"
              type="text"
              {...register('bankName', {
                required: 'Bank name is required',
              })}
            />
            {errors.bankName && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.bankName.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="branchName">Branch Name (Optional)</Label>
            <Input
              id="branchName"
              type="text"
              {...register('branchName')}
            />
          </div>

          <div>
            <Label htmlFor="iban">IBAN (Optional)</Label>
            <Input
              id="iban"
              type="text"
              {...register('iban')}
            />
          </div>
        </>
      )}
    </div>
  );
};

