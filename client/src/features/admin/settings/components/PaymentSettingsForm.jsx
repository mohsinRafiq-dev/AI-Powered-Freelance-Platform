import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Save, AlertCircle, CheckCircle, Eye, EyeOff, ToggleLeft, ToggleRight, TestTube, Lock } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Label } from '../../../../components/ui/label';
import { Input } from '../../../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';
import { 
  useEnvVars, 
  useSetEnvVar
} from '@/hooks/api/useEnvVars';
import { usePaymentMode, useUpdatePaymentMode } from '@/hooks/api/usePaymentMode';
import toast from 'react-hot-toast';

const PAYMENT_ENV_VARS = [
  // JazzCash
  { key: 'JAZZCASH_MERCHANT_ID', label: 'JazzCash Merchant ID', category: 'jazzcash', required: true, encrypted: true },
  { key: 'JAZZCASH_PASSWORD', label: 'JazzCash Password', category: 'jazzcash', required: true, encrypted: true },
  { key: 'JAZZCASH_INTEGRATION_KEY', label: 'JazzCash Integration Key', category: 'jazzcash', required: true, encrypted: true },
  { key: 'JAZZCASH_RETURN_URL', label: 'JazzCash Return URL', category: 'jazzcash', required: true, encrypted: false },
  { key: 'JAZZCASH_SANDBOX', label: 'JazzCash Sandbox Mode', category: 'jazzcash', required: false, encrypted: false, type: 'boolean' },
  
  // Easypaisa
  { key: 'EASYPAISA_MERCHANT_ID', label: 'Easypaisa Merchant ID', category: 'easypaisa', required: true, encrypted: true },
  { key: 'EASYPAISA_STORE_ID', label: 'Easypaisa Store ID', category: 'easypaisa', required: true, encrypted: true },
  { key: 'EASYPAISA_HASH_KEY', label: 'Easypaisa Hash Key', category: 'easypaisa', required: true, encrypted: true },
  { key: 'EASYPAISA_RETURN_URL', label: 'Easypaisa Return URL', category: 'easypaisa', required: true, encrypted: false },
  { key: 'EASYPAISA_SANDBOX', label: 'Easypaisa Sandbox Mode', category: 'easypaisa', required: false, encrypted: false, type: 'boolean' },
  
  // Bank Transfer
  { key: 'BANK_ACCOUNT_NUMBER', label: 'Bank Account Number', category: 'bank', required: true, encrypted: true },
  { key: 'BANK_ACCOUNT_TITLE', label: 'Bank Account Title', category: 'bank', required: true, encrypted: false },
  { key: 'BANK_NAME', label: 'Bank Name', category: 'bank', required: true, encrypted: false },
  { key: 'BANK_BRANCH', label: 'Bank Branch', category: 'bank', required: false, encrypted: false },
  { key: 'BANK_IBAN', label: 'Bank IBAN', category: 'bank', required: false, encrypted: false },
  { key: 'BANK_SWIFT', label: 'Bank SWIFT Code', category: 'bank', required: false, encrypted: false },
  { key: 'BANK_TRANSFER_SANDBOX', label: 'Bank Transfer Sandbox Mode', category: 'bank', required: false, encrypted: false, type: 'boolean' },
  
  // Payment Limits
  { key: 'MIN_DEPOSIT_AMOUNT', label: 'Minimum Deposit Amount (PKR)', category: 'limits', required: true, encrypted: false, type: 'number' },
  { key: 'MAX_DEPOSIT_AMOUNT', label: 'Maximum Deposit Amount (PKR)', category: 'limits', required: true, encrypted: false, type: 'number' },
  { key: 'MIN_WITHDRAWAL_AMOUNT', label: 'Minimum Withdrawal Amount (PKR)', category: 'limits', required: true, encrypted: false, type: 'number' },
  { key: 'MAX_WITHDRAWAL_AMOUNT', label: 'Maximum Withdrawal Amount (PKR)', category: 'limits', required: true, encrypted: false, type: 'number' },
  { key: 'MAX_DAILY_WITHDRAWAL_AMOUNT', label: 'Max Daily Withdrawal Amount (PKR)', category: 'limits', required: true, encrypted: false, type: 'number' },
  { key: 'PLATFORM_FEE_PERCENTAGE', label: 'Platform Fee Percentage', category: 'limits', required: true, encrypted: false, type: 'number' },
  
  // Encryption
  { key: 'PAYMENT_ENCRYPTION_KEY', label: 'Payment Encryption Key', category: 'security', required: true, encrypted: true, description: '64-character hex key for encrypting sensitive payment data' },
];

const CATEGORY_LABELS = {
  jazzcash: 'JazzCash',
  easypaisa: 'Easypaisa',
  bank: 'Bank Transfer',
  limits: 'Payment Limits',
  security: 'Security',
};

export const PaymentSettingsForm = () => {
  const { data, isLoading } = useEnvVars();
  const { mutateAsync: setEnvVar, isLoading: isSaving } = useSetEnvVar();
  const { data: paymentModeData, isLoading: isLoadingMode } = usePaymentMode();
  const { mutateAsync: updatePaymentMode, isPending: isUpdatingMode } = useUpdatePaymentMode();
  
  const [values, setValues] = useState({});
  const [showValues, setShowValues] = useState({});
  const [saveStatus, setSaveStatus] = useState({});
  const [showModeConfirm, setShowModeConfirm] = useState(false);
  const [pendingMode, setPendingMode] = useState(null);

  useEffect(() => {
    if (data?.data?.variables) {
      const vars = {};
      data.data.variables.forEach(v => {
        vars[v.key] = v.value;
      });
      setValues(vars);
    }
  }, [data]);

  const handleChange = (key, value) => {
    setValues(prev => ({ ...prev, [key]: value }));
    setSaveStatus(prev => ({ ...prev, [key]: 'idle' }));
  };

  const handleSave = async (key) => {
    const varConfig = PAYMENT_ENV_VARS.find(v => v.key === key);
    if (!varConfig) return;

    try {
      await setEnvVar({
        key,
        value: values[key] || '',
        description: varConfig.label,
        category: 'payment',
        isEncrypted: varConfig.encrypted,
        isPublic: false,
      });
      
      setSaveStatus(prev => ({ ...prev, [key]: 'success' }));
      toast.success(`${varConfig.label} saved successfully`);
      
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, [key]: 'idle' }));
      }, 2000);
    } catch (error) {
      setSaveStatus(prev => ({ ...prev, [key]: 'error' }));
      toast.error(`Failed to save ${varConfig.label}`);
    }
  };

  const toggleShowValue = (key) => {
    setShowValues(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getValue = (key) => {
    return values[key] || '';
  };

  const getStatus = (key) => {
    const varConfig = PAYMENT_ENV_VARS.find(v => v.key === key);
    const value = getValue(key);
    if (!value) return 'missing';
    if (varConfig?.required && !value) return 'error';
    return 'success';
  };

  const groupedVars = PAYMENT_ENV_VARS.reduce((acc, varConfig) => {
    if (!acc[varConfig.category]) {
      acc[varConfig.category] = [];
    }
    acc[varConfig.category].push(varConfig);
    return acc;
  }, {});

  const currentMode = paymentModeData?.data?.mode || 'testing';
  const isTesting = paymentModeData?.data?.isTesting !== false; // Default to testing

  const handleModeToggle = (newMode) => {
    if (newMode === 'production') {
      // Show confirmation for production mode
      setPendingMode(newMode);
      setShowModeConfirm(true);
    } else {
      // Switch to testing mode directly
      updatePaymentMode(newMode);
    }
  };

  const confirmModeSwitch = () => {
    if (pendingMode) {
      updatePaymentMode(pendingMode);
      setShowModeConfirm(false);
      setPendingMode(null);
    }
  };

  if (isLoading || isLoadingMode) {
    return <div className="animate-pulse space-y-4">Loading payment settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-brand to-brand-dark rounded-xl flex items-center justify-center">
          <Wallet className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Configuration</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage payment gateway settings and limits</p>
        </div>
      </div>

      {/* Payment Mode Toggle */}
      <Card className={`border-2 ${
        isTesting 
          ? 'border-yellow-300 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10' 
          : 'border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-900/10'
      }`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {isTesting ? (
                  <TestTube className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                ) : (
                  <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
                )}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Payment Mode
                </h3>
                <Badge className={
                  isTesting
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                }>
                  {isTesting ? 'TESTING MODE' : 'PRODUCTION MODE'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 ml-8">
                {isTesting ? (
                  <>
                    <strong>Testing Mode Active:</strong> All payments are simulated. No real transactions occur. 
                    Perfect for development and testing without merchant accounts.
                  </>
                ) : (
                  <>
                    <strong>Production Mode Active:</strong> Using real payment gateways with actual merchant credentials. 
                    Real transactions will be processed. Use with caution.
                  </>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3 ml-4">
              <button
                onClick={() => handleModeToggle('testing')}
                disabled={isUpdatingMode || isTesting}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isTesting
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <TestTube className="w-4 h-4" />
                Testing
              </button>
              <button
                onClick={() => handleModeToggle('production')}
                disabled={isUpdatingMode || !isTesting}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  !isTesting
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Lock className="w-4 h-4" />
                Production
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mode Switch Confirmation Modal */}
      {showModeConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="w-5 h-5" />
                Switch to Production Mode?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-900 dark:text-red-300 font-semibold mb-2">
                  Warning: Production Mode
                </p>
                <ul className="text-sm text-red-800 dark:text-red-400 space-y-1 list-disc list-inside">
                  <li>Real payment gateways will be used</li>
                  <li>Actual money transactions will occur</li>
                  <li>Merchant credentials must be configured</li>
                  <li>All transactions will be real and irreversible</li>
                </ul>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to switch to production mode? This action will enable real payment processing.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowModeConfirm(false);
                    setPendingMode(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmModeSwitch}
                  disabled={isUpdatingMode}
                >
                  {isUpdatingMode ? 'Switching...' : 'Switch to Production'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {Object.entries(groupedVars).map(([category, vars]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{CATEGORY_LABELS[category] || category}</span>
              <Badge variant="outline">{vars.length} settings</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {vars.map((varConfig) => {
              const status = getStatus(varConfig.key);
              const value = getValue(varConfig.key);
              const isEncrypted = varConfig.encrypted;
              const showValue = showValues[varConfig.key];
              const saveState = saveStatus[varConfig.key] || 'idle';

              return (
                <div key={varConfig.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={varConfig.key} className="flex items-center gap-2">
                      {varConfig.label}
                      {varConfig.required && (
                        <span className="text-red-500">*</span>
                      )}
                      {status === 'success' && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      {status === 'missing' && varConfig.required && (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </Label>
                    {isEncrypted && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleShowValue(varConfig.key)}
                        className="h-6 w-6 p-0"
                      >
                        {showValue ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      id={varConfig.key}
                      type={
                        varConfig.type === 'boolean' 
                          ? 'text' 
                          : varConfig.type === 'number'
                          ? 'number'
                          : isEncrypted && !showValue
                          ? 'password'
                          : 'text'
                      }
                      value={varConfig.type === 'boolean' ? (value === 'true' ? 'true' : 'false') : value}
                      onChange={(e) => {
                        if (varConfig.type === 'boolean') {
                          handleChange(varConfig.key, e.target.value === 'true' ? 'true' : 'false');
                        } else {
                          handleChange(varConfig.key, e.target.value);
                        }
                      }}
                      placeholder={varConfig.description || `Enter ${varConfig.label.toLowerCase()}`}
                      className={`flex-1 ${
                        status === 'error' ? 'border-red-500' : ''
                      }`}
                    />
                    <Button
                      onClick={() => handleSave(varConfig.key)}
                      disabled={isSaving || saveState === 'success'}
                      className="flex items-center gap-2"
                    >
                      {saveState === 'success' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {saveState === 'success' ? 'Saved' : 'Save'}
                    </Button>
                  </div>
                  
                  {varConfig.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {varConfig.description}
                    </p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}

      <Card className="border-yellow-200 dark:border-yellow-900/30 bg-yellow-50 dark:bg-yellow-900/10">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-900 dark:text-yellow-300 mb-1">
                Security Notice
              </p>
              <p className="text-sm text-yellow-800 dark:text-yellow-400">
                All payment credentials are encrypted and stored securely. Never share these values or commit them to version control.
                The encryption key is critical for decrypting sensitive payment data.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

