import {
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
} from '@/utils/formatters';
import { CURRENCY } from '@/utils/constants';

describe('formatters', () => {
  describe('formatDate', () => {
    it('should format date in SHORT format', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date, 'SHORT');
      expect(formatted).toBeTruthy();
      expect(formatted).toContain('Jan');
    });

    it('should return empty string for invalid date', () => {
      expect(formatDate(null)).toBe('');
      expect(formatDate('invalid')).toBe('');
    });
  });

  describe('formatRelativeTime', () => {
    it('should format relative time correctly', () => {
      const now = new Date();
      const oneMinuteAgo = new Date(now - 60 * 1000);
      expect(formatRelativeTime(oneMinuteAgo)).toContain('minute');

      const oneHourAgo = new Date(now - 3600 * 1000);
      expect(formatRelativeTime(oneHourAgo)).toContain('hour');

      const oneDayAgo = new Date(now - 86400 * 1000);
      expect(formatRelativeTime(oneDayAgo)).toContain('day');
    });

    it('should return "Just now" for recent dates', () => {
      const now = new Date();
      expect(formatRelativeTime(now)).toBe('Just now');
    });

    it('should return empty string for invalid date', () => {
      expect(formatRelativeTime(null)).toBe('');
      expect(formatRelativeTime('invalid')).toBe('');
    });
  });

  describe('formatCurrency', () => {
    it('should format PKR currency', () => {
      expect(formatCurrency(1000, CURRENCY.PKR)).toContain('Rs.');
      expect(formatCurrency(1000, CURRENCY.PKR)).toContain('1,000');
    });

    it('should format USD currency', () => {
      const result = formatCurrency(1000, 'USD');
      expect(result).toContain('$');
    });

    it('should handle null and undefined', () => {
      expect(formatCurrency(null)).toBe('');
      expect(formatCurrency(undefined)).toBe('');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
    });

    it('should handle null and undefined', () => {
      expect(formatNumber(null)).toBe('');
      expect(formatNumber(undefined)).toBe('');
    });
  });

  describe('formatFileSize', () => {
    it('should format file sizes', () => {
      expect(formatFileSize(1024)).toContain('KB');
      expect(formatFileSize(1024 * 1024)).toContain('MB');
      expect(formatFileSize(0)).toBe('0 Bytes');
    });

    it('should return empty string for null', () => {
      expect(formatFileSize(null)).toBe('');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentages', () => {
      expect(formatPercentage(50)).toBe('50%');
      expect(formatPercentage(50.5, 1)).toBe('50.5%');
    });

    it('should handle null and undefined', () => {
      expect(formatPercentage(null)).toBe('');
      expect(formatPercentage(undefined)).toBe('');
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const longText = 'a'.repeat(100);
      const truncated = truncateText(longText, 50);
      expect(truncated.length).toBe(53); // 50 + '...'
      expect(truncated).toContain('...');
    });

    it('should not truncate short text', () => {
      expect(truncateText('short', 50)).toBe('short');
    });

    it('should return empty string for null', () => {
      expect(truncateText(null)).toBe('');
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format Pakistani phone numbers', () => {
      expect(formatPhoneNumber('923001234567')).toContain('+92');
    });

    it('should return original if not Pakistani format', () => {
      expect(formatPhoneNumber('1234567890')).toBe('1234567890');
    });

    it('should return empty string for null', () => {
      expect(formatPhoneNumber(null)).toBe('');
    });
  });

  describe('capitalizeWords', () => {
    it('should capitalize words', () => {
      expect(capitalizeWords('hello world')).toBe('Hello World');
      expect(capitalizeWords('test')).toBe('Test');
    });

    it('should return empty string for null', () => {
      expect(capitalizeWords(null)).toBe('');
    });
  });

  describe('formatExperienceLevel', () => {
    it('should format experience levels', () => {
      expect(formatExperienceLevel('beginner')).toBe('Beginner');
      expect(formatExperienceLevel('intermediate')).toBe('Intermediate');
      expect(formatExperienceLevel('expert')).toBe('Expert');
    });

    it('should capitalize unknown levels', () => {
      expect(formatExperienceLevel('custom')).toBe('Custom');
    });
  });

  describe('formatDuration', () => {
    it('should format durations', () => {
      expect(formatDuration('less-than-month')).toBe('Less than 1 month');
      expect(formatDuration('1-3-months')).toBe('1 to 3 months');
    });
  });

  describe('formatJobType', () => {
    it('should format job types', () => {
      expect(formatJobType('fixed-price')).toBe('Fixed Price');
      expect(formatJobType('hourly')).toBe('Hourly');
    });
  });

  describe('getInitials', () => {
    it('should get initials from name', () => {
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('John')).toBe('J');
    });

    it('should return empty string for null', () => {
      expect(getInitials(null)).toBe('');
    });
  });

  describe('getImageUrl', () => {
    beforeEach(() => {
      // Mock import.meta.env via global
      if (global.__VITE_IMPORT_META_ENV__) {
        global.__VITE_IMPORT_META_ENV__.VITE_API_URL = 'http://localhost:5000/api';
      }
    });

    it('should return full URL for relative path', () => {
      const url = getImageUrl('/uploads/image.jpg');
      expect(url).toBe('http://localhost:5000/uploads/image.jpg');
    });

    it('should return full URL for absolute path', () => {
      const url = getImageUrl('uploads/image.jpg');
      expect(url).toBe('http://localhost:5000/uploads/image.jpg');
    });

    it('should return original URL if already full URL', () => {
      const url = getImageUrl('https://example.com/image.jpg');
      expect(url).toBe('https://example.com/image.jpg');
    });

    it('should return null for empty path', () => {
      expect(getImageUrl(null)).toBe(null);
      expect(getImageUrl('')).toBe(null);
    });
  });
});


