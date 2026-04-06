import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ShoppingCart, LogOut, User, ChevronDown, Monitor, Gamepad2, Film } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CATEGORIES = [
  { label: 'Softwares', icon: Monitor,  value: 'Softwares' },
  { label: 'Games',     icon: Gamepad2, value: 'Games'     },
  { label: 'Movies',    icon: Film,     value: 'Movies'    },
];

const Navbar = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const { totalItems, setCartOpen } = useCart();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleCategory = (category) => {
    setDropdownOpen(false);
    navigate(`/?category=${encodeURIComponent(category)}`);
  };

  const handleCartClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    setCartOpen(true);
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link to="/" className="text-2xl font-black text-green-600 tracking-tighter">
            E-Space
          </Link>

          <div className="flex items-center gap-6">

            {/* Product List dropdown — always visible */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(p => !p)}
                className="flex items-center gap-1.5 text-gray-600 hover:text-green-600 font-medium transition text-sm"
              >
                Product List
                <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <button
                    onClick={() => { setDropdownOpen(false); navigate('/'); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition"
                  >
                    <span>🛍️</span> All Products
                  </button>
                  <div className="my-1 border-t border-gray-100" />
                  {CATEGORIES.map(({ label, icon: Icon, value }) => (
                    <button
                      key={value}
                      onClick={() => handleCategory(value)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition"
                    >
                      <Icon size={16} className="text-green-500" /> {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart — always visible, prompts login if not authenticated */}
            <button
              onClick={handleCartClick}
              className="relative text-gray-600 hover:text-green-600 transition"
              title={isAuthenticated ? 'Cart' : 'Login to view cart'}
            >
              <ShoppingCart size={22} />
              {isAuthenticated && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Auth state */}
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                  <User size={16} className="text-gray-400" />
                  <span className="hidden sm:block font-medium truncate max-w-[100px]">
                    {user?.email}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition text-sm font-medium"
                >
                  <LogOut size={17} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-600 hover:text-green-600 font-medium transition">
                  Login
                </Link>
                <Link to="/signup" className="text-sm bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg transition">
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