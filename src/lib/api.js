import axios from 'axios';

// Keep the API base URL consistent with the main Axios client.
const API_URL = (import.meta.env.VITE_API_URL || "https://backend-ecommerce-3-2hqt.onrender.com/api").replace(/\/+$/, "");

const api = axios.create({
  baseURL: API_URL,
});

// Attach bearer token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;
