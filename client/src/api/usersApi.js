import axiosInstance from './axiosInstance';
import { USERS_ENDPOINTS } from './endpoints';

const usersApi = {
  // Profile Management
  getProfile: async () => {
    const response = await axiosInstance.get(USERS_ENDPOINTS.GET_PROFILE);
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await axiosInstance.put(USERS_ENDPOINTS.UPDATE_PROFILE, profileData);
    return response.data;
  },

  updateAvatar: async (formData) => {
    const response = await axiosInstance.post(USERS_ENDPOINTS.UPDATE_AVATAR, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updatePassword: async (passwordData) => {
    const response = await axiosInstance.put(USERS_ENDPOINTS.UPDATE_PASSWORD, passwordData);
    return response.data;
  },

  deleteAccount: async () => {
    const response = await axiosInstance.delete(USERS_ENDPOINTS.DELETE_ACCOUNT);
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  },

  getFreelancerById: async (id) => {
    const response = await axiosInstance.get(USERS_ENDPOINTS.GET_FREELANCER_BY_ID(id));
    return response.data;
  },

  searchFreelancers: async (query, params = {}) => {
    const response = await axiosInstance.get(USERS_ENDPOINTS.SEARCH_FREELANCERS, { 
      params: { q: query, ...params } 
    });
    return response.data;
  },

  // Portfolio
  addPortfolioItem: async (itemData) => {
    const response = await axiosInstance.post(USERS_ENDPOINTS.ADD_PORTFOLIO_ITEM, itemData);
    return response.data;
  },

  updatePortfolioItem: async (id, itemData) => {
    const response = await axiosInstance.put(USERS_ENDPOINTS.UPDATE_PORTFOLIO_ITEM(id), itemData);
    return response.data;
  },

  deletePortfolioItem: async (id) => {
    const response = await axiosInstance.delete(USERS_ENDPOINTS.DELETE_PORTFOLIO_ITEM(id));
    return response.data;
  },

  getPortfolio: async () => {
    const response = await axiosInstance.get(USERS_ENDPOINTS.GET_PORTFOLIO);
    return response.data;
  },

  // Skills & Experience
  addSkill: async (skill) => {
    const response = await axiosInstance.post(USERS_ENDPOINTS.ADD_SKILL, { skill });
    return response.data;
  },

  removeSkill: async (skill) => {
    const response = await axiosInstance.delete(USERS_ENDPOINTS.REMOVE_SKILL(skill));
    return response.data;
  },

  updateSkills: async (skills) => {
    const response = await axiosInstance.put(USERS_ENDPOINTS.UPDATE_SKILLS, { skills });
    return response.data;
  },

  addExperience: async (experienceData) => {
    const response = await axiosInstance.post(USERS_ENDPOINTS.ADD_EXPERIENCE, experienceData);
    return response.data;
  },

  updateExperience: async (id, experienceData) => {
    const response = await axiosInstance.put(USERS_ENDPOINTS.UPDATE_EXPERIENCE(id), experienceData);
    return response.data;
  },

  deleteExperience: async (id) => {
    const response = await axiosInstance.delete(USERS_ENDPOINTS.DELETE_EXPERIENCE(id));
    return response.data;
  },

  // Reviews & Ratings
  getUserReviews: async (id, params = {}) => {
    const response = await axiosInstance.get(USERS_ENDPOINTS.GET_USER_REVIEWS(id), { params });
    return response.data;
  },

  addReview: async (id, reviewData) => {
    const response = await axiosInstance.post(USERS_ENDPOINTS.ADD_REVIEW(id), reviewData);
    return response.data;
  },

  getRatingStats: async (id) => {
    const response = await axiosInstance.get(USERS_ENDPOINTS.GET_RATING_STATS(id));
    return response.data;
  },

  // Settings
  getNotificationSettings: async () => {
    const response = await axiosInstance.get(USERS_ENDPOINTS.GET_NOTIFICATION_SETTINGS);
    return response.data;
  },

  updateNotificationSettings: async (settings) => {
    const response = await axiosInstance.put(USERS_ENDPOINTS.UPDATE_NOTIFICATION_SETTINGS, settings);
    return response.data;
  },

  getPreferences: async () => {
    const response = await axiosInstance.get(USERS_ENDPOINTS.GET_PREFERENCES);
    return response.data;
  },

  updatePreferences: async (preferences) => {
    const response = await axiosInstance.put(USERS_ENDPOINTS.UPDATE_PREFERENCES, preferences);
    return response.data;
  },
};

export default usersApi;
