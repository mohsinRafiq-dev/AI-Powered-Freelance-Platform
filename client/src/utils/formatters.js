/**
 * Formatting utilities for dates, currency, numbers, etc.
 */

import { DATE_FORMATS, CURRENCY } from './constants';


export const formatDate = (date, format = 'SHORT') => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const options = {
    SHORT: { month: 'short', day: 'numeric', year: 'numeric' },
    LONG: { month: 'long', day: 'numeric', year: 'numeric' },
    WITH_TIME: { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' },
    TIME_ONLY: { hour: '2-digit', minute: '2-digit' },
  };

  return d.toLocaleDateString('en-US', options[format] || options.SHORT);
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const now = new Date();
  const diffInSeconds = Math.floor((now - d) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};

export const formatCurrency = (amount, currency = CURRENCY.PKR) => {
  if (amount === null || amount === undefined) return '';
  
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return '';

  if (currency === CURRENCY.PKR) {
    return `Rs. ${numAmount.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(numAmount);
};


export const formatNumber = (num) => {
  if (num === null || num === undefined) return '';
  
  const numValue = parseFloat(num);
  if (isNaN(numValue)) return '';

  return numValue.toLocaleString('en-US');
};
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  if (!bytes) return '';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};


export const formatPercentage = (value, decimals = 0) => {
  if (value === null || value === undefined) return '';
  
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return '';

  return `${numValue.toFixed(decimals)}%`;
};


export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};


export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format for Pakistani numbers (+92 xxx xxxxxxx)
  if (cleaned.startsWith('92')) {
    const match = cleaned.match(/^(\d{2})(\d{3})(\d{7})$/);
    if (match) {
      return `+${match[1]} ${match[2]} ${match[3]}`;
    }
  }
  
  return phone;
};

export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};


export const formatExperienceLevel = (level) => {
  if (!level) return '';
  
  const levels = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    expert: 'Expert',
  };
  
  return levels[level.toLowerCase()] || capitalizeWords(level);
};

export const formatDuration = (duration) => {
  if (!duration) return '';
  
  const durations = {
    'less-than-month': 'Less than 1 month',
    '1-3-months': '1 to 3 months',
    '3-6-months': '3 to 6 months',
    'more-than-6-months': 'More than 6 months',
  };
  
  return durations[duration] || duration;
};


export const formatJobType = (type) => {
  if (!type) return '';
  
  const types = {
    'fixed-price': 'Fixed Price',
    'hourly': 'Hourly',
  };
  
  return types[type] || capitalizeWords(type);
};


export const getInitials = (name) => {
  if (!name) return '';
  
  const words = name.trim().split(' ');
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

/**
 * Get full image URL from backend path
 * @param {string} imagePath - Relative or absolute image path from backend
 * @returns {string|null} Full URL or null if no path provided
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Get API base URL and remove /api suffix
  const apiBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const serverBaseURL = apiBaseURL.replace('/api', '');
  
  // Ensure path starts with /
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return `${serverBaseURL}${normalizedPath}`;
};

export default {
  formatDate,
  formatRelativeTime,
  formatCurrency,
  formatNumber,
  formatFileSize,
  formatPercentage,
  truncateText,
  formatPhoneNumber,
  capitalizeWords,
  formatExperienceLevel,
  formatDuration,
  formatJobType,
  getInitials,
  getImageUrl,
};
