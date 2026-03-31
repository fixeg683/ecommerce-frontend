import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Request Interceptor: Attach the Access Token to every request
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

// 2. Response Interceptor: Handle Token Expiration (401 errors)
api.interceptors.response.use(
  (response) => response, // If request is successful, just return it
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          // Attempt to get a new access token from Django SimpleJWT
          const res = await axios.post('http://localhost:8000/api/token/refresh/', {
            refresh: refreshToken,
          });

          if (res.status === 200) {
            const newAccessToken = res.data.access;
            localStorage.setItem('access_token', newAccessToken);

            // Update the header and retry the original request
            api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            
            return api(originalRequest);
          }
        } catch (refreshError) {
          // Refresh token is also expired or invalid - log user out
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