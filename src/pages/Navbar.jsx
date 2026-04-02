import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Store, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl md:text-2xl font-bold text-green-600 flex items-center gap-2">
          <Store size={28} />
          <span>Digital Products</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-600 hover:text-green-600 font-medium">Shop</Link>
          <Link to="/cart" className="relative text-gray-600 hover:text-green-600">
            <ShoppingCart size={24} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
          </Link>
          <Link to="/login" className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition font-semibold">
            <User size={18} />
            Login
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button className="md:hidden text-gray-600" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-4 shadow-lg animate-in slide-in-from-top">
          <Link to="/" onClick={() => setIsOpen(false)} className="block text-gray-600 font-medium py-2">Shop</Link>
          <Link to="/cart" onClick={() => setIsOpen(false)} className="block text-gray-600 font-medium py-2">Cart (0)</Link>
          <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center bg-green-600 text-white py-3 rounded-lg font-bold">
            Login / Signup
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;