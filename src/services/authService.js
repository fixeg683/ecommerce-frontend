import API from "../api/axios";

// =========================
// REGISTER
// =========================

export const registerUser = async (userData) => {
  const response = await API.post("register/", userData);
  return response.data;
};

// =========================
// LOGIN
// =========================

export const loginUser = async (credentials) => {
  const response = await API.post("login/", credentials);

  // Save token + user
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
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
// LOGOUT
// =========================

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
