import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ FIXED env variable
    const BACKEND_URL =
        import.meta.env.VITE_API_URL ||
        "https://backend-ecommerce-3-href.onrender.com";

    // 🔥 Load user from localStorage
    useEffect(() => {
        const savedToken = localStorage.getItem('access_token');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }

        setLoading(false);
    }, []);

    // ✅ LOGIN
    const login = async (email, password) => {
        try {
            const res = await axios.post(`${BACKEND_URL}/api/token/`, {
                username: email,
                password: password,
            });

            const { access, refresh } = res.data;

            if (!access) throw new Error("No access token returned");

            // ✅ store tokens
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);

            // ✅ store user
            const userData = { email };
            localStorage.setItem('user', JSON.stringify(userData));

            setToken(access);
            setUser(userData);

            // 🔥 IMPORTANT: return success
            return { success: true, user: userData };

        } catch (error) {
            console.error("Login failed:", error);

            // 🔥 CLEAN error handling
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

    // ✅ SIGNUP
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

            if (error.response) {
                throw new Error(
                    error.response.data?.message || "Signup failed"
                );
            }

            throw new Error("Network error. Please try again.");
        }
    };

    // ✅ LOGOUT
    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');

        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, token, login, signup, logout, loading }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);