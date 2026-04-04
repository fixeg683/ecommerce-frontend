import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const BACKEND_URL = "https://backend-ecommerce-3-href.onrender.com";

    // Check for token on app load
    useEffect(() => {
        const savedToken = localStorage.getItem('access_token');
        if (savedToken) {
            setToken(savedToken);
            // Optional: You could fetch user profile here to verify token
            setUser(true); 
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${BACKEND_URL}/api/token/`, {
                username: email, // Django SimpleJWT uses 'username' by default
                password: password
            });
            
            if (res.data.access) {
                localStorage.setItem('access_token', res.data.access);
                localStorage.setItem('refresh_token', res.data.refresh);
                setToken(res.data.access);
                setUser(true);
                router.push('/products');
            }
        } catch (error) {
            console.error("Login failed", error);
            alert("Invalid Credentials");
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setToken(null);
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};