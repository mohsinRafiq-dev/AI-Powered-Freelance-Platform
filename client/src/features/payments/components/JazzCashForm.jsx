import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const JazzCashForm = ({ register, errors }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="jazzcash_phone">Phone Number</Label>
        <Input
          id="jazzcash_phone"
          type="tel"
          placeholder="03001234567"
          {...register('phone', {
            required: 'Phone number is required',
            pattern: {
              value: /^03\d{9}$/,
              message: 'Please enter a valid JazzCash phone number',
            },
          })}
        />
        {errors.phone && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
            {errors.phone.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="jazzcash_email">Email (Optional)</Label>
        <Input
          id="jazzcash_email"
          type="email"
          placeholder="your@email.com"
          {...register('email')}
        />
      </div>
    </div>
  );
};

