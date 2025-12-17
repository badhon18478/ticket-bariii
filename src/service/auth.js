import api from './api';

export const getUserRole = async email => {
  try {
    const response = await api.get(`/auth/role?email=${email}`);
    return response.data.role;
  } catch (error) {
    console.error('Error fetching user role:', error);
    throw error;
  }
};

export const updateUserRole = async (email, role) => {
  try {
    const response = await api.put('/auth/role', { email, role });
    return response.data;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};
