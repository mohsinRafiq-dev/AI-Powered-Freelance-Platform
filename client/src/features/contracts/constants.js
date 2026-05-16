/**
 * Contract Module Constants & Helpers for Frontend
 * Matches backend contract business rules and status machine
 * Used for conditional rendering, validation, and UX logic
 */

// Contract status enumeration - matches backend
export const CONTRACT_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  DISPUTED: 'disputed',
  TERMINATED: 'terminated',
};

// Milestone status enumeration - matches backend
export const MILESTONE_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  DISPUTED: 'disputed',
};

// Payment type enumeration
export const PAYMENT_TYPE = {
  FIXED: 'fixed',
  HOURLY: 'hourly',
  MILESTONE: 'milestone',
};

// Terminal statuses (cannot be modified once reached)
export const TERMINAL_STATUSES = [
  CONTRACT_STATUS.COMPLETED,
  CONTRACT_STATUS.CANCELLED,
  CONTRACT_STATUS.TERMINATED,
];

// Statuses that allow milestone addition
export const MILESTONE_EDITABLE_STATUSES = [
  CONTRACT_STATUS.PENDING,
  CONTRACT_STATUS.ACTIVE,
];

// Status display configuration for UI
export const STATUS_CONFIG = {
  [CONTRACT_STATUS.PENDING]: {
    label: 'Pending',
    color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    description: 'Waiting for freelancer response',
  },
  [CONTRACT_STATUS.ACTIVE]: {
    label: 'Active',
    color: 'bg-brand/10 text-brand border-brand/20',
    description: 'Contract is active',
  },
  [CONTRACT_STATUS.COMPLETED]: {
    label: 'Completed',
    color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    description: 'Contract completed successfully',
  },
  [CONTRACT_STATUS.CANCELLED]: {
    label: 'Cancelled',
    color: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    description: 'Contract was cancelled',
  },
  [CONTRACT_STATUS.DISPUTED]: {
    label: 'Disputed',
    color: 'bg-red-500/10 text-red-500 border-red-500/20',
    description: 'Contract is under dispute',
  },
  [CONTRACT_STATUS.TERMINATED]: {
    label: 'Terminated',
    color: 'bg-red-500/10 text-red-500 border-red-500/20',
    description: 'Contract was terminated',
  },
};

// Milestone status display configuration
export const MILESTONE_STATUS_CONFIG = {
  [MILESTONE_STATUS.PENDING]: {
    label: 'Pending',
    color: 'bg-yellow-500/10 text-yellow-500',
  },
  [MILESTONE_STATUS.IN_PROGRESS]: {
    label: 'In Progress',
    color: 'bg-blue-500/10 text-blue-500',
  },
  [MILESTONE_STATUS.COMPLETED]: {
    label: 'Completed',
    color: 'bg-brand/10 text-brand',
  },
  [MILESTONE_STATUS.DISPUTED]: {
    label: 'Disputed',
    color: 'bg-red-500/10 text-red-500',
  },
};

/**
 * Helper Functions - Business Logic for UI
 */

/**
 * Check if contract status is terminal (cannot be modified)
 */
export const isTerminalStatus = (status) => {
  return TERMINAL_STATUSES.includes(status);
};

/**
 * Check if milestones can be added to contract
 * Business Rule: Only in pending or active status
 */
export const canAddMilestones = (contractStatus) => {
  return MILESTONE_EDITABLE_STATUSES.includes(contractStatus);
};

/**
 * Check if user is the client
 */
export const isClient = (contract, userId) => {
  if (!contract || !userId) return false;
  const clientId = contract.client?._id || contract.client;
  return String(clientId) === String(userId);
};

/**
 * Check if user is the freelancer
 */
export const isFreelancer = (contract, userId) => {
  if (!contract || !userId) return false;
  const freelancerId = contract.freelancer?._id || contract.freelancer;
  return String(freelancerId) === String(userId);
};

/**
 * Check if freelancer can respond to contract
 * Business Rule: Only freelancer can respond to pending contracts
 */
export const canRespondToContract = (contract, userId) => {
  return (
    contract?.status === CONTRACT_STATUS.PENDING &&
    isFreelancer(contract, userId)
  );
};

/**
 * Check if client can complete contract
 * Business Rule: Only client can complete active contracts
 */
export const canCompleteContract = (contract, userId) => {
  return (
    contract?.status === CONTRACT_STATUS.ACTIVE &&
    isClient(contract, userId)
  );
};

/**
 * Check if client can cancel contract
 * Business Rule: Only client can cancel pending or active contracts
 */
export const canCancelContract = (contract, userId) => {
  return (
    (contract?.status === CONTRACT_STATUS.PENDING ||
      contract?.status === CONTRACT_STATUS.ACTIVE) &&
    isClient(contract, userId)
  );
};

/**
 * Check if milestones can be edited
 * Business Rule: Cannot edit milestones in terminal states
 */
export const canEditMilestones = (contractStatus) => {
  return !isTerminalStatus(contractStatus);
};

/**
 * Check if milestone can be updated
 * Business Rule: Cannot update completed milestones or milestones in terminal contracts
 */
export const canUpdateMilestone = (milestone, contractStatus) => {
  return (
    milestone?.status !== MILESTONE_STATUS.COMPLETED &&
    canEditMilestones(contractStatus)
  );
};

/**
 * Calculate milestone progress percentage
 */
export const calculateProgress = (milestones) => {
  if (!milestones || milestones.length === 0) return 0;
  const completed = milestones.filter(
    (m) => m.status === MILESTONE_STATUS.COMPLETED
  ).length;
  return Math.round((completed / milestones.length) * 100);
};

/**
 * Get human-readable status message for contract
 */
export const getStatusMessage = (contract, userId) => {
  const status = contract?.status;
  const config = STATUS_CONFIG[status];

  if (!config) return 'Status unknown';

  // Add context based on user role and status
  if (status === CONTRACT_STATUS.PENDING) {
    if (isFreelancer(contract, userId)) {
      return 'You need to accept or decline this contract';
    }
    if (isClient(contract, userId)) {
      return 'Waiting for freelancer to respond';
    }
  }

  if (status === CONTRACT_STATUS.ACTIVE) {
    return 'Work in progress';
  }

  if (status === CONTRACT_STATUS.COMPLETED && contract.completedAt) {
    const date = new Date(contract.completedAt).toLocaleDateString();
    return `Completed on ${date}`;
  }

  return config.description;
};

/**
 * Validate milestone data before submission
 */
export const validateMilestone = (milestone, contractDeadline) => {
  const errors = [];

  // Title validation
  if (!milestone.title || milestone.title.trim().length < 3) {
    errors.push('Milestone title must be at least 3 characters');
  }
  if (milestone.title && milestone.title.length > 200) {
    errors.push('Milestone title cannot exceed 200 characters');
  }

  // Amount validation
  if (!milestone.amount || milestone.amount <= 0) {
    errors.push('Milestone amount must be greater than 0');
  }

  // Due date validation
  if (milestone.dueDate) {
    const dueDate = new Date(milestone.dueDate);
    const now = new Date();
    
    if (dueDate < now) {
      errors.push('Milestone due date must be in the future');
    }

    if (contractDeadline) {
      const deadline = new Date(contractDeadline);
      if (dueDate > deadline) {
        errors.push('Milestone due date cannot exceed contract deadline');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Map backend error messages to user-friendly messages
 */
export const mapErrorMessage = (error) => {
  const message = error?.response?.data?.message || error?.message || 'An error occurred';

  const errorMap = {
    'Invalid status transition': 'This action is not allowed for the current contract status',
    'You do not have access to this contract': 'You are not authorized to perform this action',
    'Cannot add milestone': 'Milestones cannot be added to this contract in its current state',
    'Only the client can': 'Only the client can perform this action',
    'Only the freelancer can': 'Only the freelancer can perform this action',
    'Milestone due date cannot be in the past': 'Please select a future date for the milestone',
    'Cancellation reason is required': 'Please provide a reason for cancellation',
  };

  // Find matching error message
  for (const [key, value] of Object.entries(errorMap)) {
    if (message.includes(key)) {
      return value;
    }
  }

  return message;
};
