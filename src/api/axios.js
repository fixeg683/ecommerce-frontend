import axios from "axios";

const BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "https://backend-ecommerce-1-avn4.onrender.com"
).replace(/\/+$/, "");

const API = axios.create({
  baseURL: `${BASE_URL}/api/`,
  headers: {
    "Content-Type": "application/json",
  },
});


// -----------------------------------
// REQUEST INTERCEPTOR — attach token
// -----------------------------------

API.interceptors.request.use(
  (config) => {
    // Key must match what AuthContext.login() saves: "access_token"
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// -----------------------------------
// RESPONSE INTERCEPTOR — auto refresh
// -----------------------------------

API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // 401 + not already retried → attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh_token");
        if (!refresh) throw new Error("No refresh token");

        const res = await axios.post(`${BASE_URL}/api/token/refresh/`, {
          refresh,
        });

        const newAccess = res.data.access;
        localStorage.setItem("access_token", newAccess);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return API(originalRequest);

      } catch (refreshError) {
        // Refresh failed — clear auth and redirect to login
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    console.error("API ERROR:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default API;