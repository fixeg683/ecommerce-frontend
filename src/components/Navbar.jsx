import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ShoppingCart, LogOut, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useCart();

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo - Changed to E-Space */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-black text-green-600 tracking-tighter">
              E-Space
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-gray-600 hover:text-green-600 font-medium transition">
              Product List
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-6">
                <Link to="/cart" className="relative text-gray-600 hover:text-green-600 transition">
                  <ShoppingCart size={22} />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {cart.length}
                    </span>
                  )}
                </Link>
                
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                  <User size={18} className="text-gray-400" />
                  <span>{user.username}</span>
                </div>

                <button 
                  onClick={logout}
                  className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition text-sm font-medium"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-green-600 font-medium">
                  Login
                </Link>
                <Link to="/signup" className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;