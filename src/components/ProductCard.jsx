import { Link } from 'react-router-dom';
import { ShoppingCart, Download } from 'lucide-react';
import { useCart } from '../context/CartContext';

const FALLBACK_IMAGE = 'https://placehold.co/400x300/e5e7eb/9ca3af?text=No+Image';
const BACKEND_URL = "https://backend-ecommerce-3-href.onrender.com";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  // Helper to ensure the image URL is absolute
  const getFullImageUrl = (path) => {
    if (!path) return FALLBACK_IMAGE;
    // If the path is already a full URL (starting with http), return it. 
    // Otherwise, prefix it with your Render backend URL.
    return path.startsWith('http') ? path : `${BACKEND_URL}${path}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col group overflow-hidden">
      {/* Image Section */}
      <Link to={`/product/${product.id}`}>
        <div className="w-full h-56 overflow-hidden bg-gray-50">
          <img
            src={getFullImageUrl(product.image)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = FALLBACK_IMAGE;
            }}
          />
        </div>
      </Link>

      {/* Body Section */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <Link to={`/product/${product.id}`}>
            <h2 className="font-bold text-lg text-gray-900 line-clamp-1 hover:text-green-600 transition">
              {product.name}
            </h2>
          </Link>
          
          {/* Download Button for Software/Games (only if product.file exists) */}
          {product.file && (
            <a 
              href={`${BACKEND_URL}${product.file}`} 
              download 
              className="text-blue-500 hover:text-blue-700 transition-colors"
              title="Download Software"
              onClick={(e) => e.stopPropagation()} // Prevents navigation to product detail
            >
              <Download size={20} />
            </a>
          )}
        </div>

        <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-grow">
          {product.description}
        </p>

        {/* Price + Add to Cart */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
          <div>
            <p className="text-xs text-gray-400">Price</p>
            <p className="text-green-600 font-extrabold text-xl">
              KES {Number(product.price).toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => addToCart(product)}
            className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            <ShoppingCart size={15} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;