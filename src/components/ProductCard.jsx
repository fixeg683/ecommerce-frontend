import { Link } from 'react-router-dom';

const FALLBACK_IMAGE = 'https://placehold.co/300x200/e5e7eb/6b7280?text=No+Image';

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/product/${product.id}`}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col group overflow-hidden"
    >
      {/* Image */}
      <div className="w-full h-52 overflow-hidden bg-gray-100">
        <img
          src={product.image || FALLBACK_IMAGE}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null; // prevent infinite loop
            e.target.src = FALLBACK_IMAGE;
          }}
        />
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-grow">
        <h2 className="font-semibold text-lg text-gray-800 line-clamp-1">
          {product.name}
        </h2>
        <p className="text-gray-500 text-sm flex-grow line-clamp-2 mt-1 mb-3">
          {product.description}
        </p>

        {/* Price row */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-gray-500 text-xs">Price</span>
          <p className="text-green-600 font-extrabold text-xl">
            KES {Number(product.price).toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;