import API from "../api/axios";

// =========================
// REGISTER USER
// =========================

export const registerUser = async (userData) => {
  const response = await API.post("register/", userData);
  return response.data;
};

// =========================
// LOGIN USER
// =========================

export const loginUser = async (credentials) => {
  const response = await API.post("token/", {
    username: credentials.username,
    password: credentials.password,
  });

  if (response.data.access) {
    localStorage.setItem("access", response.data.access);
  }

  if (response.data.refresh) {
    localStorage.setItem("refresh", response.data.refresh);
  }

  const user = response.data.user || {
    username: credentials.username,
  };

  localStorage.setItem("user", JSON.stringify(user));

  return {
    ...response.data,
    user,
  };
};

// =========================
// LOGOUT USER
// =========================

export const logoutUser = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
};
