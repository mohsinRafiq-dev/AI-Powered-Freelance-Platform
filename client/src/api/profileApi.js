
import axiosInstance from './axiosInstance';
import PROFILE_ENDPOINTS from './endpoints/profile';

export const getMyProfile = async () => {
  const response = await axiosInstance.get(PROFILE_ENDPOINTS.getMyProfile);
  return response.data;
};

export const getUserProfile = async (userId) => {
  const response = await axiosInstance.get(PROFILE_ENDPOINTS.getUserProfile(userId));
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await axiosInstance.put(PROFILE_ENDPOINTS.updateProfile, profileData);
  return response.data;
};

export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  
  const response = await axiosInstance.post(
    PROFILE_ENDPOINTS.uploadAvatar,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export const uploadPortfolioImage = async (file) => {
  const formData = new FormData();
  formData.append('portfolioImage', file);
  
  const response = await axiosInstance.post(
    PROFILE_ENDPOINTS.uploadPortfolioImage,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export const addPortfolioItem = async (portfolioData) => {
  const response = await axiosInstance.post(PROFILE_ENDPOINTS.addPortfolio, portfolioData);
  return response.data;
};

export const updatePortfolioItem = async (portfolioId, portfolioData) => {
  const response = await axiosInstance.put(
    PROFILE_ENDPOINTS.updatePortfolio(portfolioId),
    portfolioData
  );
  return response.data;
};

export const deletePortfolioItem = async (portfolioId) => {
  const response = await axiosInstance.delete(PROFILE_ENDPOINTS.deletePortfolio(portfolioId));
  return response.data;
};

export default {
  getMyProfile,
  getUserProfile,
  updateProfile,
  uploadAvatar,
  uploadPortfolioImage,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
};
