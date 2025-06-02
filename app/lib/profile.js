import api from './api';

export const getProfile = async () => {
  try {
    const response = await api.get('/v1/user/');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch profile');
  }
};

export const updateProfile = async (data) => {
  try {
    const response = await api.patch('/v1/user/update', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

// Replace your current requestEmailVerification with this:
export const requestEmailVerification = async () => {
  try {
    const response = await api.post('/v1/user/verify-email/request'); // Add the endpoint here
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to request verification');
  }
};

// Add this to your API file where you have requestEmailVerification
export const verifyEmailWithToken = async (token) => {
  try {
    const response = await api.post(`/v1/user/verify-email/${token}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to verify email');
  }
};

export const getAddresses = async () => {
  try {
    const response = await api.get('/v1/user/addresses');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch addresses');
  }
};

export const addAddress = async (data) => {
  try {
    const response = await api.post('/v1/user/addresses', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add address');
  }
};

export const updateAddress = async (id, data) => {
  try {
    const response = await api.put(`/v1/user/addresses/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update address');
  }
};

export const deleteAddress = async (id) => {
  try {
    const response = await api.delete(`/v1/user/addresses/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete address');
  }
};