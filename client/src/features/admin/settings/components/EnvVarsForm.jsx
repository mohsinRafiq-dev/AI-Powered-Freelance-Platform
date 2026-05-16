import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, Save, X, Plus, Trash2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Label } from '../../../../components/ui/label';
import { Input, Textarea } from '../../../../components/ui/input';
import { 
  useEnvVars, 
  useSetEnvVar, 
  useDeleteEnvVar 
} from '@/hooks/api/useEnvVars';
import { InlineLoader } from '../../../../components/common/Loader';
import logger from '@/utils/logger';

const CATEGORIES = [
  { value: 'database', label: 'Database' },
  { value: 'authentication', label: 'Authentication' },
  { value: 'api', label: 'API' },
  { value: 'payment', label: 'Payment' },
  { value: 'ai', label: 'AI' },
  { value: 'email', label: 'Email' },
  { value: 'storage', label: 'Storage' },
  { value: 'feature', label: 'Feature Flags' },
  { value: 'other', label: 'Other' },
];

/**
 * Environment Variables Form Component
 * Form for managing environment variables
 */
export const EnvVarsForm = () => {
  const { data, isLoading, error } = useEnvVars();
  const { mutateAsync: setEnvVar, isLoading: isSaving } = useSetEnvVar();
  const { mutateAsync: deleteEnvVar, isLoading: isDeleting } = useDeleteEnvVar();

  const [envVars, setEnvVars] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showValues, setShowValues] = useState({});
  const [newVar, setNewVar] = useState({
    key: '',
    value: '',
    description: '',
    category: 'other',
    isEncrypted: false,
    isPublic: false,
  });
  const [errors, setErrors] = useState({});
  const [saveStatus, setSaveStatus] = useState('idle');

  // Load environment variables when data is available
  useEffect(() => {
    if (data?.data?.variables) {
      setEnvVars(data.data.variables);
    }
  }, [data]);

  const handleAddNew = () => {
    setEditingIndex('new');
    setNewVar({
      key: '',
      value: '',
      description: '',
      category: 'other',
      isEncrypted: false,
      isPublic: false,
    });
    setErrors({});
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setNewVar({
      key: '',
      value: '',
      description: '',
      category: 'other',
      isEncrypted: false,
      isPublic: false,
    });
    setErrors({});
  };

  const validateVar = (varData) => {
    const newErrors = {};
    
    if (!varData.key || !varData.key.trim()) {
      newErrors.key = 'Key is required';
    } else if (!/^[A-Z_][A-Z0-9_]*$/.test(varData.key.toUpperCase())) {
      newErrors.key = 'Key must be uppercase letters, numbers, and underscores only';
    }
    
    if (varData.value === undefined || varData.value === null) {
      newErrors.value = 'Value is required';
    }

    return newErrors;
  };

  const handleSave = async (varData, index) => {
    const validationErrors = validateVar(varData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSaveStatus('idle');
      setErrors({});

      const dataToSave = {
        key: varData.key.toUpperCase().trim(),
        value: varData.value,
        description: varData.description || '',
        category: varData.category || 'other',
        isEncrypted: varData.isEncrypted || false,
        isPublic: varData.isPublic || false,
      };

      await setEnvVar(dataToSave);
      
      if (index === 'new') {
        setEditingIndex(null);
        setNewVar({
          key: '',
          value: '',
          description: '',
          category: 'other',
          isEncrypted: false,
          isPublic: false,
        });
      } else {
        setEditingIndex(null);
      }
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      logger.error('Failed to save environment variable:', error);
      setSaveStatus('error');
    }
  };

  const handleDelete = async (key) => {
    if (!window.confirm(`Are you sure you want to delete ${key}?`)) {
      return;
    }

    try {
      await deleteEnvVar(key);
    } catch (error) {
      logger.error('Failed to delete environment variable:', error);
    }
  };

  const toggleShowValue = (key) => {
    setShowValues((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <InlineLoader message="Loading environment variables..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
          <AlertCircle className="w-5 h-5" />
          <span>Failed to load environment variables. Please refresh the page.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Button */}
      <div className="flex items-center justify-end">
        <Button
          onClick={handleAddNew}
          className="bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-deeper text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Variable
        </Button>
      </div>

      {/* New Variable Form */}
      {editingIndex === 'new' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl"
        >
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
            Add New Environment Variable
          </h4>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-key" className="text-gray-900 dark:text-white">
                Key *
              </Label>
              <Input
                id="new-key"
                value={newVar.key}
                onChange={(e) => setNewVar({ ...newVar, key: e.target.value })}
                placeholder="API_KEY"
                className={errors.key ? 'border-red-500' : ''}
              />
              {errors.key && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.key}</p>
              )}
            </div>

            <div>
              <Label htmlFor="new-value" className="text-gray-900 dark:text-white">
                Value *
              </Label>
              <div className="relative">
                <Input
                  id="new-value"
                  type={showValues['new'] ? 'text' : 'password'}
                  value={newVar.value}
                  onChange={(e) => setNewVar({ ...newVar, value: e.target.value })}
                  placeholder="Enter value"
                  className={errors.value ? 'border-red-500' : ''}
                />
                <button
                  type="button"
                  onClick={() => toggleShowValue('new')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showValues['new'] ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.value && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.value}</p>
              )}
            </div>

            <div>
              <Label htmlFor="new-description" className="text-gray-900 dark:text-white">
                Description
              </Label>
              <Textarea
                id="new-description"
                value={newVar.description}
                onChange={(e) => setNewVar({ ...newVar, description: e.target.value })}
                placeholder="Optional description"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-category" className="text-gray-900 dark:text-white">
                  Category
                </Label>
                <select
                  id="new-category"
                  value={newVar.category}
                  onChange={(e) => setNewVar({ ...newVar, category: e.target.value })}
                  className="flex h-11 w-full rounded-lg px-4 py-2 text-sm transition-all duration-200 border border-gray-300 bg-gray-50 text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ring-offset-white dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:ring-offset-gray-950 dark:focus-visible:ring-brand-light"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newVar.isEncrypted}
                  onChange={(e) => setNewVar({ ...newVar, isEncrypted: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Encrypted</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newVar.isPublic}
                  onChange={(e) => setNewVar({ ...newVar, isPublic: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Public (Frontend)</span>
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={() => handleSave(newVar, 'new')}
                disabled={isSaving}
                className="flex-1 bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-deeper text-white"
              >
                {isSaving ? (
                  <>
                    <InlineLoader size="small" />
                    <span className="ml-2">Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                disabled={isSaving}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Environment Variables List */}
      <div className="space-y-4">
        {envVars.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 dark:bg-gray-900 rounded-lg">
            <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No environment variables found. Click "Add Variable" to create one.
            </p>
          </div>
        ) : (
          envVars.map((envVar, index) => (
            <motion.div
              key={envVar._id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Key className="w-4 h-4 text-brand dark:text-brand-light" />
                    <span className="font-mono font-semibold text-gray-900 dark:text-white">
                      {envVar.key}
                    </span>
                    {envVar.isEncrypted && (
                      <span className="px-2 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded">
                        Encrypted
                      </span>
                    )}
                    {envVar.isPublic && (
                      <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded">
                        Public
                      </span>
                    )}
                    <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                      {CATEGORIES.find((c) => c.value === envVar.category)?.label || envVar.category}
                    </span>
                  </div>
                  {envVar.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {envVar.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Value:</span>
                    <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
                      {envVar.isEncrypted ? '***ENCRYPTED***' : envVar.value}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => handleDelete(envVar.key)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 dark:text-red-400 border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  disabled={isDeleting}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Save Status */}
      {saveStatus === 'success' && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
            <span className="text-sm font-medium">Environment variable saved successfully!</span>
          </div>
        </div>
      )}

      {saveStatus === 'error' && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">Failed to save environment variable</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnvVarsForm;

