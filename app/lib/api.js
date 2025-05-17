import axios from 'axios';

const BASE_URL = 'http://69.62.85.32:5000'; // Hardcoded API URL

const api = axios.create({
  baseURL: BASE_URL || 'http://localhost:3000/',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized request.'); // Don't redirect
    }

    return Promise.reject(error);
  }
);

export default api;
