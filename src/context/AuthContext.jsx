import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Changed from 'next/router'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Changed from useRouter()

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://backend-ecommerce-3-href.onrender.com";

    useEffect(() => {
        const savedToken = localStorage.getItem('access_token');
        if (savedToken) {
            setToken(savedToken);
            // Assuming token is valid for simplicity; 
            // In production, you'd decode this or verify with backend.
            setUser({ username: "User" }); 
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${BACKEND_URL}/api/token/`, {
                username: email,
                password: password
            });
            
            if (res.data.access) {
                localStorage.setItem('access_token', res.data.access);
                localStorage.setItem('refresh_token', res.data.refresh);
                setToken(res.data.access);
                setUser({ username: email });
                navigate('/'); // Redirect to Home
            }
        } catch (error) {
            console.error("Login failed", error);
            throw error; // Let the UI handle the error message
        }
    };

    const signup = async (name, email, password) => {
        try {
            // Adjust this URL based on your actual Django signup endpoint
            await axios.post(`${BACKEND_URL}/api/register/`, {
                username: email,
                email: email,
                password: password,
                first_name: name
            });
            // Automatically log in or redirect to login page
            navigate('/login');
        } catch (error) {
            console.error("Signup failed", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setToken(null);
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for easier usage
export const useAuth = () => useContext(AuthContext);