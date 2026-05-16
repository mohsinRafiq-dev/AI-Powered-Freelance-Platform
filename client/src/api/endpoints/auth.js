import axiosInstance from "@/api/axiosInstance";
import { removeToken } from "@/store/slices/authSlice";
import logger from "@/utils/logger";


// Register new user
export const register = (userData) => {
  return axiosInstance.post("/auth/register", userData);
};

// Login user
export const login = (credentials) => {
  return axiosInstance.post("/auth/login", credentials);
};

// Logout user
export const logout = async () => {
  try {
    await axiosInstance.post("/auth/logout");
  } finally {
    // Always clear token on logout, even if server request fails
    removeToken();
  }
};

// Get current user
export const getCurrentUser = async () => {
  logger.api('/auth/me', 'GET');
  const response = await axiosInstance.get("/auth/me");
  logger.debug('Current user fetched:', response.data);
  return response;
};

// Complete user profile
export const completeProfile = async (profileData) => {
  logger.api('/auth/complete-profile', 'POST', profileData);
  const response = await axiosInstance.post("/auth/complete-profile", profileData);
  logger.debug('Profile completed:', response.data);
  return response;
};

// Google OAuth (for future use if needed)
export const googleAuth = (idToken) => {
  return axiosInstance.post("/auth/google", { idToken });
};

// Forgot Password - Request OTP
export const requestPasswordReset = async (email) => {
  logger.api('/auth/forgot-password', 'POST', { email });
  const response = await axiosInstance.post("/auth/forgot-password", { email });
  logger.debug('Password reset OTP sent:', response.data);
  return response;
};

// Forgot Password - Verify OTP
export const verifyOTP = async (email, otp) => {
  logger.api('/auth/verify-otp', 'POST', { email, otp });
  const response = await axiosInstance.post("/auth/verify-otp", { email, otp });
  logger.debug('OTP verified:', response.data);
  return response;
};

// Forgot Password - Reset Password
export const resetPassword = async (email, otp, newPassword, confirmPassword) => {
  logger.api('/auth/reset-password', 'POST', { email, otp });
  const response = await axiosInstance.post("/auth/reset-password", { 
    email, 
    otp, 
    newPassword,
    confirmPassword 
  });
  logger.debug('Password reset successful:', response.data);
  return response;
};

// CNIC Verification - Upload Front Image
export const uploadCNICFront = async (file) => {
  logger.api('/auth/cnic/front', 'POST', 'FormData');
  const formData = new FormData();
  formData.append('cnicFront', file);
  const response = await axiosInstance.post("/auth/cnic/front", formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  logger.debug('CNIC front uploaded:', response.data);
  return response;
};

// CNIC Verification - Upload Back Image
export const uploadCNICBack = async (file) => {
  logger.api('/auth/cnic/back', 'POST', 'FormData');
  const formData = new FormData();
  formData.append('cnicBack', file);
  const response = await axiosInstance.post("/auth/cnic/back", formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  logger.debug('CNIC back uploaded:', response.data);
  return response;
};

// CNIC Verification - Submit CNIC
export const submitCNIC = async (cnicNumber) => {
  logger.api('/auth/cnic/submit', 'POST', { cnicNumber });
  const response = await axiosInstance.post("/auth/cnic/submit", { cnicNumber });
  logger.debug('CNIC submitted:', response.data);
  return response;
};

// CNIC Verification - Get Status
export const getCNICStatus = async () => {
  logger.api('/auth/cnic/status', 'GET');
  const response = await axiosInstance.get("/auth/cnic/status");
  logger.debug('CNIC status fetched:', response.data);
  return response;
};

// Admin - Get Pending CNIC Verifications
export const getPendingCNICVerifications = async (page = 1, limit = 10) => {
  logger.api('/auth/admin/cnic/pending', 'GET');
  const response = await axiosInstance.get(`/auth/admin/cnic/pending?page=${page}&limit=${limit}`);
  logger.debug('Pending CNIC verifications fetched:', response.data);
  return response;
};

// Admin - Verify/Reject CNIC
export const verifyCNIC = async (userId, status, rejectionReason = null) => {
  logger.api('/auth/admin/cnic/verify', 'POST', { userId, status, rejectionReason });
  const response = await axiosInstance.post(`/auth/admin/cnic/verify/${userId}`, {
    status,
    rejectionReason
  });
  logger.debug('CNIC verification updated:', response.data);
  return response;
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
  completeProfile,
  googleAuth,
  requestPasswordReset,
  verifyOTP,
  resetPassword,
  uploadCNICFront,
  uploadCNICBack,
  submitCNIC,
  getCNICStatus,
  getPendingCNICVerifications,
  verifyCNIC,
};
