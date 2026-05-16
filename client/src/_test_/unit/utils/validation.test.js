import {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validateHourlyRate,
  validateRequired,
  validateRegistrationForm,
} from '@/utils/validation';

describe('validation', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate passwords with minimum requirements', () => {
      const result = validatePassword('password123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject short passwords', () => {
      const result = validatePassword('short');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should check for letters and numbers', () => {
      const result1 = validatePassword('123456');
      expect(result1.errors.some(e => e.includes('letter'))).toBe(true);

      const result2 = validatePassword('abcdef');
      expect(result2.errors.some(e => e.includes('number'))).toBe(true);
    });
  });

  describe('validateName', () => {
    it('should validate names with at least 2 characters', () => {
      const result = validateName('John');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject short names', () => {
      const result = validateName('J');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('validatePhone', () => {
    it('should validate phone numbers', () => {
      const result = validatePhone('+923001234567');
      expect(result.isValid).toBe(true);
    });

    it('should allow empty phone numbers', () => {
      const result = validatePhone('');
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      const result = validatePhone('invalid');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateHourlyRate', () => {
    it('should validate hourly rates within range', () => {
      const result = validateHourlyRate('1000');
      expect(result.isValid).toBe(true);
    });

    it('should reject rates outside range', () => {
      const result1 = validateHourlyRate('60000');
      expect(result1.isValid).toBe(false);

      const result2 = validateHourlyRate('0');
      expect(result2.isValid).toBe(false);
    });

    it('should allow empty rates', () => {
      const result = validateHourlyRate('');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateRequired', () => {
    it('should validate required fields', () => {
      const result = validateRequired('value', 'Field');
      expect(result.isValid).toBe(true);
    });

    it('should reject empty required fields', () => {
      const result = validateRequired('', 'Field');
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('Field');
    });
  });

  describe('validateRegistrationForm', () => {
    it('should validate complete freelancer form', () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        role: 'freelancer',
        hourlyRate: 1000,
        experience: 'intermediate',
      };
      const result = validateRegistrationForm(formData);
      expect(result.isValid).toBe(true);
    });

    it('should validate complete client form', () => {
      const formData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        role: 'client',
        companyName: 'Test Company',
        companySize: '11-50',
        industry: 'Technology',
      };
      const result = validateRegistrationForm(formData);
      expect(result.isValid).toBe(true);
    });

    it('should reject form with mismatched passwords', () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'different',
        role: 'freelancer',
      };
      const result = validateRegistrationForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('match'))).toBe(true);
    });

    it('should reject form with invalid email', () => {
      const formData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123',
        confirmPassword: 'password123',
        role: 'freelancer',
      };
      const result = validateRegistrationForm(formData);
      expect(result.isValid).toBe(false);
    });

    it('should require company name for clients', () => {
      const formData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        role: 'client',
      };
      const result = validateRegistrationForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('Company name'))).toBe(true);
    });
  });
});


