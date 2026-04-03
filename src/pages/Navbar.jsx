import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const { cart } = useCart();
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-green-600">E-Soko</Link>

      <div className="flex gap-6 items-center">
        {isAuthenticated ? (
          <>
            <Link to="/" className="text-sm text-gray-600 hover:text-green-600 font-medium">
              Shop
            </Link>
            <Link to="/cart" className="relative text-sm text-gray-600 hover:text-green-600 font-medium">
              🛒 Cart
              {cart.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 absolute -top-2 -right-4">
                  {cart.length}
                </span>
              )}
            </Link>
            <span className="text-sm text-gray-400 hidden sm:block">
              {user?.name || user?.email}
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 font-medium transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm text-gray-600 hover:text-green-600 font-medium">
              Login
            </Link>
            <Link
              to="/signup"
              className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium transition"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;