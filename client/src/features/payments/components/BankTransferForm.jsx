import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';

export const BankTransferForm = ({ register, errors }) => {
  return (
    <div className="space-y-4">
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-300">
              <p className="font-medium mb-1">Bank Transfer Instructions</p>
              <p>After submitting, you'll receive bank account details. Please transfer the amount and use the provided reference number.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <Label htmlFor="bank_name">Your Name</Label>
        <Input
          id="bank_name"
          type="text"
          placeholder="Your full name"
          {...register('name', {
            required: 'Name is required for bank transfer',
          })}
        />
        {errors.name && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="bank_email">Email</Label>
        <Input
          id="bank_email"
          type="email"
          placeholder="your@email.com"
          {...register('email', {
            required: 'Email is required for bank transfer confirmation',
          })}
        />
        {errors.email && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
            {errors.email.message}
          </p>
        )}
      </div>
    </div>
  );
};

