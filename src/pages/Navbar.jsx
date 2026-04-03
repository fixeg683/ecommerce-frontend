import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, Store, User } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-green-600 font-bold text-2xl">
            <Store size={28} />
            <span>E-Space</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-green-600 font-medium">Shop</Link>
            <Link to="/cart" className="flex items-center gap-1 text-gray-600 hover:text-green-600 font-medium">
              <ShoppingCart size={20} />
              <span>Cart</span>
              <span className="bg-red-500 text-white text-xs rounded-full px-1.5 ml-0.5">0</span>
            </Link>
            <Link to="/login" className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition font-bold shadow-sm">
              <User size={18} />
              Login
            </Link>
          </div>

          {/* Mobile Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 p-2">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl p-4 space-y-4">
          <Link to="/" onClick={() => setIsOpen(false)} className="block text-gray-700 font-medium py-2">Shop</Link>
          <Link to="/cart" onClick={() => setIsOpen(false)} className="block text-gray-700 font-medium py-2">Cart (0)</Link>
          <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center bg-green-600 text-white py-3 rounded-xl font-bold">
            Login / Signup
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;