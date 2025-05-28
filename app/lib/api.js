import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", //process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    console.log("🔥 API Request:", {
      fullUrl: config.baseURL + config.url,
      method: config.method?.toUpperCase(),
      data: config.data,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized request."); // Don't redirect
    }

    return Promise.reject(error);
  }
);

export default api;
