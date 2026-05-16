import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const EasypaisaForm = ({ register, errors }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="easypaisa_phone">Phone Number</Label>
        <Input
          id="easypaisa_phone"
          type="tel"
          placeholder="03001234567"
          {...register('phone', {
            required: 'Phone number is required',
            pattern: {
              value: /^03\d{9}$/,
              message: 'Please enter a valid Easypaisa phone number',
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
        <Label htmlFor="easypaisa_email">Email (Optional)</Label>
        <Input
          id="easypaisa_email"
          type="email"
          placeholder="your@email.com"
          {...register('email')}
        />
      </div>
    </div>
  );
};

