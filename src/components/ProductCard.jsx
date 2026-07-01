import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Download, ImageOff, CheckCircle, Lock, BookOpen, User, FileText } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const BACKEND_URL =
  (import.meta.env.VITE_API_URL || 'https://backend-ecommerce-3-2hqt.onrender.com/api').replace(/\/+$/, '');

const getProductImage = (imageField) => {
  if (!imageField) return "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop";
  if (imageField.startsWith("http")) return imageField;
  return `${BACKEND_URL}${imageField}`;
};

// Colour coding per product type
const TYPE_STYLES = {
  ebook: { bg: 'bg-amber-500', label: 'E-Book', Icon: BookOpen },
  software: { bg: 'bg-blue-600', label: 'Software', Icon: null },
  game: { bg: 'bg-purple-600', label: 'Game', Icon: null },
  movie: { bg: 'bg-red-600', label: 'Movie', Icon: null },
};

const ProductCard = ({ product }) => {
  const { addToCart, hasPaid } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);

  const imageUrl = getProductImage(product.image_url || product.image);
  const showImage = !!imageUrl;
  const isPaid = hasPaid(product.id);
  const isEbook = product.is_ebook || product.product_type === 'ebook';
  const hasFile = !!(product.file || product.ebook_file || product.download_url);

  const typeInfo = TYPE_STYLES[product.product_type] || TYPE_STYLES.software;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/signup', { state: { from: '/cart' } });
      return;
    }
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    try {
      const res = await api.get(`/download/${product.id}/`);
      window.open(res.data.download_url, '_blank');
    } catch (err) {
      alert(err.response?.data?.detail || 'Download failed. Please complete payment first.');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col group overflow-hidden">

      {/* Image / cover */}
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative w-full h-56 overflow-hidden bg-gray-100">

          {/* E-Book placeholder when no cover */}
          {isEbook && !showImage ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 gap-2">
              <BookOpen size={48} className="text-amber-400" />
              <span className="text-xs text-amber-500 font-semibold">E-Book</span>
            </div>
          ) : showImage ? (
            <img
              src={imageUrl} alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop" }}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 gap-2">
              <ImageOff size={36} className="text-gray-300" />
              <span className="text-xs text-gray-400 font-medium">No Image</span>
            </div>
          )}

          {/* Product type badge (top-left) */}
          {product.product_type && product.product_type !== 'software' && (
            <div className={`absolute top-3 left-3 ${typeInfo.bg} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>
              {typeInfo.label}
            </div>
          )}

          {/* Lock / Download badge (top-right) */}
          {hasFile && (
            <div className="absolute top-3 right-3">
              {isPaid ? (
                <button
                  onClick={handleDownload}
                  title="Download"
                  className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg transition"
                >
                  <Download size={15} />
                </button>
              ) : (
                <div title="Purchase to unlock download" className="bg-amber-500 text-white p-2 rounded-full shadow-lg">
                  <Lock size={15} />
                </div>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="p-5 flex flex-col flex-grow">
        <Link to={`/product/${product.id}`}>
          <h2 className="font-bold text-lg text-gray-900 line-clamp-1 hover:text-green-600 transition mb-1">
            {product.name}
          </h2>
        </Link>

        {/* E-Book metadata */}
        {isEbook && (product.author || product.page_count) && (
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 mb-2">
            {product.author && (
              <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                <User size={11} /> {product.author}
              </span>
            )}
            {product.page_count && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <FileText size={11} /> {product.page_count} pages
              </span>
            )}
          </div>
        )}

        <p className="text-gray-400 text-sm line-clamp-2 flex-grow mb-4">
          {product.description || 'No description available.'}
        </p>

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
          <div>
            <p className="text-xs text-gray-400">Price</p>
            <p className="text-green-600 font-extrabold text-xl">
              KES {Number(product.price).toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isPaid && hasFile && (
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-3 py-2 rounded-lg transition"
              >
                <Download size={14} />
                {isEbook ? 'Read' : 'Download'}
              </button>
            )}

            <button
              onClick={handleAddToCart}
              className={`flex items-center gap-1.5 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-300 ${added ? 'bg-emerald-500 scale-95' : 'bg-green-600 hover:bg-green-700'
                }`}
            >
              {added
                ? <><CheckCircle size={15} /> Added</>
                : <><ShoppingCart size={15} /> {isAuthenticated ? 'Add' : 'Buy'}</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;