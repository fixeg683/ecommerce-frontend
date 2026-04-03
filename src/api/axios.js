import axios from 'axios';

/**
 * In Vite, environment variables must start with VITE_
 * On Vercel, set VITE_API_URL to: https://backend-ecommerce-3-href.onrender.com
 */
const api = axios.create({
  // Ensure we don't double up on /api/ if it's already in the Env variable
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Request Interceptor: Attach Access Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor: Silent Token Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 means the access token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          // Use the absolute URL for the refresh to avoid base complications
          const refreshUrl = `${api.defaults.baseURL}/api/token/refresh/`;
          
          const res = await axios.post(refreshUrl, {
            refresh: refreshToken,
          });

          if (res.status === 200) {
            const newAccessToken = res.data.access;
            localStorage.setItem('access_token', newAccessToken);

            // Re-run the failed request with the NEW token
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          // Refresh token also expired - force logout
          console.warn("Session expired. Logging out.");
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;