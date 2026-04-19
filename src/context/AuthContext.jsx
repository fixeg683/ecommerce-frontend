import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    const BACKEND_URL =
        import.meta.env.VITE_API_URL ||
        'https://backend-ecommerce-3-href.onrender.com';

    useEffect(() => {
        const savedToken = localStorage.getItem('access_token');
        const savedUser = localStorage.getItem('user');
        if (savedToken && savedUser) {
            try {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
            } catch {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
            }
        }
        setAuthLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            // /api/token/ expects { username, password }
            const res = await axios.post(`${BACKEND_URL}/api/token/`, {
                username,   // must be the actual username, NOT email
                password,
            });
            const { access, refresh } = res.data;
            if (!access) throw new Error('No access token returned');

            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);

            const userData = { username };
            localStorage.setItem('user', JSON.stringify(userData));
            setToken(access);
            setUser(userData);

            return { success: true, user: userData };
        } catch (error) {
            if (error.response) {
                throw new Error(
                    error.response.data?.detail ||
                    error.response.data?.message ||
                    'Invalid credentials'
                );
            }
            throw new Error('Network error. Please try again.');
        }
    };

    const signup = async (username, email, password) => {
        try {
            // Register with username (not email) as the unique identifier
            await axios.post(`${BACKEND_URL}/api/register/`, {
                username,   // the chosen username
                email,
                password,
            });
            return { success: true };
        } catch (error) {
            if (error.response) {
                const data = error.response.data;
                throw new Error(
                    data?.detail ||
                    data?.message ||
                    Object.values(data).flat().join(' ')
                );
            }
            throw new Error('Network error. Please try again.');
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = !!token || !!localStorage.getItem('access_token');

    return (
        <AuthContext.Provider value={{
            user, token, login, signup, logout,
            authLoading,
            isAuthenticated,
            loading: authLoading, // alias for legacy usage
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
