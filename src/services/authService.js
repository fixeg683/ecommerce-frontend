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
  const response = await API.post("login/", credentials);

  // Save auth data
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
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
  localStorage.removeItem("token");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
};
