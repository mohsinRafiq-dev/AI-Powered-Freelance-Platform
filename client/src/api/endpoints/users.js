const USERS_ENDPOINTS = {
  // Profile Management
  GET_PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile',
  UPDATE_AVATAR: '/users/profile/avatar',
  UPDATE_PASSWORD: '/users/profile/password',
  DELETE_ACCOUNT: '/users/profile/delete',
  
  // User Discovery
  GET_FREELANCERS: '/users/freelancers',
  GET_FREELANCER_BY_ID: (id) => `/users/freelancers/${id}`,
  SEARCH_FREELANCERS: '/users/freelancers/search',
  
  // Portfolio
  ADD_PORTFOLIO_ITEM: '/users/portfolio/add',
  UPDATE_PORTFOLIO_ITEM: (id) => `/users/portfolio/${id}`,
  DELETE_PORTFOLIO_ITEM: (id) => `/users/portfolio/${id}`,
  GET_PORTFOLIO: '/users/portfolio',
  
  // Skills & Experience
  ADD_SKILL: '/users/skills/add',
  REMOVE_SKILL: (skill) => `/users/skills/${skill}/remove`,
  UPDATE_SKILLS: '/users/skills',
  ADD_EXPERIENCE: '/users/experience/add',
  UPDATE_EXPERIENCE: (id) => `/users/experience/${id}`,
  DELETE_EXPERIENCE: (id) => `/users/experience/${id}`,
  
  // Reviews & Ratings
  GET_USER_REVIEWS: (id) => `/users/${id}/reviews`,
  ADD_REVIEW: (id) => `/users/${id}/reviews`,
  GET_RATING_STATS: (id) => `/users/${id}/rating-stats`,
  
  // Notifications Settings
  GET_NOTIFICATION_SETTINGS: '/users/settings/notifications',
  UPDATE_NOTIFICATION_SETTINGS: '/users/settings/notifications',
  
  // Preferences
  GET_PREFERENCES: '/users/preferences',
  UPDATE_PREFERENCES: '/users/preferences',
};

export default USERS_ENDPOINTS;
