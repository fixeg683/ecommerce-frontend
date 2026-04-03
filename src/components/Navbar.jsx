import { Link } from 'react-router-dom';
import { ShoppingCart, LogOut, Store } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { cart } = useCart();
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Store className="text-green-600" size={24} />
          <span className="text-2xl font-black text-green-600">E-Soko</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link to="/" className="text-sm text-gray-600 hover:text-green-600 font-medium transition">
                Shop
              </Link>

              <Link to="/cart" className="relative flex items-center gap-1.5 text-sm text-gray-600 hover:text-green-600 font-medium transition">
                <ShoppingCart size={18} />
                Cart
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Link>

              <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                <span className="text-sm text-gray-400 hidden sm:block truncate max-w-[120px]">
                  {user?.name || user?.email}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 font-medium transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-green-600 font-medium transition">
                Login
              </Link>
              <Link to="/signup" className="text-sm bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2 rounded-lg transition">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;