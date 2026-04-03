import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  // On mount, check if a valid token exists
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Fetch current user profile to confirm token is valid
      api.get('/users/me/')
        .then(res => setUser(res.data))
        .catch(() => {
          // Token invalid/expired — clear storage
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setUser(null);
        })
        .finally(() => setAuthLoading(false));
    } else {
      setAuthLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/token/', { email, password });
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    // Fetch user profile after login
    const userRes = await api.get('/users/me/');
    setUser(userRes.data);
    navigate('/');
  };

  const signup = async (name, email, password) => {
    await api.post('/register/', { name, email, password });
    // Auto-login after signup
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    navigate('/login');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, authLoading, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};