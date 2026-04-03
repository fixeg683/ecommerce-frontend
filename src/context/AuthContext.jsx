import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setAuthLoading(false);
      return;
    }

    api.get('/users/me/')
      .then(res => {
        setUser(res.data);
      })
      .catch(async (err) => {
        const status = err.response?.status;

        if (status === 401) {
          // Token expired — try refresh before logging out
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            try {
              const res = await api.post('/token/refresh/', { refresh: refreshToken });
              localStorage.setItem('access_token', res.data.access);
              // Retry fetching user with new token
              const userRes = await api.get('/users/me/');
              setUser(userRes.data);
              return; // success — don't log out
            } catch {
              // Refresh also failed — now it's safe to log out
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              setUser(null);
            }
          } else {
            localStorage.removeItem('access_token');
            setUser(null);
          }
        } else {
          // Network error, 500, cold boot timeout etc.
          // DON'T log out — keep the token, assume backend is waking up
          // Restore user from token payload as fallback
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUser({
              id: payload.user_id,
              email: payload.email || '',
              name: payload.name || payload.email || 'User',
              username: payload.username || payload.email || '',
            });
          } catch {
            // Token unreadable but don't log out — just leave user as null
            // They'll be redirected by ProtectedRoute only if truly unauthenticated
          }
        }
      })
      .finally(() => {
        setAuthLoading(false);
      });
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/token/', { username: email, password });
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    const userRes = await api.get('/users/me/');
    setUser(userRes.data);
    navigate('/');
  };

  const signup = async (name, email, password) => {
    await api.post('/register/', { name, email, password });
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{
      user,
      authLoading,
      isAuthenticated: !!localStorage.getItem('access_token'), // ← token-based, not user-based
      login,
      signup,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};