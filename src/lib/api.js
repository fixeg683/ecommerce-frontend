import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://backend-ecommerce-1-avn4.onrender.com";

const api = axios.create({
  baseURL: API_URL,
});

// 🔥 Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔥 Auto refresh token when expired
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem('refresh_token');

        const res = await axios.post(`${API_URL}/api/token/refresh/`, {
          refresh,
        });

        const newAccess = res.data.access;

        localStorage.setItem('access_token', newAccess);

        // retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);

      } catch (err) {
        // refresh failed → logout
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;