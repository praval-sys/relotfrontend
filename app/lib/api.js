// src/api/api.ts
import axios from 'axios';

// Create Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/', // your backend URL
  withCredentials: true, // IMPORTANT because you use cookie-based auth
});

// Intercept request to add Authorization header if token exists
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Intercept responses
api.interceptors.response.use(
  (response) => {
    // If the server sent a new access token in headers, update it
    const newAccessToken = response.headers['authorization']?.split(' ')[1]; // Authorization: Bearer <token>
    if (newAccessToken) {
      console.log('Updating token from response header:', newAccessToken);
      localStorage.setItem('accessToken', newAccessToken);
    }
    return response;
  },
  async (error) => {
    // Optional: handle other errors like 401, etc
    return Promise.reject(error);
  }
);

export default api;
