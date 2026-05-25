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
    username: credentials.username || credentials.email,
    password: credentials.password,
  });

  // Save auth data
  if (response.data.access) {
    localStorage.setItem("access", response.data.access);
  }

  if (response.data.refresh) {
    localStorage.setItem("refresh", response.data.refresh);
  }

  if (response.data.user) {
    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );
  }

  return response.data;
};

// =========================
// LOGOUT USER
// =========================

export const logoutUser = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
};
