import axios from 'axios';

<<<<<<< HEAD
const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
=======
/**
 * In Vite, environment variables must start with VITE_
 * On Vercel, you will set VITE_API_URL to: https://your-backend.onrender.com/api/
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/',
>>>>>>> ac8d25c (updating code)
  headers: {
    'Content-Type': 'application/json',
  },
});

<<<<<<< HEAD
// 1. Request Interceptor: Attach the Access Token to every request
=======
// 1. Request Interceptor: Attach Access Token
>>>>>>> ac8d25c (updating code)
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

<<<<<<< HEAD
// 2. Response Interceptor: Handle Token Expiration (401 errors)
api.interceptors.response.use(
  (response) => response, // If request is successful, just return it
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already tried to refresh
=======
// 2. Response Interceptor: Silent Token Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 (Unauthorized) and not already retrying
>>>>>>> ac8d25c (updating code)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
<<<<<<< HEAD
          // Attempt to get a new access token from Django SimpleJWT
          const res = await axios.post('http://localhost:8000/api/token/refresh/', {
=======
          // Attempt to get a new access token using the refresh token
          // Note: We use a fresh axios instance to avoid interceptor loops
          const res = await axios.post(`${api.defaults.baseURL}token/refresh/`, {
>>>>>>> ac8d25c (updating code)
            refresh: refreshToken,
          });

          if (res.status === 200) {
            const newAccessToken = res.data.access;
            localStorage.setItem('access_token', newAccessToken);

<<<<<<< HEAD
            // Update the header and retry the original request
=======
            // Update original request headers and retry
>>>>>>> ac8d25c (updating code)
            api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            
            return api(originalRequest);
          }
        } catch (refreshError) {
<<<<<<< HEAD
          // Refresh token is also expired or invalid - log user out
=======
          // Both tokens are invalid - session has truly expired
>>>>>>> ac8d25c (updating code)
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;