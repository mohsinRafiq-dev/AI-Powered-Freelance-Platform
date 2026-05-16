import { Sparkles, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';

/**
 * AI Generation Status Component
 * Shows the status of AI proposal generation
 */
export const AIGenerationStatus = ({ 
  status, // 'idle' | 'loading' | 'success' | 'error'
  confidence = null,
  error = null,
  onRetry = null
}) => {
  if (status === 'idle') {
    return null;
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-3 p-4 bg-brand/10 dark:bg-brand-light/10 border border-brand/20 dark:border-brand-light/20 rounded-lg">
        <Loader2 className="w-5 h-5 text-brand dark:text-brand-light animate-spin" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            Generating AI proposal...
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            This may take a few seconds
          </p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            Proposal draft generated successfully!
          </p>
          {confidence !== null && confidence !== undefined && (
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-0">
                <Sparkles className="w-3 h-3 mr-1" />
                {Math.round(confidence)}% Confidence
              </Badge>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            Failed to generate proposal
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            {error || 'An error occurred while generating the proposal. Please try again or fill the form manually.'}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-xs text-red-600 dark:text-red-400 hover:underline font-medium"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default AIGenerationStatus;





