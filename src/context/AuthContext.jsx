import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [authLoading, setAuthLoading] = useState(true); // ← renamed

    const BACKEND_URL =
        import.meta.env.VITE_API_URL ||
        "https://backend-ecommerce-3-href.onrender.com";

    // Restore session from localStorage on mount
    useEffect(() => {
        const savedToken = localStorage.getItem('access_token');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser) {
            try {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
            } catch {
                // Corrupted data — clear it
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
            }
        }

        setAuthLoading(false); // ← always unblock after check
    }, []);

    // LOGIN
    const login = async (email, password) => {
        try {
            const res = await axios.post(`${BACKEND_URL}/api/token/`, {
                username: email,
                password: password,
            });

            const { access, refresh } = res.data;
            if (!access) throw new Error("No access token returned");

            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);

            const userData = { email };
            localStorage.setItem('user', JSON.stringify(userData));

            setToken(access);
            setUser(userData);

            return { success: true, user: userData };

        } catch (error) {
            console.error("Login failed:", error);

            if (error.response) {
                const message =
                    error.response.data?.detail ||
                    error.response.data?.message ||
                    "Invalid credentials";
                throw new Error(message);
            }

            throw new Error("Network error. Please try again.");
        }
    };

    // SIGNUP
    const signup = async (name, email, password) => {
        try {
            await axios.post(`${BACKEND_URL}/api/register/`, {
                username: email,
                email: email,
                password: password,
                first_name: name,
            });

            return { success: true };

        } catch (error) {
            console.error("Signup failed:", error);

            if (error.response?.data) {
                // Surface actual Django validation errors
                const data = error.response.data;
                const message =
                    data.detail ||
                    data.message ||
                    Object.values(data).flat().join(' ');
                throw new Error(message);
            }

            throw new Error("Network error. Please try again.");
        }
    };

    // LOGOUT
    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    // ✅ isAuthenticated derived from token in state OR localStorage
    const isAuthenticated = !!token || !!localStorage.getItem('access_token');

    return (
        <AuthContext.Provider
            value={{ user, token, login, signup, logout, authLoading, isAuthenticated }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);