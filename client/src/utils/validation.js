
import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const baseRegistrationSchema = {
  name: yup.string().min(2, "Name must be at least 2 characters").required("Name is required"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup.string().oneOf([yup.ref("password")], "Passwords must match").required("Confirm password is required"),
  role: yup.string().oneOf(["freelancer", "client"]).required("Please select a role"),
  bio: yup.string().max(500, "Bio must be less than 500 characters"),
  location: yup.string(),
  phone: yup.string(),
};

export const freelancerRegistrationSchema = yup.object({
  ...baseRegistrationSchema,
  // REQUIRED fields for freelancers during registration
  hourlyRate: yup
    .number()
    .positive("Hourly rate must be positive")
    .required("Hourly rate is required for freelancers")
    .typeError("Hourly rate must be a number"),
  experience: yup
    .string()
    .oneOf(["beginner", "intermediate", "expert"], "Please select your experience level")
    .required("Experience level is required for freelancers"),
  // Skills array is handled separately in the form
  skills: yup.array().optional(),
});

export const clientRegistrationSchema = yup.object({
  ...baseRegistrationSchema,
  // REQUIRED fields for clients during registration
  companyName: yup
    .string()
    .min(2, "Company name must be at least 2 characters")
    .required("Company name is required for clients"),
  companySize: yup
    .string()
    .oneOf(["1-10", "11-50", "51-200", "201-500", "500+"], "Please select company size")
    .required("Company size is required for clients"),
  industry: yup
    .string()
    .min(2, "Industry must be at least 2 characters")
    .required("Industry is required for clients"),
});

/**
 * Profile Completion Schemas
 */
export const freelancerProfileSchema = yup.object({
  role: yup.string().oneOf(["freelancer"]).required(),
  bio: yup.string().max(500),
  location: yup.string(),
  phone: yup.string(),
  hourlyRate: yup.number().positive("Hourly rate must be positive").required("Hourly rate is required"),
  experience: yup.string().oneOf(["beginner", "intermediate", "expert"]).required("Experience level is required"),
});

export const clientProfileSchema = yup.object({
  role: yup.string().oneOf(["client"]).required(),
  bio: yup.string().max(500),
  location: yup.string(),
  phone: yup.string(),
  companyName: yup.string().required("Company name is required"),
  companySize: yup.string().required("Company size is required"),
  industry: yup.string().required("Industry is required"),
});


export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return {
    isValid: password.length >= 6,
    errors: [
      ...(password.length < 6 ? ['Password must be at least 6 characters long'] : []),
      ...(!/[A-Za-z]/.test(password) ? ['Password must contain at least one letter'] : []),
      ...(!/\d/.test(password) ? ['Password must contain at least one number'] : [])
    ]
  };
};

export const validateName = (name) => {
  return {
    isValid: name.trim().length >= 2,
    errors: name.trim().length < 2 ? ['Name must be at least 2 characters long'] : []
  };
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return {
    isValid: !phone || phoneRegex.test(phone.replace(/\s/g, '')),
    errors: phone && !phoneRegex.test(phone.replace(/\s/g, '')) ? ['Please enter a valid phone number'] : []
  };
};

export const validateHourlyRate = (rate) => {
  const numRate = parseFloat(rate);
  return {
    isValid: !rate || (numRate > 0 && numRate <= 50000),
    errors: rate && (isNaN(numRate) || numRate <= 0 || numRate > 50000) ? ['Hourly rate must be between Rs. 100 and Rs. 50,000'] : []
  };
};

export const validateRequired = (value, fieldName) => {
  const trimmedValue = value ? value.toString().trim() : '';
  const isValid = trimmedValue.length > 0;
  return {
    isValid,
    errors: !isValid ? [`${fieldName} is required`] : []
  };
};

// Full form validation
export const validateRegistrationForm = (formData) => {
  const errors = [];
  
  // Basic validations
  const nameValidation = validateName(formData.name);
  if (!nameValidation.isValid) errors.push(...nameValidation.errors);
  
  if (!validateEmail(formData.email)) {
    errors.push('Please enter a valid email address');
  }
  
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) errors.push(...passwordValidation.errors);
  
  if (formData.password !== formData.confirmPassword) {
    errors.push('Passwords do not match');
  }
  
  // Phone validation (optional field)
  const phoneValidation = validatePhone(formData.phone);
  if (!phoneValidation.isValid) errors.push(...phoneValidation.errors);
  
  // Role-specific validations
  if (formData.role === 'client') {
    const companyValidation = validateRequired(formData.companyName, 'Company name');
    if (!companyValidation.isValid) errors.push(...companyValidation.errors);
  }
  
  if (formData.role === 'freelancer' && formData.hourlyRate) {
    const rateValidation = validateHourlyRate(formData.hourlyRate);
    if (!rateValidation.isValid) errors.push(...rateValidation.errors);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export default {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validateHourlyRate,
  validateRequired,
  validateRegistrationForm
};