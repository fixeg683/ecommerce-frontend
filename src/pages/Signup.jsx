import React from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';

const Signup = () => {
  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border-2 border-green-500">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">Create Account</h2>
        <p className="text-center text-gray-500 mb-8 font-medium">Join the E-Space community</p>
        
        <form className="space-y-5">
          {/* Full Name */}
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="text" 
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none transition" 
              placeholder="Full Name" 
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="email" 
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none transition" 
              placeholder="Email address" 
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="password" 
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none transition" 
              placeholder="Password (min 8 characters)" 
            />
          </div>

          <button className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transform active:scale-95 transition-all">
            Register Now
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;