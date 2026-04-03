import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{
      padding: '1rem',
      backgroundColor: '#111827',
      color: 'white',
      display: 'flex',
      gap: '1rem'
    }}>
      <Link to="/" style={{ color: 'white' }}>Home</Link>
      <Link to="/login" style={{ color: 'white' }}>Login</Link>
    </nav>
  );
}

export default Navbar;