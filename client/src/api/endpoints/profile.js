const PROFILE_ENDPOINTS = {
  // Get current user's profile
  getMyProfile: "/profile/me",
  
  // Get any user's profile by ID
  getUserProfile: (userId) => `/profile/${userId}`,
  
  // Update current user's profile
  updateProfile: "/profile",
  
  // Upload avatar
  uploadAvatar: "/profile/avatar",
  
  // Upload portfolio image
  uploadPortfolioImage: "/profile/portfolio/upload",
  
  // Portfolio management (Freelancer only)
  addPortfolio: "/profile/portfolio",
  updatePortfolio: (portfolioId) => `/profile/portfolio/${portfolioId}`,
  deletePortfolio: (portfolioId) => `/profile/portfolio/${portfolioId}`,
};

export default PROFILE_ENDPOINTS;
