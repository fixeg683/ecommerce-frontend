import { createContext, useContext, useEffect, useState } from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
} from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD USER
  // =========================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // =========================
  // LOGIN
  // =========================

  const login = async (username, password) => {
    try {
      const data = await loginUser({
        username,
        password,
      });

      if (data.user) {
        setUser(data.user);
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Login failed",
      };
    }
  };

  // =========================
  // REGISTER
  // =========================

  const register = async (formData) => {
    try {
      await registerUser(formData);

      // AUTO LOGIN AFTER REGISTER
      const loginResult = await login(
        formData.username,
        formData.password
      );

      return loginResult;
    } catch (error) {
      return {
        success: false,
        message:
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Registration failed",
      };
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authLoading: loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
