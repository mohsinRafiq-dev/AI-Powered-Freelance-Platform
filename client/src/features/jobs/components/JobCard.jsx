

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, MapPin, Clock, DollarSign, 
  Eye, FileText, TrendingUp 
} from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { formatCurrency } from '@/utils/formatters';
import logger from '@/utils/logger';

// Helper function to format proposal count in ranges
const formatProposalCount = (count) => {
  if (count === 0) return '0';
  if (count < 5) return 'Less than 5';
  if (count < 10) return '5 to 10';
  if (count < 15) return '10 to 15';
  if (count < 20) return '15 to 20';
  if (count < 50) return '20 to 50';
  return '50+';
};

export const JobCard = ({ job, onApply, onEdit, onDelete, showActions = true, matchScore = null }) => {
  // Safety check
  if (!job || (!job._id && !job.id)) {
    logger.error('JobCard: Invalid job object', job);
    return null;
  }

  const jobId = job.id || job._id;
  const isFixed = job.budgetType === 'fixed';
  const budgetDisplay = isFixed 
    ? `${formatCurrency(job.budgetAmount, 'PKR')} Fixed`
    : `${formatCurrency(job.hourlyRate?.min, 'PKR')}-${formatCurrency(job.hourlyRate?.max, 'PKR')}/hr`;

  // Helper to get location display text
  const getLocationDisplay = () => {
    if (job.locationType === 'remote') {
      return 'Remote';
    } else if (job.locationType === 'hybrid') {
      return job.location?.city ? `Hybrid - ${job.location.city}` : 'Hybrid';
    } else if (job.locationType === 'onsite') {
      if (job.location?.country && job.location?.city) {
        return `${job.location.city}, ${job.location.country}`;
      }
      return 'Onsite';
    }
    return 'Remote';
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-brand dark:hover:border-brand-light rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {job.isFeatured && (
              <Badge className="bg-gradient-to-r from-brand to-brand-dark text-white">
                <TrendingUp className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
            {job.isFlagged && (
              <Badge variant="destructive" className="bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800">
                Flagged
              </Badge>
            )}
            {job.moderationStatus === 'pending' && (
              <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800">
                Under Review
              </Badge>
            )}
            {matchScore && (
              <Badge className="bg-brand/10 text-brand dark:bg-brand-light/10 dark:text-brand-light border-0">
                {matchScore}% Match
              </Badge>
            )}
            <Badge variant="outline" className="border-brand text-brand dark:border-brand-light dark:text-brand-light capitalize">
              {job.status}
            </Badge>
          </div>
          
          <Link to={`/jobs/${jobId}`}>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white hover:text-brand dark:hover:text-brand-light transition-colors mb-2 line-clamp-1 break-words">
              {job.title}
            </h3>
          </Link>
          
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3 break-words overflow-hidden">
            {job.description?.length > 150 
              ? `${job.description.substring(0, 150)}...` 
              : job.description}
          </p>
        </div>
      </div>

      {/* Client Info */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-light to-brand flex items-center justify-center text-white font-semibold text-base shadow-sm">
          {job.client?.name?.charAt(0)?.toUpperCase() || 'C'}
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white text-sm">
            {job.client?.companyName || job.client?.name}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {getLocationDisplay()}
          </p>
        </div>
      </div>

      {/* Job Details Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
          <DollarSign className="w-4 h-4 text-brand flex-shrink-0" />
          <span className="text-gray-900 dark:text-white font-semibold truncate">
            {budgetDisplay}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
          <Clock className="w-4 h-4 text-brand flex-shrink-0" />
          <span className="text-gray-700 dark:text-gray-300 capitalize truncate">
            {job.duration}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
          <Briefcase className="w-4 h-4 text-brand flex-shrink-0" />
          <span className="text-gray-700 dark:text-gray-300 capitalize truncate">
            {job.experienceLevel}
          </span>
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills?.slice(0, 5).map((skill, index) => (
          <Badge 
            key={index} 
            className="bg-brand/10 text-brand dark:bg-brand-light/10 dark:text-brand-light border-0 text-xs font-medium"
          >
            {skill}
          </Badge>
        ))}
        {job.skills?.length > 5 && (
          <Badge variant="outline" className="text-xs text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600">
            +{job.skills.length - 5} more
          </Badge>
        )}
      </div>

      {/* Category & Stats */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <Badge className="bg-brand/10 text-brand dark:bg-brand-light/10 dark:text-brand-light border-0">
          {job.category}
        </Badge>
        
        <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" />
            <span>{formatProposalCount(job.proposalsCount || 0)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{job.views || 0}</span>
          </div>
        </div>
      </div>

      {/* Posted Time */}
      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-4">
        <Clock className="w-3.5 h-3.5" />
        <span>Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex gap-2">
          <Link to={`/jobs/${jobId}`} className="flex-1">
            <Button 
              className="w-full bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-deeper text-white shadow-sm hover:shadow-md transition-all"
            >
              View Details
            </Button>
          </Link>
          
          {onApply && (
            <Button 
              onClick={() => onApply(job)}
              className="flex-1 bg-brand hover:bg-brand-dark text-white shadow-sm hover:shadow-md transition-all"
            >
              Apply Now
            </Button>
          )}
          
          {onEdit && (
            <Button 
              onClick={() => onEdit(job)}
              variant="outline"
              className="border-brand text-brand hover:bg-brand/10 dark:border-brand-light dark:text-brand-light dark:hover:bg-brand-light/10"
            >
              Edit
            </Button>
          )}
          
          {onDelete && (
            <Button 
              onClick={() => onDelete(job)}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-950/20"
            >
              Delete
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
