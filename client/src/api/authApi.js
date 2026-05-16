import axiosInstance from "./axiosInstance";
import * as authEndpoints from "./endpoints/auth";

// Re-export all auth endpoints for backward compatibility
export const register = authEndpoints.register;
export const login = authEndpoints.login;
export const logout = authEndpoints.logout;
export const me = authEndpoints.getCurrentUser;
export const completeProfile = authEndpoints.completeProfile;
export const googleAuth = authEndpoints.googleAuth;

// Export axios instance as default
export default axiosInstance;
