import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ShoppingCart, LogOut, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { totalItems, setCartOpen } = useCart();

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link to="/" className="text-2xl font-black text-green-600 tracking-tighter">
            E-Space
          </Link>

          {/* Nav Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-green-600 font-medium transition text-sm"
            >
              Product List
            </Link>

            {user && (
              <>
                {/* Cart icon — opens drawer */}
                <button
                  onClick={() => setCartOpen(true)}
                  className="relative text-gray-600 hover:text-green-600 transition"
                >
                  <ShoppingCart size={22} />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>

                {/* User */}
                <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                  <User size={16} className="text-gray-400" />
                  <span className="hidden sm:block font-medium truncate max-w-[100px]">
                    {user.email || user.username}
                  </span>
                </div>

                {/* Logout */}
                <button
                  onClick={logout}
                  className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition text-sm font-medium"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </>
            )}

            {!user && (
              <>
                <Link to="/login" className="text-gray-600 hover:text-green-600 font-medium text-sm">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition text-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;