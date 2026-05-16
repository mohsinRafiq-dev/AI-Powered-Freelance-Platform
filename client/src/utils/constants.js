/**
 * Application-wide constants
 */

// User roles
export const USER_ROLES = {
  FREELANCER: 'freelancer',
  CLIENT: 'client',
};

// Job status
export const JOB_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  CLOSED: 'closed',
};

// Proposal status
export const PROPOSAL_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn',
};

// Payment status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

// Transaction types
export const TRANSACTION_TYPES = {
  PAYMENT: 'payment',
  REFUND: 'refund',
  WITHDRAWAL: 'withdrawal',
  DEPOSIT: 'deposit',
};

// Experience levels
export const EXPERIENCE_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  EXPERT: 'expert',
};

// Job types
export const JOB_TYPES = {
  FIXED_PRICE: 'fixed-price',
  HOURLY: 'hourly',
};

// Job duration
export const JOB_DURATION = {
  LESS_THAN_MONTH: 'less-than-month',
  ONE_TO_THREE_MONTHS: '1-3-months',
  THREE_TO_SIX_MONTHS: '3-6-months',
  MORE_THAN_SIX_MONTHS: 'more-than-6-months',
};

// Project complexity
export const PROJECT_COMPLEXITY = {
  BASIC: 'basic',
  INTERMEDIATE: 'intermediate',
  COMPLEX: 'complex',
};

// File upload limits
export const FILE_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILES: 5,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Currency
export const CURRENCY = {
  PKR: 'PKR',
  SYMBOL: 'Rs.',
  NAME: 'Pakistani Rupee',
};

// Date formats
export const DATE_FORMATS = {
  SHORT: 'MMM DD, YYYY',
  LONG: 'MMMM DD, YYYY',
  WITH_TIME: 'MMM DD, YYYY HH:mm',
  TIME_ONLY: 'HH:mm',
};

// Message types
export const MESSAGE_TYPES = {
  TEXT: 'text',
  FILE: 'file',
  IMAGE: 'image',
  SYSTEM: 'system',
};

// Notification types
export const NOTIFICATION_TYPES = {
  JOB_POSTED: 'job_posted',
  PROPOSAL_RECEIVED: 'proposal_received',
  PROPOSAL_ACCEPTED: 'proposal_accepted',
  PROPOSAL_REJECTED: 'proposal_rejected',
  JOB_COMPLETED: 'job_completed',
  PAYMENT_RECEIVED: 'payment_received',
  MESSAGE_RECEIVED: 'message_received',
  REVIEW_RECEIVED: 'review_received',
};

// Review ratings
export const REVIEW_RATINGS = {
  MIN: 1,
  MAX: 5,
};

// Skill levels
export const SKILL_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert',
};

// Company sizes
export const COMPANY_SIZES = {
  SOLO: '1',
  SMALL: '2-10',
  MEDIUM: '11-50',
  LARGE: '51-200',
  ENTERPRISE: '200+',
};

// Industries
export const INDUSTRIES = {
  TECHNOLOGY: 'Technology',
  FINANCE: 'Finance',
  HEALTHCARE: 'Healthcare',
  EDUCATION: 'Education',
  RETAIL: 'Retail',
  MANUFACTURING: 'Manufacturing',
  REAL_ESTATE: 'Real Estate',
  MARKETING: 'Marketing',
  CONSULTING: 'Consulting',
  OTHER: 'Other',
};

export default {
  USER_ROLES,
  JOB_STATUS,
  PROPOSAL_STATUS,
  PAYMENT_STATUS,
  TRANSACTION_TYPES,
  EXPERIENCE_LEVELS,
  JOB_TYPES,
  JOB_DURATION,
  PROJECT_COMPLEXITY,
  FILE_LIMITS,
  PAGINATION,
  CURRENCY,
  DATE_FORMATS,
  MESSAGE_TYPES,
  NOTIFICATION_TYPES,
  REVIEW_RATINGS,
  SKILL_LEVELS,
  COMPANY_SIZES,
  INDUSTRIES,
};
