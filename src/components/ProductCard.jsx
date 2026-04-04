import { Link } from 'react-router-dom';
import { ShoppingCart, Download, ImageOff, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

const BACKEND_URL =
  import.meta.env.VITE_API_URL || 'https://backend-ecommerce-3-href.onrender.com';

const getFullImageUrl = (product) => {
  // 1. Prefer image_url from serializer (absolute Cloudinary URL)
  if (product.image_url) return product.image_url;
  // 2. Fallback: image field
  if (!product.image) return null;
  // 3. Already absolute (Cloudinary / external)
  if (product.image.startsWith('http')) return product.image;
  // 4. Relative path — prefix backend URL
  return `${BACKEND_URL}${product.image}`;
};

const getFullFileUrl = (fileUrl) => {
  if (!fileUrl) return null;
  if (fileUrl.startsWith('http')) return fileUrl;
  return `${BACKEND_URL}${fileUrl}`;
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);

  const imageUrl = getFullImageUrl(product);
  const fileUrl = getFullFileUrl(product.file);
  const showImage = imageUrl && !imgError;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col group overflow-hidden">

      {/* Image */}
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative w-full h-56 overflow-hidden bg-gray-100">
          {showImage ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 gap-2">
              <ImageOff size={36} className="text-gray-300" />
              <span className="text-xs text-gray-400 font-medium">No Image</span>
            </div>
          )}

          {/* Download badge — shown if product has a file */}
          {fileUrl && (
            <a
              href={fileUrl}
              download
              onClick={(e) => e.stopPropagation()}
              title="Download file"
              className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-blue-600 hover:text-blue-800 hover:bg-white p-2 rounded-full shadow transition z-10"
            >
              <Download size={16} />
            </a>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="p-5 flex flex-col flex-grow">

        {/* Name */}
        <Link to={`/product/${product.id}`}>
          <h2 className="font-bold text-lg text-gray-900 line-clamp-1 hover:text-green-600 transition mb-1">
            {product.name}
          </h2>
        </Link>

        {/* Description */}
        <p className="text-gray-400 text-sm line-clamp-2 flex-grow mb-4">
          {product.description || 'No description available.'}
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
            onClick={handleAddToCart}
            className={`flex items-center gap-1.5 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-300 ${
              added
                ? 'bg-emerald-500 scale-95'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {added ? (
              <>
                <CheckCircle size={15} />
                Added
              </>
            ) : (
              <>
                <ShoppingCart size={15} />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;