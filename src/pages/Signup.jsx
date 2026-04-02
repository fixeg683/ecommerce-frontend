import React from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-md border">
      <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input type="text" className="w-full mt-1 p-2 border rounded-lg" placeholder="John Doe" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" className="w-full mt-1 p-2 border rounded-lg" placeholder="example@gmail.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" className="w-full mt-1 p-2 border rounded-lg" placeholder="Min 8 characters" />
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition">
          Register
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account? <Link to="/login" className="text-blue-600 font-bold">Login</Link>
      </p>
    </div>
  );
};

export default Signup;