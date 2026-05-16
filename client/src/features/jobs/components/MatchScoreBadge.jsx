import { useState } from 'react';
import { Sparkles } from 'lucide-react';

/**
 * MatchScoreBadge Component
 * Modern badge design for displaying match scores
 */
export const MatchScoreBadge = ({ 
  matchScore, 
  baseScore = null, 
  aiScore = null, 
  confidence = null,
  aiEnhanced = false,
  showBreakdown = true,
  size = 'md'
}) => {
  if (matchScore === null || matchScore === undefined) {
    return null;
  }

  const score = Math.round(matchScore);
  
  // Enhanced color coding
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-blue-600 dark:text-blue-400';
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/30 border-green-300 dark:border-green-700';
    if (score >= 60) return 'bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/30 border-blue-300 dark:border-blue-700';
    if (score >= 50) return 'bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/40 dark:to-amber-900/30 border-yellow-300 dark:border-yellow-700';
    return 'bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/40 dark:to-red-900/30 border-orange-300 dark:border-orange-700';
  };

  const getConfidenceColor = (confidence) => {
    if (!confidence) return '';
    if (confidence >= 80) return 'text-green-600 dark:text-green-400';
    if (confidence >= 60) return 'text-blue-600 dark:text-blue-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5',
  };

  const badgeContent = (
    <div className="inline-flex flex-col items-end gap-2">
      <div className={`inline-flex items-center gap-2 rounded-xl border-2 ${getScoreBgColor(score)} ${sizeClasses[size]} shadow-lg backdrop-blur-sm relative overflow-hidden`}>
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        <span className={`font-black ${getScoreColor(score)} relative z-10`}>
          {score}%
        </span>
        <span className={`text-xs ${getScoreColor(score)} opacity-70 font-semibold relative z-10`}>
          Match
        </span>
        {aiEnhanced && (
          <div className="relative z-10 ml-1">
            <Sparkles className="w-3.5 h-3.5 text-brand dark:text-brand-light animate-pulse" />
          </div>
        )}
      </div>
      {aiEnhanced && confidence !== null && confidence !== undefined && (
        <div className="flex items-center gap-1.5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg px-2 py-1 border border-gray-200 dark:border-gray-700">
          <div className={`w-1.5 h-1.5 rounded-full ${getConfidenceColor(confidence).replace('text-', 'bg-')}`}></div>
          <span className={`text-xs font-bold ${getConfidenceColor(confidence)}`}>
            {Math.round(confidence)}%
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            confidence
          </span>
        </div>
      )}
    </div>
  );

  const [showTooltip, setShowTooltip] = useState(false);

  if (!showBreakdown || (!baseScore && !aiScore)) {
    return badgeContent;
  }

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="cursor-help">
        {badgeContent}
      </div>
      {showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-3 text-sm text-white bg-gray-900 dark:bg-gray-800 rounded-xl shadow-2xl max-w-xs border border-gray-700"
        >
          <div className="space-y-2.5">
            <div className="font-bold text-sm mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-light" />
              Match Score Breakdown
            </div>
            {baseScore !== null && (
              <div className="text-xs flex justify-between items-center">
                <span className="text-gray-300">Base Score:</span>
                <span className="font-bold">{Math.round(baseScore)}%</span>
              </div>
            )}
            {aiScore !== null && aiEnhanced && (
              <div className="text-xs flex justify-between items-center">
                <span className="text-gray-300">AI Enhanced:</span>
                <span className="font-bold text-brand-light">{Math.round(aiScore)}%</span>
              </div>
            )}
            {confidence !== null && confidence !== undefined && (
              <div className="text-xs flex justify-between items-center">
                <span className="text-gray-300">Confidence:</span>
                <span className="font-bold">{Math.round(confidence)}%</span>
              </div>
            )}
            {aiEnhanced && (
              <div className="flex items-center gap-2 text-xs text-brand-light mt-2.5 pt-2.5 border-t border-gray-700">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="font-semibold">AI-Enhanced Match</span>
              </div>
            )}
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
        </motion.div>
      )}
    </div>
  );
};

export default MatchScoreBadge;
