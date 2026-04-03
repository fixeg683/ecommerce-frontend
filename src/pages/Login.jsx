import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Connects to your Render Backend
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/login/`, {
        email,
        password,
      });
      
      // Save the JWT token (Supabase/Django auth)
      localStorage.setItem('access_token', response.data.access);
      alert('Login Successful!');
      navigate('/'); // Go to Home
    } catch (error) {
      alert('Login Failed: ' + (error.response?.data?.detail || 'Error'));
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6' }}>
      <form onSubmit={handleLogin} style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', width: '300px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '1rem' }}>Login Page</h1>
        <input 
          type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px' }} 
        />
        <input 
          type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
          style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px' }} 
        />
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Login
        </button>
        <p style={{ marginTop: '1rem', fontSize: '14px' }}>
          New here? <a href="/signup" style={{ color: '#2563eb' }}>Create Account</a>
        </p>
      </form>
    </div>
  );
}

export default Login;