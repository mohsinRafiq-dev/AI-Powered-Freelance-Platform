import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../../components/ui/button';

export const DeclineContractModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate reason
    if (!reason.trim()) {
      setError('Please provide a reason for declining');
      return;
    }
    
    if (reason.trim().length < 10) {
      setError('Reason must be at least 10 characters');
      return;
    }

    onConfirm(reason.trim());
  };

  const handleClose = () => {
    if (!isLoading) {
      setReason('');
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <X className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Decline Contract
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Please provide a reason</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label
              htmlFor="reason"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"
            >
              <span>Reason for declining</span>
              <span className="text-red-500">*</span>
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError('');
              }}
              disabled={isLoading}
              rows={5}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none transition-all"
              placeholder="Please provide a clear reason for declining this contract offer. This will help the client understand your decision.\n\nExample: The project timeline doesn't align with my current commitments..."
            />
            {error && (
              <div className="mt-2 flex items-start gap-2 text-red-500 dark:text-red-400">
                <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
            <div className="mt-2 flex items-center justify-between">
              <p className={`text-xs font-medium ${reason.length >= 10 ? 'text-brand dark:text-brand-light' : 'text-gray-500 dark:text-gray-400'}`}>
                {reason.length >= 10 ? '✓ Minimum length met' : `${reason.length}/10 characters minimum`}
              </p>
              {reason.length > 0 && reason.length < 10 && (
                <p className="text-xs text-red-500 dark:text-red-400">
                  {10 - reason.length} more needed
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <Button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              variant="outline"
              className="px-5 py-2.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-700 rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !reason.trim() || reason.trim().length < 10}
              className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold shadow-lg shadow-red-500/30 disabled:from-gray-400 disabled:to-gray-400 disabled:shadow-none disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Declining...
                </>
              ) : (
                <>
                  <X className="w-4 h-4" />
                  Decline Contract
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
