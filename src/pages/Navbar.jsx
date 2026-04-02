import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { cart } = useCart();
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-green-600">Digital Products</Link>
      <div className="flex gap-6 items-center">
        <Link to="/" className="hover:text-green-600">Shop</Link>
        <Link to="/cart" className="relative">
          <span className="bg-red-500 text-white text-xs rounded-full px-2 absolute -top-2 -right-3">
            {cart.length}
          </span>
          🛒 Cart
        </Link>
      </div>
    </nav>
  );
};
export default Navbar;