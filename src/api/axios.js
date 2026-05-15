import axios from "axios";

const API = axios.create({

  baseURL:
    "https://backend-ecommerce-1-avn4.onrender.com/api/",

  headers: {
    "Content-Type": "application/json",
  },
});


// -----------------------------------
// REQUEST INTERCEPTOR
// -----------------------------------

API.interceptors.request.use(

  (config) => {

    const token =
      localStorage.getItem("token");

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {

    return Promise.reject(error);
  }
);


// -----------------------------------
// RESPONSE INTERCEPTOR
// -----------------------------------

API.interceptors.response.use(

  (response) => response,

  (error) => {

    console.error(
      "API ERROR:",
      error.response || error.message
    );

    return Promise.reject(error);
  }
);

export default API;