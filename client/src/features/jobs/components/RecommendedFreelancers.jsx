import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Users, Filter, ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import FreelancerMatchCard from './FreelancerMatchCard';
import EmptyState from '../../dashboard/shared/EmptyState';
import { InlineLoader } from '../../../components/common/Loader';

/**
 * RecommendedFreelancers Component
 * Displays AI-recommended freelancers for a job with modern design
 */
export const RecommendedFreelancers = ({ 
  freelancers = [], 
  isLoading = false, 
  jobId = null,
  onViewAll = null,
  compact = false,
  maxItems = null
}) => {
  const [minScore, setMinScore] = useState(30);
  const [sortBy, setSortBy] = useState('matchScore');

  // Filter and sort freelancers
  let filteredFreelancers = freelancers
    .filter(f => (f.matchScore || f.finalScore || 0) >= minScore)
    .sort((a, b) => {
      if (sortBy === 'matchScore') {
        return (b.matchScore || b.finalScore || 0) - (a.matchScore || a.finalScore || 0);
      } else if (sortBy === 'rate') {
        return (a.hourlyRate || 0) - (b.hourlyRate || 0);
      } else if (sortBy === 'experience') {
        const expOrder = { expert: 3, intermediate: 2, beginner: 1 };
        return (expOrder[b.experience] || 0) - (expOrder[a.experience] || 0);
      }
      return 0;
    });

  // Limit items if maxItems is specified
  if (maxItems && filteredFreelancers.length > maxItems) {
    filteredFreelancers = filteredFreelancers.slice(0, maxItems);
  }

  if (isLoading) {
    return (
      <div className="py-12">
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-brand/20 border-t-brand rounded-full animate-spin"></div>
            <Sparkles className="w-6 h-6 text-brand absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-400">
            Finding perfect freelancers...
          </p>
        </div>
      </div>
    );
  }

  if (!freelancers || freelancers.length === 0) {
    return (
      <div className="py-12">
        <EmptyState
          title="No proposals yet"
          message="No freelancers have submitted proposals for this job yet. Recommendations will appear once proposals are received."
          icon={Users}
        />
      </div>
    );
  }

  return (
    <div className={compact ? 'space-y-5' : 'space-y-6'}>
      {/* Modern Header with Gradient Background */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand/10 via-brand/5 to-transparent dark:from-brand-light/10 dark:via-brand-light/5 p-6 border border-brand/20 dark:border-brand-light/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-3xl"></div>
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className={`${compact ? 'w-12 h-12' : 'w-14 h-14'} bg-gradient-to-br from-brand to-brand-dark rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-brand/10 dark:ring-brand-light/10`}>
              <Sparkles className={`${compact ? 'w-6 h-6' : 'w-7 h-7'} text-white`} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`${compact ? 'text-xl' : 'text-2xl'} font-bold text-gray-900 dark:text-white`}>
                  Recommended Freelancers
                </h3>
                <Badge className="bg-brand/10 text-brand dark:bg-brand-light/10 dark:text-brand-light border-0 px-2 py-0.5">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  AI-Ranked
                </Badge>
              </div>
              {!compact && (
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white">{filteredFreelancers.length}</span>
                  <span>{filteredFreelancers.length === 1 ? 'match' : 'matches'} from proposals</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-xs">Ranked by proposal quality, profile match & track record</span>
                </p>
              )}
              {compact && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {filteredFreelancers.length} {filteredFreelancers.length === 1 ? 'match' : 'matches'} • AI-ranked from proposals
                </p>
              )}
            </div>
          </div>
          {onViewAll && !compact && (
            <Button
              variant="outline"
              size="sm"
              onClick={onViewAll}
              className="border-brand/30 text-brand hover:bg-brand hover:text-white dark:border-brand-light/30 dark:text-brand-light shadow-sm backdrop-blur-sm bg-white/50 dark:bg-gray-800/50"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Modern Filters */}
      {!compact && (
        <div className="flex flex-col sm:flex-row gap-4 p-5 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-2 flex-1">
            <Filter className="w-4 h-4 text-gray-400" />
            <Label htmlFor="minScore" className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
              Min Score:
            </Label>
            <div className="flex items-center gap-2 flex-1">
              <Input
                type="number"
                id="minScore"
                min="0"
                max="100"
                value={minScore}
                onChange={(e) => setMinScore(parseInt(e.target.value) || 0)}
                className="w-20 h-9"
              />
              <span className="text-sm text-gray-500">%</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-1">
            <Label htmlFor="sortBy" className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
              Sort by:
            </Label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 h-9 px-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
            >
              <option value="matchScore">Match Score</option>
              <option value="rate">Hourly Rate</option>
              <option value="experience">Experience Level</option>
            </select>
          </div>
        </div>
      )}

      {/* Freelancers Grid with Modern Cards */}
      <div className={`grid gap-5 ${
        compact 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      }`}>
        {filteredFreelancers.map((freelancer, index) => (
          <motion.div
            key={freelancer._id || freelancer.id || index}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: index * 0.08,
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="min-w-0"
          >
            <FreelancerMatchCard
              freelancer={freelancer}
              jobId={jobId}
              compact={compact}
            />
          </motion.div>
        ))}
      </div>

      {filteredFreelancers.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700">
          <Filter className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            No freelancers match the current filter criteria
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Try lowering the minimum match score
          </p>
        </div>
      )}
    </div>
  );
};

export default RecommendedFreelancers;
