import { createContext, useContext, useEffect, useState } from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
} from "../services/authService";

// Extracts a human-readable message from any Django REST Framework error response
const parseDRFError = (error, fallback = 'Something went wrong') => {
  const data = error?.response?.data;
  if (!data) return error?.message || fallback;

  // Flat string fields: { detail: "..." } or { message: "..." }
  if (typeof data === 'string') return data;
  if (data.detail) return data.detail;
  if (data.message) return data.message;

  // Field-level validation errors: { password: ["too short"], username: ["taken"] }
  if (typeof data === 'object') {
    const messages = Object.entries(data)
      .map(([field, errors]) => {
        const msg = Array.isArray(errors) ? errors.join(' ') : String(errors);
        // Capitalise field name for readability: "password" → "Password"
        const label = field.charAt(0).toUpperCase() + field.slice(1);
        return `${label}: ${msg}`;
      })
      .join(' • ');
    if (messages) return messages;
  }

  return fallback;
};

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

  const login = async (email, password) => {
    try {
      const data = await loginUser({
        email,
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
        message: parseDRFError(error, 'Login failed'),
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
        formData.email,
        formData.password
      );

      return loginResult;
    } catch (error) {
      return {
        success: false,
        message: parseDRFError(error, 'Registration failed'),
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