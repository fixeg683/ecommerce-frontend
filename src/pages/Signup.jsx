import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios'; // Use your custom instance!

function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Using 'api' automatically uses your Render URL
      await api.post('/register/', formData); 
      alert('Signup successful! Please login.');
      navigate('/login');
    } catch (error) {
      const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : 'Connection failed';
      alert('Signup failed: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ 
        padding: '2.5rem', 
        backgroundColor: 'white', 
        borderRadius: '16px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)', 
        width: '100%', 
        maxWidth: '400px', 
        textAlign: 'center',
        border: '1px solid #e5e7eb'
      }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '1rem' }}>Create Account</h1>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input 
            type="text" name="name" placeholder="Full Name" onChange={handleChange} required 
            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }} 
          />
          <input 
            type="email" name="email" placeholder="Email Address" onChange={handleChange} required 
            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }} 
          />
          <input 
            type="password" name="password" placeholder="Create Password" onChange={handleChange} required 
            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px' }} 
          />
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', padding: '14px', 
              backgroundColor: loading ? '#9ca3af' : '#16a34a', 
              color: 'white', border: 'none', borderRadius: '8px', 
              fontWeight: '700', cursor: 'pointer', marginTop: '10px' 
            }}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', fontSize: '14px', color: '#4b5563' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#16a34a', fontWeight: '700', textDecoration: 'none' }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;