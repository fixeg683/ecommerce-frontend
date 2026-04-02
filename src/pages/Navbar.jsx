import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Store } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-green-600 flex items-center gap-2">
          <Store size={28} />
          E-Soko
        </Link>

        {/* Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="text-gray-600 hover:text-green-600 font-medium">Shop</Link>
          
          <Link to="/cart" className="relative text-gray-600 hover:text-green-600">
            <ShoppingCart size={24} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
          </Link>

          <Link to="/login" className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
            <User size={18} />
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;