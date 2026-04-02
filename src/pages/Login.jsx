import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-md border">
      <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input 
            type="email" 
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="example@gmail.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input 
            type="password" 
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="••••••••"
          />
        </div>
        <button className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition">
          Login
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account? <Link to="/signup" className="text-green-600 font-bold">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;