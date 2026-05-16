import axiosInstance from '../axiosInstance';

const userManagementApi = {
  // Get all users with filters
  getUsers: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });
    
    const response = await axiosInstance.get(`/admin/users?${params.toString()}`);
    return response.data;
  },

  // Get user by ID
  getUserById: async (userId) => {
    const response = await axiosInstance.get(`/admin/users/${userId}`);
    return response.data;
  },

  // Suspend user
  suspendUser: async (userId, reason) => {
    console.log('API: Suspending user', { userId, reason });
    const response = await axiosInstance.put(`/admin/users/${userId}/suspend`, { reason });
    console.log('API: Suspend response', response.data);
    return response.data;
  },

  // Ban user
  banUser: async (userId, reason) => {
    console.log('API: Banning user', { userId, reason });
    const response = await axiosInstance.put(`/admin/users/${userId}/ban`, { reason });
    console.log('API: Ban response', response.data);
    return response.data;
  },

  // Activate user
  activateUser: async (userId) => {
    const response = await axiosInstance.put(`/admin/users/${userId}/activate`);
    return response.data;
  },

  // Get user activity
  getUserActivity: async (userId) => {
    const response = await axiosInstance.get(`/admin/users/${userId}/activity`);
    return response.data;
  },

  // Export users
  exportUsers: async (filters = {}, format = 'excel') => {
    const params = new URLSearchParams({ ...filters, format });
    
    const response = await axiosInstance.post(
      `/admin/users/export?${params.toString()}`,
      {},
      { responseType: 'blob' }
    );
    
    return response.data;
  },
};

export default userManagementApi;
