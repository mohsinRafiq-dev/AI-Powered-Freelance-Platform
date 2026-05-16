import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, MapPin, DollarSign, Briefcase, Star, 
  Clock, FileText, CheckCircle2, TrendingUp, Award,
  Sparkles as SparklesIcon
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import MatchScoreBadge from './MatchScoreBadge';

/**
 * FreelancerMatchCard Component
 * Modern vertical card design for displaying freelancer recommendations
 */
export const FreelancerMatchCard = ({ freelancer, jobId, compact = false }) => {
  if (!freelancer) return null;

  const matchScore = freelancer.matchScore || freelancer.finalScore || 0;
  const avatarInitial = freelancer.name?.charAt(0)?.toUpperCase() || 'F';

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-brand dark:hover:border-brand-light rounded-2xl ${compact ? 'p-5' : 'p-6'} shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col`}
    >
      {/* Gradient Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand via-brand-dark to-brand opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"></div>

      {/* Header Section - Match Score and Avatar */}
      <div className="flex items-start justify-between mb-5">
        {/* Match Score - Top Left */}
        <div className="flex-shrink-0">
          <MatchScoreBadge
            matchScore={matchScore}
            baseScore={freelancer.baseScore}
            aiScore={freelancer.aiScore}
            confidence={freelancer.matchConfidence}
            aiEnhanced={freelancer.aiEnhanced}
            size="sm"
          />
        </div>
        
        {/* Avatar - Top Right */}
        <div className="relative flex-shrink-0">
          <div className={`${compact ? 'w-16 h-16' : 'w-20 h-20'} rounded-2xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white font-bold shadow-lg ring-4 ring-brand/10 dark:ring-brand-light/10 transition-transform group-hover:scale-105`}>
            {freelancer.avatar ? (
              <img 
                src={freelancer.avatar} 
                alt={freelancer.name}
                className="w-full h-full rounded-2xl object-cover"
              />
            ) : (
              <span className={`${compact ? 'text-2xl' : 'text-3xl'}`}>{avatarInitial}</span>
            )}
          </div>
          {freelancer.contractHistory?.hasHistory && (
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5 shadow-lg border-2 border-white dark:border-gray-800">
              <Award className="w-3.5 h-3.5 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Name and Location - Vertical Stack */}
      <div className="mb-4">
        <h3 className={`${compact ? 'text-lg' : 'text-xl'} font-bold text-gray-900 dark:text-white mb-1 group-hover:text-brand dark:group-hover:text-brand-light transition-colors`}>
          {freelancer.name}
        </h3>
        {freelancer.role && (
          <p className={`${compact ? 'text-xs' : 'text-sm'} text-gray-500 dark:text-gray-400 mb-2 capitalize font-medium`}>
            {freelancer.role}
          </p>
        )}
        {freelancer.location && (
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{freelancer.location}</span>
          </div>
        )}
      </div>

      {/* Skills - Horizontal Row */}
      {freelancer.skills && freelancer.skills.length > 0 && (
        <div className="mb-5">
          <div className="flex flex-wrap gap-2">
            {freelancer.skills.slice(0, compact ? 3 : 4).map((skill, index) => (
              <Badge
                key={index}
                className="bg-gradient-to-r from-brand/10 to-brand/5 text-brand dark:from-brand-light/10 dark:to-brand-light/5 dark:text-brand-light border border-brand/20 dark:border-brand-light/20 text-xs font-medium px-2.5 py-1 rounded-lg"
              >
                {skill}
              </Badge>
            ))}
            {freelancer.skills.length > (compact ? 3 : 4) && (
              <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-600 px-2.5 py-1 rounded-lg">
                +{freelancer.skills.length - (compact ? 3 : 4)}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Proposal Details - Vertical Card */}
      {(freelancer.proposalBidAmount || freelancer.proposalDeliveryTime) && (
        <div className="mb-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl border border-blue-200/50 dark:border-blue-800/30">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-blue-500/10 rounded-lg">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
              Proposal Details
            </p>
          </div>
          <div className="space-y-2.5">
            {freelancer.proposalBidAmount && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Bid Amount</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  PKR {freelancer.proposalBidAmount.toLocaleString()}
                </span>
              </div>
            )}
            {freelancer.proposalDeliveryTime && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Delivery Time</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {freelancer.proposalDeliveryTime} days
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Track Record - Vertical Card */}
      {freelancer.contractHistory && freelancer.contractHistory.hasHistory && (
        <div className="mb-4 p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 rounded-xl border border-purple-200/50 dark:border-purple-800/30">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-purple-500/10 rounded-lg">
              <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wide">
              Track Record
            </p>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Completed Contracts</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {freelancer.contractHistory.completedContracts || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Success Rate</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {freelancer.contractHistory.successRate?.toFixed(0) || 0}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Stats - Horizontal Grid */}
      <div className="grid grid-cols-3 gap-2 mb-5 pb-5 border-b border-gray-200 dark:border-gray-700">
        <div className="text-center p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/50">
          <DollarSign className="w-4 h-4 text-brand dark:text-brand-light mx-auto mb-1.5" />
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">Rate</p>
          <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
            {freelancer.hourlyRate ? `PKR ${freelancer.hourlyRate.toLocaleString()}/hr` : 'N/A'}
          </p>
        </div>
        <div className="text-center p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/50">
          <Briefcase className="w-4 h-4 text-brand dark:text-brand-light mx-auto mb-1.5" />
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">Experience</p>
          <p className="text-xs font-bold text-gray-900 dark:text-white capitalize truncate">
            {freelancer.experience || 'N/A'}
          </p>
        </div>
        <div className="text-center p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/50">
          <Star className="w-4 h-4 text-brand dark:text-brand-light mx-auto mb-1.5" />
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">Completed</p>
          <p className="text-xs font-bold text-gray-900 dark:text-white">
            {freelancer.completedJobsCount || freelancer.contractHistory?.completedContracts || 0}
          </p>
        </div>
      </div>

      {/* Match Reasoning - Vertical Card */}
      {freelancer.matchReasoning && (
        <div className="mb-4 p-4 bg-gradient-to-br from-brand/5 via-brand/10 to-brand/5 dark:from-brand-light/5 dark:via-brand-light/10 dark:to-brand-light/5 rounded-xl border border-brand/20 dark:border-brand-light/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand to-brand-dark"></div>
          <div className="flex items-start gap-2.5 relative z-10 mt-1">
            <SparklesIcon className="w-4 h-4 text-brand dark:text-brand-light mt-0.5 flex-shrink-0" />
            <p className={`${compact ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-300 line-clamp-3 flex-1 leading-relaxed`}>
              {compact 
                ? (freelancer.matchReasoning.length > 120 
                    ? `${freelancer.matchReasoning.substring(0, 120)}...`
                    : freelancer.matchReasoning)
                : (freelancer.matchReasoning.length > 180 
                    ? `${freelancer.matchReasoning.substring(0, 180)}...`
                    : freelancer.matchReasoning)
              }
            </p>
          </div>
        </div>
      )}

      {/* Strengths - Vertical List */}
      {freelancer.strengths?.length > 0 && (
        <div className="mb-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 rounded-xl p-4 border border-green-200/50 dark:border-green-800/30">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
              <p className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wide">
                Strengths
              </p>
            </div>
            <ul className={`${compact ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-300 space-y-2`}>
              {freelancer.strengths.slice(0, compact ? 2 : 3).map((strength, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-green-500 mt-0.5 flex-shrink-0 font-bold text-base">✓</span>
                  <span className="line-clamp-2 leading-relaxed flex-1">{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Concerns - Vertical List (only in non-compact mode) */}
      {!compact && freelancer.concerns?.length > 0 && (
        <div className="mb-4">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 rounded-xl p-4 border border-amber-200/50 dark:border-amber-800/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                Considerations
              </p>
            </div>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
              {freelancer.concerns.slice(0, 2).map((concern, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-amber-500 mt-0.5 flex-shrink-0">•</span>
                  <span className="line-clamp-2 leading-relaxed flex-1">{concern}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Action Button - Full Width */}
      <div className="mt-auto pt-2">
        <Link to={`/users/${freelancer._id || freelancer.id}`}>
          <Button
            variant="outline"
            size={compact ? 'sm' : 'default'}
            className="w-full border-2 border-brand/30 text-brand hover:bg-gradient-to-r hover:from-brand hover:to-brand-dark hover:text-white dark:border-brand-light/30 dark:text-brand-light dark:hover:from-brand-light dark:hover:to-brand-dark dark:hover:text-gray-900 transition-all duration-200 font-semibold rounded-xl shadow-sm hover:shadow-md group h-11"
          >
            <User className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            View Profile
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default FreelancerMatchCard;
