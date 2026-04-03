import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API Call to Django
      await axios.post(`${import.meta.env.VITE_API_URL}/api/register/`, formData);
      alert('Signup successful! Please login.');
      navigate('/login');
    } catch (error) {
      alert('Signup failed: ' + JSON.stringify(error.response?.data));
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6' }}>
      <div style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', width: '320px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '1rem' }}>Create Account</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px' }} />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px' }} />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '5px' }} />
          <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Sign Up
          </button>
        </form>
        <p style={{ marginTop: '1rem', fontSize: '14px' }}>
          Already have an account? <a href="/login" style={{ color: '#2563eb' }}>Login</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;