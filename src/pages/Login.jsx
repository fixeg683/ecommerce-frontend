import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios'; // Ensure this points to your custom axios file

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Connects to your Django Backend on Render
      // Path usually matches your urls.py (e.g., api/token/ or api/login/)
      const response = await api.post('/token/', {
        email: email,
        password: password,
      });

      // 1. Store both tokens for the interceptor to use
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      // 2. Redirect to Home on success
      navigate('/');
      window.location.reload(); // Force refresh to update Navbar state
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.detail || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent' // Let App.jsx handle the main bg
    }}>
      <div style={{
        padding: '2.5rem',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        border: '1px solid #e5e7eb',
        width: '100%',
        maxWdith: '400px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#111827', marginBottom: '0.5rem' }}>
          Welcome Back
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '14px' }}>
          Log in to your E-Soko account
        </p>

        {error && (
          <div style={{ 
            backgroundColor: '#fef2f2', 
            color: '#dc2626', 
            padding: '10px', 
            borderRadius: '8px', 
            marginBottom: '1rem', 
            fontSize: '13px',
            border: '1px solid #fee2e2'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', marginLeft: '4px' }}>Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                marginTop: '4px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#374151', marginLeft: '4px' }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                marginTop: '4px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none',
                fontSize: '14px'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: loading ? '#9ca3af' : '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '10px',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', borderTop: '1px solid #f3f4f6', paddingTop: '1.5rem' }}>
          <p style={{ fontSize: '14px', color: '#4b5563' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ 
              color: '#16a34a', 
              fontWeight: '700', 
              textDecoration: 'none' 
            }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;